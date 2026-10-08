import ClientLayout from '@/components/layout/ClientLayout';

/**
 * 站点布局：产品目录由 ClientLayout 在浏览器端通过
 * usePublicCatalog()（Supabase RPC get_public_catalog）加载。
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
