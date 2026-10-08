/**
 * 构建后预压缩静态资源：next build 之后自动运行（package.json 的 postbuild）。
 * 为 out/ 下的文本类资源生成 .gz 文件（gzip 级别 9，比 Nginx 运行时压缩更小、零 CPU 开销），
 * 配合 Nginx 的 `gzip_static on;` 直接下发预压缩文件。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = path.resolve(process.cwd(), 'out');
const COMPRESSIBLE = new Set([
  '.html',
  '.js',
  '.css',
  '.txt',
  '.json',
  '.svg',
  '.xml',
  '.webmanifest',
  '.map',
]);
const MIN_BYTES = 1024;

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

const files = await walk(ROOT);
let count = 0;
let before = 0;
let after = 0;

for (const file of files) {
  if (!COMPRESSIBLE.has(path.extname(file).toLowerCase())) continue;

  const stat = await fs.stat(file);
  if (stat.size < MIN_BYTES) continue;

  const content = await fs.readFile(file);
  const gz = gzipSync(content, { level: 9 });

  // 压缩收益 <10% 的不生成，避免无意义小文件
  if (gz.length >= stat.size * 0.9) continue;

  await fs.writeFile(`${file}.gz`, gz);
  count += 1;
  before += stat.size;
  after += gz.length;
}

console.log(`gzip 预压缩：${count} 个文件，${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB`);
