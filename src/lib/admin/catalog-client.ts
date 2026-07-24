'use client';

import type { AdminCatalog } from '@/lib/admin-catalog';

export type AdminCatalogSource = 'fallback' | 'seeded' | 'supabase';

export interface AdminCatalogResponse {
  ok: boolean;
  source: AdminCatalogSource;
  catalog: AdminCatalog;
}

export interface SaveAdminCatalogResponse {
  ok: boolean;
  source: AdminCatalogSource;
  persisted: boolean;
}

async function readErrorMessage(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return data?.message || fallback;
}

export async function fetchAdminCatalog(): Promise<AdminCatalogResponse> {
  const response = await fetch('/api/admin/catalog', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '后台数据读取失败'));
  }

  return response.json();
}

export async function saveAdminCatalog(catalog: AdminCatalog): Promise<SaveAdminCatalogResponse> {
  const response = await fetch('/api/admin/catalog', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(catalog),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '后台数据保存失败'));
  }

  return response.json();
}
