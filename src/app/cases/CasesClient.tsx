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
  image: string;
  parameters: { label: string; value: string }[];
};

const categories: CaseCategory[] = ['全部', '船舶海洋', '工程机械', '轨道交通', '风力发电', '航空航天/其他'];

const caseCards: CaseCard[] = [
  {
    category: '船舶海洋',
    title: '100米打桩船',
    systemType: '船用液压系统',
    scenario: '海上打桩作业',
    highlights: ['连续运行稳定性', '环境适应性', '维护便利性'],
    image: '/images/gc/marine.jpg',
    parameters: [
      { label: '系统压力', value: '35 MPa' },
      { label: '最大流量', value: '1200 L/min' },
      { label: '装机功率', value: '800 kW' },
    ],
  },
  {
    category: '船舶海洋',
    title: '绞吸式挖泥船',
    systemType: '船用液压系统',
    scenario: '河道/港口疏浚',
    highlights: ['复杂工况适配', '动力与控制协同', '可靠性设计'],
    image: '/images/gc/marine.jpg',
    parameters: [
      { label: '绞刀功率', value: '2000 kW' },
      { label: '排距', value: '4000 m' },
      { label: '挖深', value: '25 m' },
    ],
  },
  {
    category: '船舶海洋',
    title: '船用大型综合检测试验台',
    systemType: '检测系统',
    scenario: '船舶设备检测',
    highlights: ['数据可追溯', '测试流程规范化', '联动控制与保护'],
    image: '/images/gc/marine.jpg',
    parameters: [
      { label: '测试压力', value: '60 MPa' },
      { label: '加载力', value: '500 Ton' },
      { label: '控制精度', value: '±0.5%' },
    ],
  },
  {
    category: '工程机械',
    title: '大型发泡产线液压及电控系统',
    systemType: '生产线液压系统',
    scenario: '发泡材料生产',
    highlights: ['产线节拍匹配', '一致性与可追溯', '系统集成交付'],
    image: '/images/gc/manufacturing.jpg',
    parameters: [
      { label: '生产节拍', value: '30 s/pc' },
      { label: '定位精度', value: '±0.1 mm' },
      { label: '总功率', value: '450 kW' },
    ],
  },
  {
    category: '工程机械',
    title: '起重机吊臂产线液压站',
    systemType: '生产线液压系统',
    scenario: '起重机制造',
    highlights: ['批量交付一致性', '维护体系完善', '工艺与品控'],
    image: '/images/gc/manufacturing.jpg',
    parameters: [
      { label: '油箱容积', value: '2000 L' },
      { label: '系统压力', value: '21 MPa' },
      { label: '工位数量', value: '12' },
    ],
  },
  {
    category: '工程机械',
    title: '300T脱模机液压及电控系统',
    systemType: '重型设备液压系统',
    scenario: '模具脱模',
    highlights: ['重载稳定输出', '安全保护策略', '可维护性设计'],
    image: '/images/gc/construction.jpg',
    parameters: [
      { label: '脱模力', value: '300 Ton' },
      { label: '行程', value: '1500 mm' },
      { label: '同步精度', value: '±1 mm' },
    ],
  },
  {
    category: '工程机械',
    title: '多规格楼面布料机液压及电控系统',
    systemType: '建筑机械液压系统',
    scenario: '混凝土布料',
    highlights: ['多规格适配', '控制可靠性', '现场工况兼容'],
    image: '/images/gc/construction.jpg',
    parameters: [
      { label: '布料半径', value: '28-36 m' },
      { label: '系统压力', value: '28 MPa' },
      { label: '回转角度', value: '360°' },
    ],
  },
  {
    category: '轨道交通',
    title: '轨道交通铰接器试验台',
    systemType: '测试系统',
    scenario: '轨道车辆铰接器检测',
    highlights: ['重复性与一致性', '安全联锁', '报告输出'],
    image: '/images/gc/rail.jpg',
    parameters: [
      { label: '最大加载', value: '1000 kN' },
      { label: '频率', value: '5 Hz' },
      { label: '通道数', value: '16' },
    ],
  },
  {
    category: '风力发电',
    title: '风电联轴器压力测试系统',
    systemType: '测试系统',
    scenario: '联轴器压力检测',
    highlights: ['指标量化', '数据采集', '流程可追溯'],
    image: '/images/gc/wind.jpg',
    parameters: [
      { label: '测试压力', value: '250 MPa' },
      { label: '保压时间', value: '24 h' },
      { label: '介质', value: '液压油' },
    ],
  },
  {
    category: '风力发电',
    title: '风电联轴器疲劳测试系统',
    systemType: '测试系统',
    scenario: '联轴器疲劳寿命检测',
    highlights: ['长周期稳定运行', '工况可编程', '数据与报告'],
    image: '/images/gc/wind.jpg',
    parameters: [
      { label: '最大扭矩', value: '50 kNm' },
      { label: '疲劳次数', value: '10^7' },
      { label: '加载波形', value: '正弦/三角' },
    ],
  },
  {
    category: '航空航天/其他',
    title: '空气制动阀密封件测试试验台',
    systemType: '测试系统',
    scenario: '制动系统密封检测',
    highlights: ['精密控制', '流程规范化', '可追溯记录'],
    image: '/images/gc/aerospace.jpg',
    parameters: [
      { label: '气压范围', value: '0-1.0 MPa' },
      { label: '泄漏检测', value: '0.01 mL/min' },
      { label: '温控范围', value: '-40~80 ℃' },
    ],
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
      <section className="relative overflow-hidden border-b border-blue-100 bg-blue-50 py-12 sm:py-16">
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
              <MotionReveal key={item.title} delay={idx * 0.03}>
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
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
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
