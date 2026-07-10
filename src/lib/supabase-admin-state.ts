import 'server-only';

import type { AdminCatalog } from '@/lib/admin-catalog';

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
  return rows[0]?.value ?? null;
}

export async function writeAdminCatalogToSupabase(catalog: AdminCatalog) {
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
      value: catalog,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to write Supabase admin state: ${response.status} ${await response.text()}`);
  }

  return true;
}
