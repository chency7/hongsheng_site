'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState, useEffect } from 'react';
import Container from '@/components/site/Container';
import ButtonLink from '@/components/site/ButtonLink';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = useMemo<NavItem[]>(
    () => [
      { href: '/', label: '首页' },
      { href: '/products', label: '产品中心' },
      { href: '/solutions', label: '定制方案' },
      { href: '/cases', label: '工程案例' },
      { href: '/capability', label: '技术实力' },
      { href: '/service', label: '服务支持' },
      { href: '/partners', label: '合作伙伴' },
      { href: '/about', label: '关于我们' },
      { href: '/contact', label: '联系我们' },
    ],
    []
  );

  const isTransparent = pathname === '/' && !isScrolled;

  return (
    <header
      suppressHydrationWarning
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'border-b border-transparent bg-transparent backdrop-blur-none'
          : 'border-b border-white/10 bg-[#0B0F16]/90 shadow-sm backdrop-blur'
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg">
            <Image src="/images/hs/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="leading-tight">
            <div
              className={`text-lg font-bold transition-colors ${isTransparent ? 'text-white' : 'text-[#0B0F16] dark:text-white'}`}
            >
              湖南协力鸿胜机械有限公司
            </div>
            <div
              className={`text-[10px] transition-colors ${isTransparent ? 'text-zinc-400' : 'text-zinc-600 dark:text-zinc-400'}`}
            >
              Hunan Xieli Hongsheng Machinery Co.,Ltd.
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                suppressHydrationWarning
                className={[
                  'relative rounded-md px-2 py-2 text-sm font-medium transition-colors',
                  active
                    ? isTransparent
                      ? 'text-white'
                      : 'text-[#0B2A4A] dark:text-white'
                    : isTransparent
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-600 hover:text-[#0B2A4A] dark:text-zinc-400 dark:hover:text-white',
                ].join(' ')}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-2 -bottom-[9px] h-[2px] rounded-full bg-[#F4B400]" />
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
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors xl:hidden ${
            isTransparent
              ? 'border-white/20 text-white hover:bg-white/10'
              : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10'
          }`}
          aria-label="打开菜单"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 6H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="sr-only">菜单</span>
        </button>
      </Container>

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
                        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
