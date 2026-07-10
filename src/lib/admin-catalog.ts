import { categoryOptions, products as initialProducts } from '@/data/products';

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productIds: string[];
}

export interface AdminProductSpec {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
}

export interface AdminSubProduct {
  id: string;
  name: string;
  slug: string;
  model: string;
  coverImage: string;
  images: string[];
  specs: AdminProductSpec[];
  hydraulicParams: string;
  electricParams: string;
  sortOrder: number;
}

export interface AdminDetailTab {
  id: string;
  title: string;
  content: string;
  type: 'markdown' | 'pdf' | 'file';
  sortOrder: number;
}

export interface AdminProductFile {
  id: string;
  detailTabId: string;
  name: string;
  url: string;
  fileType: string;
  fileSize: number;
}

export interface AdminProduct {
  id: string;
  slug: string;
  subCategoryId: string;
  name: string;
  model: string;
  brand: string;
  description: string;
  coverImage: string;
  images: string[];
  specs: AdminProductSpec[];
  features: string[];
  subProducts: AdminSubProduct[];
  detailTabs: AdminDetailTab[];
  files: AdminProductFile[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalog {
  categories: AdminCategory[];
  subCategories: AdminSubCategory[];
  products: AdminProduct[];
}

export function generateAdminId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function buildInitialCategories(): AdminCategory[] {
  const nowStr = '2024-03-22T00:00:00.000Z';
  return categoryOptions.map((cat, i) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.id,
    sortOrder: i,
    isActive: true,
    createdAt: nowStr,
    updatedAt: nowStr,
  }));
}

function buildInitialSubCategories(): AdminSubCategory[] {
  const nowStr = '2024-03-22T00:00:00.000Z';
  const result: AdminSubCategory[] = [];
  categoryOptions.forEach((cat) => {
    cat.subCategories?.forEach((sub, j) => {
      result.push({
        id: sub.id,
        categoryId: cat.id,
        name: sub.name,
        slug: sub.id,
        sortOrder: j,
        isActive: true,
        createdAt: nowStr,
        updatedAt: nowStr,
        productIds: sub.products?.map((p) => p.productId) || [],
      });
    });
  });
  return result;
}

function buildInitialAdminProducts(): AdminProduct[] {
  return initialProducts.map((p, i) => ({
    id: p.id,
    slug: p.id,
    subCategoryId: p.category,
    name: p.name,
    model: p.model,
    brand: p.brand,
    description: p.description,
    coverImage: p.image,
    images: p.images,
    specs: p.specs.map((s, si) => ({ id: generateAdminId(), ...s, sortOrder: si })),
    features: p.features,
    subProducts:
      p.subCategories?.map((sp, spi) => ({
        id: sp.id,
        name: sp.name,
        slug: sp.id,
        model: sp.model,
        coverImage: sp.image,
        images: sp.images,
        specs: sp.specs.map((s, ssi) => ({ id: generateAdminId(), ...s, sortOrder: ssi })),
        hydraulicParams: sp.hydraulicParams || '',
        electricParams: sp.electricParams || '',
        sortOrder: spi,
      })) || [],
    detailTabs:
      p.detailTabs?.map((dt, dti) => ({
        id: generateAdminId(),
        title: dt.title,
        content: dt.fileUrl || dt.content || '',
        type: dt.type || 'markdown',
        sortOrder: dti,
      })) || [],
    files: [],
    sortOrder: i,
    isActive: true,
    createdAt: p.createdAt,
    updatedAt: p.createdAt,
  }));
}

export function buildInitialAdminCatalog(): AdminCatalog {
  return {
    categories: buildInitialCategories(),
    subCategories: buildInitialSubCategories(),
    products: buildInitialAdminProducts(),
  };
}
