'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import {
  getSupabaseBrowserClient,
  hasAdminRole,
  normalizeAdminUser,
  type AdminSessionUser,
} from '@/lib/supabase-browser';
import { AdminSessionProvider } from './AdminSessionContext';

/**
 * 后台会话守卫：浏览器直连 Supabase Auth。
 * - getUser() 会自动刷新过期 token
 * - 校验 app_metadata.role = admin
 * - 监听 SIGNED_OUT / TOKEN_REFRESHED 事件保持会话状态
 */
export default function AuthGuard({
  children,
  isLoginPage,
}: {
  children: React.ReactNode;
  isLoginPage: boolean;
}) {
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(isLoginPage);
  const [user, setUser] = useState<AdminSessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseBrowserClient();

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getUser();
        const adminUser =
          !error && data.user && hasAdminRole(data.user) ? normalizeAdminUser(data.user) : null;

        if (cancelled) return;

        if (isLoginPage) {
          setSessionReady(true);
          if (adminUser) {
            router.replace('/admin/dashboard');
          }
          return;
        }

        if (!adminUser) {
          window.location.replace('/admin/login');
          return;
        }

        setUser(adminUser);
        setSessionReady(true);
      } catch {
        // 网络异常：不立即踢出会话，保持当前页面
        if (!cancelled && !isLoginPage) {
          setSessionReady(true);
        }
      }
    }

    void checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === 'SIGNED_OUT') {
        if (!isLoginPage) {
          window.location.replace('/admin/login');
        }
        return;
      }
      if (event === 'USER_UPDATED') {
        void checkSession();
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  if (!isLoginPage && !sessionReady) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#f4f7fa] text-[#5f7486]">
        <div className="flex items-center gap-2 text-sm" role="status">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#176fa6]" aria-hidden="true" />
          正在验证会话
        </div>
      </div>
    );
  }

  return <AdminSessionProvider user={user}>{children}</AdminSessionProvider>;
}
