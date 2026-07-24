import 'server-only';

import { buildInitialAdminCatalog, normalizeAdminCatalog, type AdminCatalog } from '@/lib/admin-catalog';
import type { CategoryOption, Product } from '@/data/products';
import { adminProductToProduct } from '@/lib/admin/product-view';

const ADMIN_STATE_TABLE = 'admin_state';
const ADMIN_STATE_KEY = 'catalog';

type AdminStateRow = {
  key: string;
  value: AdminCatalog;
  updated_at?: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function isSupabaseAdminStateConfigured() {
  return Boolean(getSupabaseConfig());
}

function getRestUrl(path: string) {
  const config = getSupabaseConfig();
  if (!config) return null;
  return `${config.url}/rest/v1/${path}`;
}

function getRpcUrl(functionName: string) {
  const config = getSupabaseConfig();
  if (!config) return null;
  return `${config.url}/rest/v1/rpc/${functionName}`;
}

function getHeaders(extra?: HeadersInit): HeadersInit {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Supabase is not configured');
  }

  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    ...extra,
  };
}

export async function readAdminCatalogFromSupabase() {
  const rpcUrl = getRpcUrl('get_admin_catalog');

  if (rpcUrl) {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: '{}',
      cache: 'no-store',
    });

    if (response.ok) {
      const rawCatalog = (await response.json()) as AdminCatalog | null;
      if (!rawCatalog) return null;

      const catalog = normalizeAdminCatalog(rawCatalog);
      if (catalog.categories.length || catalog.subCategories.length || catalog.products.length) {
        return catalog;
      }
    }
  }

  const url = getRestUrl(`${ADMIN_STATE_TABLE}?key=eq.${ADMIN_STATE_KEY}&select=key,value,updated_at&limit=1`);
  if (!url) return null;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to read Supabase admin state: ${response.status} ${await response.text()}`);
  }

  const rows = (await response.json()) as AdminStateRow[];
  return rows[0]?.value ? normalizeAdminCatalog(rows[0].value) : null;
}

export async function writeAdminCatalogToSupabase(catalog: AdminCatalog) {
  const normalizedCatalog = normalizeAdminCatalog(catalog);
  const rpcUrl = getRpcUrl('replace_admin_catalog');

  if (rpcUrl) {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ catalog: normalizedCatalog }),
    });

    if (response.ok) {
      return true;
    }
  }

  const url = getRestUrl(`${ADMIN_STATE_TABLE}?on_conflict=key`);
  if (!url) return false;

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders({
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    }),
    body: JSON.stringify({
      key: ADMIN_STATE_KEY,
      value: normalizedCatalog,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to write Supabase admin state: ${response.status} ${await response.text()}`);
  }

  return true;
}

export async function getAdminCatalogForSite() {
  if (!isSupabaseAdminStateConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Supabase is required for the production product catalog');
    }

    console.warn('Supabase is not configured; using the local development catalog');
    return buildInitialAdminCatalog();
  }

  const catalog = await readAdminCatalogFromSupabase();
  if (!catalog) {
    throw new Error('Supabase product catalog is empty');
  }

  return catalog;
}

export function adminCatalogToCategoryOptions(catalog: AdminCatalog): CategoryOption[] {
  const activeProducts = catalog.products.filter((product) => product.isActive);

  return catalog.categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => {
      const subCategories = catalog.subCategories
        .filter((subCategory) => subCategory.isActive && subCategory.categoryId === category.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          products: activeProducts
            .filter((product) => product.subCategoryId === subCategory.id)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((product) => ({
              id: `${subCategory.id}-${product.id}`,
              name: product.name,
              productId: product.slug || product.id,
            })),
        }));

      return {
        id: category.id,
        name: category.name,
        products: activeProducts
          .filter((product) => product.subCategoryId === category.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((product) => ({
            id: `${category.id}-${product.id}`,
            name: product.name,
            productId: product.slug || product.id,
          })),
        subCategories,
      };
    });
}

export function adminCatalogToProducts(catalog: AdminCatalog): Product[] {
  return catalog.products
    .filter((product) => product.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(adminProductToProduct);
}
