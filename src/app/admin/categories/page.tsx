'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronRight,
  ChevronDown,
  FolderTree,
  FolderOpen,
  Folder,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import type { AdminCategory, AdminSubCategory } from '@/lib/admin-store';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import CategoryForm from '../components/CategoryForm';
import SubCategoryForm from '../components/SubCategoryForm';
import { Switch } from '@/components/ui/switch';

type FormMode = 'category' | 'subCategory';

export default function AdminCategoriesPage() {
  const {
    getCategories,
    getSubCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
  } = useAdminStore();
  const categories = getCategories();
  const subCategories = getSubCategories();

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('subCategory');
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [editingSub, setEditingSub] = useState<AdminSubCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<
    { type: 'category'; data: AdminCategory } | { type: 'subCategory'; data: AdminSubCategory } | null
  >(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );

  const treeData = useMemo(() => {
    return categories
      .filter((cat) => {
        if (!search) return true;
        const matchSelf = cat.name.toLowerCase().includes(search.toLowerCase());
        const matchChildren = subCategories.some(
          (s) => s.categoryId === cat.id && s.name.toLowerCase().includes(search.toLowerCase())
        );
        return matchSelf || matchChildren;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((cat) => ({
        cat,
        children: subCategories
          .filter((sub) => {
            if (sub.categoryId !== cat.id) return false;
            if (search) return sub.name.toLowerCase().includes(search.toLowerCase());
            return true;
          })
          .sort((a, b) => a.sortOrder - b.sortOrder),
      }));
  }, [categories, subCategories, search]);

  const toggleExpand = (catId: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleCategorySave = (data: Omit<AdminCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCat) {
      updateCategory(editingCat.id, data);
    } else {
      createCategory(data);
    }
    setShowForm(false);
    setEditingCat(null);
  };

  const handleSubCategorySave = (
    data: Omit<AdminSubCategory, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingSub) {
      updateSubCategory(editingSub.id, data);
    } else {
      createSubCategory(data);
    }
    setShowForm(false);
    setEditingSub(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') {
      deleteCategory(deleteTarget.data.id);
    } else {
      deleteSubCategory(deleteTarget.data.id);
    }
    setDeleteTarget(null);
  };

  const totalSubs = subCategories.length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1E3A5F]">分类管理</h1>
          <p className="mt-1 text-sm text-[#999999]">
            {categories.length} 个顶级分类，{totalSubs} 个子分类
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingSub(null);
              setFormMode('subCategory');
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E8ECF0] bg-white px-4 py-2.5 text-sm font-medium text-[#666666] shadow-sm transition-colors duration-150 hover:bg-[#F5F7FA] hover:text-[#1E3A5F]"
          >
            <Plus className="h-4 w-4" />
            新增子分类
          </button>
          <button
            onClick={() => {
              setEditingCat(null);
              setFormMode('category');
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#1E3A5F]/10 transition-[background-color,transform] duration-150 hover:-translate-y-[1px] hover:bg-[#162A45]"
          >
            <Plus className="h-4 w-4" />
            新增顶级分类
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索分类或子分类..."
            className="w-full rounded-lg border border-[#E8ECF0] py-2.5 pl-10 pr-4 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E8ECF0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {treeData.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-[#999999]">
            {search ? '没有匹配的分类' : '暂无分类数据，点击上方按钮新增'}
          </div>
        ) : (
          <div>
            {treeData.map((node) => {
              const isExpanded = expandedCats.has(node.cat.id);
              const hasChildren = node.children.length > 0;

              return (
                <div key={node.cat.id}>
                  {/* Parent Category Row */}
                  <div className="flex items-center gap-3 border-b border-[#E8ECF0] bg-[#F9FAFB] px-5 py-3 transition-colors hover:bg-[#F0F5FA]">
                    <button
                      onClick={() => toggleExpand(node.cat.id)}
                      className="flex shrink-0 items-center"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-[#999999]" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-[#999999]" />
                      )}
                    </button>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1E3A5F] text-white">
                      <FolderTree className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold text-[#1E3A5F]">
                        {node.cat.name}
                      </h3>
                      <code className="mt-0.5 block text-[11px] text-[#BBBBBB]">
                        {node.cat.slug}
                      </code>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#666666]">
                        <Folder className="h-3 w-3" />
                        {node.children.length} 个子分类
                      </span>

                      {!node.cat.isActive && (
                        <span className="rounded bg-red-50 px-2 py-0.5 text-xs text-red-500">已禁用</span>
                      )}

                      <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={node.cat.isActive}
                          onCheckedChange={() =>
                            updateCategory(node.cat.id, { isActive: !node.cat.isActive })
                          }
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCat(node.cat);
                            setFormMode('category');
                            setShowForm(true);
                          }}
                          className="rounded p-1.5 text-[#999999] hover:bg-[#F0F5FA] hover:text-[#4A90D9] transition-colors"
                          title="编辑分类"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'category', data: node.cat })}
                          className="rounded p-1.5 text-[#999999] hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="删除分类"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Child Sub-Category Rows */}
                  {isExpanded ? (
                    <div>
                      {hasChildren ? (
                      node.children.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center gap-3 border-b border-[#E8ECF0] px-5 py-3 pl-16 transition-colors hover:bg-[#FAFBFC]"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F0F5FA] text-[#4A90D9]">
                            <FolderOpen className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-medium text-[#333333]">
                              {sub.name}
                            </p>
                            <code className="mt-0.5 block text-[11px] text-[#BBBBBB]">
                              {sub.slug}
                            </code>
                          </div>

                          <div className="flex shrink-0 items-center gap-4">
                            <span className="rounded-full bg-[#F5F7FA] px-2.5 py-1 text-xs text-[#999999]">
                              {sub.productIds.length} 个产品
                            </span>

                            {!sub.isActive && (
                              <span className="rounded bg-red-50 px-2 py-0.5 text-xs text-red-500">已禁用</span>
                            )}

                            <div onClick={(e) => e.stopPropagation()}>
                              <Switch
                                checked={sub.isActive}
                                onCheckedChange={() =>
                                  updateSubCategory(sub.id, { isActive: !sub.isActive })
                                }
                              />
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingSub(sub);
                                  setFormMode('subCategory');
                                  setShowForm(true);
                                }}
                                className="rounded p-1.5 text-[#999999] hover:bg-[#F0F5FA] hover:text-[#4A90D9] transition-colors"
                                title="编辑"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteTarget({ type: 'subCategory', data: sub })
                                }
                                className="rounded p-1.5 text-[#999999] hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="删除"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                      ) : (
                        <div className="border-b border-dashed border-[#E8ECF0] px-5 py-6 pl-16 text-center text-sm text-[#CCCCCC]">
                          该分类下暂无子分类
                          <button
                            onClick={() => {
                              setEditingSub(null);
                              setFormMode('subCategory');
                              setShowForm(true);
                            }}
                            className="ml-2 text-[#4A90D9] hover:underline"
                          >
                            添加一个
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && formMode === 'category' && (
        <CategoryForm
          initialData={editingCat}
          onSave={handleCategorySave}
          onClose={() => { setShowForm(false); setEditingCat(null); }}
        />
      )}

      {showForm && formMode === 'subCategory' && (
        <SubCategoryForm
          categories={categories}
          initialData={editingSub}
          onSave={handleSubCategorySave}
          onClose={() => { setShowForm(false); setEditingSub(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteConfirmDialog
          title={deleteTarget.type === 'category' ? '删除顶级分类' : '删除子分类'}
          message={
            deleteTarget.type === 'category'
              ? `确定要删除顶级分类「${deleteTarget.data.name}」吗？该分类下的所有子分类也将被删除。`
              : `确定要删除子分类「${deleteTarget.data.name}」吗？`
          }
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
