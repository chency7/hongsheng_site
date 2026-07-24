import 'server-only';

import {
  adminCatalogToCategoryOptions,
  adminCatalogToProducts,
  getAdminCatalogForSite,
  isSupabaseAdminStateConfigured,
  readAdminCatalogFromSupabase,
  writeAdminCatalogToSupabase,
} from '@/lib/supabase-admin-state';
import type { AdminCatalog } from '@/lib/admin-catalog';

export type AdminCatalogSource = 'fallback' | 'seeded' | 'supabase';

export {
  adminCatalogToCategoryOptions,
  adminCatalogToProducts,
  getAdminCatalogForSite,
  isSupabaseAdminStateConfigured,
};

export async function readAdminCatalog() {
  return readAdminCatalogFromSupabase();
}

export async function writeAdminCatalog(catalog: AdminCatalog) {
  return writeAdminCatalogToSupabase(catalog);
}
