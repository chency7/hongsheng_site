'use client';

import React, { useMemo } from 'react';
import type { AdminSubCategory, AdminCategory } from '@/lib/admin-store';

interface Props {
  subCategories: AdminSubCategory[];
  categories: AdminCategory[];
  value: string;
  onChange: (value: string) => void;
}

export default function SubCategorySelect({ subCategories, categories, value, onChange }: Props) {
  const grouped = useMemo(() => {
    const map: Record<string, AdminSubCategory[]> = {};
    categories.forEach((cat) => {
      map[cat.id] = subCategories.filter((s) => s.categoryId === cat.id);
    });
    return map;
  }, [subCategories, categories]);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
      required
    >
      <option value="">请选择二级分类</option>
      {categories.map((cat) => {
        const subs = grouped[cat.id] || [];
        if (!subs.length) return null;

        return (
          <optgroup key={cat.id} label={cat.name}>
            {subs.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}
