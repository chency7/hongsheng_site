import React from 'react';
import Container from '@/components/site/Container';
import ButtonLink from '@/components/site/ButtonLink';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/site/Hero';

type Industry = {
  title: string;
  description: string;
};

type CaseItem = {
  industry: string;
  projects: string[];
};

export default function HomePage() {
  const industries: Industry[] = [
    { title: '轨道交通', description: '铰接器试验、车辆液压系统与测试平台。' },
    { title: '工程机械', description: '起重机、塔吊、建筑机械液压与电控系统。' },
    { title: '船舶海洋', description: '打桩船、挖泥船等船用液压系统。' },
    { title: '风力发电', description: '联轴器压力/疲劳测试与风电系统测试。' },
    { title: '航空航天', description: '制动系统测试与精密液压控制。' },
    { title: '工业制造', description: '发泡产线与自动化设备系统集成。' },
  ];

  const caseItems: CaseItem[] = [
    { industry: '船舶海洋', projects: ['100米打桩船', '绞吸式挖泥船', '船用大型综合检测试验台'] },
    {
      industry: '工程机械',
      projects: [
        '大型发泡产线液压及电控系统',
        '起重机吊臂产线液压站',
        '300T脱模机液压及电控系统',
        '多规格楼面布料机系统',
      ],
    },
    { industry: '轨道交通', projects: ['轨道交通铰接器试验台'] },
    { industry: '风力发电', projects: ['风电联轴器压力测试系统', '风电联轴器疲劳测试系统'] },
    { industry: '航空航天/其他', projects: ['空气制动阀密封件测试试验台'] },
  ];

  return (
    <div>
      <Hero />

      <section className="border-b border-zinc-200/70 py-14 dark:border-white/10 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <MotionReveal>
                <SectionHeading
                  eyebrow="MANUFACTURING"
                  title="现代化生产与检测能力"
                  description="以精密加工、自动化焊接与试验检测为基础，结合精益管理与工艺优化，保障交付一致性并降低运维成本。"
                />
              </MotionReveal>
              <MotionReveal delay={0.08}>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    '数控设备（CNC）与加工中心',
                    '大型深孔镗床与焊接机器人',
                    '油漆线表面处理',
                    '液压试验台检测与记录',
                  ].map((t) => (
                    <div
                      key={t}
                      className="rounded-xl border border-zinc-200/80 bg-white px-5 py-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-black/30 dark:text-zinc-200"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </MotionReveal>
              <MotionReveal delay={0.14}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ButtonLink href="/capability" variant="secondary">
                    查看设备与品控
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="accent">
                    获取方案评审
                  </ButtonLink>
                </div>
              </MotionReveal>
            </div>

            <div className="lg:col-span-6">
              <MotionReveal delay={0.06}>
                <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 dark:border-white/10 dark:bg-black/30">
                  <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_30%_10%,rgba(244,180,0,0.18),transparent_60%)]" />
                  <div className="relative aspect-[16/10]">
                    <Image
                      src="/images/hs/factory.svg"
                      alt="厂房与车间占位图"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </MotionReveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="INDUSTRIES"
              title="六大核心应用领域"
              description="覆盖轨道交通、工程机械、船舶海洋、风力发电、航空航天与工业制造等关键行业，输出可验证的系统能力与交付质量。"
            />
          </MotionReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((item, idx) => (
              <MotionReveal key={item.title} delay={idx * 0.04}>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black/30 dark:hover:bg-white/5">
                  <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                    {item.title}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {item.description}
                  </div>
                  <div className="mt-5 h-[2px] w-10 rounded-full bg-[#F4B400]" />
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
              eyebrow="PRODUCTS"
              title="产品体系与系统交付"
              description="液压泵站系列与试验检测设备系列为核心产品线，同时提供面向工况的定制化解决方案与全流程服务。"
            />
          </MotionReveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <MotionReveal delay={0.06} className="lg:col-span-2">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                <div className="relative mb-6 overflow-hidden rounded-xl border border-zinc-200/70 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
                  <div className="relative aspect-[16/7]">
                    <Image
                      src="/images/hs/hydraulic.svg"
                      alt="液压泵站占位图"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                  液压泵站系列
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                  覆盖标准型、定制型、带冷却系统与批量产线液压站，以及塔式起重机配套液压站等，强调机电液集成、节能与可靠性。
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {[
                    '塔式起重机配套液压站',
                    '标准型/定制型液压站',
                    '带冷却系统液压站',
                    '批量生产线液压站',
                  ].map((t) => (
                    <div
                      key={t}
                      className="rounded-lg border border-zinc-200/70 bg-white/70 px-4 py-3 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div className="mt-7">
                  <ButtonLink href="/products" variant="secondary">
                    查看产品中心
                  </ButtonLink>
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.12}>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                <div className="relative mb-6 overflow-hidden rounded-xl border border-zinc-200/70 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src="/images/hs/testing.svg"
                      alt="试验检测设备占位图"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                  试验检测设备系列
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                  从比例阀测试试验台到全自动操作台与机器人动力源，帮助客户将性能、耐久与一致性转化为可量化、可追溯的指标。
                </p>
                <div className="mt-6 grid gap-2">
                  {['座椅疲劳试验台', '比例阀测试试验台', '全自动操作台', '伺服机器人动力源'].map(
                    (t) => (
                      <div
                        key={t}
                        className="rounded-lg border border-zinc-200/70 bg-white/70 px-4 py-3 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                      >
                        {t}
                      </div>
                    )
                  )}
                </div>
                <div className="mt-7">
                  <ButtonLink href="/solutions" variant="accent">
                    获取试验台方案
                  </ButtonLink>
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
              eyebrow="CASES"
              title="工程案例（按行业）"
              description="系统能力通过行业项目持续验证：从船舶海洋、工程机械到风电与轨交测试平台，关注复杂工况下的稳定性与可维护性。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {caseItems.map((c, idx) => (
              <MotionReveal key={c.industry} delay={idx * 0.05}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-white/10 dark:bg-black/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                      {c.industry}
                    </div>
                    <div className="h-[2px] w-10 rounded-full bg-[#F4B400]" />
                  </div>
                  <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200/70 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
                    <div className="relative aspect-[16/7]">
                      <Image
                        src="/images/hs/cases.svg"
                        alt="工程案例占位图"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {c.projects.map((p) => (
                      <li key={p} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal delay={0.1}>
            <div className="mt-10">
              <ButtonLink href="/cases" variant="secondary">
                查看全部案例
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="border-t border-zinc-200/70 bg-zinc-50 py-14 dark:border-white/10 dark:bg-white/5 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="SERVICE"
              title="一站式服务流程"
              description="从需求分析到运维支持，三步闭环交付，确保系统性能、可靠性与长期可用性。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { title: '创新设计', desc: '需求分析→方案设计→仿真验证→定制化解决方案' },
              { title: '精益制造', desc: '工艺优化→精密加工→严格品控→高性能交付' },
              { title: '用心服务', desc: '24小时响应→预防性维护→系统升级→全生命周期管理' },
            ].map((s, idx) => (
              <MotionReveal key={s.title} delay={idx * 0.06}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="relative mb-6 overflow-hidden rounded-xl border border-zinc-200/70 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src="/images/hs/service.svg"
                        alt="服务流程占位图"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">
                    STEP {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-[#0B0F16] dark:text-white">
                    {s.title}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {s.desc}
                  </div>
                  <div className="mt-6 h-[2px] w-10 rounded-full bg-[#F4B400]" />
                </div>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal delay={0.12}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/service" variant="secondary">
                查看服务支持
              </ButtonLink>
              <ButtonLink href="/contact" variant="accent">
                提交需求
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>
    </div>
  );
}
