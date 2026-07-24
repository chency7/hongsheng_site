import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const PRODUCT_IMAGES_DIR = path.join(PUBLIC_DIR, 'images', 'products');
const BUCKET = 'files';
const STORAGE_PREFIX = 'products';
const LOCAL_PRODUCT_PREFIX = '/images/products/';
const STORAGE_PUBLIC_PREFIX = `/storage/v1/object/public/${BUCKET}/${STORAGE_PREFIX}/`;
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const IMAGE_MAX_EDGE = 2400;
const IMAGE_WEBP_QUALITY = 82;
const IMAGE_COMPRESSION_PROFILE = `webp-q${IMAGE_WEBP_QUALITY}-max${IMAGE_MAX_EDGE}`;

const productStorageTypeFallbacks = new Map([
  ['p-zhonglian-zhebi', { categoryId: 'electro-hydraulic-system', subCategoryId: 'folding-arm-crane' }],
  ['p-hunan-yatai', { categoryId: 'electro-hydraulic-system', subCategoryId: 'large-foaming-line' }],
  ['p-jiaerhua-dongbi', { categoryId: 'electro-hydraulic-system', subCategoryId: 'luffing-jib-tower-crane' }],
  ['p-sanyi-bianfu', { categoryId: 'electro-hydraulic-system', subCategoryId: 'luffing-jib-tower-crane' }],
  ['p-sileng-yaozhu', { categoryId: 'electro-hydraulic-system', subCategoryId: 'dual-cylinder-die-casting' }],
  ['p-yuqian-yeya', { categoryId: 'electro-hydraulic-system', subCategoryId: 'industrial-automation' }],
  ['p-zhonglian-zhonglian', { categoryId: 'electro-hydraulic-system', subCategoryId: 'industrial-automation' }],
  ['p-hedun-shuili', { categoryId: 'customized', subCategoryId: 'water-gate-sync' }],
  ['p-sanyi-txl63', { categoryId: 'customized', subCategoryId: 'lifting-station' }],
  ['p-feiyi-fangbao', { categoryId: 'customized', subCategoryId: 'explosion-proof' }],
]);

function parseEnv(raw) {
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
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

async function ensureBucket({ supabaseUrl, serviceRoleKey }) {
  const bucketUrl = `${supabaseUrl}/storage/v1/bucket/${BUCKET}`;
  const getResponse = await fetch(bucketUrl, {
    headers: headers(serviceRoleKey),
  });

  if (getResponse.ok) {
    const bucket = await readResponse(getResponse);
    if (bucket?.public === false) {
      await requestJson(bucketUrl, {
        method: 'PUT',
        headers: headers(serviceRoleKey, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({ public: true }),
      });

      return 'updated_public';
    }

    return 'exists';
  }

  const body = await readResponse(getResponse);
  const bucketNotFound = getResponse.status === 404 || body?.statusCode === '404' || body?.message === 'Bucket not found';
  if (!bucketNotFound) {
    throw new Error(`GET ${bucketUrl} failed with ${getResponse.status}: ${JSON.stringify(body)}`);
  }

  await requestJson(`${supabaseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: headers(serviceRoleKey, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });

  return 'created';
}

async function walkImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkImages(absolutePath)));
      continue;
    }

    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolutePath);
    }
  }

  return files;
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function safeSegment(value, fallback) {
  return String(value || fallback)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || fallback;
}

function encodeObjectPath(objectPath) {
  return objectPath.split('/').map(encodeURIComponent).join('/');
}

function imageKey(relativePath) {
  return relativePath.replace(/\\/g, '/');
}

function sourceFilenameForRelativePath(relativePath) {
  const normalized = imageKey(relativePath);
  const extension = path.posix.extname(normalized).toLowerCase();
  const stem = safeSegment(path.posix.basename(normalized, extension), 'image');
  const hash = createHash('sha256').update(normalized, 'utf8').digest('hex').slice(0, 8);

  return `${hash}-${stem}${extension}`;
}

function compressedPathKeyForRelativePath(relativePath) {
  const normalized = imageKey(relativePath);
  return createHash('sha256')
    .update(`${IMAGE_COMPRESSION_PROFILE}:${normalized}`, 'utf8')
    .digest('hex')
    .slice(0, 10);
}

function legacyCompressedFilenameForRelativePath(relativePath) {
  const normalized = imageKey(relativePath);
  const extension = path.posix.extname(normalized).toLowerCase();
  const stem = safeSegment(path.posix.basename(normalized, extension), 'image');

  return `${compressedPathKeyForRelativePath(relativePath)}-${stem}.webp`;
}

function compressedFilenameForRelativePath(relativePath, sourceHash) {
  const normalized = imageKey(relativePath);
  const extension = path.posix.extname(normalized).toLowerCase();
  const stem = safeSegment(path.posix.basename(normalized, extension), 'image');

  return `${compressedPathKeyForRelativePath(relativePath)}-${sourceHash}-${stem}.webp`;
}

function legacyFlatObjectPathForRelativePath(relativePath) {
  const normalized = imageKey(relativePath);
  const extension = path.posix.extname(normalized).toLowerCase();
  const stem = safeSegment(path.posix.basename(normalized, extension), 'image');
  const hash = createHash('sha256').update(normalized, 'utf8').digest('hex').slice(0, 16);

  return `${STORAGE_PREFIX}/${hash}-${stem}${extension}`;
}

function storageObjectPathForImage(relativePath, context, sourceHash) {
  return [
    STORAGE_PREFIX,
    safeSegment(context?.categoryId, 'uncategorized'),
    safeSegment(context?.subCategoryId, 'general'),
    safeSegment(context?.productId, 'unknown-product'),
    compressedFilenameForRelativePath(relativePath, sourceHash),
  ].join('/');
}

function storagePublicUrl(supabaseUrl, objectPath) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${encodeObjectPath(objectPath)}`;
}

function localPublicPathToRelativePath(localPath) {
  const normalized = decodeURI(localPath).replace(/\\/g, '/');
  if (!normalized.startsWith(LOCAL_PRODUCT_PREFIX)) return null;

  return normalized.slice(LOCAL_PRODUCT_PREFIX.length);
}

function valueToRelativePath(value, supabaseUrl, legacyRelativePathByObjectPath) {
  if (typeof value !== 'string') return null;

  const localRelativePath = localPublicPathToRelativePath(value);
  if (localRelativePath) return imageKey(localRelativePath);

  const objectPath = storageUrlToObjectPath(supabaseUrl, value);
  if (!objectPath) return null;

  const fileName = path.posix.basename(objectPath);
  return legacyRelativePathByObjectPath.get(objectPath)
    || legacyRelativePathByObjectPath.get(fileName)
    || legacyRelativePathByObjectPath.get(`compressed:${fileName.slice(0, 10)}`)
    || null;
}

function storageUrlToObjectPath(supabaseUrl, url) {
  if (typeof url !== 'string') return null;
  const expectedPrefix = `${supabaseUrl}${STORAGE_PUBLIC_PREFIX}`;
  if (!url.startsWith(expectedPrefix)) return null;

  return `${STORAGE_PREFIX}/${url.slice(expectedPrefix.length).split('/').map(decodeURIComponent).join('/')}`;
}

function addImageContext(contextByRelativePath, value, context, supabaseUrl, legacyRelativePathByObjectPath) {
  const relativePath = valueToRelativePath(value, supabaseUrl, legacyRelativePathByObjectPath);
  if (!relativePath || !IMAGE_EXTENSIONS.has(path.posix.extname(relativePath).toLowerCase())) return;
  contextByRelativePath.set(imageKey(relativePath), context);
}

function addMarkdownImageContexts(contextByRelativePath, content, context, supabaseUrl, legacyRelativePathByObjectPath) {
  if (typeof content !== 'string') return;

  for (const match of content.matchAll(/!\[[^\]]*\]\(([^\s)]+)\)/g)) {
    addImageContext(contextByRelativePath, match[1], context, supabaseUrl, legacyRelativePathByObjectPath);
  }
}

function buildImageContextMap(catalog, supabaseUrl, legacyRelativePathByObjectPath) {
  const contextByRelativePath = new Map();
  const categoryIdBySubCategoryId = new Map(
    (catalog.subCategories || []).map((subCategory) => [subCategory.id, subCategory.categoryId]),
  );

  for (const product of catalog.products || []) {
    const fallbackStorageType = productStorageTypeFallbacks.get(product.id);
    const productContext = {
      categoryId: product.categoryId || categoryIdBySubCategoryId.get(product.subCategoryId) || fallbackStorageType?.categoryId,
      subCategoryId: fallbackStorageType?.subCategoryId || product.subCategoryId,
      productId: product.id,
    };

    addImageContext(contextByRelativePath, product.coverImage, productContext, supabaseUrl, legacyRelativePathByObjectPath);
    addImageContext(contextByRelativePath, product.cover_image, productContext, supabaseUrl, legacyRelativePathByObjectPath);
    for (const image of product.images || []) addImageContext(contextByRelativePath, image, productContext, supabaseUrl, legacyRelativePathByObjectPath);
    for (const tab of product.detailTabs || []) {
      addMarkdownImageContexts(contextByRelativePath, tab.content, productContext, supabaseUrl, legacyRelativePathByObjectPath);
    }

    for (const subProduct of product.subProducts || []) {
      const subProductContext = {
        ...productContext,
        productId: `${product.id}-${subProduct.id || safeSegment(subProduct.name, 'sub-product')}`,
      };

      addImageContext(contextByRelativePath, subProduct.coverImage, subProductContext, supabaseUrl, legacyRelativePathByObjectPath);
      addImageContext(contextByRelativePath, subProduct.cover_image, subProductContext, supabaseUrl, legacyRelativePathByObjectPath);
      for (const image of subProduct.images || []) {
        addImageContext(contextByRelativePath, image, subProductContext, supabaseUrl, legacyRelativePathByObjectPath);
      }
    }
  }

  return contextByRelativePath;
}

async function uploadFile(config, absolutePath, contextByRelativePath, existingStorageObjects) {
  const relativeToProducts = imageKey(toPosixPath(path.relative(PRODUCT_IMAGES_DIR, absolutePath)));
  const context = contextByRelativePath.get(relativeToProducts) || {
    categoryId: 'uncategorized',
    subCategoryId: 'unreferenced',
    productId: 'local-assets',
  };
  const source = await readFile(absolutePath);
  const sourceHash = createHash('sha256').update(source).digest('hex').slice(0, 12);
  const objectPath = storageObjectPathForImage(relativeToProducts, context, sourceHash);
  const uploadUrl = `${config.supabaseUrl}/storage/v1/object/${BUCKET}/${encodeObjectPath(objectPath)}`;
  const publicUrl = storagePublicUrl(config.supabaseUrl, objectPath);

  if (existingStorageObjects.has(objectPath)) {
    return {
      relativePath: relativeToProducts,
      objectPath,
      publicUrl,
      sourceBytes: source.length,
      uploadedBytes: 0,
      uploaded: false,
    };
  }

  const compressed = await sharp(source, { animated: true })
    .rotate()
    .resize({
      width: IMAGE_MAX_EDGE,
      height: IMAGE_MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: IMAGE_WEBP_QUALITY,
      alphaQuality: 100,
      smartSubsample: true,
      effort: 5,
    })
    .toBuffer({ resolveWithObject: true });

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: headers(config.serviceRoleKey, {
      'Content-Type': 'image/webp',
      'x-upsert': 'true',
    }),
    body: compressed.data,
  });

  const body = await readResponse(response);
  if (!response.ok) {
    throw new Error(`Upload failed for ${relativeToProducts} with ${response.status}: ${JSON.stringify(body)}`);
  }

  return {
    relativePath: relativeToProducts,
    objectPath,
    publicUrl,
    sourceBytes: source.length,
    uploadedBytes: compressed.data.length,
    uploaded: true,
    width: compressed.info.width,
    height: compressed.info.height,
  };
}

async function getCatalog({ supabaseUrl, serviceRoleKey }) {
  return requestJson(`${supabaseUrl}/rest/v1/rpc/get_admin_catalog`, {
    method: 'POST',
    headers: headers(serviceRoleKey, { 'Content-Type': 'application/json' }),
    body: '{}',
  });
}

async function replaceCatalog({ supabaseUrl, serviceRoleKey }, catalog) {
  return requestJson(`${supabaseUrl}/rest/v1/rpc/replace_admin_catalog`, {
    method: 'POST',
    headers: headers(serviceRoleKey, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ catalog }),
  });
}

function rewriteMarkdownImages(markdown, imageUrlByRelativePath, supabaseUrl, legacyRelativePathByObjectPath) {
  if (typeof markdown !== 'string') return markdown;

  return markdown.replace(/(!\[[^\]]*\]\()([^\s)]+)(\))/g, (match, before, url, after) => {
    const relativePath = valueToRelativePath(url, supabaseUrl, legacyRelativePathByObjectPath);
    if (!relativePath) return match;

    return `${before}${imageUrlByRelativePath.get(imageKey(relativePath)) || url}${after}`;
  });
}

function rewriteImageValue(value, imageUrlByRelativePath, supabaseUrl, legacyRelativePathByObjectPath) {
  const relativePath = valueToRelativePath(value, supabaseUrl, legacyRelativePathByObjectPath);
  if (!relativePath) return value;

  return imageUrlByRelativePath.get(imageKey(relativePath)) || value;
}

function rewriteCatalogImages(catalog, imageUrlByRelativePath, supabaseUrl, legacyRelativePathByObjectPath) {
  let rewritten = 0;
  const nextCatalog = structuredClone(catalog);

  for (const product of nextCatalog.products || []) {
    const rewriteField = (target, field) => {
      const before = target?.[field];
      const after = rewriteImageValue(before, imageUrlByRelativePath, supabaseUrl, legacyRelativePathByObjectPath);
      if (after !== before) {
        target[field] = after;
        rewritten += 1;
      }
    };

    rewriteField(product, 'coverImage');
    rewriteField(product, 'cover_image');

    if (Array.isArray(product.images)) {
      product.images = product.images.map((image) => {
        const after = rewriteImageValue(image, imageUrlByRelativePath, supabaseUrl, legacyRelativePathByObjectPath);
        if (after !== image) rewritten += 1;
        return after;
      });
    }

    for (const subProduct of product.subProducts || []) {
      rewriteField(subProduct, 'coverImage');
      rewriteField(subProduct, 'cover_image');

      if (Array.isArray(subProduct.images)) {
        subProduct.images = subProduct.images.map((image) => {
          const after = rewriteImageValue(image, imageUrlByRelativePath, supabaseUrl, legacyRelativePathByObjectPath);
          if (after !== image) rewritten += 1;
          return after;
        });
      }
    }

    for (const tab of product.detailTabs || []) {
      const before = tab.content;
      const after = rewriteMarkdownImages(before, imageUrlByRelativePath, supabaseUrl, legacyRelativePathByObjectPath);
      if (after !== before) {
        tab.content = after;
        rewritten += 1;
      }
    }
  }

  return { catalog: nextCatalog, rewritten };
}

function collectStorageImageRefs(supabaseUrl, value, refs = new Set()) {
  if (typeof value === 'string') {
    const objectPath = storageUrlToObjectPath(supabaseUrl, value);
    if (objectPath) refs.add(objectPath);

    for (const match of value.matchAll(/https?:\/\/[^\s)"']+\/storage\/v1\/object\/public\/files\/products\/[^\s)"']+/g)) {
      const embeddedObjectPath = storageUrlToObjectPath(supabaseUrl, match[0]);
      if (embeddedObjectPath) refs.add(embeddedObjectPath);
    }

    return refs;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectStorageImageRefs(supabaseUrl, item, refs);
    return refs;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectStorageImageRefs(supabaseUrl, item, refs);
  }

  return refs;
}

async function checkReferencedFilesExist(refs) {
  const missing = [];

  for (const ref of refs) {
    const absolutePath = path.join(PUBLIC_DIR, ref.replace(/^\//, ''));
    try {
      await access(absolutePath);
    } catch {
      missing.push(ref);
    }
  }

  return missing;
}

async function listObjects(config, prefix) {
  return requestJson(`${config.supabaseUrl}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers: headers(config.serviceRoleKey, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prefix, limit: 1000, offset: 0 }),
  });
}

async function listObjectPathsRecursive(config, prefix) {
  const entries = await listObjects(config, prefix);
  const paths = [];

  for (const entry of entries || []) {
    const entryPath = `${prefix}/${entry.name}`;
    if (entry.id) {
      paths.push(entryPath);
      continue;
    }

    paths.push(...(await listObjectPathsRecursive(config, entryPath)));
  }

  return paths;
}

async function removeObjects(config, objectPaths) {
  if (!objectPaths.length) return 0;

  await requestJson(`${config.supabaseUrl}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers: headers(config.serviceRoleKey, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prefixes: objectPaths }),
  });

  return objectPaths.length;
}

async function main() {
  const config = await loadSupabaseConfig();
  const bucketStatus = await ensureBucket(config);
  const catalog = await getCatalog(config);
  const previousStorageRefs = collectStorageImageRefs(config.supabaseUrl, catalog);
  const imageFiles = await walkImages(PRODUCT_IMAGES_DIR);
  const legacyRelativePathByObjectPath = new Map();
  const existingStorageObjects = new Set(await listObjectPathsRecursive(config, STORAGE_PREFIX));

  for (const file of imageFiles) {
    const relativePath = imageKey(toPosixPath(path.relative(PRODUCT_IMAGES_DIR, file)));
    legacyRelativePathByObjectPath.set(legacyFlatObjectPathForRelativePath(relativePath), relativePath);
    legacyRelativePathByObjectPath.set(path.posix.basename(legacyFlatObjectPathForRelativePath(relativePath)), relativePath);
    legacyRelativePathByObjectPath.set(sourceFilenameForRelativePath(relativePath), relativePath);
    legacyRelativePathByObjectPath.set(legacyCompressedFilenameForRelativePath(relativePath), relativePath);
    legacyRelativePathByObjectPath.set(`compressed:${compressedPathKeyForRelativePath(relativePath)}`, relativePath);
  }

  const contextByRelativePath = buildImageContextMap(catalog, config.supabaseUrl, legacyRelativePathByObjectPath);
  const localRefs = new Set([...contextByRelativePath.keys()].map((value) => `${LOCAL_PRODUCT_PREFIX}${value}`));
  const missingRefs = await checkReferencedFilesExist(localRefs);
  const uploaded = [];
  const imageUrlByRelativePath = new Map();

  const referencedImageFiles = imageFiles.filter((file) => {
    const relativePath = imageKey(toPosixPath(path.relative(PRODUCT_IMAGES_DIR, file)));
    return contextByRelativePath.has(relativePath);
  });

  for (const file of referencedImageFiles) {
    const result = await uploadFile(config, file, contextByRelativePath, existingStorageObjects);
    uploaded.push(result);
    imageUrlByRelativePath.set(result.relativePath, result.publicUrl);
  }

  const rewriteResult = rewriteCatalogImages(catalog, imageUrlByRelativePath, config.supabaseUrl, legacyRelativePathByObjectPath);
  await replaceCatalog(config, rewriteResult.catalog);

  const newStorageRefs = collectStorageImageRefs(config.supabaseUrl, rewriteResult.catalog);
  const allProductStorageObjects = await listObjectPathsRecursive(config, STORAGE_PREFIX);
  const obsoleteStorageRefs = [
    ...new Set([
      ...previousStorageRefs,
      ...allProductStorageObjects.filter((objectPath) => !newStorageRefs.has(objectPath)),
    ]),
  ].filter((objectPath) => !newStorageRefs.has(objectPath));
  const deletedObjects = await removeObjects(config, obsoleteStorageRefs);

  const sample = uploaded[0]?.publicUrl;
  let sampleStatus = null;
  if (sample) {
    const response = await fetch(sample, { method: 'HEAD' });
    sampleStatus = response.status;
  }

  const rootObjects = await listObjects(config, STORAGE_PREFIX);
  const products = Array.isArray(catalog.products) ? catalog.products.length : 0;
  const uploadedObjects = uploaded.filter((image) => image.uploaded).length;
  const skippedObjects = uploaded.length - uploadedObjects;
  const newlyUploaded = uploaded.filter((image) => image.uploaded);
  const sourceBytes = newlyUploaded.reduce((total, image) => total + image.sourceBytes, 0);
  const uploadedBytes = newlyUploaded.reduce((total, image) => total + image.uploadedBytes, 0);

  console.log(JSON.stringify({
    bucket: BUCKET,
    bucketStatus,
    storageLayout: `${STORAGE_PREFIX}/<categoryId>/<subCategoryId>/<productId>/<image>`,
    productDirectoryCount: Array.isArray(rootObjects) ? rootObjects.length : null,
    localImageFiles: imageFiles.length,
    referencedImageFiles: referencedImageFiles.length,
    uploadedObjects,
    skippedExistingObjects: skippedObjects,
    compression: {
      format: 'webp',
      quality: IMAGE_WEBP_QUALITY,
      maxEdge: IMAGE_MAX_EDGE,
      sourceBytes,
      uploadedBytes,
      savedBytes: sourceBytes - uploadedBytes,
      reductionPercent: sourceBytes ? Number(((1 - uploadedBytes / sourceBytes) * 100).toFixed(1)) : 0,
    },
    products,
    referencedLocalImageFiles: contextByRelativePath.size,
    rewrittenCatalogImageValues: rewriteResult.rewritten,
    deletedObsoleteObjects: deletedObjects,
    missingReferencedImages: missingRefs,
    samplePublicUrl: sample,
    sampleHeadStatus: sampleStatus,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
