'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import type { AdminProduct } from '@/lib/admin-store';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { Switch } from '@/components/ui/switch';

export default function AdminProductsPage() {
  const { getProducts, getSubCategories, getCategories, updateProduct, deleteProduct, getStats } = useAdminStore();
  const products = getProducts();
  const subCategories = getSubCategories();
  const categories = getCategories();
  const stats = getStats();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  const getSubName = (subId: string) =>
    subCategories.find((s) => s.id === subId)?.name || subId;

  const getCatName = (subId: string) => {
    const sub = subCategories.find((s) => s.id === subId);
    if (!sub) return '';
    const cat = categories.find((c) => c.id === sub.categoryId);
    return cat?.name || '';
  };

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
      );
    }
    if (filterCat) {
      result = result.filter((p) => p.subCategoryId === filterCat);
    }
    return result;
  }, [products, search, filterCat]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1E3A5F]">产品管理</h1>
          <p className="mt-1 text-sm text-[#999999]">
            共 {stats.totalProducts} 个产品，{stats.activeProducts} 个已启用
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#1E3A5F]/10 transition-all hover:bg-[#162A45] hover:-translate-y-[1px]"
        >
          <Plus className="h-4 w-4" />
          新增产品
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索产品名称/型号..."
            className="w-full rounded-lg border border-[#E8ECF0] py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] sm:w-48"
        >
          <option value="">全部分类</option>
          {subCategories.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E8ECF0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E8ECF0] bg-[#F9FAFB]">
              <tr>
                <th className="w-16 px-4 py-4 text-xs font-medium text-[#999999] uppercase">#</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">产品</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">型号</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">所属分类</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">品牌</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">状态</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-[#999999]">
                    暂无数据
                  </td>
                </tr>
              ) : (
                filtered.map((product, idx) => (
                  <tr key={product.id} className="border-b border-[#E8ECF0] transition-colors hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3 text-[#999999]">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-slate-50">
                          <Image
                            src={product.coverImage || '/images/hs/hydraulic.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-[#333333]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#666666]">{product.model}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#F0F5FA] px-2.5 py-1 text-xs font-medium text-[#4A90D9]">
                        {getSubName(product.subCategoryId)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#666666]">{product.brand}</td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={() => updateProduct(product.id, { isActive: !product.isActive })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="rounded p-1.5 text-[#999999] hover:bg-[#F0F5FA] hover:text-[#28A745] transition-colors"
                          title="前台预览"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded p-1.5 text-[#999999] hover:bg-[#F0F5FA] hover:text-[#4A90D9] transition-colors"
                          title="编辑"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="rounded p-1.5 text-[#999999] hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmDialog
          title="删除产品"
          message={`确定要删除产品「${deleteTarget.name}」吗？删除后不可恢复。`}
          onConfirm={() => { deleteProduct(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
