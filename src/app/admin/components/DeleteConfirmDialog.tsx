'use client';

import React from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({ title, message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#E8ECF0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8ECF0] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-red-600">{title}</h2>
          <button onClick={onCancel} className="rounded p-1 text-[#999999] hover:bg-[#F5F7FA] hover:text-[#333333] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-[#666666] leading-relaxed">{message}</p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-lg border border-[#E8ECF0] px-5 py-2.5 text-sm font-medium text-[#666666] hover:bg-[#F5F7FA] transition-colors"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-600"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
