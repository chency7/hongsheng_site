'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/admin-store';
import ProductForm from '../../../components/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { getProductById } = useAdminStore();
  const product = getProductById(params.id as string);

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

  return <ProductForm initialProduct={product} />;
}
