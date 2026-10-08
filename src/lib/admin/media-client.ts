'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
  generateAdminId,
  type AdminCatalog,
  type AdminProductFile,
} from '@/lib/admin-catalog';
import {
  fileExtension,
  isSupportedProductDocument,
  productDocumentContentType,
  productDocumentObjectPath,
  productImageObjectPath,
  productMediaObjectPathFromPublicUrl,
  productMediaPublicUrl,
  productThumbnailObjectPath,
} from '@/lib/admin/media-paths';
import { isThumbnailObjectPath } from '@/lib/admin/product-thumbnails';
import { getCatalogSnapshot } from '@/lib/admin-store';

/**
 * 产品媒体上传/删除（浏览器直连 Supabase Storage）。
 * 图片压缩改在浏览器完成（canvas → webp），
 * 替代原服务端 sharp 压缩 + /api/admin/media 路由。
 */

export const MAX_PRODUCT_DOCUMENT_BYTES = 25 * 1024 * 1024;
export const MAX_PRODUCT_IMAGE_BYTES = 30 * 1024 * 1024;

export interface UploadedAdminProductImage {
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

interface CompressedImage {
  blob: Blob;
  width: number;
  height: number;
}

async function compressImageToWebp(file: File, maxDimension: number, quality: number): Promise<CompressedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('图片无法读取，请换一张有效的图片后重试');
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('当前浏览器不支持图片压缩，请改用 Chrome 或 Edge');
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality),
  );

  if (!blob) {
    throw new Error('当前浏览器不支持 WebP 压缩，请改用 Chrome 或 Edge');
  }

  return { blob, width, height };
}

async function uploadObject(objectPath: string, blob: Blob, contentType: string) {
  const { error } = await getSupabaseBrowserClient()
    .storage
    .from('files')
    .upload(objectPath, blob, { contentType, upsert: true });

  if (error) {
    throw new Error(`文件上传失败：${error.message}`);
  }
}

export async function uploadAdminProductImage(input: {
  file: File;
  categoryId: string;
  subCategoryId: string;
  productId: string;
}): Promise<UploadedAdminProductImage> {
  if (!input.file.type.startsWith('image/')) {
    throw new Error('请选择 JPG、PNG、WebP、GIF 或其他常见图片文件');
  }
  if (input.file.size > MAX_PRODUCT_IMAGE_BYTES) {
    throw new Error('单张产品图片不能超过 30 MB');
  }

  const source = new Uint8Array(await input.file.arrayBuffer());
  const main = await compressImageToWebp(input.file, 2400, 0.82);
  const thumbnail = await compressImageToWebp(input.file, 360, 0.76);

  const objectPath = await productImageObjectPath({ ...input, bytes: source });
  const thumbnailObjectPath = productThumbnailObjectPath(objectPath);

  await Promise.all([
    uploadObject(objectPath, main.blob, 'image/webp'),
    uploadObject(thumbnailObjectPath, thumbnail.blob, 'image/webp'),
  ]);

  return {
    url: productMediaPublicUrl(objectPath),
    thumbnailUrl: productMediaPublicUrl(thumbnailObjectPath),
    storageObjectPath: objectPath,
    thumbnailStorageObjectPath: thumbnailObjectPath,
    width: main.width,
    height: main.height,
    sourceSize: input.file.size,
    storedSize: main.blob.size,
    thumbnailSize: thumbnail.blob.size,
  };
}

export async function uploadAdminProductDocument(input: {
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
  const objectPath = await productDocumentObjectPath({
    categoryId: input.categoryId,
    subCategoryId: input.subCategoryId,
    productId: input.productId,
    detailTabId: input.detailTabId,
    fileName: input.file.name,
    bytes,
  });

  await uploadObject(objectPath, input.file, productDocumentContentType(input.file.name));

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

// ---------------------------------------------------------------------------
// 删除媒体（带"仍被目录引用"校验，与原服务端逻辑一致）
// ---------------------------------------------------------------------------

function catalogReferencesUrl(catalog: AdminCatalog, url: string) {
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

export async function deleteAdminProductDocument(url: string) {
  const objectPath = productMediaObjectPathFromPublicUrl(url);
  if (!objectPath) {
    throw new Error('只能删除 Supabase Storage 的 products 目录文件');
  }

  // 与原服务端逻辑一致：仍被产品目录引用的媒体不允许删除
  if (catalogReferencesUrl(getCatalogSnapshot(), url)) {
    throw new Error('该媒体仍被产品目录引用，不能删除');
  }

  const paths = [objectPath];
  if (!isThumbnailObjectPath(objectPath)) {
    paths.push(productThumbnailObjectPath(objectPath));
  }

  const { error } = await getSupabaseBrowserClient()
    .storage
    .from('files')
    .remove(paths);

  if (error) {
    throw new Error(`产品媒体删除失败：${error.message}`);
  }
}

export const deleteAdminProductMedia = deleteAdminProductDocument;
