import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';

export const metadata = {
  title: '产品中心',
};

type ProductItem = {
  title: string;
  description: string;
  highlights: string[];
};

export default function ProductsPage() {
  const pumpStations: ProductItem[] = [
    {
      title: '塔式起重机配套液压站',
      description: '面向塔式起重机工况的系统级液压站方案，支持定制外观与安装接口。',
      highlights: ['定制化结构与接口', '稳定输出与可靠保护', '适配复杂工况连续运行'],
    },
    {
      title: '标准型液压站',
      description: '覆盖常见工况的标准化液压站配置，交付效率高，维护成本可控。',
      highlights: ['标准化配置', '交付效率高', '维护友好'],
    },
    {
      title: '定制型液压站',
      description: '以需求为起点进行系统级设计，可按压力、流量、控制与安装条件定制。',
      highlights: ['需求导向方案设计', '模块化组合', '可扩展控制接口'],
    },
    {
      title: '带冷却系统液压站',
      description: '针对热负载与温升要求的工况，提供冷却与温控方案，保障长期稳定。',
      highlights: ['温升控制', '长时稳定运行', '适配多种冷却方式'],
    },
    {
      title: '批量生产线液压站',
      description: '面向产线一致性与节拍要求，强调工艺与品控，支持批量交付与维护体系。',
      highlights: ['一致性与可追溯', '精益制造', '降低运维成本'],
    },
  ];

  const testEquipment: ProductItem[] = [
    {
      title: '座椅疲劳试验台',
      description: '用于座椅耐久性与疲劳寿命测试，支持可编程工况与数据采集。',
      highlights: ['工况可编程', '数据采集与报告', '重复性与一致性'],
    },
    {
      title: '比例阀测试试验台',
      description: '用于液压阀性能检测与标定，支持曲线输出与关键指标评估。',
      highlights: ['性能检测与标定', '曲线输出', '可追溯测试流程'],
    },
    {
      title: '全自动操作台',
      description: '用于系统控制操作与测试联动，强调安全联锁与可靠交互。',
      highlights: ['可靠控制逻辑', '安全联锁', '人机交互友好'],
    },
    {
      title: '伺服机器人动力源',
      description: '为机器人系统提供稳定动力供应，支持长时间运行与关键参数监控。',
      highlights: ['稳定动力输出', '长时运行支持', '状态监控与保护'],
    },
  ];

  const parameterFields: { label: string; description: string }[] = [
    { label: '压力范围', description: '按工况需求给出目标与裕量。' },
    { label: '流量范围', description: '结合执行机构与节拍确定。' },
    { label: '油箱容积', description: '依据散热与维护要求配置。' },
    { label: '冷却方式', description: '风冷/水冷/按现场条件选配。' },
    { label: '过滤精度', description: '结合可靠性与寿命目标确定。' },
    { label: '电机功率', description: '按负载与效率目标匹配。' },
    { label: '控制方式', description: '继电器/PLC/电控系统集成等。' },
    { label: '环境温度', description: '影响油液与温控方案选型。' },
    { label: '油液类型', description: '按标准与现场要求确定。' },
    { label: '接口标准', description: '安装尺寸与管路接口约束。' },
    { label: '噪声要求', description: '按现场标准与要求控制。' },
  ];

  return (
    <div>
      <section className="border-b border-zinc-200/70 bg-zinc-50 py-12 dark:border-white/10 dark:bg-white/5 sm:py-16">
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">
              PRODUCTS
            </div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B0F16] dark:text-white sm:text-4xl">
              产品中心
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              以液压泵站系列与试验检测设备系列为核心产品线，结合系统集成与仿真验证能力，输出可落地的定制化解决方案与交付质量。
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/8]">
                <Image
                  src="/images/hs/hydraulic.svg"
                  alt="产品主视觉占位图"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="accent">
                提交需求与参数
              </ButtonLink>
              <ButtonLink href="/solutions" variant="secondary">
                查看定制方案
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="HYDRAULIC POWER UNITS"
              title="液压泵站系列"
              description="覆盖标准型、定制型与产线批量交付等多类形态，强调机电液集成、节能与可靠性。"
            />
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/7]">
                <Image
                  src="/images/hs/hydraulic.svg"
                  alt="液压泵站占位图"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </MotionReveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {pumpStations.map((p, idx) => (
              <MotionReveal key={p.title} delay={idx * 0.05}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">
                    {p.title}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {p.description}
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    {p.highlights.map((h) => (
                      <div
                        key={h}
                        className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-white/5 dark:text-zinc-200"
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

      <section className="border-y border-zinc-200/70 bg-zinc-50 py-14 dark:border-white/10 dark:bg-white/5 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="TESTING & VALIDATION"
              title="试验检测设备系列"
              description="将性能、耐久与一致性转化为可量化、可追溯的指标，支持测试工况设计、数据采集与报告输出。"
            />
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/images/hs/testing.svg"
                  alt="试验检测设备占位图"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </MotionReveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {testEquipment.map((p, idx) => (
              <MotionReveal key={p.title} delay={idx * 0.05}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">
                    {p.title}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {p.description}
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    {p.highlights.map((h) => (
                      <div
                        key={h}
                        className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-white/5 dark:text-zinc-200"
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

      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="PARAMETERS"
              title="选型与参数字段（提交即可评审）"
              description="不预设固定数值，以工况与约束为依据进行方案评审与选型建议。"
            />
          </MotionReveal>

          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
            <div className="grid grid-cols-1 divide-y divide-zinc-200/70 dark:divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {parameterFields.map((f) => (
                <div key={f.label} className="p-6">
                  <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                    {f.label}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {f.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <ButtonLink href="/contact" variant="accent">
              立即提交需求
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
