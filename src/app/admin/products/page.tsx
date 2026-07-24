'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Eye, CornerDownRight, FolderTree, Layers3 } from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import type { AdminProduct } from '@/lib/admin-store';
import { deleteAdminProductMedia } from '@/lib/admin/media-client';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ALL_CATEGORIES_VALUE = '__all_categories__';
const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const { isCatalogLoading, getProducts, getSubCategories, getCategories, updateProduct, deleteProduct, getStats } = useAdminStore();
  const products = getProducts();
  const subCategories = getSubCategories();
  const categories = getCategories();
  const stats = getStats();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [error, setError] = useState('');

  const categoryGroups = useMemo(
    () => categories.map((category) => ({
      category,
      children: subCategories.filter((subCategory) => subCategory.categoryId === category.id),
    })),
    [categories, subCategories],
  );

  const categoryNameById = useMemo(() => {
    const names = new Map<string, string>();
    categories.forEach((category) => names.set(category.id, category.name));
    subCategories.forEach((subCategory) => {
      const parent = names.get(subCategory.categoryId);
      names.set(subCategory.id, parent ? `${parent} / ${subCategory.name}` : subCategory.name);
    });
    return names;
  }, [categories, subCategories]);

  const categoryIds = useMemo(
    () => new Set(categories.map((category) => category.id)),
    [categories],
  );

  const childIdsByCategoryId = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    subCategories.forEach((subCategory) => {
      const current = groups.get(subCategory.categoryId) || new Set<string>();
      current.add(subCategory.id);
      groups.set(subCategory.categoryId, current);
    });
    return groups;
  }, [subCategories]);

  const selectedFilterLabel = useMemo(() => {
    if (!filterCat) return '全部分类';
    return categories.find((category) => category.id === filterCat)?.name
      || subCategories.find((subCategory) => subCategory.id === filterCat)?.name
      || '全部分类';
  }, [categories, filterCat, subCategories]);

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
      );
    }
    if (filterCat) {
      if (categoryIds.has(filterCat)) {
        const childCategoryIds = childIdsByCategoryId.get(filterCat) || new Set<string>();
        result = result.filter(
          (product) => product.subCategoryId === filterCat || childCategoryIds.has(product.subCategoryId),
        );
      } else {
        result = result.filter((product) => product.subCategoryId === filterCat);
      }
    }
    return result;
  }, [categoryIds, childIdsByCategoryId, filterCat, products, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleProducts = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  if (isCatalogLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-[#999999]">
        正在读取产品目录...
      </div>
    );
  }

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
          className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#1E3A5F]/10 transition-[background-color,transform] duration-150 hover:-translate-y-[1px] hover:bg-[#162A45]"
        >
          <Plus className="h-4 w-4" />
          新增产品
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="搜索产品名称/型号..."
            className="w-full rounded-lg border border-[#E8ECF0] py-2.5 pl-10 pr-4 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
          />
        </div>
        <Select
          value={filterCat || ALL_CATEGORIES_VALUE}
          onValueChange={(value) => { setFilterCat(value === ALL_CATEGORIES_VALUE ? '' : value); setCurrentPage(1); }}
        >
          <SelectTrigger className="sm:w-60" aria-label="筛选产品分类">
            <SelectValue>{selectedFilterLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start" sideOffset={4}>
            <SelectItem value={ALL_CATEGORIES_VALUE} className="font-medium">
              <span className="flex min-w-0 items-center gap-2">
                <Layers3 className="h-4 w-4 shrink-0 text-[#64748B]" />
                <span className="truncate">全部分类</span>
              </span>
            </SelectItem>
            <SelectSeparator />
            {categoryGroups.map(({ category, children }, categoryIndex) => (
              <SelectGroup key={category.id}>
                {categoryIndex > 0 ? <SelectSeparator /> : null}
                <SelectItem
                  value={category.id}
                  textValue={category.name}
                  className="min-h-10 bg-[#F7F9FB] font-semibold text-[#1E3A5F] focus:bg-[#E7F1FA]"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <FolderTree className="h-4 w-4 shrink-0 text-[#2878C8]" />
                    <span className="truncate">{category.name}</span>
                    <span className="ml-auto shrink-0 rounded bg-[#E7EEF5] px-1.5 py-0.5 text-[10px] font-medium text-[#6B7C8F]">
                      {children.length}
                    </span>
                  </span>
                </SelectItem>
                {children.map((subCategory) => (
                  <SelectItem
                    key={subCategory.id}
                    value={subCategory.id}
                    textValue={subCategory.name}
                    className="pl-10 text-[#4B5563]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-[#A3AFBC]" />
                      <span className="truncate">{subCategory.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
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
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">状态</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#999999]">
                    暂无数据
                  </td>
                </tr>
              ) : (
                visibleProducts.map((product, idx) => (
                  <tr key={product.id} className="border-b border-[#E8ECF0] transition-colors hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3 text-[#999999]">{(safePage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-slate-50">
                          <Image
                            src={product.coverThumbnail || product.coverImage || '/images/hs/hydraulic.svg'}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-[#333333]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#666666]">{product.model}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#F0F5FA] px-2.5 py-1 text-xs font-medium text-[#4A90D9]">
                        {categoryNameById.get(product.subCategoryId) || product.subCategoryId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={() => {
                          setError('');
                          void updateProduct(product.id, { isActive: !product.isActive }).catch((updateError) => {
                            setError(updateError instanceof Error ? updateError.message : '产品状态更新失败');
                          });
                        }}
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
        {filtered.length > PAGE_SIZE ? (
          <div className="flex items-center justify-between border-t border-[#E8ECF0] px-4 py-3 text-sm text-[#666666]">
            <span>
              第 {safePage} / {totalPages} 页，共 {filtered.length} 项
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safePage === 1}
                className="rounded border border-[#E8ECF0] bg-white px-3 py-1.5 transition-colors hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                上一页
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safePage === totalPages}
                className="rounded border border-[#E8ECF0] bg-white px-3 py-1.5 transition-colors hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {deleteTarget && (
        <DeleteConfirmDialog
          title="删除产品"
          message={`确定要删除产品「${deleteTarget.name}」吗？删除后不可恢复。`}
          onConfirm={() => {
            const product = deleteTarget;
            setDeleteTarget(null);
            setError('');
            void (async () => {
              try {
                await deleteProduct(product.id);
                const mediaUrls = new Set([
                  product.coverImage,
                  product.coverThumbnail,
                  ...product.images,
                  ...product.files.map((file) => file.url),
                  ...product.subProducts.flatMap((subProduct) => [subProduct.coverImage, subProduct.coverThumbnail, ...subProduct.images]),
                ].filter((url): url is string => Boolean(url)));
                const cleanupResults = await Promise.allSettled(
                  Array.from(mediaUrls).map((url) => deleteAdminProductMedia(url)),
                );
                if (cleanupResults.some((result) => result.status === 'rejected')) {
                  setError('产品已删除，但部分资料文件清理失败，可运行媒体同步任务清理未引用文件');
                }
              } catch (deleteError) {
                setError(deleteError instanceof Error ? deleteError.message : '产品删除失败');
              }
            })();
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
