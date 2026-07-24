import type { Product, ProductDetailTab, ProductSubCategory } from '@/data/products';
import type { AdminProduct } from '@/lib/admin-catalog';

export function adminProductToProduct(product: AdminProduct): Product {
  const detailTabs = product.detailTabs.length
    ? product.detailTabs.map<ProductDetailTab>((tab) => {
        const file = product.files.find((item) => item.detailTabId === tab.id);
        const isFile = tab.type === 'file' || tab.type === 'pdf';

        return {
          title: tab.title,
          type: isFile ? 'file' : tab.type,
          content: isFile ? tab.content || file?.name || tab.fileName || tab.title : tab.content,
          fileUrl: isFile ? file?.url || tab.fileUrl : undefined,
          fileName: isFile ? file?.name || tab.fileName : undefined,
          fileType: isFile ? file?.fileType || tab.fileType : undefined,
          fileSize: isFile ? file?.fileSize ?? tab.fileSize : undefined,
        };
      })
    : undefined;

  return {
    id: product.slug || product.id,
    name: product.name,
    model: product.model,
    category: product.subCategoryId,
    brand: '其他',
    price: 0,
    rating: 5,
    sales: 0,
    createdAt: product.createdAt,
    image: product.coverImage,
    images: product.images,
    specs: product.specs.map(({ label, value }) => ({ label, value })),
    description: product.description,
    features: product.features,
    detailTabs,
    subCategories: product.subProducts.map<ProductSubCategory>((subProduct) => ({
      id: subProduct.slug || subProduct.id,
      name: subProduct.name,
      model: subProduct.model,
      image: subProduct.coverImage,
      images: subProduct.images,
      specs: subProduct.specs.map(({ label, value }) => ({ label, value })),
      hydraulicParams: subProduct.hydraulicParams,
      electricParams: subProduct.electricParams,
    })),
  };
}
