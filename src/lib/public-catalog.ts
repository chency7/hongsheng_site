'use client';

import useSWR from 'swr';
import { normalizeAdminCatalog, type AdminCatalog } from '@/lib/admin-catalog';
import { adminCatalogToCategoryOptions, adminCatalogToProducts } from '@/lib/catalog-transform';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { CategoryOption, Product } from '@/data/products';

/**
 * 站点公开产品目录（匿名可读）。
 * 数据来自 Supabase RPC get_public_catalog——只包含"对外可见"的
 * 分类/子分类/产品（产品启用 + 子分类启用 + 上级分类启用）。
 */

async function fetchPublicCatalog(): Promise<AdminCatalog> {
  const { data, error } = await getSupabaseBrowserClient().rpc('get_public_catalog');

  if (error) {
    throw new Error(error.message || '产品目录读取失败');
  }

  return normalizeAdminCatalog(
    (data ?? { categories: [], subCategories: [], products: [] }) as AdminCatalog,
  );
}

export function usePublicCatalog(): {
  catalog: AdminCatalog | undefined;
  products: Product[];
  categoryOptions: CategoryOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data: catalog, error, isLoading } = useSWR('public-catalog', fetchPublicCatalog, {
    revalidateOnFocus: false,
  });

  const products = catalog ? adminCatalogToProducts(catalog) : [];
  const categoryOptions = catalog ? adminCatalogToCategoryOptions(catalog) : [];

  return {
    catalog,
    products,
    categoryOptions,
    isLoading: !catalog && !error,
    error: (error as Error | null) ?? null,
  };
}
