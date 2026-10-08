import {
  productMediaObjectPathFromPublicUrl,
  productThumbnailObjectPath,
} from '@/lib/admin/product-thumbnails';

/**
 * 产品媒体路径与文件类型工具（浏览器端安全，无 Node 依赖）。
 * 从原服务端 supabase-storage.ts 移植；对象路径哈希改用
 * crypto.subtle（不可用时回退到纯 JS 哈希）。
 */

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

export function fileExtension(value: string) {
  return value.split(/[?#]/)[0].split('.').pop()?.toLowerCase() || '';
}

export function isSupportedProductDocument(fileName: string) {
  return Boolean(documentContentTypes[fileExtension(fileName)]);
}

export function productDocumentContentType(fileName: string) {
  return documentContentTypes[fileExtension(fileName)] || 'application/octet-stream';
}

export { productMediaObjectPathFromPublicUrl, productThumbnailObjectPath };

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  if (!url) {
    throw new Error('缺少 NEXT_PUBLIC_SUPABASE_URL 环境变量');
  }
  return url;
}

export function productMediaPublicUrl(objectPath: string) {
  return `${getSupabaseUrl()}/storage/v1/object/public/${PRODUCT_MEDIA_BUCKET}/${encodeObjectPath(objectPath)}`;
}

function encodeObjectPath(objectPath: string) {
  return objectPath.split('/').map(encodeURIComponent).join('/');
}

function safeSegment(value: string, fallback: string) {
  return (
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || fallback
  );
}

function safeFileName(value: string) {
  const extension = fileExtension(value);
  const stem = value.replace(/\.[^.]+$/, '');
  return `${safeSegment(stem, 'document')}.${extension}`;
}

/**
 * 内容哈希：优先 Web Crypto（https/localhost 下可用），
 * 普通http环境下回退到 FNV-1a 采样哈希，保证浏览器可用。
 */
export async function contentHashHex(bytes: Uint8Array, length = 16): Promise<string> {
  if (globalThis.crypto?.subtle) {
    try {
      const digest = await crypto.subtle.digest('SHA-256', bytes as unknown as ArrayBuffer);
      return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, length);
    } catch {
      // fall through to quick hash
    }
  }

  let hash = 0x811c9dc5;
  const step = Math.max(1, Math.floor(bytes.length / 4096));
  for (let index = 0; index < bytes.length; index += step) {
    hash = Math.imul(hash ^ bytes[index], 16777619) >>> 0;
  }
  const tail = (bytes.length.toString(16) + hash.toString(16)).padEnd(8, '0');
  return (hash.toString(16).padStart(8, '0') + tail).slice(0, length);
}

export async function productImageObjectPath(input: {
  categoryId: string;
  subCategoryId: string;
  productId: string;
  bytes: Uint8Array;
}) {
  const hash = await contentHashHex(input.bytes);
  return [
    PRODUCT_MEDIA_PREFIX,
    safeSegment(input.categoryId, 'uncategorized'),
    safeSegment(input.subCategoryId, 'general'),
    safeSegment(input.productId, 'unknown-product'),
    `${hash}.webp`,
  ].join('/');
}

export async function productDocumentObjectPath(input: {
  categoryId: string;
  subCategoryId: string;
  productId: string;
  detailTabId: string;
  fileName: string;
  bytes: Uint8Array;
}) {
  const hash = await contentHashHex(input.bytes, 12);
  return [
    PRODUCT_MEDIA_PREFIX,
    safeSegment(input.categoryId, 'uncategorized'),
    safeSegment(input.subCategoryId, 'general'),
    safeSegment(input.productId, 'unknown-product'),
    'documents',
    `${safeSegment(input.detailTabId, 'document')}-${hash}-${safeFileName(input.fileName)}`,
  ].join('/');
}
