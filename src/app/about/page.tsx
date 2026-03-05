import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';
import AboutHero from '@/components/site/AboutHero';
import SectionDivider from '@/components/site/SectionDivider';
import { Target, Users, History } from 'lucide-react';

export const metadata = {
  title: '关于我们',
};

export default function AboutPage() {
  return (
    <div>
      <AboutHero />

      {/* <SectionDivider /> */}

      <section className="py-14 sm:py-20 bg-white dark:bg-white">
        <Container>
          <MotionReveal>
            <SectionHeading
              forceLight
              eyebrow="MISSION"
              title="使命与愿景"
              description="致力于以尖端技术为工业领域提供定制化的智能解决方案，助力中国装备制造。"
              icon={Target}
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <MotionReveal delay={0.06}>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-zinc-200/80 dark:bg-white">
                <div className="text-sm font-semibold text-[#0B0F16] dark:text-[#0B0F16]">企业定位</div>
                <div className="mt-4 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-700">
                  <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-50">高新技术企业</div>
                  <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-50">液压系统设计、研发与制造</div>
                  <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-50">智能液压与电控系统解决方案</div>
                  <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-50">成为行业领军企业</div>
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.12}>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-zinc-200/80 dark:bg-white">
                <div className="text-sm font-semibold text-[#0B0F16] dark:text-[#0B0F16]">核心价值观</div>
                <div className="mt-4 grid gap-3">
                  {[
                    { k: '客户至上', v: '以需求为起点，以交付质量为结果。' },
                    { k: '创新驱动', v: '以技术与方法持续提升系统能力。' },
                    { k: '质量为本', v: '以工艺与品控保障可靠性与一致性。' },
                    { k: '协作共赢', v: '与客户与伙伴共建长期价值。' },
                  ].map((i) => (
                    <div
                      key={i.k}
                      className="rounded-xl border border-zinc-200/70 bg-white/70 p-4 dark:border-zinc-200/70 dark:bg-white/70"
                    >
                      <div className="text-sm font-semibold text-[#0B0F16] dark:text-[#0B0F16]">{i.k}</div>
                      <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-700">{i.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-zinc-200/70 bg-white py-14 dark:border-zinc-200/70 dark:bg-white sm:py-20">
        <Container>
          <MotionReveal>
            <SectionHeading
              forceLight
              eyebrow="TEAM"
              title="团队与方法"
              description="专业液压系统与电气控制集成设计团队，结合仿真验证与模块化设计，实现面向工况的深度定制。"
              icon={Users}
            />
          </MotionReveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: '系统集成能力',
                desc: '机、电、液一体化传动控制系统设计与交付，强调可靠性与可维护性。',
                image: '/images/about/system-integration.jpg',
              },
              {
                title: '资深工程师团队',
                desc: '多名10年以上现场经验的高级液压工程师与资深电气工程师。',
                image: '/images/about/engineer-team.jpg',
              },
              {
                title: '仿真与模块化',
                desc: '全比例仿真验证 + 模块化设计方法，提高一致性与交付效率。',
                image: '/images/about/simulation-lab.jpg',
              },
            ].map((c, idx) => (
              <MotionReveal key={c.title} delay={idx * 0.06}>
                <div className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-200/80 dark:bg-white">
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-100">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-lg font-semibold text-[#0B0F16] dark:text-[#0B0F16]">{c.title}</div>
                    <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-700">{c.desc}</div>
                    <div className="mt-6 h-[2px] w-10 rounded-full bg-[#F4B400]" />
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20 bg-white dark:bg-white">
        <Container>
          <MotionReveal>
            <SectionHeading 
              forceLight
              eyebrow="MILESTONES" 
              title="发展历程" 
              description="以系统能力建设为主线，持续投入研发与制造能力。" 
              icon={History}
            />
          </MotionReveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {[
              { year: '2023', title: '公司成立', desc: '总部落地长沙，组建液压与电控系统集成团队。' },
              { year: '至今', title: '能力扩展', desc: '完善设备与制造能力，覆盖多行业系统交付与试验检测平台。' },
            ].map((m, idx) => (
              <MotionReveal key={m.year} delay={idx * 0.06}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-zinc-200/80 dark:bg-white">
                  <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-[#0B2A4A]/70">{m.year}</div>
                  <div className="mt-3 text-lg font-semibold text-[#0B0F16] dark:text-[#0B0F16]">{m.title}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-700">{m.desc}</div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-10">
            <ButtonLink href="/products" variant="secondary">
              查看产品体系
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
