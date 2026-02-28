import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';

export const metadata = {
  title: '合作伙伴',
};

type PartnerItem = {
  name: string;
  logo: string;
};

export default function PartnersPage() {
  const customers: PartnerItem[] = [
    { name: '中国中车', logo: '/images/partners/株洲时代新材料.png' },
    { name: '三一重工', logo: '/images/partners/三一重工.png' },
    { name: '中联重科', logo: '/images/partners/中联重科.png' },
    { name: '徐工集团', logo: '/images/partners/徐工集团.png' },
    { name: '蓝天科技', logo: '/images/partners/蓝天科技.png' },
    { name: '飞翼股份', logo: '/images/partners/飞翼股份.png' },
    { name: '百通新材', logo: '/images/partners/百通新材.png' },
    { name: '深蓝动力', logo: '/images/partners/深蓝动力.png' },
    { name: '北路智控', logo: '/images/partners/北路智控.png' },
  ];

  return (
    <div>
      <section className="border-b border-zinc-200/70 bg-zinc-50 py-12 dark:border-white/10 dark:bg-white/5 sm:py-16">
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">
              PARTNERS
            </div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B0F16] dark:text-white sm:text-4xl">
              合作伙伴
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              与优秀客户长期协作，与国内外优质品牌共同构建稳定可靠的供应与技术体系，持续提升系统交付能力。
            </p>
          </MotionReveal>
          {/* <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/8]">
                <Image
                  src="/images/hs/partners.svg"
                  alt="合作伙伴主视觉占位图"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </MotionReveal> */}
          <MotionReveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="accent">
                洽谈谈合作
              </ButtonLink>
              <ButtonLink href="/capability" variant="secondary">
                查看技术实力
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="CUSTOMERS"
              title="主要客户"
              description="覆盖工程机械、工业制造等行业客户，强调长期合作与交付一致性。"
            />
          </MotionReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c, idx) => (
              <MotionReveal key={c.name} delay={idx * 0.03}>
                <div className="flex items-center gap-4 rounded-xl border border-zinc-200/80 bg-white p-5 dark:border-white/10 dark:bg-black/30">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image src={c.logo} alt={c.name} fill className="object-contain" />
                  </div>
                  <div className="text-base font-medium text-zinc-700 dark:text-zinc-200">
                    {c.name}
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-zinc-200/70 bg-zinc-50 py-14 dark:border-white/10 dark:bg-white/5 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="BRANDS"
              title="合作品牌"
              description="与国际知名品牌与国内优质品牌协作，保障关键器件与系统方案的一致性与可靠性。"
            />
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative w-full">
                <Image
                  src="/images/partners/hezuokehu1.png"
                  alt="合作品牌"
                  width={2400}
                  height={1800}
                  className="w-full object-contain"
                />
              </div>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="CO-BUILD"
              title="协作方式"
              description="以协作共赢为原则，对齐需求、交付范围与质量标准，形成可持续合作的长期价值。"
            />
          </MotionReveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { title: '需求对齐', desc: '明确边界与目标指标，形成可评审输入。' },
              { title: '方案评审', desc: '对齐关键器件、控制策略与风险点。' },
              { title: '交付与支持', desc: '按项目范围提供交付与运维支持，保障长期可用性。' },
            ].map((i, idx) => (
              <MotionReveal key={i.title} delay={idx * 0.06}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">
                    {i.title}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {i.desc}
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-10">
            <ButtonLink href="/contact" variant="accent">
              联系我们
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
