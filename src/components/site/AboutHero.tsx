'use client';

import React from 'react';
import Image from 'next/image';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import { Calendar, Coins, Package, Award } from 'lucide-react';

export default function AboutHero() {
  const stats = [
    { value: '2023', label: '公司始建于', suffix: '年', icon: Calendar },
    { value: '5', label: '总投资', suffix: '亿元', icon: Coins },
    { value: '15', label: '年产量', suffix: '万件', icon: Package },
    { value: '31', label: '公司已获专利', suffix: '项', icon: Award },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-12 dark:bg-black sm:py-16 lg:py-24">
      {/* Background decoration */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-zinc-50/50 blur-3xl dark:bg-zinc-900/20" />
      </div>

      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Content */}
          <div className="relative z-10 lg:col-span-4">
            <MotionReveal>
              <div className="mb-4 text-sm font-bold uppercase tracking-widest text-red-600">
                About Us
              </div>
            </MotionReveal>
            
            <MotionReveal delay={0.1}>
              <h1 className="font-display text-4xl font-bold tracking-tight text-[#0B0F16] dark:text-white sm:text-5xl lg:text-6xl">
                湖南协力鸿胜
                <span className="block text-xl font-normal text-zinc-500 sm:text-2xl mt-1">
                  HUNAN XIELI HONGSHENG
                </span>
              </h1>
            </MotionReveal>

            <MotionReveal delay={0.2}>
              <div className="mt-6 h-1 w-20 bg-red-600" />
            </MotionReveal>

            <MotionReveal delay={0.3}>
              <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                <p>
                  <strong className="text-[#0B0F16] dark:text-white font-semibold">数字化液压技术的先行者。</strong>
                  湖南协力鸿胜机械有限公司立足长沙，是一家专注于高端装备核心零部件研发与制造的高新技术企业。我们致力于将传统液压技术与现代数字控制深度融合，重新定义流体动力传输的精度与效率。
                </p>
                <p>
                  <strong className="text-[#0B0F16] dark:text-white font-semibold">从制造到智造的跨越。</strong>
                  公司依托总投资5亿元的现代化生产基地，构建了全流程数字化的研发与制造体系。我们不仅仅是液压油缸与系统的制造商，更是复杂工况下智能流体控制方案的提供商。产品广泛应用于工程机械、海工装备、能源设施等关键领域，以卓越的稳定性与智能化的交互体验，赋予机械装备更强大的“心脏”。
                </p>
                <p>
                  长期以来，我们与 <strong className="font-bold text-[#0B0F16] dark:text-white">三一重工</strong>、
                  <strong className="font-bold text-[#0B0F16] dark:text-white">中联重科</strong>、
                  <strong className="font-bold text-[#0B0F16] dark:text-white">徐工集团</strong> 及 <strong className="font-bold text-[#0B0F16] dark:text-white">中国中车</strong> 等行业领军企业保持紧密协作，
                  在数字化液压、伺服控制与系统集成领域持续突破，共同推动中国高端装备制造业的自主化与智能化进程。
                </p>
              </div>
            </MotionReveal>
          </div>

          {/* Right Image & Stats */}
          <div className="relative z-10 lg:col-span-8 lg:pt-0">
            <MotionReveal delay={0.2}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-tr-[50px] shadow-xl">
                <Image
                  src="/images/banner.jpg"
                  alt="Company Building"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </MotionReveal>

            {/* Stats Cards - Placed below image */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <MotionReveal key={stat.label} delay={0.4 + index * 0.1}>
                  <div className="group flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md transition-transform hover:-translate-y-1 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    <div className="mb-2 text-red-600">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#0B0F16] dark:text-white sm:text-3xl">
                        {stat.value}
                      </span>
                      <span className="text-xs text-zinc-500">{stat.suffix}</span>
                    </div>
                    <div className="mt-1 text-xs font-medium text-zinc-500">
                      {stat.label}
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
