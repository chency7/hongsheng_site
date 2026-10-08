'use client';

import { buildInitialAdminCatalog, normalizeAdminCatalog, type AdminCatalog } from '@/lib/admin-catalog';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

/**
 * 后台产品目录读写（浏览器直连 Supabase RPC）。
 * - get_admin_catalog: 仅管理员可调用，返回完整目录（含未启用草稿）
 * - replace_admin_catalog: 仅管理员可调用，全量替换目录
 */

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

function messageFromError(error: { message?: string } | null, fallback: string) {
  return error?.message || fallback;
}

export async function fetchAdminCatalog(): Promise<AdminCatalogResponse> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase.rpc('get_admin_catalog');
  if (error) {
    throw new Error(messageFromError(error as { message?: string } | null, '后台数据读取失败'));
  }

  const catalog = data ? normalizeAdminCatalog(data as AdminCatalog) : null;
  if (
    catalog &&
    (catalog.categories.length || catalog.subCategories.length || catalog.products.length)
  ) {
    return { ok: true, source: 'supabase', catalog };
  }

  // 目录为空时用内置种子数据初始化
  const fallbackCatalog = buildInitialAdminCatalog();
  const { error: seedError } = await supabase.rpc('replace_admin_catalog', {
    catalog: fallbackCatalog,
  });
  if (seedError) {
    throw new Error(
      messageFromError(seedError as { message?: string } | null, '初始化产品目录失败'),
    );
  }

  return { ok: true, source: 'seeded', catalog: fallbackCatalog };
}

export async function saveAdminCatalog(catalog: AdminCatalog): Promise<SaveAdminCatalogResponse> {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc('replace_admin_catalog', { catalog });
  if (error) {
    throw new Error(messageFromError(error as { message?: string } | null, '后台数据保存失败'));
  }

  return { ok: true, source: 'supabase', persisted: true };
}
