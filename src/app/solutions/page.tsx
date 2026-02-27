import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';

export const metadata = {
  title: '定制方案',
};

type SolutionPillar = {
  title: string;
  description: string;
  items: string[];
};

type IndustrySolution = {
  title: string;
  description: string;
  examples: string[];
};

export default function SolutionsPage() {
  const pillars: SolutionPillar[] = [
    {
      title: '需求分析与工况建模',
      description: '以工况与约束为边界，明确目标指标与风险点，形成可评审的输入。',
      items: ['需求澄清与边界确认', '关键负载与工况拆解', '接口/安装/环境约束整理'],
    },
    {
      title: '方案设计与仿真验证',
      description: '以系统方案为核心，结合仿真与模块化设计，提升可靠性与一致性。',
      items: ['系统原理与关键器件选型', '控制策略与安全保护设计', '仿真验证与迭代优化'],
    },
    {
      title: '精益制造与严格品控',
      description: '以工艺与检测保障交付质量，降低运维成本并提升长期可用性。',
      items: ['精密加工与装配一致性', '试验台检测与记录', '交付文件与验收支持'],
    },
    {
      title: '运维支持与系统升级',
      description: '以全生命周期为导向，支持预防性维护、故障响应与持续优化。',
      items: ['24小时售后响应', '预防性维护建议', '系统升级与性能优化'],
    },
  ];

  const industries: IndustrySolution[] = [
    {
      title: '工程机械',
      description: '面向起重、建筑机械等高冲击与高负载工况，强调稳定动力与控制可靠性。',
      examples: ['起重机与塔吊系统', '楼面布料机系统', '重载脱模液压与电控系统'],
    },
    {
      title: '船舶海洋',
      description: '面向海上作业与连续运行工况，关注耐久、环境适应性与维护便利。',
      examples: ['打桩船液压系统', '挖泥船液压系统', '船用综合检测试验台'],
    },
    {
      title: '风力发电',
      description: '面向测试与可靠性验证需求，输出可追溯的测试数据与报告体系。',
      examples: ['联轴器压力测试系统', '联轴器疲劳测试系统'],
    },
    {
      title: '轨道交通',
      description: '面向关键部件测试与一致性验证，强调可重复、可量化与安全联锁。',
      examples: ['轨道交通铰接器试验台'],
    },
    {
      title: '航空航天/其他',
      description: '面向高要求测试场景与精密控制，强调流程可追溯与稳定交付。',
      examples: ['空气制动阀密封件测试试验台'],
    },
    {
      title: '工业制造',
      description: '面向产线节拍与一致性要求，强调系统集成、交付效率与运维成本控制。',
      examples: ['大型发泡产线液压及电控系统', '产线液压站批量交付'],
    },
  ];

  const deliverables: { title: string; items: string[] }[] = [
    {
      title: '方案交付清单',
      items: ['需求与工况确认记录', '系统方案与关键器件选型', '原理图/电气图（按项目）', '仿真验证结论（按项目）', '检测与验收支持'],
    },
    {
      title: '运维交付清单',
      items: ['使用与维护建议', '预防性维护计划建议', '备件与易损件建议', '升级路径与优化建议（可选）'],
    },
  ];

  return (
    <div>
      <section className="border-b border-zinc-200/70 bg-zinc-50 py-12 dark:border-white/10 dark:bg-white/5 sm:py-16">
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">SOLUTIONS</div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B0F16] dark:text-white sm:text-4xl">
              需求导向的深度定制
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              我们以工况与约束为边界，构建系统方案并通过仿真验证与严格品控实现稳定交付，为复杂场景提供可靠的动力与控制支持。
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/8]">
                <Image src="/images/hs/hero.svg" alt="定制方案主视觉占位图" fill className="object-cover" />
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="accent">
                预约方案评审
              </ButtonLink>
              <ButtonLink href="/cases" variant="secondary">
                查看案例验证
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="PROCESS"
              title="方案方法与交付闭环"
              description="从需求、设计、制造到运维支持的全流程服务，减少不确定性，提高可靠性与交付效率。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {pillars.map((p, idx) => (
              <MotionReveal key={p.title} delay={idx * 0.05}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">{p.title}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{p.description}</div>
                  <ul className="mt-5 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:grid-cols-3">
                    {p.items.map((i) => (
                      <li key={i} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
                        {i}
                      </li>
                    ))}
                  </ul>
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
              eyebrow="INDUSTRIES"
              title="按行业的解决方案"
              description="覆盖关键行业与工况场景，形成可复用的系统能力与交付经验。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i, idx) => (
              <MotionReveal key={i.title} delay={idx * 0.04}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black/30 dark:hover:bg-white/5">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">{i.title}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{i.description}</div>
                  <div className="mt-5 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {i.examples.map((e) => (
                      <div key={e} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
                        {e}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 h-[2px] w-10 rounded-full bg-[#F4B400]" />
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading eyebrow="DELIVERABLES" title="交付内容（可对齐验收）" description="以可评审与可追溯为原则组织交付物，便于项目协作与后续维护。"/>
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {deliverables.map((d, idx) => (
              <MotionReveal key={d.title} delay={idx * 0.06}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">{d.title}</div>
                  <ul className="mt-4 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {d.items.map((it) => (
                      <li key={it} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-10">
            <ButtonLink href="/contact" variant="accent">
              提交需求与参数
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
