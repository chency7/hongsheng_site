import React from 'react';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import { adminCatalogToProducts, getAdminCatalogForSite } from '@/lib/admin/catalog-repository';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const catalog = await getAdminCatalogForSite();
  const products = adminCatalogToProducts(catalog);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return { title: '产品未找到' };
  }

  return { title: `${product.name} - 产品详情` };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const catalog = await getAdminCatalogForSite();
  const products = adminCatalogToProducts(catalog);
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
