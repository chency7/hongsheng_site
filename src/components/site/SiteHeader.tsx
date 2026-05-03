'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import Container from '@/components/site/Container';
import ButtonLink from '@/components/site/ButtonLink';
import { categoryOptions } from '@/data/products';
import { ChevronDown } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function SiteHeader() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleProductsMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setProductsOpen(true);
  };

  const handleProductsMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setProductsOpen(false);
    }, 200);
  };

  const navItems = useMemo<NavItem[]>(
    () => [
      { href: '/', label: '首页' },
      { href: '/products', label: '产品中心' },
      { href: '/cases', label: '工程案例' },
      { href: '/capability', label: '技术实力' },
      { href: '/service', label: '服务支持' },
      { href: '/partners', label: '合作伙伴' },
      { href: '/about', label: '关于我们' },
      { href: '/contact', label: '联系我们' },
    ],
    []
  );

  return (
    <header
      suppressHydrationWarning
      className={`sticky top-0 z-50 transition-all duration-300 ${'border-b border-white/10 bg-[#0B0F16]/90 shadow-sm backdrop-blur'}`}
    >
      <Container className="flex h-24 items-center justify-between gap-4">
        <Link href="/" className="group ml-[-10px] flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-lg">
            <Image
              src="/images/hs/logo.png"
              alt="Logo"
              fill
              sizes="48px"
              className="object-contain"
            />
          </div>
          <div className="leading-tight">
            <div className={`text-lg font-bold text-white sm:text-2xl`}>
              <span className="sm:hidden">湖南协力鸿胜</span>
              <span className="hidden sm:inline">湖南协力鸿胜机械有限公司</span>
            </div>
            <div className={`text-xs text-zinc-400 transition-colors sm:text-sm`}>
              <span className="sm:hidden">Hunan Xieli Hongsheng Machinery</span>
              <span className="hidden sm:inline">Hunan XL-Honsun Machinery</span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            if (item.href === '/products') {
              return (
                <div
                  key={item.href}
                  ref={productsRef}
                  className="relative"
                  onMouseEnter={handleProductsMouseEnter}
                  onMouseLeave={handleProductsMouseLeave}
                >
                  <Link
                    href={item.href}
                    suppressHydrationWarning
                    className={[
                      'relative flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-[20px] text-base font-medium transition-colors',
                      active ? 'text-white' : 'text-zinc-400 hover:text-white',
                    ].join(' ')}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                    />
                    {active ? (
                      <span className="absolute inset-x-3 -bottom-[9px] h-[3px] rounded-full bg-[#F4B400]" />
                    ) : null}
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                suppressHydrationWarning
                className={[
                  'relative rounded-md px-3 py-2 text-[20px] text-base font-medium  transition-colors',
                  active ? 'text-white' : 'text-zinc-400 hover:text-white',
                ].join(' ')}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-[9px] h-[3px] rounded-full bg-[#F4B400]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ButtonLink href="/contact" variant="accent">
            方案咨询
          </ButtonLink>
        </div>

        <button
          type="button"
          className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 text-sm text-white transition-colors hover:bg-white/10 xl:hidden`}
          aria-label="打开菜单"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 6H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="sr-only">菜单</span>
        </button>
      </Container>

      <AnimatePresence>
        {productsOpen ? (
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: -4 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onMouseEnter={handleProductsMouseEnter}
            onMouseLeave={handleProductsMouseLeave}
            className="absolute left-0 right-0 top-full z-40 border-b border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          >
            <Container>
              <div className="py-8">
                <div className="grid grid-cols-6 gap-8">
                  {categoryOptions.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        href="/products"
                        onClick={() => setProductsOpen(false)}
                        className="mb-3 inline-block text-[14px] font-semibold text-[#1E3A5F] transition-colors hover:text-[#4A90D9]"
                      >
                        {cat.name}
                      </Link>
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        <ul className="space-y-2">
                          {cat.subCategories.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/products?category=${encodeURIComponent(sub.id)}`}
                                onClick={() => setProductsOpen(false)}
                                className="text-[13px] text-[#666666] transition-colors hover:text-[#4A90D9]"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <Link
                    href="/products"
                    onClick={() => setProductsOpen(false)}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#4A90D9] transition-colors hover:text-[#1E3A5F]"
                  >
                    查看全部产品
                    <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                  </Link>
                </div>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reducedMotion ? undefined : { height: 'auto', opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="border-t border-zinc-200/70 bg-white/95 dark:border-white/10 dark:bg-black/80 xl:hidden"
          >
            <Container className="py-4">
              <div className="grid gap-1">
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        'rounded-lg px-3 py-2 text-base font-medium transition-colors',
                        active
                          ? 'bg-[#0B2A4A]/5 text-[#0B2A4A] dark:bg-white/10 dark:text-white'
                          : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/5',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4">
                <ButtonLink href="/contact" variant="accent" className="w-full">
                  方案咨询
                </ButtonLink>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
