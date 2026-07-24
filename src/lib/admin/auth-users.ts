import 'server-only';

import { AdminAuthError } from '@/lib/admin-auth';

const AUTH_ADMIN_TIMEOUT_MS = 8000;

type SupabaseAuthUser = {
  id: string;
  email?: string;
  created_at?: string;
  confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

type SupabaseUsersResponse = {
  users?: SupabaseAuthUser[];
};

export type ManagedAdminUser = {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: string | null;
  confirmedAt: string | null;
  lastSignInAt: string | null;
};

function getAuthAdminConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new AdminAuthError('Supabase Auth 尚未配置，请联系系统管理员', 503, 'configuration');
  }

  return { url, serviceRoleKey };
}

function getHeaders() {
  const { serviceRoleKey } = getAuthAdminConfig();
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

async function authAdminFetch(path: string, init: RequestInit) {
  const { url } = getAuthAdminConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AUTH_ADMIN_TIMEOUT_MS);

  try {
    return await fetch(`${url}/auth/v1/admin${path}`, {
      ...init,
      headers: {
        ...getHeaders(),
        ...init.headers,
      },
      signal: controller.signal,
      cache: 'no-store',
    });
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') {
      throw new AdminAuthError('Supabase Auth 响应超时，请稍后重试', 503, 'service');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function readJson(response: Response) {
  return response.json().catch(() => null) as Promise<unknown>;
}

function hasAdminRole(user: SupabaseAuthUser) {
  const role = user.app_metadata?.role;
  const roles = user.app_metadata?.roles;
  return role === 'admin' || (Array.isArray(roles) && roles.includes('admin'));
}

function normalizeUser(user: SupabaseAuthUser): ManagedAdminUser {
  const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name;
  const email = user.email || '';

  return {
    id: user.id,
    email,
    displayName: typeof displayName === 'string' && displayName.trim()
      ? displayName.trim()
      : email.split('@')[0] || '未命名账号',
    isAdmin: hasAdminRole(user),
    createdAt: user.created_at || null,
    confirmedAt: user.confirmed_at || null,
    lastSignInAt: user.last_sign_in_at || null,
  };
}

function normalizeUsersPayload(payload: unknown) {
  if (Array.isArray(payload)) return payload as SupabaseAuthUser[];
  return ((payload as SupabaseUsersResponse | null)?.users || []) as SupabaseAuthUser[];
}

function withAdminMetadata(user: SupabaseAuthUser, isAdmin: boolean) {
  const nextMetadata = { ...(user.app_metadata || {}) };
  const roles = Array.isArray(nextMetadata.roles) ? nextMetadata.roles.filter((role) => role !== 'admin') : undefined;

  if (isAdmin) {
    nextMetadata.role = 'admin';
  } else {
    nextMetadata.role = null;
    nextMetadata.roles = roles?.length ? roles : null;
  }

  return nextMetadata;
}

export async function listManagedAdminUsers() {
  const response = await authAdminFetch('/users?page=1&per_page=200', { method: 'GET' });
  if (!response.ok) {
    throw new AdminAuthError('读取账号列表失败', response.status, 'service');
  }

  const users = normalizeUsersPayload(await readJson(response));
  return users.map(normalizeUser).sort((a, b) => a.email.localeCompare(b.email));
}

export async function createManagedAdminUser(input: { email: string; password: string; isAdmin: boolean }) {
  const response = await authAdminFetch('/users', {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      email_confirm: true,
      app_metadata: input.isAdmin ? { role: 'admin' } : {},
    }),
  });
  const payload = await readJson(response);

  if (!response.ok) {
    const message = (payload as { msg?: string; message?: string } | null)?.msg
      || (payload as { message?: string } | null)?.message
      || '创建账号失败';
    throw new AdminAuthError(message, response.status, 'service');
  }

  return normalizeUser(payload as SupabaseAuthUser);
}

export async function setManagedAdminRole(userId: string, isAdmin: boolean) {
  const readResponse = await authAdminFetch(`/users/${userId}`, { method: 'GET' });
  const rawUser = await readJson(readResponse) as SupabaseAuthUser | null;

  if (!readResponse.ok || !rawUser?.id) {
    throw new AdminAuthError('账号不存在或无法读取', readResponse.status || 404, 'service');
  }

  const response = await authAdminFetch(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ app_metadata: withAdminMetadata(rawUser, isAdmin) }),
  });
  const payload = await readJson(response);

  if (!response.ok) {
    throw new AdminAuthError('更新账号权限失败', response.status, 'service');
  }

  return normalizeUser(payload as SupabaseAuthUser);
}
