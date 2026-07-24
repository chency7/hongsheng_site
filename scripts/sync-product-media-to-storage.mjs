import { spawnSync } from 'node:child_process';
import path from 'node:path';

const scripts = [
  'upload-product-images-to-storage.mjs',
  'upload-product-documents-to-storage.mjs',
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [path.join(process.cwd(), 'scripts', script)], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status || 1);
}
