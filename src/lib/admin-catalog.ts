import { categoryOptions, products as initialProducts } from '@/data/products';
import { thumbnailUrlFromProductImageUrl } from '@/lib/admin/product-thumbnails';

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
  coverThumbnail?: string;
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
  fileId?: string;
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  storageObjectPath?: string;
  sortOrder: number;
}

export interface AdminProductFile {
  id: string;
  detailTabId: string;
  name: string;
  url: string;
  fileType: string;
  fileSize: number;
  storageObjectPath?: string;
}

export interface AdminProduct {
  id: string;
  slug: string;
  subCategoryId: string;
  name: string;
  model: string;
  description: string;
  coverImage: string;
  coverThumbnail?: string;
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

function stableNameHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function generateProductSlug(name: string) {
  const normalizedName = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const readablePart = normalizedName
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const suffix = stableNameHash(name.trim() || generateAdminId()).slice(0, 7);
  return `p-${readablePart ? `${readablePart}-` : ''}${suffix}`;
}

export function uniqueProductSlug(preferredSlug: string, products: Pick<AdminProduct, 'slug'>[]) {
  const usedSlugs = new Set(products.map((product) => product.slug));
  if (!usedSlugs.has(preferredSlug)) return preferredSlug;

  let suffix = 2;
  while (usedSlugs.has(`${preferredSlug}-${suffix}`)) suffix += 1;
  return `${preferredSlug}-${suffix}`;
}

function buildProductSubCategoryMap() {
  const result = new Map<string, string>();

  categoryOptions.forEach((category) => {
    category.subCategories?.forEach((subCategory) => {
      subCategory.products?.forEach((product) => {
        result.set(product.productId, subCategory.id);
      });
    });
  });

  return result;
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
  const subCategoryIdByProductId = buildProductSubCategoryMap();

  return initialProducts.map((p, i) => ({
    id: p.id,
    slug: p.id,
    subCategoryId: subCategoryIdByProductId.get(p.id) || p.category,
    name: p.name,
    model: p.model,
    description: p.description,
    coverImage: p.image,
    coverThumbnail: p.image,
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
        coverThumbnail: sp.image,
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
        content: dt.content || '',
        type: dt.type || 'markdown',
        fileUrl: dt.fileUrl,
        fileName: dt.fileName,
        fileType: dt.fileType,
        fileSize: dt.fileSize,
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
  return normalizeAdminCatalog({
    categories: buildInitialCategories(),
    subCategories: buildInitialSubCategories(),
    products: buildInitialAdminProducts(),
  });
}

export function normalizeAdminCatalog(catalog: AdminCatalog): AdminCatalog {
  const categories = catalog.categories || [];
  const subCategories = catalog.subCategories || [];
  const products = catalog.products || [];
  const knownCategoryIds = new Set(categories.map((category) => category.id));
  const knownSubCategoryIds = new Set(subCategories.map((subCategory) => subCategory.id));
  const fallbackSubCategoryIdByProductId = buildProductSubCategoryMap();
  const normalizedSlugs: Pick<AdminProduct, 'slug'>[] = [];

  const normalizedProducts = products.map((product) => {
    const fallbackSubCategoryId = fallbackSubCategoryIdByProductId.get(product.id) || fallbackSubCategoryIdByProductId.get(product.slug);
    const subCategoryId = knownSubCategoryIds.has(product.subCategoryId) || knownCategoryIds.has(product.subCategoryId)
      ? product.subCategoryId
      : fallbackSubCategoryId || product.subCategoryId;
    const slug = uniqueProductSlug(product.slug || generateProductSlug(product.name), normalizedSlugs);
    normalizedSlugs.push({ slug });
    const { brand: _legacyBrand, ...productWithoutBrand } = product as AdminProduct & { brand?: string };
    const files = [...(product.files || [])];
    const detailTabs = (product.detailTabs || []).map((tab) => {
      if (tab.type !== 'file' && tab.type !== 'pdf') return tab;

      const existingFile = files.find((file) => file.detailTabId === tab.id);
      const legacyContentUrl = looksLikeFileUrl(tab.content) ? tab.content : '';
      const fileUrl = tab.fileUrl || existingFile?.url || legacyContentUrl;
      if (!fileUrl) return tab;

      const fileName = tab.fileName || existingFile?.name || fileNameFromUrl(fileUrl);
      const fileType = tab.fileType || existingFile?.fileType || fileExtension(fileName || fileUrl);
      const fileId = tab.fileId || existingFile?.id || `file-${tab.id}`;
      const fileSize = tab.fileSize ?? existingFile?.fileSize ?? 0;
      const storageObjectPath = tab.storageObjectPath || existingFile?.storageObjectPath;

      if (!existingFile) {
        files.push({
          id: fileId,
          detailTabId: tab.id,
          name: fileName,
          url: fileUrl,
          fileType,
          fileSize,
          storageObjectPath,
        });
      }

      return {
        ...tab,
        type: 'file' as const,
        content: legacyContentUrl === tab.content ? '' : tab.content,
        fileId,
        fileName,
        fileUrl,
        fileType,
        fileSize,
        storageObjectPath,
      };
    });

    const coverThumbnail = product.coverThumbnail || thumbnailUrlFromProductImageUrl(product.coverImage) || product.coverImage;
    const subProducts = (product.subProducts || []).map((subProduct) => ({
      ...subProduct,
      coverThumbnail: subProduct.coverThumbnail || thumbnailUrlFromProductImageUrl(subProduct.coverImage) || subProduct.coverImage,
    }));

    return { ...productWithoutBrand, slug, subCategoryId, coverThumbnail, subProducts, detailTabs, files };
  });

  const productIdsBySubCategoryId = new Map<string, string[]>();
  normalizedProducts.forEach((product) => {
    if (!knownSubCategoryIds.has(product.subCategoryId)) return;
    const productIds = productIdsBySubCategoryId.get(product.subCategoryId) || [];
    productIds.push(product.id);
    productIdsBySubCategoryId.set(product.subCategoryId, productIds);
  });

  const normalizedSubCategories = subCategories.map((subCategory) => {
    const productIds = new Set([...(subCategory.productIds || []), ...(productIdsBySubCategoryId.get(subCategory.id) || [])]);
    return { ...subCategory, productIds: Array.from(productIds) };
  });

  return {
    categories,
    subCategories: normalizedSubCategories,
    products: normalizedProducts,
  };
}

function looksLikeFileUrl(value: string) {
  return /^(?:https?:\/\/|\/).+\.(?:pdf|pptx?|docx?|xlsx?|zip)(?:[?#].*)?$/i.test(value || '');
}

function fileNameFromUrl(value: string) {
  try {
    const pathname = value.startsWith('http') ? new URL(value).pathname : value;
    return decodeURIComponent(pathname.split('/').pop() || '产品资料');
  } catch {
    return value.split('/').pop() || '产品资料';
  }
}

function fileExtension(value: string) {
  return value.split(/[?#]/)[0].split('.').pop()?.toLowerCase() || 'file';
}
