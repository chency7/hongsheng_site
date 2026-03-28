import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Container from '@/components/site/Container';
import ButtonLink from '@/components/site/ButtonLink';
import { caseCards, caseCategoryMeta, caseDeliverySteps } from '@/data/cases';

export function generateStaticParams() {
  return caseCards.map((c) => ({
    id: c.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = caseCards.find((item) => item.id === id);
  if (!c) return { title: '案例未找到' };

  return {
    title: `${c.title} - 工程案例`,
    description: c.description || c.title,
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = caseCards.find((item) => item.id === id);

  if (!c) {
    notFound();
  }

  const relatedCases = caseCards
    .filter((item) => item.category === c.category && item.id !== c.id)
    .slice(0, 3);

  return (
    <div className="bg-[#F5F2EC] text-[#0B0F16]">
      <section className="relative overflow-hidden bg-[#0B1F33] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,180,0,0.2),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(64,145,204,0.18),transparent_28%),linear-gradient(135deg,#091726_0%,#0B1F33_60%,#133757_100%)]" />

        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="mb-8">
            <Link
              href="/cases"
              className="text-white/72 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              返回案例列表
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)] lg:items-end">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                {c.category}
              </div>
              <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {c.title}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                {c.description || '暂无详细描述。'}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="bg-white/8 rounded-[24px] border border-white/10 p-5 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    系统类型
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">{c.systemType}</div>
                </div>
                <div className="bg-white/8 rounded-[24px] border border-white/10 p-5 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    应用场景
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">{c.scenario}</div>
                </div>
                <div className="bg-white/8 rounded-[24px] border border-white/10 p-5 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    交付关注
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">
                    {caseCategoryMeta[c.category].focus}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/8 relative overflow-hidden rounded-[32px] border border-white/10 p-3 backdrop-blur">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[26px]">
                <Image src={c.image} alt={c.title} fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur">
                  ENGINEERING CASE DETAIL
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-8">
              <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B2A4A]">
                  <Sparkles className="h-4 w-4 text-[#F4B400]" />
                  项目概述
                </div>
                <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
                  {c.description || '暂无详细描述。'}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {c.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-[22px] border border-[#0B2A4A]/10 bg-[#0B2A4A]/[0.03] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#F4B400]" />
                        <div className="text-sm leading-7 text-slate-700">{highlight}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {c.gallery?.length ? (
                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#0B2A4A]">
                    <Sparkles className="h-4 w-4 text-[#F4B400]" />
                    项目实拍与关键部件
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {c.gallery.map((item, index) => (
                      <div
                        key={item.src}
                        className={[
                          'overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50',
                          index === 0 ? 'md:col-span-2' : '',
                        ].join(' ')}
                      >
                        <div className="flex justify-center bg-slate-100/70 px-4 py-4">
                          <div
                            className={[
                              'relative w-full',
                              index === 0
                                ? 'aspect-[16/10] max-w-[520px]'
                                : 'aspect-[4/5] max-w-[220px]',
                            ].join(' ')}
                          >
                            <Image
                              src={item.src}
                              alt={item.alt}
                              fill
                              className="object-contain"
                              sizes={
                                index === 0
                                  ? '(min-width: 768px) 520px, 100vw'
                                  : '(min-width: 768px) 220px, 100vw'
                              }
                            />
                          </div>
                        </div>
                        <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                          {item.alt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B2A4A]">
                  <Layers3 className="h-4 w-4 text-[#F4B400]" />
                  技术参数
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {c.parameters.map((param) => (
                    <div
                      key={param.label}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {param.label}
                      </div>
                      <div className="mt-3 text-2xl font-semibold text-[#0B0F16]">
                        {param.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/60">
                  DELIVERY STEPS
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#0B0F16]">
                  同类项目通常这样落地
                </h2>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {caseDeliverySteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/55">
                        Step {String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-[#0B0F16]">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <div className="rounded-[32px] border border-[#0B2A4A]/10 bg-[#0D2236] p-7 text-white shadow-[0_20px_56px_rgba(11,31,51,0.22)]">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Gauge className="h-4 w-4 text-[#F4B400]" />
                  项目判断维度
                </div>
                <div className="mt-5 space-y-4 text-sm leading-7 text-white/75">
                  <p>
                    这个案例主要体现的是 {caseCategoryMeta[c.category].focus}
                    ，适合用来说明系统在典型工况下的稳定性与可维护性。
                  </p>
                  <p>{caseCategoryMeta[c.category].description}</p>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B2A4A]">
                  <ShieldCheck className="h-4 w-4 text-[#F4B400]" />
                  下一步动作
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  如果你想把这个案例延伸成对客户更有说服力的方案页，可以继续补行业痛点、方案构成和交付结果。
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <ButtonLink href="/contact" variant="accent" className="justify-center">
                    获取详细方案
                  </ButtonLink>
                  <ButtonLink href="/cases" variant="secondary" className="justify-center">
                    继续浏览案例
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {relatedCases.length > 0 ? (
        <section className="border-t border-slate-200 bg-white/70 py-14 sm:py-20">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/60">
                  RELATED CASES
                </div>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B0F16]">
                  同行业相关案例
                </h2>
              </div>
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B2A4A] transition-colors hover:text-[#F4B400]"
              >
                查看全部案例
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {relatedCases.map((item) => (
                <Link
                  key={item.id}
                  href={`/cases/${item.id}`}
                  className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.10)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1625]/80 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-xs font-semibold text-[#0B2A4A] backdrop-blur">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/55">
                      {item.systemType}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-[#0B0F16]">{item.title}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">
                      {item.description || '暂无详细描述。'}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2A4A]">
                      查看详情
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
