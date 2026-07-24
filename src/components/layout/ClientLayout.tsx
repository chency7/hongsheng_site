'use client';

import React, { useEffect } from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { usePathname } from 'next/navigation';
import { I18nProvider } from '@/components/providers/i18n-provider';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ScrollToTop from '@/components/site/ScrollToTop';
import type { CategoryOption } from '@/data/products';

export default function ClientLayout({
  children,
  categoryOptions,
}: {
  children: React.ReactNode;
  categoryOptions: CategoryOption[];
}) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <React.Suspense fallback={<div className="p-4 text-sm text-zinc-500">Loading...</div>}>
        <I18nProvider>
          <div className="min-h-screen bg-white text-[#0B0F16] dark:bg-black dark:text-white">
            <SiteHeader categoryOptions={categoryOptions} />
            <main>{children}</main>
            <SiteFooter showPartners={pathname === '/'} />
            <ScrollToTop />
          </div>
        </I18nProvider>
      </React.Suspense>
    </ThemeProvider>
  );
}
