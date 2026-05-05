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
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

export default function AdminFilesPage() {
  const { getProducts, updateProduct } = useAdminStore();
  const products = getProducts();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pptx' | 'pdf' | 'image'>('all');

  const allFiles = useMemo(() => {
    const result: { productId: string; productName: string; fileName: string; url: string; type: string }[] = [];

    products.forEach((product) => {
      // Images
      product.images.forEach((img) => {
        if (img) {
          const ext = img.split('.').pop()?.toLowerCase() || 'unknown';
          result.push({
            productId: product.id,
            productName: product.name,
            fileName: img.split('/').pop() || img,
            url: img,
            type: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) ? 'image' : ext,
          });
        }
      });

      // Detail tab files
      product.detailTabs.forEach((tab) => {
        if (tab.type === 'file' && tab.content) {
          const ext = tab.content.split('.').pop()?.toLowerCase() || 'unknown';
          result.push({
            productId: product.id,
            productName: product.name,
            fileName: tab.title || tab.content.split('/').pop() || 'unknown',
            url: tab.content,
            type: ext,
          });
        }
      });

      // Sub-product images
      product.subProducts.forEach((sp) => {
        sp.images.forEach((img) => {
          if (img) {
            const ext = img.split('.').pop()?.toLowerCase() || 'unknown';
            result.push({
              productId: product.id,
              productName: `${product.name} / ${sp.name}`,
              fileName: img.split('/').pop() || img,
              url: img,
              type: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) ? 'image' : ext,
            });
          }
        });
      });
    });

    return result;
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

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allFiles.length };
    allFiles.forEach((f) => {
      counts[f.type] = (counts[f.type] || 0) + 1;
    });
    return counts;
  }, [allFiles]);

  const getTypeIcon = (type: string) => {
    if (type === 'image') return ImageIcon;
    if (type === 'pptx') return FileText;
    if (type === 'pdf') return FileText;
    return File;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1E3A5F]">文件管理</h1>
          <p className="mt-1 text-sm text-[#999999]">
            共 {allFiles.length} 个文件资源
          </p>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'image', 'pptx', 'pdf'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索文件..."
            className="w-full rounded-lg border border-[#E8ECF0] py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
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
                filtered.map((file, idx) => {
                  const Icon = getTypeIcon(file.type);
                  return (
                    <tr key={idx} className="border-b border-[#E8ECF0] transition-colors hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#F0F5FA]">
                          <Icon className="h-4 w-4 text-[#4A90D9]" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#333333] max-w-[200px] truncate">{file.fileName}</p>
                        <p className="text-xs text-[#999999] uppercase">{file.type}</p>
                      </td>
                      <td className="px-4 py-3 text-[#666666]">{file.productName}</td>
                      <td className="px-4 py-3">
                        <code className="max-w-[300px] truncate block rounded bg-[#F5F7FA] px-2 py-1 text-xs text-[#666666]">
                          {file.url}
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
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-xl border border-[#E8ECF0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 className="mb-3 text-sm font-semibold text-[#1E3A5F]">文件统计</h3>
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
