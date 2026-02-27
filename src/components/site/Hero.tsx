'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '@/components/site/Container';
import ButtonLink from '@/components/site/ButtonLink';
import MotionReveal from '@/components/site/MotionReveal';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0F16]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hs/hero.svg"
          alt="Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(45deg,rgba(11,15,22,0.8),rgba(11,42,74,0.7),rgba(11,15,22,0.8))]"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Particles/Geometric Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[#F4B400]/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-[#0B2A4A]/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <Container className="relative z-10 py-20 text-center">
        <MotionReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md transition-colors hover:bg-white/10">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#F4B400] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4B400]"></span>
            </span>
            智能液压 · 电控系统 · 系统交付
            <span className="mx-1 h-3 w-[1px] bg-white/20" />
            长沙 · 2023
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <h1 className="mx-auto mt-8 max-w-5xl font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
              智能液压与电控系统
            </span>
            <span className="mt-2 block bg-gradient-to-r from-[#F4B400] to-[#F7D060] bg-clip-text text-transparent">
              定制化解决方案
            </span>
          </h1>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            湖南协力鸿胜机械有限公司专注液压系统设计、研发与制造，以需求导向与仿真验证为基础，提供从方案到运维的一站式系统服务，面向复杂工况实现稳定可靠交付。
          </p>
        </MotionReveal>

        <MotionReveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink
              href="/contact"
              variant="accent"
              className="group min-w-[160px] text-base shadow-[0_0_20px_rgba(244,180,0,0.3)] transition-shadow hover:shadow-[0_0_30px_rgba(244,180,0,0.5)]"
            >
              获取方案咨询
            </ButtonLink>
            <ButtonLink
              href="/cases"
              variant="secondary"
              className="min-w-[160px] border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/30 text-base transition-all"
            >
              查看工程案例
            </ButtonLink>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.4}>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            {[
              { label: '系统集成', value: '机电液一体化', icon: '⚡' },
              { label: '仿真设计', value: '全比例建模', icon: '📐' },
              { label: '精益制造', value: '零缺陷品控', icon: '🛡️' },
              { label: '服务响应', value: '24小时支持', icon: '🕒' },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:bg-white/10 hover:border-white/20"
              >
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br from-[#F4B400]/20 to-transparent blur-xl transition-all group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <div className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {item.label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-white tracking-wide">
                    {item.value}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
