/**
 * 修复 Next.js 静态导出的 segment cache 文件路径 bug。
 *
 * 现象：构建导出器把 RSC 分段数据写成了嵌套目录
 *   out/<route>/__next.<seg0>/<seg1>/<seg2>.txt
 * 而客户端路由请求的是扁平文件名
 *   out/<route>/__next.<seg0>.<seg1>.<seg2>.txt
 * 导致所有 __PAGE__ 预取请求 404。
 *
 * 本脚本在 postbuild 阶段（gzip 之前）把这些嵌套文件拍平成客户端期望的文件名。
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'out');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

/** 找到 relativePath 中第一个以 "__next." 开头的目录段的下标 */
function findSegmentRootIndex(parts) {
  return parts.findIndex((part) => part.startsWith('__next.'));
}

let moved = 0;
let removed = 0;

/** 自底向上删除空目录 */
async function pruneEmptyDirs(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      await pruneEmptyDirs(path.join(dir, entry.name));
    }
  }
  const remaining = await fs.readdir(dir);
  if (remaining.length === 0) {
    await fs.rmdir(dir);
  }
}

async function flattenInDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('__next.')) continue;

    const nestedDir = path.join(dir, entry.name);
    const files = await walk(nestedDir);

    for (const file of files) {
      const relativeInside = path.relative(nestedDir, file);
      // __next.admin + /dashboard/__PAGE__.txt -> __next.admin.dashboard.__PAGE__.txt
      const flatName = `${entry.name}.${relativeInside.split(path.sep).join('.')}`;
      const dest = path.join(dir, flatName);
      await fs.rename(file, dest);
      moved += 1;
    }

    // 清理残留的空子目录，再删掉嵌套根目录
    await pruneEmptyDirs(nestedDir);
    const remaining = await fs.readdir(nestedDir).catch(() => null);
    if (remaining === null || remaining.length === 0) {
      await fs.rm(nestedDir, { recursive: true, force: true });
      removed += 1;
    } else {
      console.warn(`⚠ 未清空的嵌套目录（请检查）: ${nestedDir}`);
    }
  }
}

// 递归收集所有层级的路由目录（如 out/admin/products/new），
// 但跳过 _next 静态产物目录与 __next.* 分段目录本身，避免误伤 _next/static 内部结构
async function collectRouteDirs(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === '_next' || entry.name.startsWith('__next.')) continue;
    const full = path.join(dir, entry.name);
    out.push(full);
    await collectRouteDirs(full, out);
  }
  return out;
}

const scanTargets = [ROOT, ...(await collectRouteDirs(ROOT))];

for (const dir of scanTargets) {
  await flattenInDir(dir).catch(() => undefined);
}

console.log(`segment cache 修复：拍平 ${moved} 个文件，移除 ${removed} 个嵌套目录`);
