// Supabase Edge Function: admin-users
// 后台账号管理（替代原 Next.js /api/admin/users 路由）。
// 浏览器无法持有 service_role key，账号管理必须经由本函数代理，
// 函数内部先校验调用者是管理员，再用 service_role 调 Auth Admin API。
//
// 部署：
//   supabase functions deploy admin-users --project-url <SUPABASE_URL>
//
// 必需 Secrets：
//   SUPABASE_URL（函数所在实例地址）
//   SUPABASE_SERVICE_ROLE_KEY
//
// 前端调用：
//   GET    {SUPABASE_URL}/functions/v1/admin-users                  → { ok, users }
//   POST   {SUPABASE_URL}/functions/v1/admin-users {email,password,isAdmin} → { ok, user }
//   PATCH  {SUPABASE_URL}/functions/v1/admin-users {userId,isAdmin}        → { ok, user }
//   headers 均需带 Authorization: Bearer <管理员 access_token>

import { CORS_HEADERS, jsonResponse, preflight } from '../_shared/http.ts';

interface SupabaseAuthUser {
  id: string;
  email?: string;
  created_at?: string;
  confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

interface ManagedAdminUser {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: string | null;
  confirmedAt: string | null;
  lastSignInAt: string | null;
}

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`缺少环境变量 ${name}`);
  return value;
}

function hasAdminRole(user: SupabaseAuthUser): boolean {
  const role = user.app_metadata?.role;
  const roles = user.app_metadata?.roles;
  return role === 'admin' || (Array.isArray(roles) && roles.includes('admin'));
}

function normalizeUser(user: SupabaseAuthUser): ManagedAdminUser {
  const metadataName =
    user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name;
  const email = user.email || '';

  return {
    id: user.id,
    email,
    displayName:
      typeof metadataName === 'string' && metadataName.trim()
        ? metadataName.trim()
        : email.split('@')[0] || '未命名账号',
    isAdmin: hasAdminRole(user),
    createdAt: user.created_at || null,
    confirmedAt: user.confirmed_at ?? null,
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

function withAdminMetadata(user: SupabaseAuthUser, isAdmin: boolean) {
  const nextMetadata = { ...(user.app_metadata || {}) };
  const roles = Array.isArray(nextMetadata.roles)
    ? nextMetadata.roles.filter((role) => role !== 'admin')
    : undefined;

  if (isAdmin) {
    nextMetadata.role = 'admin';
  } else {
    nextMetadata.role = null;
    nextMetadata.roles = roles?.length ? roles : null;
  }

  return nextMetadata;
}

async function readJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

/** 校验调用者（Bearer token）是管理员，返回其用户信息 */
async function requireAdminCaller(request: Request): Promise<SupabaseAuthUser> {
  const baseUrl = requireEnv('SUPABASE_URL').replace(/\/$/, '');
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    throw new HttpError(401, '未登录');
  }

  const response = await fetch(`${baseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (response.status === 401 || response.status === 403) {
    throw new HttpError(401, '登录状态已失效，请重新登录');
  }
  if (!response.ok) {
    throw new HttpError(503, '账号权限服务暂时不可用');
  }

  const user = (await readJson(response)) as SupabaseAuthUser | null;
  if (!user?.id || !hasAdminRole(user)) {
    throw new HttpError(403, '该账号没有后台管理权限');
  }

  return user;
}

class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

function serviceHeaders(): HeadersInit {
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

function authBaseUrl(): string {
  return `${requireEnv('SUPABASE_URL').replace(/\/$/, '')}/auth/v1`;
}

async function listUsers(): Promise<Response> {
  const response = await fetch(`${authBaseUrl()}/admin/users?page=1&per_page=200`, {
    method: 'GET',
    headers: serviceHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new HttpError(502, '读取账号列表失败');
  }

  const payload = (await readJson(response)) as { users?: SupabaseAuthUser[] } | SupabaseAuthUser[] | null;
  const rawUsers = Array.isArray(payload) ? payload : payload?.users || [];
  const users = rawUsers
    .map(normalizeUser)
    .sort((a, b) => a.email.localeCompare(b.email));

  return jsonResponse({ ok: true, users }, 200);
}

async function createUser(request: Request): Promise<Response> {
  const body = (await readJson(request)) as {
    email?: string;
    password?: string;
    isAdmin?: boolean;
  } | null;

  const email = String(body?.email ?? '').trim();
  const password = String(body?.password ?? '');
  const isAdmin = body?.isAdmin !== false;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || password.length > 256) {
    throw new HttpError(400, '请输入有效的邮箱和不少于 6 位的密码');
  }

  const response = await fetch(`${authBaseUrl()}/admin/users`, {
    method: 'POST',
    headers: serviceHeaders(),
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      app_metadata: isAdmin ? { role: 'admin' } : {},
    }),
  });

  const payload = (await readJson(response)) as (SupabaseAuthUser & { msg?: string; message?: string }) | null;
  if (!response.ok || !payload?.id) {
    const message = payload?.msg || payload?.message || '创建账号失败';
    throw new HttpError(response.status === 400 ? 400 : 502, message);
  }

  return jsonResponse({ ok: true, user: normalizeUser(payload) }, 200);
}

async function updateUserRole(request: Request, callerId: string): Promise<Response> {
  const body = (await readJson(request)) as { userId?: string; isAdmin?: boolean } | null;

  const userId = String(body?.userId ?? '');
  const isAdmin = body?.isAdmin === true;

  if (!userId) {
    throw new HttpError(400, '账号权限请求格式不正确');
  }
  if (callerId === userId && !isAdmin) {
    throw new HttpError(400, '不能取消当前登录账号的管理员权限');
  }

  const readResponse = await fetch(`${authBaseUrl()}/admin/users/${userId}`, {
    method: 'GET',
    headers: serviceHeaders(),
    cache: 'no-store',
  });
  const rawUser = (await readJson(readResponse)) as SupabaseAuthUser | null;
  if (!readResponse.ok || !rawUser?.id) {
    throw new HttpError(404, '账号不存在或无法读取');
  }

  const response = await fetch(`${authBaseUrl()}/admin/users/${userId}`, {
    method: 'PUT',
    headers: serviceHeaders(),
    body: JSON.stringify({ app_metadata: withAdminMetadata(rawUser, isAdmin) }),
  });

  const payload = (await readJson(response)) as SupabaseAuthUser | null;
  if (!response.ok || !payload?.id) {
    throw new HttpError(502, '更新账号权限失败');
  }

  return jsonResponse({ ok: true, user: normalizeUser(payload) }, 200);
}

Deno.serve(async (request: Request) => {
  const preflightResponse = preflight(request);
  if (preflightResponse) return preflightResponse;

  try {
    const caller = await requireAdminCaller(request);

    if (request.method === 'GET') {
      return await listUsers();
    }
    if (request.method === 'POST') {
      return await createUser(request);
    }
    if (request.method === 'PATCH') {
      return await updateUserRole(request, caller.id);
    }

    return jsonResponse({ ok: false, message: '仅支持 GET/POST/PATCH 请求' }, 405);
  } catch (error) {
    if (error instanceof HttpError) {
      return jsonResponse({ ok: false, message: error.message }, error.status);
    }
    console.error('admin-users failed', error);
    const message = error instanceof Error ? error.message : '账号权限服务暂时不可用';
    return jsonResponse({ ok: false, message }, 500);
  }
});
