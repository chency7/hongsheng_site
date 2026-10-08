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

type AuthLookupResult<T> =
  | { status: 'ok'; data: T }
  | { status: 'unauthorized' }
  | { status: 'error' };

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
  /** transient network/service issue; cookies should be kept */
  transient?: boolean;
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

/**
 * Cookie Secure 标志：
 * - ADMIN_COOKIE_SECURE=true/false 可强制覆盖
 * - 否则按实际请求协议（含 x-forwarded-proto）决定
 * - 避免 production + http://IP 访问时 Secure Cookie 无法写入导致“登录后立刻被踢”
 */
export function shouldUseSecureCookie(request?: Pick<Request, 'headers' | 'url'>) {
  const forced = process.env.ADMIN_COOKIE_SECURE?.trim().toLowerCase();
  if (forced === 'true' || forced === '1') return true;
  if (forced === 'false' || forced === '0') return false;

  if (request) {
    const forwarded = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
    if (forwarded === 'https' || forwarded === 'http') {
      return forwarded === 'https';
    }

    try {
      return new URL(request.url).protocol === 'https:';
    } catch {
      // ignore invalid url
    }
  }

  return false;
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

async function readAuthUser(accessToken: string): Promise<AuthLookupResult<SupabaseAuthUser>> {
  const { url } = getSupabaseAuthConfig();
  let response: Response | null;

  try {
    response = await fetchWithTimeout(`${url}/auth/v1/user`, {
      method: 'GET',
      headers: getAuthHeaders(accessToken),
      cache: 'no-store',
    });
  } catch {
    return { status: 'error' };
  }

  if (!response) return { status: 'error' };
  if (response.status === 401 || response.status === 403) return { status: 'unauthorized' };
  if (!response.ok) return { status: 'error' };

  try {
    const user = await response.json() as SupabaseAuthUser;
    return { status: 'ok', data: user };
  } catch {
    return { status: 'error' };
  }
}

async function refreshAuthSession(refreshToken: string): Promise<AuthLookupResult<SupabaseAuthSession>> {
  const { url } = getSupabaseAuthConfig();
  let response: Response | null;

  try {
    response = await fetchWithTimeout(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: 'no-store',
    });
  } catch {
    return { status: 'error' };
  }

  if (!response) return { status: 'error' };
  if (response.status === 401 || response.status === 403) return { status: 'unauthorized' };
  if (!response.ok) return { status: 'error' };

  try {
    const session = await response.json() as SupabaseAuthSession;
    if (!session.access_token || !session.refresh_token || !session.user) {
      return { status: 'error' };
    }
    return { status: 'ok', data: session };
  } catch {
    return { status: 'error' };
  }
}

export async function getAdminSession(request: NextRequest): Promise<AdminSession> {
  const accessToken = request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    const userResult = await readAuthUser(accessToken);
    if (userResult.status === 'ok') {
      if (!hasAdminRole(userResult.data)) {
        return { authenticated: false, shouldClearCookies: true };
      }
      return { authenticated: true, user: normalizeAdminUser(userResult.data) };
    }

    // access token 明确失效时才走 refresh；网络抖动不立刻清 cookie
    if (userResult.status === 'error' && !refreshToken) {
      return { authenticated: false, shouldClearCookies: false, transient: true };
    }
  }

  if (!refreshToken) {
    return { authenticated: false, shouldClearCookies: Boolean(accessToken) };
  }

  const refreshResult = await refreshAuthSession(refreshToken);
  if (refreshResult.status === 'error') {
    return { authenticated: false, shouldClearCookies: false, transient: true };
  }

  if (refreshResult.status === 'unauthorized') {
    return { authenticated: false, shouldClearCookies: true };
  }

  const refreshedSession = refreshResult.data;
  if (!hasAdminRole(refreshedSession.user)) {
    return { authenticated: false, shouldClearCookies: true };
  }

  return {
    authenticated: true,
    user: normalizeAdminUser(refreshedSession.user),
    refreshedSession,
  };
}

export function setAdminSessionCookies(
  response: NextResponse,
  session: SupabaseAuthSession,
  request?: Pick<Request, 'headers' | 'url'>,
) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: shouldUseSecureCookie(request),
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

export function clearAdminSessionCookies(
  response: NextResponse,
  request?: Pick<Request, 'headers' | 'url'>,
) {
  for (const name of [ADMIN_ACCESS_TOKEN_COOKIE, ADMIN_REFRESH_TOKEN_COOKIE]) {
    response.cookies.set({
      name,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: shouldUseSecureCookie(request),
      path: '/',
      maxAge: 0,
    });
  }
}

export function applyAdminSession(
  response: NextResponse,
  session: AdminSession,
  request?: Pick<Request, 'headers' | 'url'>,
) {
  if (session.refreshedSession) setAdminSessionCookies(response, session.refreshedSession, request);
  if (session.shouldClearCookies) clearAdminSessionCookies(response, request);
  return response;
}
