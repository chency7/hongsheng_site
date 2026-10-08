'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * 浏览器端 Supabase 客户端（anon key + RLS）。
 * 纯前端部署下，所有数据访问都由浏览器直连 Supabase，
 * service_role key 只存在于 Edge Functions 中，绝不进入前端包。
 */

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase 前端直连尚未配置：请在 .env 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
}

export function getSupabaseAnonKey(): string {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error('缺少 NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量');
  }
  return anonKey;
}

/** Supabase Edge Function 调用地址 */
export function getFunctionsUrl(functionName: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  if (!url) {
    throw new Error('缺少 NEXT_PUBLIC_SUPABASE_URL 环境变量');
  }
  return `${url}/functions/v1/${functionName}`;
}

export type AdminSessionUser = {
  id: string;
  email: string;
  displayName: string;
};

type SupabaseAuthUserLike = {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

export function hasAdminRole(user: SupabaseAuthUserLike): boolean {
  const role = user.app_metadata?.role;
  const roles = user.app_metadata?.roles;
  return role === 'admin' || (Array.isArray(roles) && roles.includes('admin'));
}

export function normalizeAdminUser(user: SupabaseAuthUserLike): AdminSessionUser {
  const metadataName =
    user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name;
  const email = user.email || '';

  return {
    id: user.id,
    email,
    displayName:
      typeof metadataName === 'string' && metadataName.trim()
        ? metadataName.trim()
        : email.split('@')[0] || '管理员',
  };
}

/** 获取当前登录的管理员（已校验 admin 角色）；未登录或非管理员返回 null */
export async function getAdminSessionUser(): Promise<AdminSessionUser | null> {
  const {
    data: { user },
  } = await getSupabaseBrowserClient().auth.getUser();

  if (!user || !hasAdminRole(user)) return null;
  return normalizeAdminUser(user);
}

/** 获取当前登录管理员的 access_token（调用 Edge Function 用） */
export async function getAdminAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await getSupabaseBrowserClient().auth.getSession();
  return session?.access_token ?? null;
}
