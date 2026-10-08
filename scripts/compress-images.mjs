/**
 * 静态图片批量压缩（构建前手动运行：node scripts/compress-images.mjs）
 *
 * - 原地压缩 public/images 下的 .jpg/.jpeg/.png（保持路径与扩展名不变，代码引用无需改动）
 * - JPG：最长边 ≤1920，mozjpeg 质量 78
 * - PNG：最长边 ≤1920，调色板量化（photos 类 PNG 也能大幅减小）
 * - 仅当压缩结果比原文件更小时才写回
 * - <200KB 的小文件直接跳过
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd(), 'public/images');
const MAX_DIMENSION = 1920;
const MIN_BYTES = 200 * 1024;
const CONCURRENCY = 8;

const JPEG_OPTIONS = { quality: 78, mozjpeg: true, progressive: true };
const PNG_OPTIONS = { quality: 85, palette: true, compressionLevel: 9 };

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function compressOne(file) {
  const stat = await fs.stat(file);
  if (stat.size < MIN_BYTES) return { file, skipped: 'small' };

  const ext = path.extname(file).toLowerCase();
  const isJpg = ext === '.jpg' || ext === '.jpeg';
  const isPng = ext === '.png';
  if (!isJpg && !isPng) return { file, skipped: 'type' };

  const image = sharp(file, { failOn: 'none' });
  const resized = image.rotate().resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  });

  const output = isJpg
    ? await resized.jpeg(JPEG_OPTIONS).toBuffer()
    : await resized.png(PNG_OPTIONS).toBuffer();

  if (output.length >= stat.size) return { file, skipped: 'not-smaller' };

  await fs.writeFile(file, output);
  return {
    file,
    before: stat.size,
    after: output.length,
    saved: stat.size - output.length,
  };
}

const files = await walk(ROOT);
console.log(`发现 ${files.length} 个文件，开始压缩…`);

const results = [];
for (let i = 0; i < files.length; i += CONCURRENCY) {
  const batch = files.slice(i, i + CONCURRENCY);
  results.push(...(await Promise.all(batch.map((f) => compressOne(f).catch((e) => ({ file: f, error: String(e) }))))));
}

let totalBefore = 0;
let totalAfter = 0;
let compressed = 0;
for (const r of results) {
  if (r.saved) {
    compressed += 1;
    totalBefore += r.before;
    totalAfter += r.after;
    console.log(`✓ ${path.relative(ROOT, r.file)}  ${Math.round(r.before / 1024)}KB → ${Math.round(r.after / 1024)}KB`);
  } else if (r.error) {
    console.log(`✗ ${path.relative(ROOT, r.file)}  ${r.error}`);
  }
}

console.log('—'.repeat(50));
console.log(`压缩 ${compressed} 个文件，${Math.round(totalBefore / 1024 / 1024)}MB → ${Math.round(totalAfter / 1024 / 1024)}MB（节省 ${Math.round((totalBefore - totalAfter) / 1024 / 1024)}MB）`);
