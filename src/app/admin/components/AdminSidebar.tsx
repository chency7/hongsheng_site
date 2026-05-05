'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  User,
} from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/categories', label: '分类管理', icon: FolderTree },
  { href: '/admin/products', label: '产品管理', icon: Package },
  { href: '/admin/files', label: '文件管理', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#1E3A5F] text-white">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/admin/dashboard" className="text-lg font-bold tracking-wide">
            HS 后台管理
          </Link>
        )}
        <button
          onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
          className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#4A90D9] text-white shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-red-500/20 hover:text-red-300 ${
            collapsed ? 'justify-center px-2' : ''
          }`}
          title={collapsed ? '退出登录' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>退出登录</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#E8ECF0] bg-[#1E3A5F] px-4 lg:hidden">
        <button onClick={() => setMobileOpen(true)} className="rounded p-1.5 text-white">
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-white">HS 后台管理</span>
        <button onClick={handleLogout} className="rounded p-1.5 text-white/70 hover:text-white">
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 top-0 w-64 shadow-2xl">{sidebarContent}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 hidden transition-all duration-300 lg:block ${
          collapsed ? 'w-[64px]' : 'w-[240px]'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
