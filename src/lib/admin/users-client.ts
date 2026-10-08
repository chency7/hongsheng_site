'use client';

import { getAdminAccessToken, getFunctionsUrl } from '@/lib/supabase-browser';

/**
 * 后台账号管理（浏览器 → Supabase Edge Function `admin-users`）。
 * 账号管理必须使用 service_role，浏览器无法持有，
 * 因此经由 Edge Function 代理，函数内部校验调用者是管理员。
 */

export type ManagedAdminUser = {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: string | null;
  confirmedAt: string | null;
  lastSignInAt: string | null;
};

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH',
  body?: unknown,
  fallbackError = '账号权限服务暂时不可用',
): Promise<T> {
  const accessToken = await getAdminAccessToken();

  const response = await fetch(getFunctionsUrl('admin-users'), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  }).catch(() => null);

  if (!response) {
    throw new Error('无法连接账号权限服务，请稍后重试');
  }

  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;

  if (!response.ok || !data) {
    throw new Error(data?.message || fallbackError);
  }

  return data;
}

export async function listManagedAdminUsers(): Promise<ManagedAdminUser[]> {
  const data = await request<{ users: ManagedAdminUser[] }>('GET', undefined, '读取账号列表失败');
  return data.users;
}

export async function createManagedAdminUser(input: {
  email: string;
  password: string;
  isAdmin: boolean;
}): Promise<ManagedAdminUser> {
  const data = await request<{ user: ManagedAdminUser }>('POST', input, '创建账号失败');
  return data.user;
}

export async function setManagedAdminRole(
  userId: string,
  isAdmin: boolean,
): Promise<ManagedAdminUser> {
  const data = await request<{ user: ManagedAdminUser }>(
    'PATCH',
    { userId, isAdmin },
    '更新账号权限失败',
  );
  return data.user;
}
