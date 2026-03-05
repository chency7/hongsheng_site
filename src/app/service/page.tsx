import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';

export const metadata = {
  title: '服务支持',
};

type ServiceStep = {
  title: string;
  description: string;
  items: string[];
};

export default function ServicePage() {
  const steps: ServiceStep[] = [
    {
      title: '创新设计',
      description: '以需求与工况为边界，形成可评审方案并进行仿真验证。',
      items: ['需求分析', '方案设计', '仿真验证', '定制化解决方案'],
    },
    {
      title: '精益制造',
      description: '以工艺与检测保障交付质量，强调一致性与可维护性。',
      items: ['工艺优化', '精密加工', '严格品控', '高性能交付'],
    },
    {
      title: '用心服务',
      description: '以全生命周期为导向，提供快速响应与持续优化支持。',
      items: ['24小时响应', '预防性维护', '系统升级', '全周期管理'],
    },
  ];

  const promises: string[] = [
    '24小时专业售后团队全天候响应',
    '故障快速处理与建议',
    '预防性维护服务与计划建议',
    '系统升级支持与持续优化',
    '全生命周期管理方案',
    '延长设备寿命，优化运维成本',
  ];

  const faqs: { q: string; a: string }[] = [
    { q: '从提出需求到方案输出需要哪些信息？', a: '建议提供工况描述、接口与安装约束、目标指标与使用环境等；我们将以此进行方案评审与选型建议。' },
    { q: '交付时包含哪些文件或资料？', a: '按项目范围提供方案与关键选型、检测与验收支持资料，以及必要的使用维护建议与培训支持。' },
    { q: '售后响应与维护方式如何？', a: '提供24小时响应，并支持预防性维护建议、系统升级与全生命周期管理。' },
    { q: '是否支持系统升级与改造？', a: '支持在原有系统基础上进行优化与升级，具体范围以现场条件与目标指标评审为准。' },
  ];

  return (
    <div>
      <section className="border-b border-blue-100 bg-blue-50 py-12 dark:border-white/10 dark:bg-white/5 sm:py-16">
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-blue-600/70 dark:text-white/60">SERVICE</div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-blue-950 dark:text-white sm:text-4xl">
              一站式服务支持
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-900/80 dark:text-zinc-300">
              从需求分析、方案设计到制造交付与运维支持，全流程协同，聚焦可靠性、可维护性与长期可用性。
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-blue-200/80 bg-white dark:border-white/10 dark:bg-black/30 shadow-sm">
              <div className="relative aspect-[16/8]">
                <Image src="/images/hs/service.svg" alt="服务主视觉占位图" fill className="object-cover" />
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="accent" className="bg-[#0B2A4A] text-white hover:bg-[#1a3f66] border-transparent shadow-md hover:shadow-lg">
                提交售后/需求
              </ButtonLink>
              <ButtonLink href="/cases" variant="secondary" className="bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300">
                查看案例
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20 bg-white">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="PROCESS"
              title="服务流程三步走"
              description="以可评审、可追溯为原则组织流程，降低不确定性，提升交付一致性。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {steps.map((s, idx) => (
              <MotionReveal key={s.title} delay={idx * 0.06}>
                <div className="group rounded-2xl border border-zinc-100 bg-white p-7 shadow-sm transition-all hover:border-blue-100 hover:shadow-lg dark:border-white/10 dark:bg-black/30">
                  <div className="text-xs font-semibold tracking-[0.18em] text-blue-600/70 group-hover:text-blue-600 transition-colors dark:text-white/60">
                    STEP {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-zinc-900 group-hover:text-blue-900 transition-colors dark:text-white">{s.title}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{s.description}</div>
                  <div className="mt-5 grid gap-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {s.items.map((it) => (
                      <div key={it} className="rounded-lg bg-zinc-50 px-3 py-2 text-zinc-700 group-hover:bg-blue-50 group-hover:text-blue-900 transition-colors dark:bg-white/5 dark:text-zinc-300">
                        {it}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 h-[2px] w-10 rounded-full bg-[#F4B400] group-hover:w-full transition-all duration-500" />
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-zinc-100 bg-zinc-50 py-14 dark:border-white/10 dark:bg-white/5 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading eyebrow="PROMISE" title="服务承诺" description="以快速响应与预防性维护为基础，支持系统升级与全生命周期管理。"/>
          </MotionReveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promises.map((p, idx) => (
              <MotionReveal key={p} delay={idx * 0.03}>
                <div className="group rounded-2xl border border-white bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg dark:border-white/10 dark:bg-black/30">
                  <div className="text-sm leading-7 text-zinc-700 font-medium group-hover:text-blue-900 transition-colors dark:text-zinc-300">{p}</div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20 bg-white">
        <Container>
          <MotionReveal>
            <SectionHeading eyebrow="FAQ" title="常见问题" description="如需更详细的交付范围与验收标准，可在提交需求后进行方案评审对齐。"/>
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map((f, idx) => (
              <MotionReveal key={f.q} delay={idx * 0.05}>
                <div className="group rounded-2xl border border-zinc-100 bg-white p-7 transition-all hover:border-blue-200 hover:shadow-lg dark:border-white/10 dark:bg-black/30">
                  <div className="text-sm font-semibold text-zinc-900 group-hover:text-blue-900 transition-colors dark:text-white">{f.q}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{f.a}</div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <ButtonLink href="/contact" variant="accent" className="bg-[#0B2A4A] text-white hover:bg-[#1a3f66] border-transparent shadow-md hover:shadow-lg px-8 py-3">
              立即联系
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
