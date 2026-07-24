import 'server-only';

import sharp from 'sharp';
import { generateAdminId, type AdminCatalog, type AdminProductFile } from '@/lib/admin-catalog';
import {
  isThumbnailObjectPath,
  productMediaObjectPathFromPublicUrl,
  productThumbnailObjectPath,
} from '@/lib/admin/product-thumbnails';
import {
  deleteProductDocument,
  fileExtension,
  isSupportedProductDocument,
  productDocumentContentType,
  productDocumentObjectPath,
  productImageObjectPath,
  productMediaPublicUrl,
  uploadProductDocument,
  uploadProductImage,
} from '@/lib/supabase-storage';

export const MAX_PRODUCT_DOCUMENT_BYTES = 25 * 1024 * 1024;
export const MAX_PRODUCT_IMAGE_BYTES = 30 * 1024 * 1024;

export interface StoredProductImage {
  url: string;
  thumbnailUrl: string;
  storageObjectPath: string;
  thumbnailStorageObjectPath: string;
  width: number;
  height: number;
  sourceSize: number;
  storedSize: number;
  thumbnailSize: number;
}

export async function storeProductImage(input: {
  file: File;
  categoryId: string;
  subCategoryId: string;
  productId: string;
}): Promise<StoredProductImage> {
  if (!input.file.type.startsWith('image/')) {
    throw new Error('请选择 JPG、PNG、WebP、GIF 或其他常见图片文件');
  }
  if (input.file.size > MAX_PRODUCT_IMAGE_BYTES) {
    throw new Error('单张产品图片不能超过 30 MB');
  }

  const source = Buffer.from(await input.file.arrayBuffer());
  let compressed: { data: Buffer; info: sharp.OutputInfo };
  try {
    compressed = await sharp(source, { animated: false })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, alphaQuality: 100, smartSubsample: true, effort: 5 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new Error('图片无法读取，请换一张有效的图片后重试');
  }

  const bytes = new Uint8Array(compressed.data);
  const objectPath = productImageObjectPath({ ...input, bytes });
  const thumbnail = await sharp(source, { animated: false })
    .rotate()
    .resize({ width: 360, height: 360, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 76, alphaQuality: 100, smartSubsample: true, effort: 5 })
    .toBuffer({ resolveWithObject: true });
  const thumbnailObjectPath = productThumbnailObjectPath(objectPath);

  await Promise.all([
    uploadProductImage(objectPath, bytes),
    uploadProductImage(thumbnailObjectPath, new Uint8Array(thumbnail.data)),
  ]);

  return {
    url: productMediaPublicUrl(objectPath),
    thumbnailUrl: productMediaPublicUrl(thumbnailObjectPath),
    storageObjectPath: objectPath,
    thumbnailStorageObjectPath: thumbnailObjectPath,
    width: compressed.info.width,
    height: compressed.info.height,
    sourceSize: input.file.size,
    storedSize: compressed.data.length,
    thumbnailSize: thumbnail.data.length,
  };
}

export async function storeProductDocument(input: {
  file: File;
  categoryId: string;
  subCategoryId: string;
  productId: string;
  detailTabId: string;
  documentKind?: 'general' | 'presentation';
}): Promise<AdminProductFile> {
  if (!isSupportedProductDocument(input.file.name)) {
    throw new Error('仅支持 PDF、PPT/PPTX、DOC/DOCX、XLS/XLSX 和 ZIP 文件');
  }
  if (input.documentKind === 'presentation' && !['pdf', 'pptx'].includes(fileExtension(input.file.name))) {
    throw new Error('应用案例和外形尺寸仅支持 PDF 或 PPTX 文件');
  }
  if (input.file.size > MAX_PRODUCT_DOCUMENT_BYTES) {
    throw new Error('产品资料不能超过 25 MB');
  }

  const bytes = new Uint8Array(await input.file.arrayBuffer());
  const objectPath = productDocumentObjectPath({ ...input, fileName: input.file.name, bytes });
  await uploadProductDocument(objectPath, bytes, productDocumentContentType(input.file.name));

  return {
    id: generateAdminId(),
    detailTabId: input.detailTabId,
    name: input.file.name,
    url: productMediaPublicUrl(objectPath),
    fileType: fileExtension(input.file.name),
    fileSize: input.file.size,
    storageObjectPath: objectPath,
  };
}

export function catalogReferencesUrl(catalog: AdminCatalog, url: string) {
  return catalog.products.some((product) =>
    product.coverImage === url ||
    product.coverThumbnail === url ||
    product.images.includes(url) ||
    product.subProducts.some((subProduct) =>
      subProduct.coverImage === url ||
      subProduct.coverThumbnail === url ||
      subProduct.images.includes(url),
    ) ||
    product.files.some((file) => file.url === url) ||
    product.detailTabs.some((tab) => tab.fileUrl === url || tab.content === url),
  );
}

export async function removeUnreferencedProductMedia(catalog: AdminCatalog, url: string) {
  if (catalogReferencesUrl(catalog, url)) {
    throw new Error('该媒体仍被产品目录引用，不能删除');
  }

  const objectPath = productMediaObjectPathFromPublicUrl(url);
  if (!objectPath) {
    throw new Error('只能删除 Supabase Storage 的 products 目录文件');
  }

  const paths = [objectPath];
  if (!isThumbnailObjectPath(objectPath)) {
    const thumbnailPath = productThumbnailObjectPath(objectPath);
    paths.push(thumbnailPath);
  }

  await Promise.all(paths.map((path) => deleteProductDocument(path)));
}
