'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Bell } from 'lucide-react';
import { useAdminSession } from './AdminSessionContext';

function AdminHeader() {
  const router = useRouter();
  const user = useAdminSession();
  const displayName = user?.displayName || '管理员';

  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => null);
    router.push('/admin/login');
  }, [router]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E8ECF0] bg-white px-6 shadow-sm">
      <div>
        <h1 className="text-sm font-medium text-[#666666]">
          欢迎回来，<span className="text-[#1E3A5F]">{displayName}</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative rounded-lg p-2 text-[#666666] transition-colors duration-150 hover:bg-[#F5F7FA] hover:text-[#1E3A5F]"
          aria-label="通知"
          title="通知"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF6B35]" />
        </button>

        <div className="flex items-center gap-2 border-l border-[#E8ECF0] pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F5FA] text-[#4A90D9]">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="max-w-40 truncate text-sm font-medium text-[#333333]">{displayName}</p>
            <p className="max-w-40 truncate text-xs text-[#999999]">{user?.email || 'Supabase 管理账号'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 rounded-lg p-2 text-[#999999] transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
            title="退出登录"
            aria-label="退出登录"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(AdminHeader);
