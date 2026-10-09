const PRODUCT_MEDIA_BUCKET = 'files';
const PRODUCT_MEDIA_PREFIX = 'products';
const PRODUCT_MEDIA_BUCKET_PUBLIC_PREFIX = `/storage/v1/object/public/${PRODUCT_MEDIA_BUCKET}/`;
const STORAGE_PUBLIC_PREFIX = '/storage/v1/object/public/';

/**
 * 把 Supabase Storage 公网地址重写为当前配置的 Supabase 域名。
 * 数据里可能存着旧域名（例如「IP + HTTP」）的绝对地址，一旦站点上了 HTTPS
 * 或换了域名，这些地址就会变成混合内容被浏览器拦截；这里统一按路径重写主机名。
 */
export function normalizeStorageUrl(url: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  if (!base || !url.startsWith('http')) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith(STORAGE_PUBLIC_PREFIX)) return url;

    const target = new URL(base);
    if (parsed.origin === target.origin) return url;

    parsed.protocol = target.protocol;
    parsed.host = target.host;
    return parsed.toString();
  } catch {
    return url;
  }
}

function encodeObjectPath(objectPath: string) {
  return objectPath.split('/').map(encodeURIComponent).join('/');
}

export function productThumbnailObjectPath(objectPath: string) {
  const segments = objectPath.split('/');
  const fileName = segments.pop();
  if (!fileName) return objectPath;

  return [...segments, `thumb-${fileName}`].join('/');
}

export function isThumbnailObjectPath(objectPath: string) {
  const fileName = objectPath.split('/').pop() || '';
  return fileName.startsWith('thumb-');
}

export function productMediaObjectPathFromPublicUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith(PRODUCT_MEDIA_BUCKET_PUBLIC_PREFIX)) return null;
    const objectPath = decodeURIComponent(parsed.pathname.slice(PRODUCT_MEDIA_BUCKET_PUBLIC_PREFIX.length));
    if (!objectPath.startsWith(`${PRODUCT_MEDIA_PREFIX}/`)) return null;
    return objectPath;
  } catch {
    return null;
  }
}

export function productOriginalObjectPathFromPublicUrl(url: string) {
  const objectPath = productMediaObjectPathFromPublicUrl(url);
  if (!objectPath) return null;

  const segments = objectPath.split('/');
  const fileName = segments.pop();
  if (!fileName) return objectPath;

  return [...segments, fileName.replace(/^thumb-/, '')].join('/');
}

export function thumbnailUrlFromProductImageUrl(url: string) {
  const objectPath = productOriginalObjectPathFromPublicUrl(url);
  if (!objectPath) return null;

  try {
    const parsed = new URL(url);
    parsed.pathname = `${PRODUCT_MEDIA_BUCKET_PUBLIC_PREFIX}${encodeObjectPath(productThumbnailObjectPath(objectPath))}`;
    return normalizeStorageUrl(parsed.toString());
  } catch {
    return null;
  }
}
