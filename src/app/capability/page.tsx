import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';
import { Cpu, Wrench, TestTube, Cog } from 'lucide-react';

export const metadata = {
  title: '技术实力与定制方案',
};

type EquipmentItem = {
  name: string;
  capability: string;
};

type SolutionPillar = {
  title: string;
  description: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
};

type IndustrySolution = {
  title: string;
  description: string;
  examples: string[];
};

export default function CapabilityPage() {
  const equipment: EquipmentItem[] = [
    { name: '数控设备（CNC）', capability: '精密加工' },
    { name: '4.5米长加工中心（PRATIC）', capability: '大型工件加工' },
    { name: '数控高速加工中心', capability: '高效精密加工' },
    { name: '大型深孔镗床', capability: '深孔加工' },
    { name: '焊接机器人工作站', capability: '自动化焊接' },
    { name: '数控焊接摆搭机', capability: '精密焊接' },
    { name: '油漆线', capability: '表面处理' },
    { name: '液压试验台', capability: '产品检测' },
  ];

  const strengths: { title: string; description: string }[] = [
    { title: '系统集成团队', description: '专业的液压系统与电气控制集成设计团队，面向系统级方案交付。' },
    { title: '现场经验沉淀', description: '多名10年以上现场经验的资深高级液压工程师与资深电气工程师团队。' },
    { title: '仿真与模块化', description: '全比例仿真与模块化设计方法，提高可靠性、效率与交付一致性。' },
    { title: '精益制造理念', description: '全流程精益管理、工艺优化与零缺陷品控，降低运维成本并提升竞争力。' },
  ];

  const pillars: SolutionPillar[] = [
    {
      title: '需求分析与工况建模',
      description: '以工况与约束为边界，明确目标指标与风险点，形成可评审的输入。',
      items: ['需求澄清与边界确认', '关键负载与工况拆解', '接口/安装/环境约束整理'],
      icon: Cpu,
    },
    {
      title: '方案设计与仿真验证',
      description: '以系统方案为核心，结合仿真与模块化设计，提升可靠性与一致性。',
      items: ['系统原理与关键器件选型', '控制策略与安全保护设计', '仿真验证与迭代优化'],
      icon: Cog,
    },
    {
      title: '精益制造与严格品控',
      description: '以工艺与检测保障交付质量，降低运维成本并提升长期可用性。',
      items: ['精密加工与装配一致性', '试验台检测与记录', '交付文件与验收支持'],
      icon: Wrench,
    },
    {
      title: '运维支持与系统升级',
      description: '以全生命周期为导向，支持预防性维护、故障响应与持续优化。',
      items: ['24小时售后响应', '预防性维护建议', '系统升级与性能优化'],
      icon: TestTube,
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

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-zinc-200/70 bg-zinc-50 py-12 dark:border-white/10 dark:bg-white/5 sm:py-16">
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">
              CAPABILITY & SOLUTIONS
            </div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B0F16] dark:text-white sm:text-4xl">
              技术实力与定制方案
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              以系统设计、仿真验证、精益制造与检测能力为基础，构建从需求分析到交付运维的完整闭环，为复杂工况提供稳定可靠的定制化系统支持。
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/8]">
                <Image src="/images/hs/cnc.svg" alt="技术实力与定制方案" fill className="object-cover" />
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

      {/* Core Strengths */}
      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="STRENGTHS"
              title="核心优势"
              description="围绕系统级交付能力建设，从团队、方法、制造与品控等维度提升可验证的交付质量。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {strengths.map((s, idx) => (
              <MotionReveal key={s.title} delay={idx * 0.05}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">{s.title}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{s.description}</div>
                  <div className="mt-6 h-[2px] w-10 rounded-full bg-[#F4B400]" />
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Solution Process */}
      <section className="border-y border-zinc-200/70 bg-zinc-50 py-14 dark:border-white/10 dark:bg-white/5 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="PROCESS"
              title="定制方案流程"
              description="从需求、设计、制造到运维支持的全流程服务，减少不确定性，提高可靠性与交付效率。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <MotionReveal key={p.title} delay={idx * 0.05}>
                  <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#F4B400]/10 p-2">
                        <Icon className="h-5 w-5 text-[#F4B400]" />
                      </div>
                      <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">{p.title}</div>
                    </div>
                    <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{p.description}</div>
                    <div className="mt-5 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                      {p.items.map((i) => (
                        <div key={i} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
                          {i}
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

      {/* Industry Solutions */}
      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="INDUSTRIES"
              title="行业解决方案"
              description="覆盖关键行业与工况场景，形成可复用的系统能力与交付经验。"
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i, idx) => (
              <MotionReveal key={i.title} delay={idx * 0.04}>
                <div className="group rounded-2xl border border-zinc-200/80 bg-white p-7 transition-all hover:border-[#F4B400]/30 hover:shadow-md dark:border-white/10 dark:bg-black/30 dark:hover:border-[#F4B400]/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">{i.title}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{i.description}</div>
                  <div className="mt-5 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {i.examples.map((e) => (
                      <div key={e} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
                        {e}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 h-[2px] w-10 rounded-full bg-[#F4B400] transition-all group-hover:w-16" />
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Equipment */}
      <section className="border-y border-zinc-200/70 bg-zinc-50 py-14 dark:border-white/10 dark:bg-white/5 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="EQUIPMENT"
              title="生产与检测设备"
              description="以精密加工、自动化焊接与试验检测能力为基础，保障制造一致性与交付质量。"
            />
          </MotionReveal>

          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
            <div className="grid grid-cols-1 divide-y divide-zinc-200/70 dark:divide-white/10">
              {equipment.map((e, idx) => (
                <MotionReveal key={e.name} delay={idx * 0.02}>
                  <div className="grid gap-2 p-6 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5 sm:grid-cols-12 sm:items-center">
                    <div className="sm:col-span-7">
                      <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">{e.name}</div>
                    </div>
                    <div className="sm:col-span-5">
                      <div className="text-sm text-zinc-700 dark:text-zinc-300">{e.capability}</div>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Quality Control */}
      <section className="py-14 sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              eyebrow="QUALITY"
              title="制造理念与质量控制"
              description="全流程精益管理与工艺优化，配合严格检测与记录，降低运维成本并提升产品竞争力。"
            />
          </MotionReveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { title: '精益管理', desc: '从流程到现场，关注效率与一致性，降低交付波动。' },
              { title: '工艺优化', desc: '针对关键工序持续优化，提升可靠性与可维护性。' },
              { title: '零缺陷品控', desc: '以检测与记录为抓手，形成可追溯的质量闭环。' },
            ].map((i, idx) => (
              <MotionReveal key={i.title} delay={idx * 0.06}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">{i.title}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{i.desc}</div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/contact" variant="accent">
              提交需求与参数
            </ButtonLink>
            <ButtonLink href="/service" variant="secondary">
              查看服务支持
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
