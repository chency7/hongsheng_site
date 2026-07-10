'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  buildInitialAdminCatalog,
  generateAdminId,
  type AdminCatalog,
  type AdminCategory,
  type AdminDetailTab,
  type AdminProduct,
  type AdminProductFile,
  type AdminProductSpec,
  type AdminSubCategory,
  type AdminSubProduct,
} from '@/lib/admin-catalog';

export type {
  AdminCatalog,
  AdminCategory,
  AdminDetailTab,
  AdminProduct,
  AdminProductFile,
  AdminProductSpec,
  AdminSubCategory,
  AdminSubProduct,
};

function now(): string {
  return new Date().toISOString();
}

const initialCatalog = buildInitialAdminCatalog();

let globalCategories: AdminCategory[] = initialCatalog.categories;
let globalSubCategories: AdminSubCategory[] = initialCatalog.subCategories;
let globalProducts: AdminProduct[] = initialCatalog.products;
let syncStarted = false;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function getCatalogSnapshot(): AdminCatalog {
  return {
    categories: globalCategories,
    subCategories: globalSubCategories,
    products: globalProducts,
  };
}

function setCatalogSnapshot(catalog: AdminCatalog) {
  globalCategories = catalog.categories || [];
  globalSubCategories = catalog.subCategories || [];
  globalProducts = catalog.products || [];
  notify();
}

async function loadCatalog() {
  const response = await fetch('/api/admin/catalog', { cache: 'no-store' });
  if (!response.ok) return;
  const data = await response.json();
  if (data?.catalog) {
    setCatalogSnapshot(data.catalog);
  }
}

async function persistCatalog() {
  await fetch('/api/admin/catalog', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(getCatalogSnapshot()),
  });
}

function persistAndNotify() {
  notify();
  void persistCatalog();
}

export function useAdminStore() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    listeners.add(fn);

    if (!syncStarted) {
      syncStarted = true;
      void loadCatalog();
    }

    return () => {
      listeners.delete(fn);
    };
  }, []);

  const forceUpdate = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const getCategories = useCallback(() => {
    void tick;
    return [...globalCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [tick]);

  const getCategoryById = useCallback((id: string) => {
    void tick;
    return globalCategories.find((c) => c.id === id);
  }, [tick]);

  const createCategory = useCallback((data: Omit<AdminCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCat: AdminCategory = { ...data, id: data.slug || generateAdminId(), createdAt: now(), updatedAt: now() };
    globalCategories = [...globalCategories, newCat];
    persistAndNotify();
    return newCat;
  }, []);

  const updateCategory = useCallback((id: string, data: Partial<AdminCategory>) => {
    globalCategories = globalCategories.map((c) => (c.id === id ? { ...c, ...data, updatedAt: now() } : c));
    persistAndNotify();
  }, []);

  const deleteCategory = useCallback((id: string) => {
    const deletedSubIds = globalSubCategories.filter((s) => s.categoryId === id).map((s) => s.id);
    globalCategories = globalCategories.filter((c) => c.id !== id);
    globalSubCategories = globalSubCategories.filter((s) => s.categoryId !== id);
    globalProducts = globalProducts.map((p) =>
      deletedSubIds.includes(p.subCategoryId) ? { ...p, subCategoryId: '', isActive: false, updatedAt: now() } : p
    );
    persistAndNotify();
  }, []);

  const getSubCategories = useCallback(() => {
    void tick;
    return [...globalSubCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [tick]);

  const getSubCategoryById = useCallback((id: string) => {
    void tick;
    return globalSubCategories.find((s) => s.id === id);
  }, [tick]);

  const createSubCategory = useCallback((data: Omit<AdminSubCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSub: AdminSubCategory = { ...data, id: data.slug || generateAdminId(), createdAt: now(), updatedAt: now() };
    globalSubCategories = [...globalSubCategories, newSub];
    persistAndNotify();
    return newSub;
  }, []);

  const updateSubCategory = useCallback((id: string, data: Partial<AdminSubCategory>) => {
    globalSubCategories = globalSubCategories.map((s) => (s.id === id ? { ...s, ...data, updatedAt: now() } : s));
    persistAndNotify();
  }, []);

  const deleteSubCategory = useCallback((id: string) => {
    globalSubCategories = globalSubCategories.filter((s) => s.id !== id);
    globalProducts = globalProducts.map((p) =>
      p.subCategoryId === id ? { ...p, subCategoryId: '', isActive: false, updatedAt: now() } : p
    );
    persistAndNotify();
  }, []);

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
      id: data.slug || `p-${generateAdminId()}`,
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
    persistAndNotify();
    return newProd;
  }, []);

  const updateProduct = useCallback((id: string, data: Partial<AdminProduct>) => {
    const previous = globalProducts.find((p) => p.id === id);
    globalProducts = globalProducts.map((p) => (p.id === id ? { ...p, ...data, updatedAt: now() } : p));

    if (data.subCategoryId && previous?.subCategoryId !== data.subCategoryId) {
      globalSubCategories = globalSubCategories.map((s) => {
        if (s.id === previous?.subCategoryId) {
          return { ...s, productIds: s.productIds.filter((productId) => productId !== id), updatedAt: now() };
        }
        if (s.id === data.subCategoryId && !s.productIds.includes(id)) {
          return { ...s, productIds: [...s.productIds, id], updatedAt: now() };
        }
        return s;
      });
    }

    persistAndNotify();
  }, []);

  const deleteProduct = useCallback((id: string) => {
    globalProducts = globalProducts.filter((p) => p.id !== id);
    globalSubCategories = globalSubCategories.map((s) => ({
      ...s,
      productIds: s.productIds.filter((productId) => productId !== id),
    }));
    persistAndNotify();
  }, []);

  const getStats = useCallback(() => {
    void tick;
    return {
      totalCategories: globalCategories.length,
      totalSubCategories: globalSubCategories.length,
      totalProducts: globalProducts.length,
      activeProducts: globalProducts.filter((p) => p.isActive).length,
      totalImages: globalProducts.reduce((sum, p) => sum + p.images.length, 0),
    };
  }, [tick]);

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
