'use client';

import React from 'react';
import Link from 'next/link';
import { Package, FolderTree, FolderOpen, Image, TrendingUp, ArrowRight } from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';

export default function AdminDashboardPage() {
  const { getStats, getProducts } = useAdminStore();
  const stats = getStats();
  const products = getProducts();

  const statCards = [
    { label: '产品总数', value: stats.totalProducts, icon: Package, color: '#4A90D9', bg: '#F0F5FA' },
    { label: '顶级分类', value: stats.totalCategories, icon: FolderTree, color: '#28A745', bg: '#F0FAF3' },
    { label: '子分类', value: stats.totalSubCategories, icon: FolderOpen, color: '#FF6B35', bg: '#FFF5F0' },
    { label: '产品图片', value: stats.totalImages, icon: Image, color: '#9B59B6', bg: '#F8F0FA' },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1E3A5F]">仪表盘</h1>
        <p className="mt-1 text-sm text-[#999999]">产品中心数据概览与快捷操作</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-[#E8ECF0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#999999]">{card.label}</p>
                  <p className="mt-1 text-[28px] font-bold text-[#1E3A5F]">{card.value}</p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: card.bg }}
                >
                  <Icon className="h-6 w-6" style={{ color: card.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/products/new"
          className="flex items-center justify-between rounded-xl border border-[#E8ECF0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-[2px] hover:border-[#4A90D9] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          <div>
            <p className="text-sm font-medium text-[#333333]">新增产品</p>
            <p className="mt-1 text-xs text-[#999999]">创建新的产品记录</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#4A90D9]" />
        </Link>
        <Link
          href="/admin/categories"
          className="flex items-center justify-between rounded-xl border border-[#E8ECF0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-[2px] hover:border-[#28A745] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          <div>
            <p className="text-sm font-medium text-[#333333]">管理分类</p>
            <p className="mt-1 text-xs text-[#999999]">编辑产品分类结构</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#28A745]" />
        </Link>
        <Link
          href="/admin/files"
          className="flex items-center justify-between rounded-xl border border-[#E8ECF0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-[2px] hover:border-[#9B59B6] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          <div>
            <p className="text-sm font-medium text-[#333333]">文件管理</p>
            <p className="mt-1 text-xs text-[#999999]">管理上传的文件资源</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#9B59B6]" />
        </Link>
      </div>

      {/* Recent Products */}
      <div className="overflow-hidden rounded-xl border border-[#E8ECF0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-[#E8ECF0] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[#1E3A5F]">最近产品</h2>
          <Link href="/admin/products" className="text-sm text-[#4A90D9] hover:underline">
            查看全部
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E8ECF0] bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-[#999999] uppercase">产品名称</th>
                <th className="px-6 py-3 text-xs font-medium text-[#999999] uppercase">型号</th>
                <th className="px-6 py-3 text-xs font-medium text-[#999999] uppercase">品牌</th>
                <th className="px-6 py-3 text-xs font-medium text-[#999999] uppercase">状态</th>
                <th className="px-6 py-3 text-xs font-medium text-[#999999] uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#E8ECF0] transition-colors hover:bg-[#F9FAFB]">
                  <td className="px-6 py-3 font-medium text-[#333333]">{product.name}</td>
                  <td className="px-6 py-3 text-[#666666]">{product.model}</td>
                  <td className="px-6 py-3 text-[#666666]">{product.brand}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.isActive ? '已启用' : '已禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm text-[#4A90D9] hover:underline"
                    >
                      编辑
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
