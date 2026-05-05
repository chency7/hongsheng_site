import React from 'react';
import ProductDetailClient from './ProductDetailClient';
import { products } from '@/data/products';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return { title: '产品未找到' };
  }
  return { title: `${product.name} - 产品详情` };
}

export async function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
