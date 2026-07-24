import ClientLayout from '@/components/layout/ClientLayout';
import { adminCatalogToCategoryOptions, getAdminCatalogForSite } from '@/lib/admin/catalog-repository';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getAdminCatalogForSite();
  const categoryOptions = adminCatalogToCategoryOptions(catalog);

  return <ClientLayout categoryOptions={categoryOptions}>{children}</ClientLayout>;
}
