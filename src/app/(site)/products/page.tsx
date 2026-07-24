import React, { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import { BreadcrumbSchema, WebPageSchema } from '@/components/seo/SchemaOrg';
import {
  adminCatalogToCategoryOptions,
  adminCatalogToProducts,
  getAdminCatalogForSite,
} from '@/lib/admin/catalog-repository';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '产品中心 - 液压泵站与试验检测设备',
  description:
    '湖南协力鸿胜机械提供液压泵站系列、试验检测设备系列、塔式起重机液压站、标准型定制型液压站等液压系统产品。覆盖工程机械、船舶海洋、风电等行业应用。',
  keywords: [
    '液压泵站',
    '液压站',
    '试验检测设备',
    '塔式起重机液压站',
    '标准型液压站',
    '定制型液压站',
    '工程机械液压',
    '液压系统产品',
    '比例阀测试试验台',
    '液压产品',
  ],
  openGraph: {
    title: '产品中心 - 液压泵站与试验检测设备 | 湖南协力鸿胜机械',
    description: '提供液压泵站系列、试验检测设备系列、塔式起重机液压站等液压系统产品。',
    url: 'https://www.xl-honsun.com/products',
  },
  alternates: {
    canonical: 'https://www.xl-honsun.com/products',
  },
};

export default async function ProductsPage() {
  const catalog = await getAdminCatalogForSite();
  const products = adminCatalogToProducts(catalog);
  const categoryOptions = adminCatalogToCategoryOptions(catalog);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: '首页', url: '/' },
          { name: '产品中心', url: '/products' },
        ]}
      />
      <WebPageSchema
        name="产品中心"
        description="液压泵站系列与试验检测设备系列产品展示"
        url="https://www.xl-honsun.com/products"
      />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductsClient products={products} categoryOptions={categoryOptions} />
      </Suspense>
    </>
  );
}
