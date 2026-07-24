const PRODUCT_MEDIA_BUCKET = 'files';
const PRODUCT_MEDIA_PREFIX = 'products';
const PRODUCT_MEDIA_BUCKET_PUBLIC_PREFIX = `/storage/v1/object/public/${PRODUCT_MEDIA_BUCKET}/`;

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
    return parsed.toString();
  } catch {
    return null;
  }
}
