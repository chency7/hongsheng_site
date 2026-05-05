'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AdminCategory, AdminSubCategory } from '@/lib/admin-store';
import { Switch } from '@/components/ui/switch';

interface Props {
  categories: AdminCategory[];
  initialData: AdminSubCategory | null;
  onSave: (data: {
    categoryId: string;
    name: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
    productIds: string[];
  }) => void;
  onClose: () => void;
}

export default function SubCategoryForm({ categories, initialData, onSave, onClose }: Props) {
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ''));
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const activeCategories = categories.filter((c) => c.isActive);

  const handleSlugFromName = (val: string) => {
    if (!initialData) {
      setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    onSave({
      categoryId,
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
      sortOrder,
      isActive,
      productIds: initialData?.productIds || [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[#E8ECF0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8ECF0] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[#1E3A5F]">
            {initialData ? '编辑子分类' : '新增子分类'}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-[#999999] hover:bg-[#F5F7FA] hover:text-[#333333] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#666666]">所属父分类 *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
              required
            >
              <option value="">请选择父分类</option>
              {activeCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#666666]">子分类名称 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); handleSlugFromName(e.target.value); }}
              placeholder="例如：液压阀组"
              className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#666666]">标识 (slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="例如：hydraulic-valve-group"
              className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm font-mono outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#666666]">排序</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
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
            <button type="button" onClick={onClose} className="rounded-lg border border-[#E8ECF0] px-5 py-2.5 text-sm font-medium text-[#666666] hover:bg-[#F5F7FA] transition-colors">
              取消
            </button>
            <button type="submit" className="rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162A45]">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
