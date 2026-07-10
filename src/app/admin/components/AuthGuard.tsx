'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const response = await fetch('/api/admin/session', { cache: 'no-store' }).catch(() => null);
      const data = response?.ok ? await response.json() : { authenticated: false };
      const authenticated = Boolean(data?.authenticated);

      if (cancelled) return;

      if (pathname !== '/admin/login' && !authenticated) {
        router.replace('/admin/login');
        return;
      }

      if (pathname === '/admin/login' && authenticated) {
        router.replace('/admin/dashboard');
        return;
      }

      setReady(true);
    }

    queueMicrotask(() => {
      if (!cancelled) setReady(false);
    });
    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}
