import 'server-only';

import type { NextRequest, NextResponse } from 'next/server';

export const ADMIN_ACCESS_TOKEN_COOKIE = 'hs_admin_access_token';
export const ADMIN_REFRESH_TOKEN_COOKIE = 'hs_admin_refresh_token';

const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;
const SUPABASE_AUTH_TIMEOUT_MS = 8000;

type SupabaseAuthUser = {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

type SupabaseAuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: SupabaseAuthUser;
};

export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
};

export type AdminSession = {
  authenticated: boolean;
  user?: AdminUser;
  refreshedSession?: SupabaseAuthSession;
  shouldClearCookies?: boolean;
};

export class AdminAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: 'configuration' | 'credentials' | 'forbidden' | 'service',
  ) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

function getSupabaseAuthConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new AdminAuthError('Supabase Auth 尚未配置，请联系系统管理员', 503, 'configuration');
  }

  return { url, serviceRoleKey };
}

function getAuthHeaders(accessToken?: string) {
  const { serviceRoleKey } = getSupabaseAuthConfig();
  return {
    apikey: serviceRoleKey,
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

async function fetchWithTimeout(input: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_AUTH_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') return null;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function hasAdminRole(user: SupabaseAuthUser) {
  const role = user.app_metadata?.role;
  const roles = user.app_metadata?.roles;
  return role === 'admin' || (Array.isArray(roles) && roles.includes('admin'));
}

function normalizeAdminUser(user: SupabaseAuthUser): AdminUser {
  const metadataName = user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name;
  const email = user.email || '';

  return {
    id: user.id,
    email,
    displayName: typeof metadataName === 'string' && metadataName.trim()
      ? metadataName.trim()
      : email.split('@')[0] || '管理员',
  };
}

export async function signInAdminWithPassword(email: string, password: string) {
  const { url } = getSupabaseAuthConfig();
  const response = await fetchWithTimeout(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  }).catch(() => null);

  if (!response) {
    throw new AdminAuthError('暂时无法连接 Supabase Auth，请稍后重试', 503, 'service');
  }

  if (!response.ok) {
    throw new AdminAuthError('邮箱或密码错误，请重试', 401, 'credentials');
  }

  const session = await response.json() as SupabaseAuthSession;
  if (!session.access_token || !session.refresh_token || !session.user) {
    throw new AdminAuthError('Supabase Auth 返回了无效会话', 502, 'service');
  }

  if (!hasAdminRole(session.user)) {
    throw new AdminAuthError('该账号没有后台管理权限', 403, 'forbidden');
  }

  return { session, user: normalizeAdminUser(session.user) };
}

async function readAuthUser(accessToken: string) {
  const { url } = getSupabaseAuthConfig();
  const response = await fetchWithTimeout(`${url}/auth/v1/user`, {
    method: 'GET',
    headers: getAuthHeaders(accessToken),
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) return null;
  return response.json() as Promise<SupabaseAuthUser>;
}

async function refreshAuthSession(refreshToken: string) {
  const { url } = getSupabaseAuthConfig();
  const response = await fetchWithTimeout(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) return null;
  return response.json() as Promise<SupabaseAuthSession>;
}

export async function getAdminSession(request: NextRequest): Promise<AdminSession> {
  const accessToken = request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    const user = await readAuthUser(accessToken);
    if (user) {
      if (!hasAdminRole(user)) {
        return { authenticated: false, shouldClearCookies: true };
      }
      return { authenticated: true, user: normalizeAdminUser(user) };
    }
  }

  if (!refreshToken) {
    return { authenticated: false, shouldClearCookies: Boolean(accessToken) };
  }

  const refreshedSession = await refreshAuthSession(refreshToken);
  if (!refreshedSession?.access_token || !refreshedSession.refresh_token || !refreshedSession.user) {
    return { authenticated: false, shouldClearCookies: true };
  }

  if (!hasAdminRole(refreshedSession.user)) {
    return { authenticated: false, shouldClearCookies: true };
  }

  return {
    authenticated: true,
    user: normalizeAdminUser(refreshedSession.user),
    refreshedSession,
  };
}

export function shouldUseSecureCookie() {
  return process.env.NODE_ENV === 'production';
}

export function setAdminSessionCookies(response: NextResponse, session: SupabaseAuthSession) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: shouldUseSecureCookie(),
    path: '/',
  };

  response.cookies.set({
    ...cookieOptions,
    name: ADMIN_ACCESS_TOKEN_COOKIE,
    value: session.access_token,
    maxAge: Math.max(60, session.expires_in || 3600),
  });
  response.cookies.set({
    ...cookieOptions,
    name: ADMIN_REFRESH_TOKEN_COOKIE,
    value: session.refresh_token,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export function clearAdminSessionCookies(response: NextResponse) {
  for (const name of [ADMIN_ACCESS_TOKEN_COOKIE, ADMIN_REFRESH_TOKEN_COOKIE]) {
    response.cookies.set({
      name,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: shouldUseSecureCookie(),
      path: '/',
      maxAge: 0,
    });
  }
}

export function applyAdminSession(response: NextResponse, session: AdminSession) {
  if (session.refreshedSession) setAdminSessionCookies(response, session.refreshedSession);
  if (session.shouldClearCookies) clearAdminSessionCookies(response);
  return response;
}
