'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';
import { caseCards, categories, type CaseCategory } from '@/data/cases';

export default function CasesClient() {
  const [category, setCategory] = useState<CaseCategory>('全部');

  const filtered = useMemo(() => {
    if (category === '全部') return caseCards;
    return caseCards.filter((c) => c.category === category);
  }, [category]);

  return (
    <div>
      <section className="hidden relative overflow-hidden border-b border-blue-100 bg-blue-50 py-12 sm:py-16">
        {/* Geometric Abstract Background */}
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-blue-200/40 to-transparent blur-3xl" />
        <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tr from-blue-100/40 to-transparent blur-3xl" />
        
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-blue-600/80">CASES</div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-blue-950 sm:text-4xl">
              工程案例
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-900/80">
              覆盖船舶海洋、工程机械、轨道交通、风力发电与测试平台等多领域项目，强调复杂工况下的稳定性、可维护性与交付一致性。
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-blue-100 bg-white/60 shadow-lg backdrop-blur-sm">
              <div className="relative aspect-[16/8]">
                <Image src="/images/hs/cases.svg" alt="工程案例主视觉占位图" fill className="object-cover opacity-90" />
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="accent" className="bg-[#F4B400] text-white hover:bg-[#d9a000] border-none shadow-md shadow-orange-100">
                获取同类方案
              </ButtonLink>
              <ButtonLink href="/capability" variant="secondary" className="bg-white text-blue-900 border-blue-100 hover:bg-blue-50 hover:border-blue-200 shadow-sm">
                查看技术实力
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20 bg-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(239,246,255,0.4))] pointer-events-none" />
        
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="FILTER"
              title="按行业筛选"
              description="选择行业分类查看相关项目条目，点击卡片可查看每个案例的完整详情与参数。"
            />
          </MotionReveal>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={[
                    'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
                    active
                      ? 'bg-blue-950 text-white shadow-md shadow-blue-900/20'
                      : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-900 border border-slate-100 hover:border-blue-100 shadow-sm',
                  ].join(' ')}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, idx) => (
              <MotionReveal key={item.id} delay={idx * 0.03}>
                <Link href={`/cases/${item.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] block h-full">
                  {/* Image Section */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-800 shadow-sm backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-900">
                      {item.title}
                    </h3>
                    <div className="mt-2 text-sm text-slate-500">
                      {item.systemType} <span className="mx-1 text-slate-300">|</span> {item.scenario}
                    </div>

                    {/* Parameters Grid */}
                    <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                      {item.parameters.map((param) => (
                        <div key={param.label}>
                          <div className="text-[10px] text-slate-400">{param.label}</div>
                          <div className="mt-0.5 text-sm font-bold text-slate-700">{param.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
