'use client';

import { useState, useCallback, useEffect } from 'react';
import { categoryOptions, products as initialProducts, type CategoryOption, type Product } from '@/data/products';

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

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function now(): string {
  return new Date().toISOString();
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
    specs: p.specs.map((s, si) => ({ id: generateId(), ...s, sortOrder: si })),
    features: p.features,
    subProducts:
      p.subCategories?.map((sp, spi) => ({
        id: sp.id,
        name: sp.name,
        slug: sp.id,
        model: sp.model,
        coverImage: sp.image,
        images: sp.images,
        specs: sp.specs.map((s, ssi) => ({ id: generateId(), ...s, sortOrder: ssi })),
        hydraulicParams: sp.hydraulicParams || '',
        electricParams: sp.electricParams || '',
        sortOrder: spi,
      })) || [],
    detailTabs:
      p.detailTabs?.map((dt, dti) => ({
        id: generateId(),
        title: dt.title,
        content: dt.content || '',
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

let globalCategories: AdminCategory[] = buildInitialCategories();
let globalSubCategories: AdminSubCategory[] = buildInitialSubCategories();
let globalProducts: AdminProduct[] = buildInitialAdminProducts();

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function useAdminStore() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  const forceUpdate = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  // Categories
  const getCategories = useCallback(() => {
    void tick;
    return [...globalCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [tick]);
  const getCategoryById = useCallback((id: string) => {
    void tick;
    return globalCategories.find((c) => c.id === id);
  }, [tick]);
  const createCategory = useCallback((data: Omit<AdminCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCat: AdminCategory = { ...data, id: data.slug || generateId(), createdAt: now(), updatedAt: now() };
    globalCategories = [...globalCategories, newCat];
    notify();
    return newCat;
  }, []);
  const updateCategory = useCallback((id: string, data: Partial<AdminCategory>) => {
    globalCategories = globalCategories.map((c) => (c.id === id ? { ...c, ...data, updatedAt: now() } : c));
    notify();
  }, []);
  const deleteCategory = useCallback((id: string) => {
    globalCategories = globalCategories.filter((c) => c.id !== id);
    globalSubCategories = globalSubCategories.filter((s) => s.categoryId !== id);
    notify();
  }, []);

  // Sub Categories
  const getSubCategories = useCallback(() => {
    void tick;
    return [...globalSubCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [tick]);
  const getSubCategoryById = useCallback((id: string) => {
    void tick;
    return globalSubCategories.find((s) => s.id === id);
  }, [tick]);
  const createSubCategory = useCallback((data: Omit<AdminSubCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSub: AdminSubCategory = { ...data, id: data.slug || generateId(), createdAt: now(), updatedAt: now() };
    globalSubCategories = [...globalSubCategories, newSub];
    notify();
    return newSub;
  }, []);
  const updateSubCategory = useCallback((id: string, data: Partial<AdminSubCategory>) => {
    globalSubCategories = globalSubCategories.map((s) => (s.id === id ? { ...s, ...data, updatedAt: now() } : s));
    notify();
  }, []);
  const deleteSubCategory = useCallback((id: string) => {
    globalSubCategories = globalSubCategories.filter((s) => s.id !== id);
    notify();
  }, []);

  // Products
  const getProducts = useCallback(() => {
    void tick;
    return [...globalProducts].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [tick]);
  const getProductById = useCallback((id: string) => {
    void tick;
    return globalProducts.find((p) => p.id === id);
  }, [tick]);
  const createProduct = useCallback((data: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProd: AdminProduct = {
      ...data,
      id: data.slug || `p-${generateId()}`,
      createdAt: now(),
      updatedAt: now(),
    };
    globalProducts = [...globalProducts, newProd];
    if (data.subCategoryId) {
      globalSubCategories = globalSubCategories.map((s) =>
        s.id === data.subCategoryId && !s.productIds.includes(newProd.id)
          ? { ...s, productIds: [...s.productIds, newProd.id], updatedAt: now() }
          : s
      );
    }
    notify();
    return newProd;
  }, []);
  const updateProduct = useCallback((id: string, data: Partial<AdminProduct>) => {
    globalProducts = globalProducts.map((p) => (p.id === id ? { ...p, ...data, updatedAt: now() } : p));
    notify();
  }, []);
  const deleteProduct = useCallback((id: string) => {
    globalProducts = globalProducts.filter((p) => p.id !== id);
    notify();
  }, []);

  // Stats
  const getStats = useCallback(
    () => {
      void tick;
      return {
        totalCategories: globalCategories.length,
        totalSubCategories: globalSubCategories.length,
        totalProducts: globalProducts.length,
        activeProducts: globalProducts.filter((p) => p.isActive).length,
        totalImages: globalProducts.reduce((sum, p) => sum + p.images.length, 0),
      };
    },
    [tick]
  );

  return {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getStats,
    forceUpdate,
  };
}
