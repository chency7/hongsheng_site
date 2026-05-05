import ClientLayout from '@/components/layout/ClientLayout';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
