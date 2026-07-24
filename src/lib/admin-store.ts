'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  buildInitialAdminCatalog,
  generateAdminId,
  generateProductSlug,
  uniqueProductSlug,
  type AdminCatalog,
  type AdminCategory,
  type AdminDetailTab,
  type AdminProduct,
  type AdminProductFile,
  type AdminProductSpec,
  type AdminSubCategory,
  type AdminSubProduct,
} from '@/lib/admin-catalog';
import { fetchAdminCatalog, saveAdminCatalog } from '@/lib/admin/catalog-client';

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
let catalogLoaded = false;
let catalogVersion = 0;
let derivedVersion = -1;

let cachedCategories: AdminCategory[] = [];
let cachedSubCategories: AdminSubCategory[] = [];
let cachedProducts: AdminProduct[] = [];
let cachedCategoryById = new Map<string, AdminCategory>();
let cachedSubCategoryById = new Map<string, AdminSubCategory>();
let cachedProductById = new Map<string, AdminProduct>();
let cachedStats = {
  totalCategories: 0,
  totalSubCategories: 0,
  totalProducts: 0,
  activeProducts: 0,
  totalImages: 0,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function markCatalogChanged() {
  catalogVersion += 1;
}

function getDerivedCatalog() {
  if (derivedVersion === catalogVersion) {
    return {
      categories: cachedCategories,
      subCategories: cachedSubCategories,
      products: cachedProducts,
      categoryById: cachedCategoryById,
      subCategoryById: cachedSubCategoryById,
      productById: cachedProductById,
      stats: cachedStats,
    };
  }

  cachedCategories = [...globalCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  cachedSubCategories = [...globalSubCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  cachedProducts = [...globalProducts].sort((a, b) => a.sortOrder - b.sortOrder);
  cachedCategoryById = new Map(globalCategories.map((category) => [category.id, category]));
  cachedSubCategoryById = new Map(globalSubCategories.map((subCategory) => [subCategory.id, subCategory]));
  cachedProductById = new Map(globalProducts.map((product) => [product.id, product]));
  cachedStats = {
    totalCategories: globalCategories.length,
    totalSubCategories: globalSubCategories.length,
    totalProducts: globalProducts.length,
    activeProducts: globalProducts.reduce((count, product) => count + (product.isActive ? 1 : 0), 0),
    totalImages: globalProducts.reduce((sum, product) => sum + product.images.length, 0),
  };
  derivedVersion = catalogVersion;

  return {
    categories: cachedCategories,
    subCategories: cachedSubCategories,
    products: cachedProducts,
    categoryById: cachedCategoryById,
    subCategoryById: cachedSubCategoryById,
    productById: cachedProductById,
    stats: cachedStats,
  };
}

function getCatalogSnapshot(): AdminCatalog {
  return {
    categories: globalCategories,
    subCategories: globalSubCategories,
    products: globalProducts,
  };
}

function setCatalogSnapshot(catalog: AdminCatalog, shouldNotify = true) {
  globalCategories = catalog.categories || [];
  globalSubCategories = catalog.subCategories || [];
  globalProducts = catalog.products || [];
  markCatalogChanged();
  if (shouldNotify) notify();
}

async function loadCatalog() {
  const data = await fetchAdminCatalog().catch((error) => {
    console.error(error);
    return null;
  });

  if (data?.catalog) {
    setCatalogSnapshot(data.catalog, false);
  }
  catalogLoaded = true;
  notify();
}

async function persistCatalog() {
  const result = await saveAdminCatalog(getCatalogSnapshot());
  if (!result.persisted) {
    throw new Error('Supabase 未配置，产品目录没有持久化');
  }
}

function persistAndNotify() {
  markCatalogChanged();
  notify();
  void persistCatalog().catch((error) => {
    console.error(error);
  });
}

export function preloadAdminCatalog() {
  if (syncStarted) return;
  syncStarted = true;
  void loadCatalog();
}

export function useAdminStore() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    listeners.add(fn);

    preloadAdminCatalog();

    return () => {
      listeners.delete(fn);
    };
  }, []);

  const forceUpdate = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const isCatalogLoading = !catalogLoaded;

  const getCategories = useCallback(() => {
    void tick;
    return getDerivedCatalog().categories;
  }, [tick]);

  const getCategoryById = useCallback((id: string) => {
    void tick;
    return getDerivedCatalog().categoryById.get(id);
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
    return getDerivedCatalog().subCategories;
  }, [tick]);

  const getSubCategoryById = useCallback((id: string) => {
    void tick;
    return getDerivedCatalog().subCategoryById.get(id);
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
    return getDerivedCatalog().products;
  }, [tick]);

  const getProductById = useCallback((id: string) => {
    void tick;
    return getDerivedCatalog().productById.get(id);
  }, [tick]);

  const createProduct = useCallback(async (data: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    const previousCatalog = getCatalogSnapshot();
    const slug = uniqueProductSlug(data.slug || generateProductSlug(data.name), globalProducts);
    const newProd: AdminProduct = {
      ...data,
      slug,
      id: slug,
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
    try {
      markCatalogChanged();
      await persistCatalog();
      notify();
    } catch (error) {
      setCatalogSnapshot(previousCatalog);
      throw error;
    }
    return newProd;
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<AdminProduct>) => {
    const previousCatalog = getCatalogSnapshot();
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

    try {
      markCatalogChanged();
      await persistCatalog();
      notify();
    } catch (error) {
      setCatalogSnapshot(previousCatalog);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const previousCatalog = getCatalogSnapshot();
    globalProducts = globalProducts.filter((p) => p.id !== id);
    globalSubCategories = globalSubCategories.map((s) => ({
      ...s,
      productIds: s.productIds.filter((productId) => productId !== id),
    }));
    try {
      markCatalogChanged();
      await persistCatalog();
      notify();
    } catch (error) {
      setCatalogSnapshot(previousCatalog);
      throw error;
    }
  }, []);

  const getStats = useCallback(() => {
    void tick;
    return getDerivedCatalog().stats;
  }, [tick]);

  return {
    isCatalogLoading,
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
