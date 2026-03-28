'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Anchor,
  ArrowRight,
  Factory,
  Gauge,
  Layers3,
  MapPinned,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Wind,
} from 'lucide-react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import {
  caseCards,
  caseCategoryMeta,
  caseDeliverySteps,
  categories,
  type CaseCategory,
  type CaseCard,
} from '@/data/cases';

const industryCategories = categories.filter(
  (item): item is Exclude<CaseCategory, '全部'> => item !== '全部'
);

const industryIcons: Record<Exclude<CaseCategory, '全部'>, LucideIcon> = {
  船舶海洋: Anchor,
  工程机械: Factory,
  轨道交通: TrainFront,
  风力发电: Wind,
  '航空航天/其他': Rocket,
};

const overviewStats = [
  {
    label: '项目案例',
    value: `${String(caseCards.length).padStart(2, '0')}+`,
    description: '覆盖典型液压系统、产线系统与测试平台',
    icon: Layers3,
  },
  {
    label: '行业覆盖',
    value: String(industryCategories.length),
    description: '从海工装备到风电检测，形成完整行业矩阵',
    icon: MapPinned,
  },
  {
    label: '系统能力',
    value: `${new Set(caseCards.map((item) => item.systemType)).size}`,
    description: '围绕稳定性、可维护性与测试可追溯展开',
    icon: Gauge,
  },
];

function getCategoryCount(category: CaseCategory) {
  if (category === '全部') {
    return caseCards.length;
  }

  return caseCards.filter((item) => item.category === category).length;
}

function getCategoryDescription(category: CaseCategory) {
  if (category === '全部') {
    return '从海上重载设备到精密测试平台，案例库强调复杂工况、系统集成与长期运行能力。';
  }

  return caseCategoryMeta[category].description;
}

function CaseLibraryCard({
  item,
  active,
  index,
  onPreview,
}: {
  item: CaseCard;
  active: boolean;
  index: number;
  onPreview: (id: string) => void;
}) {
  return (
    <MotionReveal delay={index * 0.05}>
      <motion.article
        whileHover={{ y: -6 }}
        onMouseEnter={() => onPreview(item.id)}
        onFocusCapture={() => onPreview(item.id)}
        onClick={() => onPreview(item.id)}
        className={[
          'group relative overflow-hidden rounded-[28px] border bg-white transition-all duration-300',
          active
            ? 'border-[#0B2A4A]/20 shadow-[0_18px_50px_rgba(11,42,74,0.16)]'
            : 'border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.07)] hover:border-[#0B2A4A]/15 hover:shadow-[0_18px_44px_rgba(15,23,42,0.10)]',
        ].join(' ')}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0B2A4A] via-[#1F5E8C] to-[#F4B400]" />

        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1625]/80 via-[#0B1625]/15 to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="rounded-full border border-white/25 bg-white/90 px-3 py-1 text-xs font-semibold text-[#0B2A4A] backdrop-blur">
              {item.category}
            </span>
            <span className="rounded-full border border-white/20 bg-[#0B1F33]/70 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                {item.systemType}
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-white">{item.title}</h3>
            </div>
            <div className="hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur sm:block">
              <div className="text-[11px] text-white/65">{item.parameters[0]?.label}</div>
              <div className="mt-1 text-lg font-semibold text-white">
                {item.parameters[0]?.value}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#F4B400]" />
            <span>{item.scenario}</span>
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
            {item.description || '暂无详细描述。'}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {item.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-[#0B2A4A]/10 bg-[#0B2A4A]/[0.03] px-3 py-1 text-xs font-medium text-[#0B2A4A]"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="text-xs text-slate-500">
              聚焦 {item.parameters.map((parameter) => parameter.label).join(' / ')}
            </div>
            <Link
              href={`/cases/${item.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B2A4A] transition-colors hover:text-[#F4B400]"
            >
              查看详情
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.article>
    </MotionReveal>
  );
}

function CaseSpotlight({ item, index, total }: { item: CaseCard; index: number; total: number }) {
  return (
    <div className="xl:sticky xl:top-24">
      <div className="overflow-hidden rounded-[32px] border border-[#0B2A4A]/10 bg-[#0D2236] text-white shadow-[0_24px_64px_rgba(11,31,51,0.28)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={item.image} alt={item.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2236] via-[#0D2236]/25 to-transparent" />
          <div className="absolute inset-x-6 top-6 flex items-center justify-between gap-4">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              {item.category}
            </span>
            <span className="rounded-full border border-white/20 bg-[#F4B400]/15 px-3 py-1 text-xs font-semibold text-[#FFD86A] backdrop-blur">
              项目 {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
          <div className="absolute inset-x-6 bottom-6">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs text-white/75 backdrop-blur">
              {item.systemType}
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight">{item.title}</h3>
            <p className="text-white/78 mt-3 max-w-xl text-sm leading-7">{item.scenario}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="p-7"
          >
            <p className="text-sm leading-7 text-white/75">
              {item.description || '暂无详细描述。'}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              {item.parameters.map((parameter) => (
                <div
                  key={parameter.label}
                  className="bg-white/6 rounded-2xl border border-white/10 p-4 backdrop-blur"
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                    {parameter.label}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">{parameter.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/6 mt-6 rounded-[24px] border border-white/10 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4 text-[#F4B400]" />
                项目亮点
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-white/85"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-[#F4B400]" />
                  案例关注点
                </div>
                <p className="text-white/72 mt-3 text-sm leading-7">
                  {caseCategoryMeta[item.category].description}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Gauge className="h-4 w-4 text-[#F4B400]" />
                  交付焦点
                </div>
                <p className="text-white/72 mt-3 text-sm leading-7">
                  重点围绕 {caseCategoryMeta[item.category].focus}{' '}
                  展开方案设计、联调验证和后续维护。
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/cases/${item.id}`} variant="accent" className="justify-center">
                查看完整案例
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="secondary"
                className="justify-center border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10"
              >
                咨询相似项目
              </ButtonLink>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CasesClient() {
  const [category, setCategory] = useState<CaseCategory>('全部');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(caseCards[0]?.id ?? '');

  const filteredCases = caseCards.filter(
    (item) => category === '全部' || item.category === category
  );
  const activeCase =
    filteredCases.find((item) => item.id === selectedCaseId) ?? filteredCases[0] ?? null;
  const activeIndex = activeCase ? filteredCases.findIndex((item) => item.id === activeCase.id) : 0;

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#0B0F16]">
      <section className="relative overflow-hidden bg-[#0B1F33] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,180,0,0.22),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(64,145,204,0.24),transparent_28%),linear-gradient(135deg,#091726_0%,#0B1F33_55%,#123453_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />

        <Container className="relative py-20 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end">
            <div>
              <MotionReveal>
                <div className="bg-white/8 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white/80 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#F4B400]" />
                  ENGINEERING CASE LIBRARY
                </div>
              </MotionReveal>

              <MotionReveal delay={0.05}>
                <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  把工程能力从“能做”展示成
                  <span className="block bg-gradient-to-r from-[#F4B400] via-[#F8D36A] to-white bg-clip-text text-transparent">
                    看得懂、看得稳、看得出差异
                  </span>
                </h1>
              </MotionReveal>

              <MotionReveal delay={0.1}>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
                  这里不只是项目清单，而是围绕行业场景、系统类型、关键参数与交付关注点组织的案例库。用户可以先快速浏览，再聚焦到具体项目细节。
                </p>
              </MotionReveal>

              <MotionReveal delay={0.15}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/contact" variant="accent" className="justify-center">
                    获取同类方案
                  </ButtonLink>
                  <ButtonLink
                    href="/capability"
                    variant="secondary"
                    className="justify-center border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10"
                  >
                    查看技术实力
                  </ButtonLink>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.2}>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {overviewStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="bg-white/8 rounded-[24px] border border-white/10 p-5 backdrop-blur"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                            {stat.label}
                          </div>
                          <Icon className="h-4 w-4 text-[#F4B400]" />
                        </div>
                        <div className="mt-4 text-3xl font-semibold text-white">{stat.value}</div>
                        <p className="mt-3 text-sm leading-6 text-white/65">{stat.description}</p>
                      </div>
                    );
                  })}
                </div>
              </MotionReveal>
            </div>

            <MotionReveal delay={0.12}>
              <div className="bg-white/8 rounded-[32px] border border-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                      行业分布
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-white">案例覆盖矩阵</div>
                  </div>
                  <div className="rounded-full border border-white/15 bg-[#F4B400]/15 px-3 py-1 text-xs font-semibold text-[#FFD86A]">
                    已收录 {caseCards.length} 个项目
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {industryCategories.map((industry) => {
                    const Icon = industryIcons[industry];

                    return (
                      <div
                        key={industry}
                        className="rounded-[24px] border border-white/10 bg-black/15 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-white">
                              <Icon className="h-4 w-4 text-[#F4B400]" />
                              {industry}
                            </div>
                            <p className="mt-3 text-sm leading-6 text-white/65">
                              {caseCategoryMeta[industry].description}
                            </p>
                          </div>
                          <div className="bg-white/6 rounded-2xl border border-white/10 px-3 py-2 text-right">
                            <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                              数量
                            </div>
                            <div className="mt-1 text-lg font-semibold text-white">
                              {String(getCategoryCount(industry)).padStart(2, '0')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200/80 bg-white/70 py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="CASE BROWSER"
              title="按行业浏览案例库"
              description="筛选行业后，右侧焦点卡会联动展示代表项目。这样页面既能快速浏览，也能在不跳转的情况下看到更完整的信息。"
            />
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-wrap gap-3">
                {categories.map((item) => {
                  const active = item === category;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={[
                        'inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300',
                        active
                          ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white shadow-[0_10px_24px_rgba(11,42,74,0.18)]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#0B2A4A]/20 hover:text-[#0B2A4A]',
                      ].join(' ')}
                    >
                      <span>{item}</span>
                      <span
                        className={[
                          'rounded-full px-2 py-0.5 text-xs',
                          active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500',
                        ].join(' ')}
                      >
                        {getCategoryCount(item)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="max-w-xl rounded-[24px] border border-[#0B2A4A]/10 bg-[#0B2A4A]/[0.03] px-5 py-4 text-sm leading-7 text-slate-600">
                <div className="font-semibold text-[#0B2A4A]">
                  {category === '全部' ? '全部行业' : category}
                </div>
                <div className="mt-1">{getCategoryDescription(category)}</div>
              </div>
            </div>
          </MotionReveal>

          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="order-2 xl:order-1">
              <div className="grid gap-5 md:grid-cols-2">
                {filteredCases.map((item, index) => (
                  <CaseLibraryCard
                    key={item.id}
                    item={item}
                    index={index}
                    active={activeCase?.id === item.id}
                    onPreview={setSelectedCaseId}
                  />
                ))}
              </div>
            </div>

            <div className="order-1 xl:order-2">
              {activeCase ? (
                <MotionReveal delay={0.08}>
                  <CaseSpotlight
                    item={activeCase}
                    index={activeIndex}
                    total={filteredCases.length}
                  />
                </MotionReveal>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
            <MotionReveal>
              <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/60">
                  DELIVERY LOGIC
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#0B0F16]">
                  面向高标准项目的交付逻辑
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  真正有上限的项目，价值不在于设备体量本身，而在于能否在复杂工况下持续稳定运行，并把方案、制造、调试和运维做成闭环。
                </p>
                <div className="mt-8 rounded-[24px] bg-[#0B1F33] p-6 text-white">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-[#F4B400]" />
                    标杆项目的共性标准
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-white/75">
                    <li>不是单点设备拼装，而是液压、电控、结构与控制策略整体协同。</li>
                    <li>不是只把功能跑通，而是在连续运行、极限工况和维护周期下保持稳定。</li>
                    <li>不是一次性交付结束，而是把调试、验收、追溯与后续运维一并考虑进去。</li>
                  </ul>
                </div>
              </div>
            </MotionReveal>

            <div className="grid gap-4 md:grid-cols-3">
              {caseDeliverySteps.map((step, index) => (
                <MotionReveal key={step.title} delay={index * 0.06}>
                  <div className="h-full rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0B2A4A]/55">
                        Step {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4B400]/15 text-[#9A6B00]">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-[#0B0F16]">{step.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
