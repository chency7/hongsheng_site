import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const BUCKET = 'files';
const STORAGE_PREFIX = 'products';
const THUMBNAIL_MAX_EDGE = 360;
const THUMBNAIL_QUALITY = 76;

function parseEnv(raw) {
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function loadSupabaseConfig() {
  const fileEnv = parseEnv(await readFile(path.join(PROJECT_ROOT, '.env'), 'utf8'));
  const supabaseUrl = (process.env.SUPABASE_URL || fileEnv.SUPABASE_URL || '').replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment/.env');
  }
  return { supabaseUrl, serviceRoleKey };
}

function headers(serviceRoleKey, extra = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...extra,
  };
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await readResponse(response);
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${url} failed with ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

function encodeObjectPath(objectPath) {
  return objectPath.split('/').map(encodeURIComponent).join('/');
}

function storageUrlToObjectPath(supabaseUrl, value) {
  if (typeof value !== 'string') return null;
  const expectedPrefix = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/`;
  if (!value.startsWith(expectedPrefix)) return null;
  const objectPath = value.slice(expectedPrefix.length).split('/').map(decodeURIComponent).join('/');
  return objectPath.startsWith(`${STORAGE_PREFIX}/`) ? objectPath : null;
}

function thumbnailObjectPath(objectPath) {
  const segments = objectPath.split('/');
  const fileName = segments.pop();
  if (!fileName) return objectPath;
  return [...segments, `thumb-${fileName.replace(/^thumb-/, '')}`].join('/');
}

function storagePublicUrl(supabaseUrl, objectPath) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${encodeObjectPath(objectPath)}`;
}

async function getCatalog(config) {
  return requestJson(`${config.supabaseUrl}/rest/v1/rpc/get_admin_catalog`, {
    method: 'POST',
    headers: headers(config.serviceRoleKey, { 'Content-Type': 'application/json' }),
    body: '{}',
  });
}

async function replaceCatalog(config, catalog) {
  return requestJson(`${config.supabaseUrl}/rest/v1/rpc/replace_admin_catalog`, {
    method: 'POST',
    headers: headers(config.serviceRoleKey, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ catalog }),
  });
}

async function imageBytesForUrl(config, imageUrl) {
  if (imageUrl.startsWith('/')) {
    return readFile(path.join(PUBLIC_DIR, imageUrl.replace(/^\//, '')));
  }

  const response = await fetch(imageUrl, { headers: headers(config.serviceRoleKey) });
  if (!response.ok) {
    throw new Error(`Failed to read image ${imageUrl}: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadThumbnail(config, imageUrl) {
  const objectPath = storageUrlToObjectPath(config.supabaseUrl, imageUrl);
  if (!objectPath) return null;

  const thumbnailPath = thumbnailObjectPath(objectPath);
  const thumbnailUrl = storagePublicUrl(config.supabaseUrl, thumbnailPath);
  const source = await imageBytesForUrl(config, imageUrl);
  const thumbnail = await sharp(source, { animated: false })
    .rotate()
    .resize({ width: THUMBNAIL_MAX_EDGE, height: THUMBNAIL_MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: THUMBNAIL_QUALITY, alphaQuality: 100, smartSubsample: true, effort: 5 })
    .toBuffer();

  await requestJson(`${config.supabaseUrl}/storage/v1/object/${BUCKET}/${encodeObjectPath(thumbnailPath)}`, {
    method: 'POST',
    headers: headers(config.serviceRoleKey, { 'Content-Type': 'image/webp', 'x-upsert': 'true' }),
    body: thumbnail,
  });

  return { thumbnailUrl, sourceBytes: source.length, thumbnailBytes: thumbnail.length };
}

async function main() {
  const config = await loadSupabaseConfig();
  const catalog = await getCatalog(config);
  const nextCatalog = structuredClone(catalog);
  let updated = 0;
  let uploaded = 0;
  let skipped = 0;
  let sourceBytes = 0;
  let thumbnailBytes = 0;

  for (const product of nextCatalog.products || []) {
    const coverImage = product.coverImage || product.images?.[0] || '';
    if (coverImage) {
      const result = await uploadThumbnail(config, coverImage).catch((error) => {
        console.warn(`Skip ${product.name || product.id}: ${error.message}`);
        return null;
      });
      if (result) {
        uploaded += 1;
        sourceBytes += result.sourceBytes;
        thumbnailBytes += result.thumbnailBytes;
        if (product.coverThumbnail !== result.thumbnailUrl) {
          product.coverThumbnail = result.thumbnailUrl;
          updated += 1;
        }
      } else {
        skipped += 1;
      }
    }

    for (const subProduct of product.subProducts || []) {
      const subCoverImage = subProduct.coverImage || subProduct.images?.[0] || '';
      if (!subCoverImage) continue;
      const result = await uploadThumbnail(config, subCoverImage).catch((error) => {
        console.warn(`Skip ${product.name || product.id} / ${subProduct.name || subProduct.id}: ${error.message}`);
        return null;
      });
      if (result) {
        uploaded += 1;
        sourceBytes += result.sourceBytes;
        thumbnailBytes += result.thumbnailBytes;
        if (subProduct.coverThumbnail !== result.thumbnailUrl) {
          subProduct.coverThumbnail = result.thumbnailUrl;
          updated += 1;
        }
      } else {
        skipped += 1;
      }
    }
  }

  await replaceCatalog(config, nextCatalog);

  console.log(JSON.stringify({
    uploadedThumbnails: uploaded,
    updatedCatalogEntries: updated,
    skippedImages: skipped,
    sourceBytes,
    thumbnailBytes,
    reductionPercent: sourceBytes ? Number(((1 - thumbnailBytes / sourceBytes) * 100).toFixed(1)) : 0,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
