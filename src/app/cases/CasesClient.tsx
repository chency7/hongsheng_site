'use client';

import React, { useMemo, useState } from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';

type CaseCategory = '全部' | '船舶海洋' | '工程机械' | '轨道交通' | '风力发电' | '航空航天/其他';

type CaseCard = {
  category: Exclude<CaseCategory, '全部'>;
  title: string;
  systemType: string;
  scenario: string;
  highlights: string[];
};

const categories: CaseCategory[] = ['全部', '船舶海洋', '工程机械', '轨道交通', '风力发电', '航空航天/其他'];

const caseCards: CaseCard[] = [
  {
    category: '船舶海洋',
    title: '100米打桩船',
    systemType: '船用液压系统',
    scenario: '海上打桩作业',
    highlights: ['连续运行稳定性', '环境适应性', '维护便利性'],
  },
  {
    category: '船舶海洋',
    title: '绞吸式挖泥船',
    systemType: '船用液压系统',
    scenario: '河道/港口疏浚',
    highlights: ['复杂工况适配', '动力与控制协同', '可靠性设计'],
  },
  {
    category: '船舶海洋',
    title: '船用大型综合检测试验台',
    systemType: '检测系统',
    scenario: '船舶设备检测',
    highlights: ['数据可追溯', '测试流程规范化', '联动控制与保护'],
  },
  {
    category: '工程机械',
    title: '大型发泡产线液压及电控系统',
    systemType: '生产线液压系统',
    scenario: '发泡材料生产',
    highlights: ['产线节拍匹配', '一致性与可追溯', '系统集成交付'],
  },
  {
    category: '工程机械',
    title: '起重机吊臂产线液压站',
    systemType: '生产线液压系统',
    scenario: '起重机制造',
    highlights: ['批量交付一致性', '维护体系完善', '工艺与品控'],
  },
  {
    category: '工程机械',
    title: '300T脱模机液压及电控系统',
    systemType: '重型设备液压系统',
    scenario: '模具脱模',
    highlights: ['重载稳定输出', '安全保护策略', '可维护性设计'],
  },
  {
    category: '工程机械',
    title: '多规格楼面布料机液压及电控系统',
    systemType: '建筑机械液压系统',
    scenario: '混凝土布料',
    highlights: ['多规格适配', '控制可靠性', '现场工况兼容'],
  },
  {
    category: '轨道交通',
    title: '轨道交通铰接器试验台',
    systemType: '测试系统',
    scenario: '轨道车辆铰接器检测',
    highlights: ['重复性与一致性', '安全联锁', '报告输出'],
  },
  {
    category: '风力发电',
    title: '风电联轴器压力测试系统',
    systemType: '测试系统',
    scenario: '联轴器压力检测',
    highlights: ['指标量化', '数据采集', '流程可追溯'],
  },
  {
    category: '风力发电',
    title: '风电联轴器疲劳测试系统',
    systemType: '测试系统',
    scenario: '联轴器疲劳寿命检测',
    highlights: ['长周期稳定运行', '工况可编程', '数据与报告'],
  },
  {
    category: '航空航天/其他',
    title: '空气制动阀密封件测试试验台',
    systemType: '测试系统',
    scenario: '制动系统密封检测',
    highlights: ['精密控制', '流程规范化', '可追溯记录'],
  },
];

export default function CasesClient() {
  const [category, setCategory] = useState<CaseCategory>('全部');

  const filtered = useMemo(() => {
    if (category === '全部') return caseCards;
    return caseCards.filter((c) => c.category === category);
  }, [category]);

  return (
    <div>
      <section className="border-b border-zinc-200/70 bg-zinc-50 py-12 dark:border-white/10 dark:bg-white/5 sm:py-16">
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">CASES</div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B0F16] dark:text-white sm:text-4xl">
              工程案例
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              覆盖船舶海洋、工程机械、轨道交通、风力发电与测试平台等多领域项目，强调复杂工况下的稳定性、可维护性与交付一致性。
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/8]">
                <Image src="/images/hs/cases.svg" alt="工程案例主视觉占位图" fill className="object-cover" />
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="accent">
                获取同类方案
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
              eyebrow="FILTER"
              title="按行业筛选"
              description="选择行业分类查看相关项目条目，后续可继续补充每个案例的完整详情页。"
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
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-[#0B2A4A] text-white dark:bg-white dark:text-[#0B2A4A]'
                      : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-black/30 dark:text-zinc-200 dark:hover:bg-white/5',
                  ].join(' ')}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {filtered.map((item, idx) => (
              <MotionReveal key={item.title} delay={idx * 0.03}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">
                        {item.category}
                      </div>
                      <div className="mt-3 text-lg font-semibold text-[#0B0F16] dark:text-white">{item.title}</div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-[#F4B400]" />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:grid-cols-3">
                    <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
                      <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">系统类型</div>
                      <div className="mt-1">{item.systemType}</div>
                    </div>
                    <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5 sm:col-span-2">
                      <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">应用场景</div>
                      <div className="mt-1">{item.scenario}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {item.highlights.map((h) => (
                      <div
                        key={h}
                        className="rounded-lg border border-zinc-200/70 bg-white/70 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                      >
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
