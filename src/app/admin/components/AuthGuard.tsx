'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authed = localStorage.getItem('admin_authenticated');
    if (pathname !== '/admin/login' && authed !== 'true') {
      router.replace('/admin/login');
    }
    if (pathname === '/admin/login' && authed === 'true') {
      router.replace('/admin/dashboard');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
