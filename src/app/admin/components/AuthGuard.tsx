'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { AdminSessionProvider, type AdminSessionUser } from './AdminSessionContext';

const SESSION_CHECK_TIMEOUT_MS = 10000;

type SessionResponse = {
  authenticated?: boolean;
  user?: AdminSessionUser | null;
};

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
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), SESSION_CHECK_TIMEOUT_MS);

    async function checkSession() {
      const response = await fetch('/api/admin/session', {
        cache: 'no-store',
        signal: controller.signal,
      }).catch(() => null);
      const data = response?.ok
        ? await response.json().catch(() => null) as SessionResponse | null
        : null;
      const authenticated = Boolean(data?.authenticated);

      if (cancelled) return;

      if (isLoginPage) {
        setSessionReady(true);
        if (authenticated) {
          router.replace('/admin/dashboard');
        }
        return;
      }

      if (!authenticated) {
        window.location.replace('/admin/login');
        return;
      }

      setUser(data?.user || null);
      setSessionReady(true);
    }

    void checkSession();

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
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
