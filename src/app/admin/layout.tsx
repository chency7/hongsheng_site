'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthGuard from './components/AuthGuard';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F5F7FA] text-[#333333]">
        <AdminSidebar />
        <div className="transition-all duration-300 lg:ml-[240px]">
          <AdminHeader />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
