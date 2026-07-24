'use client';

import type { AdminProductFile } from '@/lib/admin-catalog';

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

async function responseError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return new Error(body?.message || fallback);
}

export async function uploadAdminProductDocument(input: {
  file: File;
  categoryId: string;
  subCategoryId: string;
  productId: string;
  detailTabId: string;
  documentKind?: 'general' | 'presentation';
}): Promise<AdminProductFile> {
  const formData = new FormData();
  formData.set('file', input.file);
  formData.set('categoryId', input.categoryId);
  formData.set('subCategoryId', input.subCategoryId);
  formData.set('productId', input.productId);
  formData.set('detailTabId', input.detailTabId);
  formData.set('mediaType', 'document');
  formData.set('documentKind', input.documentKind || 'general');

  const response = await fetch('/api/admin/media', { method: 'POST', body: formData });
  if (!response.ok) throw await responseError(response, '产品资料上传失败');
  const body = await response.json();
  return body.file;
}

export async function uploadAdminProductImage(input: {
  file: File;
  categoryId: string;
  subCategoryId: string;
  productId: string;
}): Promise<UploadedAdminProductImage> {
  const formData = new FormData();
  formData.set('file', input.file);
  formData.set('categoryId', input.categoryId);
  formData.set('subCategoryId', input.subCategoryId);
  formData.set('productId', input.productId);
  formData.set('mediaType', 'image');

  const response = await fetch('/api/admin/media', { method: 'POST', body: formData });
  if (!response.ok) throw await responseError(response, '产品图片上传失败');
  const body = await response.json();
  return body.image;
}

export async function deleteAdminProductDocument(url: string) {
  const response = await fetch('/api/admin/media', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
    keepalive: true,
  });
  if (!response.ok) throw await responseError(response, '产品媒体删除失败');
}

export const deleteAdminProductMedia = deleteAdminProductDocument;
