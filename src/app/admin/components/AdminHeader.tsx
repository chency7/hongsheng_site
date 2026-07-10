'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Bell } from 'lucide-react';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => null);
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E8ECF0] bg-white px-6 shadow-sm">
      <div>
        <h1 className="text-sm font-medium text-[#666666]">
          欢迎回来，<span className="text-[#1E3A5F]">管理员</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-[#666666] hover:bg-[#F5F7FA] hover:text-[#1E3A5F] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF6B35]" />
        </button>

        <div className="flex items-center gap-2 border-l border-[#E8ECF0] pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F5FA] text-[#4A90D9]">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#333333]">管理员</p>
            <p className="text-xs text-[#999999]">admin@xl-honsun.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 rounded-lg p-2 text-[#999999] hover:bg-red-50 hover:text-red-500 transition-colors"
            title="退出登录"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
