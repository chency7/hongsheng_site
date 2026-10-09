'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
  type LucideIcon,
  LayoutDashboard,
  FolderTree,
  Package,
  FileText,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
} from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/categories', label: '分类管理', icon: FolderTree },
  { href: '/admin/products', label: '产品管理', icon: Package },
  { href: '/admin/files', label: '文件资产', icon: FileText },
  { href: '/admin/users', label: '账号权限', icon: Users },
];

type AdminSidebarProps = {
  collapsed: boolean;
  pathname: string;
  onToggleCollapsed: () => void;
};

type SidebarMenuItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
};

/**
 * 后台菜单使用客户端路由（next/link）切换，不再整页刷新。
 * 静态导出下 Next 的预取请求若在点击前被取消会导致路由死等
 * （表现为"点了没反应 / 一直 loading"），因此显式关闭 prefetch：
 * 导航时按需拉取静态 payload，既能局部切换、保留侧边栏与会话状态，
 * 又不会出现预取被取消而卡住的问题。
 */
const SidebarMenuItem = memo(function SidebarMenuItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: SidebarMenuItemProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
        active
          ? 'bg-[#4A90D9] text-white shadow-md'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      } ${collapsed ? 'justify-center px-2' : ''}`}
      title={collapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
});

function AdminSidebar({ collapsed, pathname, onToggleCollapsed }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    await getSupabaseBrowserClient()
      .auth.signOut()
      .catch(() => undefined);
    window.location.assign('/admin/login');
  }, []);

  const activeItems = useMemo(
    () =>
      menuItems.map((item) => ({
        ...item,
        active: pathname === item.href || pathname.startsWith(item.href + '/'),
      })),
    [pathname]
  );

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#1E3A5F] text-white">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link
            href="/admin/dashboard"
            prefetch={false}
            className="text-lg font-bold tracking-wide"
          >
            HS 后台管理
          </Link>
        )}
        <button
          onClick={() => {
            onToggleCollapsed();
            setMobileOpen(false);
          }}
          className="rounded p-1.5 text-white/60 transition-colors duration-150 hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {activeItems.map((item) => (
          <SidebarMenuItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.active}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors duration-150 hover:bg-red-500/20 hover:text-red-300 ${
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
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded p-1.5 text-white"
          aria-label="打开侧边栏"
        >
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
        className={`fixed bottom-0 left-0 top-0 z-40 hidden transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block ${
          collapsed ? 'w-[64px]' : 'w-[240px]'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default memo(AdminSidebar);
