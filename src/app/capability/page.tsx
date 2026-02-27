import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';

export const metadata = {
  title: '技术实力',
};

type EquipmentItem = {
  name: string;
  capability: string;
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

  return (
    <div>
      <section className="border-b border-zinc-200/70 bg-zinc-50 py-12 dark:border-white/10 dark:bg-white/5 sm:py-16">
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">CAPABILITY</div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B0F16] dark:text-white sm:text-4xl">
              技术实力
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              以系统设计、仿真验证、精益制造与检测能力为基础，构建从方案到交付的能力闭环，为复杂工况提供稳定可靠的系统支持。
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/8]">
                <Image src="/images/hs/cnc.svg" alt="设备与加工占位图" fill className="object-cover" />
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="accent">
                预约技术沟通
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
                  <div className="grid gap-2 p-6 sm:grid-cols-12 sm:items-center">
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

          <div className="mt-10">
            <ButtonLink href="/service" variant="secondary">
              查看服务支持
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
