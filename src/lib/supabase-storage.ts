import 'server-only';

import { createHash } from 'crypto';

export const PRODUCT_MEDIA_BUCKET = 'files';
const PRODUCT_MEDIA_PREFIX = 'products';

const documentContentTypes: Record<string, string> = {
  pdf: 'application/pdf',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
};

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase Storage is not configured');
  }

  return { url, serviceRoleKey };
}

function headers(extra?: HeadersInit): HeadersInit {
  const { serviceRoleKey } = getConfig();
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...extra,
  };
}

function safeSegment(value: string, fallback: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || fallback;
}

function safeFileName(value: string) {
  const extension = fileExtension(value);
  const stem = value.replace(/\.[^.]+$/, '');
  return `${safeSegment(stem, 'document')}.${extension}`;
}

export function productImageObjectPath(input: {
  categoryId: string;
  subCategoryId: string;
  productId: string;
  bytes: Uint8Array;
}) {
  const hash = createHash('sha256').update(input.bytes).digest('hex').slice(0, 16);
  return [
    PRODUCT_MEDIA_PREFIX,
    safeSegment(input.categoryId, 'uncategorized'),
    safeSegment(input.subCategoryId, 'general'),
    safeSegment(input.productId, 'unknown-product'),
    `${hash}.webp`,
  ].join('/');
}

function encodeObjectPath(objectPath: string) {
  return objectPath.split('/').map(encodeURIComponent).join('/');
}

export function fileExtension(value: string) {
  return value.split(/[?#]/)[0].split('.').pop()?.toLowerCase() || '';
}

export function isSupportedProductDocument(fileName: string) {
  return Boolean(documentContentTypes[fileExtension(fileName)]);
}

export function productDocumentContentType(fileName: string) {
  return documentContentTypes[fileExtension(fileName)] || 'application/octet-stream';
}

export function productDocumentObjectPath(input: {
  categoryId: string;
  subCategoryId: string;
  productId: string;
  detailTabId: string;
  fileName: string;
  bytes: Uint8Array;
}) {
  const hash = createHash('sha256').update(input.bytes).digest('hex').slice(0, 12);
  return [
    PRODUCT_MEDIA_PREFIX,
    safeSegment(input.categoryId, 'uncategorized'),
    safeSegment(input.subCategoryId, 'general'),
    safeSegment(input.productId, 'unknown-product'),
    'documents',
    `${safeSegment(input.detailTabId, 'document')}-${hash}-${safeFileName(input.fileName)}`,
  ].join('/');
}

export function productMediaPublicUrl(objectPath: string) {
  const { url } = getConfig();
  return `${url}/storage/v1/object/public/${PRODUCT_MEDIA_BUCKET}/${encodeObjectPath(objectPath)}`;
}

export function productMediaObjectPathFromUrl(value: string) {
  const { url } = getConfig();
  const prefix = `${url}/storage/v1/object/public/${PRODUCT_MEDIA_BUCKET}/`;
  if (!value.startsWith(prefix)) return null;

  const objectPath = value
    .slice(prefix.length)
    .split('/')
    .map((segment) => decodeURIComponent(segment))
    .join('/');

  if (!objectPath.startsWith(`${PRODUCT_MEDIA_PREFIX}/`)) {
    return null;
  }

  return objectPath;
}

export async function uploadProductDocument(objectPath: string, bytes: Uint8Array, contentType: string) {
  const { url } = getConfig();
  const response = await fetch(
    `${url}/storage/v1/object/${PRODUCT_MEDIA_BUCKET}/${encodeObjectPath(objectPath)}`,
    {
      method: 'POST',
      headers: headers({ 'Content-Type': contentType, 'x-upsert': 'true' }),
      body: Buffer.from(bytes),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase document upload failed: ${response.status} ${await response.text()}`);
  }
}

export async function uploadProductImage(objectPath: string, bytes: Uint8Array) {
  return uploadProductDocument(objectPath, bytes, 'image/webp');
}

export async function deleteProductDocument(objectPath: string) {
  const { url } = getConfig();
  const response = await fetch(`${url}/storage/v1/object/${PRODUCT_MEDIA_BUCKET}`, {
    method: 'DELETE',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prefixes: [objectPath] }),
  });

  if (!response.ok) {
    throw new Error(`Supabase document delete failed: ${response.status} ${await response.text()}`);
  }
}
