'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  FileText,
  File,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { deleteAdminProductDocument } from '@/lib/admin/media-client';
import { displayFilePath } from '@/lib/display-file-path';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

type ManagedFile = {
  productId: string;
  productName: string;
  detailTabId?: string;
  fileName: string;
  displayPath: string;
  url: string;
  type: string;
  fileSize: number;
  isDocument: boolean;
};

const PAGE_SIZE = 25;
const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
const typeIcons = {
  image: ImageIcon,
  pptx: FileText,
  pdf: FileText,
};

export default function AdminFilesPage() {
  const { getProducts, updateProduct } = useAdminStore();
  const products = getProducts();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pptx' | 'pdf' | 'image'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ManagedFile | null>(null);
  const [error, setError] = useState('');

  const allFiles = useMemo(() => {
    const result: ManagedFile[] = [];

    products.forEach((product) => {
      const addImage = (url: string, productName = product.name) => {
        if (!url) return;
        const fileName = fileNameFromUrl(url);
        const ext = fileName.split('.').pop()?.toLowerCase() || 'unknown';
        result.push({
          productId: product.id,
          productName,
          fileName,
          displayPath: displayFilePath(url),
          url,
          type: imageExtensions.has(ext) ? 'image' : ext,
          fileSize: 0,
          isDocument: false,
        });
      };

      addImage(product.coverImage);
      product.images.forEach((image) => addImage(image));

      product.detailTabs.forEach((tab) => {
        if (tab.type !== 'markdown') return;
        for (const match of Array.from(tab.content.matchAll(/!\[[^\]]*\]\(([^\s)]+)\)/g))) {
          addImage(match[1]);
        }
      });

      product.files.forEach((file) => {
        result.push({
          productId: product.id,
          productName: product.name,
          detailTabId: file.detailTabId,
          fileName: file.name,
          displayPath: displayFilePath(file.url),
          url: file.url,
          type: file.fileType || file.url.split('.').pop()?.toLowerCase() || 'file',
          fileSize: file.fileSize,
          isDocument: true,
        });
      });

      // Sub-product images
      product.subProducts.forEach((sp) => {
        const subProductName = `${product.name} / ${sp.name}`;
        addImage(sp.coverImage, subProductName);
        sp.images.forEach((image) => addImage(image, subProductName));
      });
    });

    const uniqueByUrl = new Map<string, ManagedFile>();
    result.forEach((file) => {
      const existing = uniqueByUrl.get(file.url);
      if (!existing) {
        uniqueByUrl.set(file.url, file);
        return;
      }

      const productNames = Array.from(new Set([existing.productName, file.productName]));
      uniqueByUrl.set(file.url, { ...existing, productName: productNames.join('、') });
    });

    return Array.from(uniqueByUrl.values());
  }, [products]);

  const filtered = useMemo(() => {
    let result = allFiles;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((f) => f.fileName.toLowerCase().includes(q) || f.productName.toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') {
      result = result.filter((f) => f.type === typeFilter);
    }
    return result;
  }, [allFiles, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleFiles = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allFiles.length };
    allFiles.forEach((f) => {
      counts[f.type] = (counts[f.type] || 0) + 1;
    });
    return counts;
  }, [allFiles]);

  const deleteDocument = async (file: ManagedFile) => {
    const product = products.find((item) => item.id === file.productId);
    if (!product || !file.detailTabId) return;

    setError('');
    try {
      await updateProduct(product.id, {
        detailTabs: product.detailTabs.map((tab) =>
          tab.id === file.detailTabId
            ? {
                ...tab,
                fileId: undefined,
                fileName: undefined,
                fileUrl: undefined,
                fileType: undefined,
                fileSize: undefined,
                storageObjectPath: undefined,
              }
            : tab,
        ),
        files: product.files.filter((item) => item.detailTabId !== file.detailTabId),
      });
      await deleteAdminProductDocument(file.url);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '产品资料删除失败');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1E3A5F]">文件资产</h1>
          <p className="mt-1 text-sm text-[#999999]">
            共 {allFiles.length} 项文件资产
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Type Filter Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'image', 'pptx', 'pdf'] as const).map((type) => (
          <button
            key={type}
            onClick={() => { setTypeFilter(type); setCurrentPage(1); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              typeFilter === type
                ? 'bg-[#1E3A5F] text-white shadow-sm'
                : 'border border-[#E8ECF0] bg-white text-[#666666] hover:border-[#4A90D9] hover:text-[#4A90D9]'
            }`}
          >
            {type === 'all' ? '全部' : type.toUpperCase()} ({typeCounts[type] || 0})
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="搜索文件..."
            className="w-full rounded-lg border border-[#E8ECF0] py-2.5 pl-10 pr-4 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
          />
        </div>
      </div>

      {/* File List */}
      <div className="overflow-hidden rounded-xl border border-[#E8ECF0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E8ECF0] bg-[#F9FAFB]">
              <tr>
                <th className="w-12 px-4 py-4 text-xs font-medium text-[#999999] uppercase">类型</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">文件名</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">所属产品</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">路径/URL</th>
                <th className="px-4 py-4 text-xs font-medium text-[#999999] uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#999999]">
                    暂无文件
                  </td>
                </tr>
              ) : (
                visibleFiles.map((file, idx) => {
                  const Icon = typeIcons[file.type as keyof typeof typeIcons] || File;
                  return (
                    <tr key={`${file.url}-${(safePage - 1) * PAGE_SIZE + idx}`} className="border-b border-[#E8ECF0] transition-colors hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#F0F5FA]">
                          <Icon className="h-4 w-4 text-[#4A90D9]" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#333333] max-w-[200px] truncate">{file.fileName}</p>
                        <p className="text-xs text-[#999999] uppercase">
                          {file.type}{file.fileSize ? ` · ${formatFileSize(file.fileSize)}` : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[#666666]">{file.productName}</td>
                      <td className="px-4 py-3">
                        <code
                          title={file.displayPath}
                          className="block max-w-[300px] truncate rounded bg-[#F5F7FA] px-2 py-1 text-xs text-[#666666]"
                        >
                          {file.displayPath}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {file.url && (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded p-1.5 text-[#999999] hover:bg-[#F0F5FA] hover:text-[#4A90D9] transition-colors"
                              title="打开"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {file.isDocument && (
                            <a
                              href={file.url}
                              download
                              className="rounded p-1.5 text-[#999999] hover:bg-[#F0F5FA] hover:text-[#28A745] transition-colors"
                              title="下载"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                          {file.isDocument && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(file)}
                              className="rounded p-1.5 text-[#999999] hover:bg-red-50 hover:text-red-500 transition-colors"
                              title="移除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
          title="移除产品资料"
          message={`确定要从「${deleteTarget.productName}」移除「${deleteTarget.fileName}」吗？保存引用后会同时删除 Supabase Storage 文件。`}
          onConfirm={() => {
            const file = deleteTarget;
            setDeleteTarget(null);
            void deleteDocument(file);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Summary */}
      <div className="mt-6 rounded-xl border border-[#E8ECF0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 className="mb-3 text-sm font-semibold text-[#1E3A5F]">资产统计</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-[#F0F5FA] p-3 text-center">
            <p className="text-[24px] font-bold text-[#4A90D9]">{typeCounts.image || 0}</p>
            <p className="text-xs text-[#999999]">图片文件</p>
          </div>
          <div className="rounded-lg bg-[#F0FAF3] p-3 text-center">
            <p className="text-[24px] font-bold text-[#28A745]">{typeCounts.pptx || 0}</p>
            <p className="text-xs text-[#999999]">PPTX文件</p>
          </div>
          <div className="rounded-lg bg-[#FFF5F0] p-3 text-center">
            <p className="text-[24px] font-bold text-[#FF6B35]">{typeCounts.pdf || 0}</p>
            <p className="text-xs text-[#999999]">PDF文件</p>
          </div>
          <div className="rounded-lg bg-[#F8F0FA] p-3 text-center">
            <p className="text-[24px] font-bold text-[#9B59B6]">{allFiles.length}</p>
            <p className="text-xs text-[#999999]">文件总数</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileNameFromUrl(value: string) {
  try {
    const pathname = value.startsWith('http') ? new URL(value).pathname : value;
    return decodeURIComponent(pathname.split('/').pop() || value);
  } catch {
    return value.split('/').pop() || value;
  }
}
