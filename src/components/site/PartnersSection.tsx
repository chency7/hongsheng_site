'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';

type PartnerItem = {
  name: string;
  logo: string;
};

export default function PartnersSection() {
  const customers: PartnerItem[] = [
    { name: '中国中车', logo: '/images/partners/株洲时代新材料.png' },
    { name: '三一重工', logo: '/images/partners/三一重工.png' },
    { name: '中联重科', logo: '/images/partners/中联重科.png' },
    { name: '徐工集团', logo: '/images/partners/徐工集团.png' },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-white">
      <Container>
        <MotionReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-[#F4B400] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#F4B400] uppercase">
                Partners
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0B0F16] dark:text-[#0B0F16] mb-4">
              合作伙伴
            </h2>
            <p className="text-zinc-600 dark:text-zinc-600 max-w-2xl mx-auto text-sm sm:text-base">
              与优秀客户长期协作，与国内外优质品牌共同构建稳定可靠的供应与技术体系，持续提升系统交付能力
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c, idx) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="flex items-center gap-4 rounded-xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-200/80 dark:bg-white hover:border-[#F4B400]/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image src={c.logo} alt={c.name} fill className="object-contain" />
                </div>
                <div className="text-base font-medium text-zinc-700 dark:text-zinc-700">
                  {c.name}
                </div>
              </motion.div>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.18}>
          <div className="mt-10 text-center">
            <ButtonLink href="/partners" variant="accent">
              查看全部合作伙伴
            </ButtonLink>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
