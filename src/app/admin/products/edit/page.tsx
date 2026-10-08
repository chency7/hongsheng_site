'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/admin-store';
import ProductForm from '../../components/ProductForm';

/**
 * 静态导出版产品编辑页：/admin/products/edit?id=<productId>
 * （原动态路由 /admin/products/[id]/edit 在 output: export 下不可用）
 */
function EditProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('id') || '';
  const { isCatalogLoading, getProductById } = useAdminStore();
  const product = getProductById(productId);

  if (isCatalogLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-[#999999]">
        正在读取产品目录...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-xl border border-[#E8ECF0] bg-white p-16 text-center">
        <p className="text-lg font-medium text-[#333333]">产品未找到</p>
        <button
          onClick={() => router.push('/admin/products')}
          className="mt-4 text-sm text-[#4A90D9] hover:underline"
        >
          返回产品列表
        </button>
      </div>
    );
  }

  return <ProductForm key={`${product.id}-${product.updatedAt}`} initialProduct={product} />;
}

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[320px] items-center justify-center text-sm text-[#999999]">
          正在加载...
        </div>
      }
    >
      <EditProductContent />
    </Suspense>
  );
}
