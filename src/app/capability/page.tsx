import React from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Cog,
  Cpu,
  Factory,
  Gauge,
  ShieldCheck,
  Sparkles,
  Target,
  TestTube,
  Wrench,
} from 'lucide-react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import { caseCards } from '@/data/cases';
import { categoryOptions, products } from '@/data/products';

export const metadata = {
  title: '技术实力 - 液压系统设计与制造能力',
  description:
    '湖南协力鸿胜技术实力展示：系统定义能力、机电液协同设计、制造与测试闭环、长期交付能力。拥有数控加工中心、深孔镗床、焊接机器人等制造资源，服务工程机械、船舶海洋等行业。',
  keywords: [
    '技术实力',
    '液压系统设计',
    '机电液集成',
    '精密制造',
    '试验检测',
    '数控加工',
    '液压制造能力',
    '焊接机器人',
    '深孔镗床',
    '仿真验证',
  ],
  openGraph: {
    title: '技术实力 - 液压系统设计与制造能力 | 湖南协力鸿胜机械',
    description: '系统定义能力、机电液协同设计、制造与测试闭环、长期交付能力。',
    url: 'https://www.xl-honsun.com/capability',
  },
  alternates: {
    canonical: 'https://www.xl-honsun.com/capability',
  },
};

type CapabilityDimension = {
  title: string;
  description: string;
  points: string[];
  icon: React.ComponentType<{ className?: string }>;
};

type CapabilityPhase = {
  step: string;
  title: string;
  summary: string;
  outputs: string[];
};

type IndustryMatrix = {
  title: string;
  description: string;
  strength: string;
  cases: string[];
  products: string[];
};

type EquipmentCluster = {
  title: string;
  description: string;
  items: { name: string; capability: string }[];
};

const capabilityDimensions: CapabilityDimension[] = [
  {
    title: '系统定义能力',
    description: '不是只给单机配件，而是从动作、载荷、压力、能耗与安全约束出发定义系统边界。',
    points: ['工况拆解', '边界条件确认', '风险点前置'],
    icon: Target,
  },
  {
    title: '机电液协同设计',
    description: '把液压、电控、结构与执行逻辑联成一套方案，避免后期调试阶段反复返工。',
    points: ['原理设计', '控制策略', '关键器件选型'],
    icon: Cpu,
  },
  {
    title: '制造与测试闭环',
    description: '从精密加工、焊接装配到试验台检测，能力建设直接决定交付一致性。',
    points: ['精密制造', '装配一致性', '测试可追溯'],
    icon: Factory,
  },
  {
    title: '长期交付能力',
    description: '真正的技术实力不止于出厂，而是项目上线后的维护、响应、升级和持续优化。',
    points: ['现场联调', '验收支持', '运维升级'],
    icon: ShieldCheck,
  },
];

const capabilityPhases: CapabilityPhase[] = [
  {
    step: '01',
    title: '定义项目边界',
    summary: '围绕目标工况、动作节拍、安装约束与风险点建立完整输入，先把问题定义清楚。',
    outputs: ['需求澄清记录', '工况与载荷拆解', '接口与环境条件确认'],
  },
  {
    step: '02',
    title: '完成系统方案',
    summary: '同步推进液压回路、电控逻辑、结构协同与器件选型，形成可落地的系统方案。',
    outputs: ['系统原理与控制方案', '安全保护策略', '关键元件与参数选型'],
  },
  {
    step: '03',
    title: '制造验证并交付',
    summary: '通过精密加工、装配、试验检测与现场联调，保证系统不是纸面方案，而是真正可投用。',
    outputs: ['制造与装配控制', '试验检测与记录', '现场联调与验收支持'],
  },
];

const equipmentClusters: EquipmentCluster[] = [
  {
    title: '制造资源',
    description: '以大型加工中心、深孔镗床与焊接工作站支撑重载件、长尺寸件和复杂结构件制造。',
    items: [
      { name: '数控设备（CNC）', capability: '精密加工' },
      { name: '4.5米长加工中心（PRATIC）', capability: '大型工件加工' },
      { name: '数控高速加工中心', capability: '高效精密加工' },
      { name: '大型深孔镗床', capability: '深孔加工' },
      { name: '焊接机器人工作站', capability: '自动化焊接' },
      { name: '数控焊接摆搭机', capability: '精密焊接' },
      { name: '油漆线', capability: '表面处理' },
    ],
  },
  {
    title: '检测资源',
    description: '试验台、检测记录与交付文件协同工作，让性能验证、过程记录和后续运维形成连续链路。',
    items: [{ name: '液压试验台', capability: '产品检测与系统验证' }],
  },
];

const industryMatrix: IndustryMatrix[] = [
  {
    title: '工程机械',
    description: '面向高冲击、高负载和现场连续作业场景，强调动力稳定、控制可靠与维护效率。',
    strength: '重载工况下的系统协同与量产一致性',
    cases: [
      '大型发泡产线液压及电控系统',
      '300T脱模机液压及电控系统',
      '多规格楼面布料机液压及电控系统',
    ],
    products: ['布料机液压站', '动臂塔机液压系统'],
  },
  {
    title: '船舶海洋',
    description: '围绕海上连续运行和环境适应性，要求系统兼顾高压大流量、耐久性与维护便利。',
    strength: '复杂环境下的大流量液压系统设计能力',
    cases: ['100米打桩船', '绞吸式挖泥船', '船用大型综合检测试验台'],
    products: ['高频液压振动打桩锤', '液压泵站'],
  },
  {
    title: '测试与验证平台',
    description: '针对风电、轨交和精密检测场景，强调测试可重复、数据可追溯与安全联锁完整。',
    strength: '试验台系统、控制逻辑与检测闭环能力',
    cases: ['轨道交通铰接器试验台', '风电联轴器压力测试系统', '空气制动阀密封件测试试验台'],
    products: ['试验检测设备', '组合阀组'],
  },
];

const topStats = [
  {
    label: '案例验证',
    value: `${String(caseCards.length).padStart(2, '0')}+`,
    description: '真实项目持续反向验证设计与交付方法',
  },
  {
    label: '产品沉淀',
    value: `${String(products.length).padStart(2, '0')}+`,
    description: '把解决方案逐步沉淀成可复用产品能力',
  },
  {
    label: '能力方向',
    value: `${String(categoryOptions.length).padStart(2, '0')}`,
    description: '工程机械与工业制造两大产品能力带',
  },
  {
    label: '工程经验',
    value: '10Y+',
    description: '资深液压与电气工程师的现场经验积累',
  },
];

export default function CapabilityPage() {
  return (
    <div className="bg-[#F5F2EC] text-[#0B0F16]">
      <section className="relative overflow-hidden bg-[#0B1F33] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,180,0,0.22),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(64,145,204,0.2),transparent_28%),linear-gradient(135deg,#091726_0%,#0B1F33_55%,#123453_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:34px_34px]" />

        <Container className="relative py-20 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] lg:items-center">
            <div>
              <MotionReveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white/80 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#F4B400]" />
                  CAPABILITY SYSTEM
                </div>
              </MotionReveal>

              <MotionReveal delay={0.05}>
                <h1 className="mt-6 max-w-5xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  技术实力不是单点能力堆叠
                  <span className="block bg-gradient-to-r from-[#F4B400] via-[#F8D36A] to-white bg-clip-text text-transparent">
                    而是把方案、制造、验证、交付做成一套系统
                  </span>
                </h1>
              </MotionReveal>

              <MotionReveal delay={0.1}>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
                  这里展示的不是抽象口号，而是湖南协力鸿胜把产品、案例、定制方案与服务支持串联起来的能力底座。页面会回答三个问题：我们能做什么、为什么做得稳、以及这种能力如何在具体行业里落地。
                </p>
              </MotionReveal>

              <MotionReveal delay={0.15}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/cases" variant="accent" className="justify-center">
                    查看案例验证
                  </ButtonLink>
                  <ButtonLink
                    href="/products"
                    variant="secondary"
                    className="justify-center border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10"
                  >
                    查看产品体系
                  </ButtonLink>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.2}>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {topStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/8 rounded-[24px] border border-white/10 p-5 backdrop-blur"
                    >
                      <div className="text-white/58 text-xs font-semibold uppercase tracking-[0.18em]">
                        {stat.label}
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
                      <p className="mt-3 text-sm leading-6 text-white/65">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </MotionReveal>
            </div>

            <MotionReveal delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white/8 overflow-hidden rounded-[30px] border border-white/10 shadow-[0_18px_48px_rgba(6,19,31,0.18)] backdrop-blur">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/images/about/system-integration.jpg"
                      alt="系统集成能力"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/85 via-[#0B1F33]/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                        System Integration
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-white">
                        方案不是拼装，而是整套协同
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="bg-white/8 overflow-hidden rounded-[30px] border border-white/10 shadow-[0_18px_48px_rgba(6,19,31,0.18)] backdrop-blur">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src="/images/about/simulation-lab.jpg"
                        alt="仿真与实验能力"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/80 via-[#0B1F33]/20 to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                          Simulation & Validation
                        </div>
                        <div className="mt-2 text-xl font-semibold text-white">
                          设计前移，验证前置
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[30px] border border-white/10 bg-[#0E2A44] p-6 text-white shadow-[0_18px_48px_rgba(6,19,31,0.18)]">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-[#F4B400]" />
                      能力的落点
                    </div>
                    <p className="text-white/72 mt-4 text-sm leading-7">
                      这套能力最终会落在三个结果上：复杂项目更容易定义清楚，系统方案更容易稳定落地，项目交付后更容易维护与升级。
                    </p>
                    <div className="mt-6 grid gap-2">
                      {['复杂工况可定义', '系统方案可验证', '长期运行可维护'].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="CAPABILITY MATRIX"
              title="技术实力的四条主线"
              description="这四条主线不是并列介绍，而是同一套项目系统里的不同层级。从定义问题，到完成方案，再到制造验证和长期交付，能力必须贯通。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilityDimensions.map((dimension, index) => {
              const Icon = dimension.icon;

              return (
                <MotionReveal key={dimension.title} delay={index * 0.05}>
                  <div className="hover:border-[#0B2A4A]/12 group h-full rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(15,23,42,0.10)]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="bg-[#F4B400]/12 flex h-12 w-12 items-center justify-center rounded-2xl text-[#9A6B00]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/35">
                        0{index + 1}
                      </div>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#0B0F16]">
                      {dimension.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{dimension.description}</p>
                    <div className="mt-6 grid gap-2">
                      {dimension.points.map((point) => (
                        <div
                          key={point}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                        >
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70 py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
            <MotionReveal>
              <div className="rounded-[32px] border border-[#0B2A4A]/10 bg-[#0D2236] p-7 text-white shadow-[0_20px_56px_rgba(11,31,51,0.22)]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  DELIVERY ENGINE
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
                  把能力转化成项目结果
                </h2>
                <p className="text-white/72 mt-4 text-sm leading-7">
                  技术实力页面不应该只是“我有什么设备、我有什么团队”，而应该说明这些资源如何在真实项目里形成成果。这也是它和产品页、案例页、服务页连接的地方。
                </p>
                <div className="mt-8 grid gap-3">
                  {[
                    '案例页负责证明能力已经被验证',
                    '产品页负责说明能力已经沉淀为体系',
                    '服务页负责说明能力可以持续陪跑项目',
                  ].map((item) => (
                    <div
                      key={item}
                      className="text-white/82 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </MotionReveal>

            <div className="grid gap-4 lg:grid-cols-3">
              {capabilityPhases.map((phase, index) => (
                <MotionReveal key={phase.step} delay={index * 0.06}>
                  <div className="h-full rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0B2A4A]/55">
                        Step {phase.step}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4B400]/15 text-[#9A6B00]">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#0B0F16]">
                      {phase.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{phase.summary}</p>
                    <div className="mt-6 grid gap-2">
                      {phase.outputs.map((output) => (
                        <div
                          key={output}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                        >
                          {output}
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="RESOURCE BASE"
              title="能力背后的资源底座"
              description="真正的新颖不是花哨，而是把制造、检测、工程经验和交付方法以更高级的结构展示出来。下面这些资源不是孤立陈列，而是支撑项目落地的底层能力。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_340px]">
            <div className="grid gap-6">
              {equipmentClusters.map((cluster, index) => (
                <MotionReveal key={cluster.title} delay={index * 0.06}>
                  <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/55">
                          {index === 0 ? 'Manufacturing Resources' : 'Validation Resources'}
                        </div>
                        <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B0F16]">
                          {cluster.title}
                        </h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4B400]/15 text-[#9A6B00]">
                        {index === 0 ? (
                          <Wrench className="h-5 w-5" />
                        ) : (
                          <TestTube className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                      {cluster.description}
                    </p>

                    <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {cluster.items.map((item) => (
                        <div
                          key={item.name}
                          className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                        >
                          <div className="text-base font-semibold text-[#0B0F16]">{item.name}</div>
                          <div className="mt-3 text-sm leading-7 text-slate-600">
                            {item.capability}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>

            <MotionReveal delay={0.1}>
              <div className="grid gap-4 xl:sticky xl:top-24">
                <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/images/about/engineer-team.jpg"
                      alt="工程团队"
                      fill
                      className="object-cover"
                    />
                    <div className="via-[#0B1625]/18 absolute inset-0 bg-gradient-to-t from-[#0B1625]/80 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                        Engineering Team
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-white">
                        项目经验决定方案上限
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#0B2A4A]">
                    <Gauge className="h-4 w-4 text-[#F4B400]" />
                    为什么这页重要
                  </div>
                  <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
                    <p>
                      它告诉客户，我们不是先卖产品，再补方案，而是先有系统能力，再沉淀产品与案例。
                    </p>
                    <p>
                      它也告诉项目团队，任何一个高标准项目，都需要设计、制造、验证与服务同步发力。
                    </p>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70 py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="INDUSTRY LINKAGE"
              title="能力如何映射到行业场景"
              description="案例和产品并不是分开的两张皮。技术实力真正成立，是因为这些能力已经在不同行业里被验证，也已经开始沉淀为产品与解决方案。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {industryMatrix.map((industry, index) => (
              <MotionReveal key={industry.title} delay={index * 0.05}>
                <div className="h-full rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/55">
                      Industry 0{index + 1}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4B400]/15 text-[#9A6B00]">
                      {index === 0 ? (
                        <Cog className="h-4 w-4" />
                      ) : index === 1 ? (
                        <Factory className="h-4 w-4" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#0B0F16]">
                    {industry.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{industry.description}</p>

                  <div className="mt-5 rounded-[24px] border border-[#0B2A4A]/10 bg-[#0B2A4A]/[0.03] p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/55">
                      核心强项
                    </div>
                    <div className="mt-2 text-base font-semibold text-[#0B2A4A]">
                      {industry.strength}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        代表案例
                      </div>
                      <div className="mt-3 grid gap-2">
                        {industry.cases.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        相关产品
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {industry.products.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#0B2A4A]/10 bg-[#0B2A4A]/[0.03] px-3 py-1.5 text-sm text-[#0B2A4A]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="overflow-hidden rounded-[36px] border border-[#0B2A4A]/10 bg-[#0D2236] text-white shadow-[0_20px_56px_rgba(11,31,51,0.22)]">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
              <div>
                <div className="text-white/58 text-xs font-semibold uppercase tracking-[0.2em]">
                  NEXT ACTION
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  如果项目要求更高，就先从能力对齐开始
                </h2>
                <p className="text-white/72 mt-4 max-w-3xl text-sm leading-8 sm:text-base">
                  你可以从案例页看验证结果，从产品页看沉淀形态，也可以直接带着工况、参数、动作要求来做方案评审。技术实力真正有价值，是它能缩短定义问题到形成可交付方案的路径。
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/contact" variant="accent" className="justify-center">
                    预约方案评审
                  </ButtonLink>
                  <ButtonLink
                    href="/service"
                    variant="secondary"
                    className="justify-center border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10"
                  >
                    查看服务支持
                  </ButtonLink>
                </div>
              </div>

              <div className="grid gap-3">
                {['复杂工况项目', '系统集成项目', '测试验证项目'].map((item) => (
                  <div
                    key={item}
                    className="text-white/82 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-center text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
