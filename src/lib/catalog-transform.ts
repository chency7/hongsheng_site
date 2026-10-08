import type { CategoryOption, Product } from '@/data/products';
import { adminProductToProduct } from '@/lib/admin/product-view';
import type { AdminCatalog, AdminProduct } from '@/lib/admin-catalog';

/**
 * 产品目录转换（客户端安全，无服务端依赖）。
 * 数据来源为 Supabase RPC：get_public_catalog（站点）/ get_admin_catalog（后台）。
 */

export function adminCatalogToCategoryOptions(catalog: AdminCatalog): CategoryOption[] {
  const activeProducts = catalog.products.filter((product) => product.isActive);

  return catalog.categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => {
      const subCategories = catalog.subCategories
        .filter((subCategory) => subCategory.isActive && subCategory.categoryId === category.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          products: activeProducts
            .filter((product) => product.subCategoryId === subCategory.id)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((product) => ({
              id: `${subCategory.id}-${product.id}`,
              name: product.name,
              productId: product.slug || product.id,
            })),
        }));

      return {
        id: category.id,
        name: category.name,
        products: activeProducts
          .filter((product) => product.subCategoryId === category.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((product) => ({
            id: `${category.id}-${product.id}`,
            name: product.name,
            productId: product.slug || product.id,
          })),
        subCategories,
      };
    });
}

export function adminCatalogToProducts(catalog: AdminCatalog): Product[] {
  const categoryById = new Map(catalog.categories.map((category) => [category.id, category]));
  const subCategoryById = new Map(catalog.subCategories.map((subCategory) => [subCategory.id, subCategory]));

  // 产品对外可见要求：产品本身启用，且所属子分类、上级分类均处于启用状态
  const isProductVisible = (product: AdminProduct) => {
    if (!product.isActive) return false;

    const subCategory = subCategoryById.get(product.subCategoryId);
    if (subCategory) {
      return subCategory.isActive && (categoryById.get(subCategory.categoryId)?.isActive ?? true);
    }

    return categoryById.get(product.subCategoryId)?.isActive ?? true;
  };

  return catalog.products
    .filter(isProductVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(adminProductToProduct);
}
