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
      {
        <div className="hero-bg z-5 absolute inset-0  h-full w-full bg-[rgba(11,15,22,1)]">
          <Image
            src="/images/scsb/生产基地.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(11,15,22,0.5),rgba(11,15,22,0.3),rgba(11,15,22,0.5))]" />
          {/* Bottom Fade Gradient - Ensures smooth transition to next section */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0F16] to-transparent" />
        </div>
      }

      {/* Particles/Geometric Elements */}
      {
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[rgba(11,15,22,1)]">
          <motion.div
            className="bg-[#F4B400]/8 absolute -right-20 -top-20 h-96 w-96 rounded-full blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.25, 0.35, 0.25],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ willChange: 'transform, opacity' }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-[#0B2A4A]/15 blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            style={{ willChange: 'transform, opacity' }}
          />
        </div>
      }

      <Container className="relative z-10 mt-[0rem] py-0 text-center">
        <MotionReveal>
          <div className="text-l inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-semibold tracking-wide text-white backdrop-blur-md transition-colors hover:bg-white/10">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[#F4B400] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F4B400]"></span>
            </span>
            智能液压 · 电控系统 · 系统交付
            <span className="mx-1 h-3 w-[1px] bg-white/20" />
            长沙 · 2023
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <h1 className="mx-auto mt-6 max-w-6xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-5xl">
            <span className="block bg-gradient-to-r from-white via-white to-white/70 bg-clip-text py-2 text-transparent">
              智能液压与电控系统
            </span>
            <span className="mt-2 block bg-gradient-to-r from-[#F4B400] to-[#F7D060] bg-clip-text py-2 text-transparent">
              定制化解决方案
            </span>
          </h1>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-300">
            <span className="font-semibold text-white">湖南协力鸿胜</span>
            机械有限公司专注液压系统设计、研发与制造，以需求导向与仿真验证为基础，提供从方案到运维的一站式系统服务，面向复杂工况实现稳定可靠交付。
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
              className="min-w-[160px] border-white/20 bg-white/5 text-base text-white backdrop-blur transition-all hover:border-white/30 hover:bg-white/10"
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
                className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/15 p-6 shadow-lg backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/25 hover:shadow-xl"
              >
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br from-[#F4B400]/20 to-transparent blur-xl transition-all group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <div className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-zinc-200">
                    {item.label}
                  </div>
                  <div className="mt-1 text-lg font-bold tracking-wide text-white">
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
