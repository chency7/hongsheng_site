import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const BUCKET = 'files';
const STORAGE_PREFIX = 'products';
const DOCUMENT_EXTENSIONS = new Set(['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.zip']);

const mimeTypes = new Map([
  ['.pdf', 'application/pdf'],
  ['.ppt', 'application/vnd.ms-powerpoint'],
  ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['.doc', 'application/msword'],
  ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['.xls', 'application/vnd.ms-excel'],
  ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ['.zip', 'application/zip'],
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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function loadConfig() {
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

function publicUrl(config, objectPath) {
  return `${config.supabaseUrl}/storage/v1/object/public/${BUCKET}/${encodeObjectPath(objectPath)}`;
}

function storageObjectPathFromUrl(config, value) {
  if (typeof value !== 'string') return null;
  const prefix = `${config.supabaseUrl}/storage/v1/object/public/${BUCKET}/`;
  if (!value.startsWith(prefix)) return null;
  return value.slice(prefix.length).split('/').map(decodeURIComponent).join('/');
}

function localPublicPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/')) return null;
  return path.join(PUBLIC_DIR, ...decodeURI(value).split('/').filter(Boolean));
}

async function fileExists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function resolveLocalDocument(tab) {
  const values = [tab.fileUrl, tab.content].filter(Boolean);
  for (const value of values) {
    const localPath = localPublicPath(value);
    if (!localPath) continue;
    if (await fileExists(localPath)) return localPath;

    const extension = path.extname(localPath).toLowerCase();
    if (extension === '.pdf') {
      const pptxPath = `${localPath.slice(0, -extension.length)}.pptx`;
      if (await fileExists(pptxPath)) return pptxPath;
    }
  }
  return null;
}

function documentObjectPath({ categoryId, subCategoryId, productId, tabId, fileName, bytes }) {
  const extension = path.extname(fileName).toLowerCase();
  const stem = path.basename(fileName, extension);
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const normalizedName = `${safeSegment(stem, 'document')}${extension}`;
  return [
    STORAGE_PREFIX,
    safeSegment(categoryId, 'uncategorized'),
    safeSegment(subCategoryId, 'general'),
    safeSegment(productId, 'unknown-product'),
    'documents',
    `${safeSegment(tabId, 'document')}-${hash}-${normalizedName}`,
  ].join('/');
}

async function uploadDocument(config, objectPath, bytes, extension) {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${BUCKET}/${encodeObjectPath(objectPath)}`,
    {
      method: 'POST',
      headers: headers(config.serviceRoleKey, {
        'Content-Type': mimeTypes.get(extension) || 'application/octet-stream',
        'x-upsert': 'true',
      }),
      body: bytes,
    },
  );
  const body = await readResponse(response);
  if (!response.ok) {
    throw new Error(`Upload failed for ${objectPath} with ${response.status}: ${JSON.stringify(body)}`);
  }
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
    if (entry.id) paths.push(entryPath);
    else paths.push(...(await listObjectPathsRecursive(config, entryPath)));
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

function collectDocumentRefs(config, catalog) {
  const refs = new Set();
  for (const product of catalog.products || []) {
    for (const tab of product.detailTabs || []) {
      const objectPath = storageObjectPathFromUrl(config, tab.fileUrl || tab.content);
      if (objectPath?.includes('/documents/')) refs.add(objectPath);
    }
    for (const file of product.files || []) {
      const objectPath = file.storageObjectPath || storageObjectPathFromUrl(config, file.url);
      if (objectPath?.includes('/documents/')) refs.add(objectPath);
    }
  }
  return refs;
}

async function main() {
  const config = await loadConfig();
  const catalog = await getCatalog(config);
  const categoryIdBySubCategoryId = new Map(
    (catalog.subCategories || []).map((subCategory) => [subCategory.id, subCategory.categoryId]),
  );
  const migrated = [];
  const alreadyRemote = [];
  const missing = [];

  for (const product of catalog.products || []) {
    product.files = Array.isArray(product.files) ? product.files : [];
    for (const tab of product.detailTabs || []) {
      if (tab.type !== 'file' && tab.type !== 'pdf') continue;

      const existingFile = product.files.find((file) => file.detailTabId === tab.id);
      const remoteUrl = tab.fileUrl || existingFile?.url || (storageObjectPathFromUrl(config, tab.content) ? tab.content : '');
      if (remoteUrl) {
        const response = await fetch(remoteUrl, { method: 'HEAD' });
        if (response.ok) {
          alreadyRemote.push({ productId: product.id, tabId: tab.id, url: remoteUrl });
          continue;
        }
      }

      const localPath = await resolveLocalDocument(tab);
      if (!localPath || path.basename(localPath).startsWith('~$')) {
        missing.push({ productId: product.id, tabId: tab.id, value: tab.fileUrl || tab.content || '' });
        continue;
      }

      const extension = path.extname(localPath).toLowerCase();
      if (!DOCUMENT_EXTENSIONS.has(extension)) continue;
      const bytes = await readFile(localPath);
      const fileName = path.basename(localPath);
      const objectPath = documentObjectPath({
        categoryId: categoryIdBySubCategoryId.get(product.subCategoryId),
        subCategoryId: product.subCategoryId,
        productId: product.id,
        tabId: tab.id,
        fileName,
        bytes,
      });
      await uploadDocument(config, objectPath, bytes, extension);
      const url = publicUrl(config, objectPath);
      const fileRecord = {
        id: existingFile?.id || `file-${tab.id}`,
        detailTabId: tab.id,
        name: fileName,
        url,
        fileType: extension.slice(1),
        fileSize: bytes.length,
        storageObjectPath: objectPath,
      };

      tab.type = 'file';
      tab.content = localPublicPath(tab.content) ? '' : (tab.content || '');
      tab.fileId = fileRecord.id;
      tab.fileName = fileRecord.name;
      tab.fileUrl = fileRecord.url;
      tab.fileType = fileRecord.fileType;
      tab.fileSize = fileRecord.fileSize;
      tab.storageObjectPath = fileRecord.storageObjectPath;
      product.files = [...product.files.filter((file) => file.detailTabId !== tab.id), fileRecord];
      migrated.push({ productId: product.id, tabId: tab.id, fileName, url, objectPath, bytes: bytes.length });
    }
  }

  if (missing.length) {
    throw new Error(`Missing local product documents: ${JSON.stringify(missing)}`);
  }

  await replaceCatalog(config, catalog);

  const referencedObjects = collectDocumentRefs(config, catalog);
  const allObjects = await listObjectPathsRecursive(config, STORAGE_PREFIX);
  const obsoleteDocuments = allObjects.filter(
    (objectPath) => objectPath.includes('/documents/') && !referencedObjects.has(objectPath),
  );
  const deletedObjects = await removeObjects(config, obsoleteDocuments);

  const verification = [];
  for (const item of [...migrated, ...alreadyRemote]) {
    const response = await fetch(item.url, { method: 'HEAD' });
    verification.push({ productId: item.productId, tabId: item.tabId, status: response.status, url: item.url });
  }

  console.log(JSON.stringify({
    bucket: BUCKET,
    storageLayout: `${STORAGE_PREFIX}/<categoryId>/<subCategoryId>/<productId>/documents/<document>`,
    migratedDocuments: migrated.length,
    existingRemoteDocuments: alreadyRemote.length,
    deletedUnreferencedDocuments: deletedObjects,
    documents: migrated,
    verification,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
