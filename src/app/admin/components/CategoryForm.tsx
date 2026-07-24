'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AdminCategory } from '@/lib/admin-store';
import { Switch } from '@/components/ui/switch';

interface Props {
  initialData: AdminCategory | null;
  onSave: (data: { name: string; slug: string; sortOrder: number; isActive: boolean }) => void;
  onClose: () => void;
}

export default function CategoryForm({ initialData, onSave, onClose }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const handleSlugFromName = (val: string) => {
    if (!initialData) {
      setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'), sortOrder, isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[#E8ECF0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8ECF0] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[#1E3A5F]">
            {initialData ? '编辑分类' : '新增分类'}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-[#999999] hover:bg-[#F5F7FA] hover:text-[#333333] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#666666]">分类名称 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); handleSlugFromName(e.target.value); }}
              placeholder="例如：液压元件"
              className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#666666]">标识 (slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="例如：hydraulic-components"
              className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm font-mono outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#666666]">排序</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#666666]">状态</label>
              <div className="flex items-center gap-3 pt-1.5">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <span className="text-sm text-[#666666]">{isActive ? '启用' : '禁用'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-[#E8ECF0] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E8ECF0] px-5 py-2.5 text-sm font-medium text-[#666666] hover:bg-[#F5F7FA] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#162A45]"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
