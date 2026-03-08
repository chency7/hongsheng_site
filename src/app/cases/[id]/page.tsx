import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Settings, Target } from 'lucide-react';
import Container from '@/components/site/Container';
import ButtonLink from '@/components/site/ButtonLink';
import { caseCards } from '@/data/cases';

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

  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden border-b border-blue-100 bg-blue-50 py-12 sm:py-16">
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-blue-200/40 to-transparent blur-3xl" />
        <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tr from-blue-100/40 to-transparent blur-3xl" />
        
        <Container>
          <div className="mb-8">
            <Link 
              href="/cases" 
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回案例列表
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-100/50 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
                {c.category}
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl lg:text-5xl">
                {c.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-blue-900/70">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>{c.systemType}</span>
                </div>
                <div className="h-4 w-px bg-blue-200" />
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>{c.scenario}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Column: Image & Description */}
            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg border border-slate-100">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900">项目概述</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {c.description || '暂无详细描述。'}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900">核心亮点</h3>
                <ul className="mt-4 space-y-3">
                  {c.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-none text-[#F4B400]" />
                      <span className="text-slate-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Parameters & CTA */}
            <div className="lg:pl-8">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-slate-900">技术参数</h3>
                <div className="mt-6 space-y-4">
                  {c.parameters.map((param) => (
                    <div key={param.label} className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                      <span className="text-sm font-medium text-slate-500">{param.label}</span>
                      <span className="text-base font-bold text-slate-900">{param.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-blue-950 p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 -z-10 h-64 w-64 translate-x-1/3 -translate-y-1/4 rounded-full bg-blue-800/50 blur-3xl" />
                
                <h3 className="text-lg font-semibold">对此方案感兴趣？</h3>
                <p className="mt-2 text-blue-100/80 text-sm">
                  我们要么有现成的解决方案，要么可以为您快速定制。
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <ButtonLink href="/contact" variant="accent" className="bg-[#F4B400] text-white hover:bg-[#d9a000] border-none w-full justify-center">
                    获取详细方案
                  </ButtonLink>
                  <ButtonLink href="/solutions" variant="secondary" className="bg-transparent text-white border-white/20 hover:bg-white/10 w-full justify-center">
                    查看更多方案
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
