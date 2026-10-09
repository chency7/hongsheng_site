'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { preloadAdminCatalog } from '@/lib/admin-store';
import AuthGuard from './AuthGuard';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  useEffect(() => {
    if (!isLoginPage) preloadAdminCatalog();
  }, [isLoginPage]);

  if (isLoginPage) {
    return <AuthGuard isLoginPage>{children}</AuthGuard>;
  }

  return (
    <AuthGuard isLoginPage={false}>
      <div className="min-h-screen bg-[#F5F7FA] text-[#333333]">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          pathname={pathname}
          onToggleCollapsed={toggleSidebar}
        />
        <div
          className={`transition-[margin-left] duration-200 ease-out motion-reduce:transition-none ${
            sidebarCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[240px]'
          }`}
        >
          <AdminHeader />
          <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
