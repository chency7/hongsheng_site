'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { preloadAdminCatalog } from '@/lib/admin-store';
import AuthGuard from './AuthGuard';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  useEffect(() => {
    if (!isLoginPage) preloadAdminCatalog();
  }, [isLoginPage]);

  useEffect(() => {
    if (isLoginPage) return;
    const id = window.setTimeout(() => {
      ['/admin/dashboard', '/admin/products', '/admin/categories', '/admin/files', '/admin/users'].forEach((href) => {
        router.prefetch(href);
      });
    }, 250);
    return () => window.clearTimeout(id);
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return (
      <AuthGuard isLoginPage>
        {children}
      </AuthGuard>
    );
  }

  return (
    <AuthGuard isLoginPage={false}>
      <div className="min-h-screen bg-[#F5F7FA] text-[#333333]">
        <AdminSidebar collapsed={sidebarCollapsed} pathname={pathname} onToggleCollapsed={toggleSidebar} />
        <div
          className={`transition-[margin-left] duration-200 ease-out motion-reduce:transition-none ${
            sidebarCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[240px]'
          }`}
        >
          <AdminHeader />
          <main className="min-w-0 p-4 [contain:layout_paint] sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
