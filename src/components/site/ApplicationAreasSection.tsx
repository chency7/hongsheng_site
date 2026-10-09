'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Train, Factory, Ship, Wind, Plane, Cpu, ArrowRight } from 'lucide-react';
import Container from '@/components/site/Container';
import ButtonLink from '@/components/site/ButtonLink';
import MotionReveal from '@/components/site/MotionReveal';
import Image from 'next/image';

type ApplicationArea = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  image: string;
};

const applicationAreas: ApplicationArea[] = [
  {
    id: 'rail',
    title: '轨道交通',
    description: '铰接器试验、车辆液压系统与测试平台',
    icon: Train,
    color: '#F4B400',
    image: '/images/gc/rail.webp',
  },
  {
    id: 'construction',
    title: '工程机械',
    description: '起重机、塔吊、建筑机械液压与电控系统',
    icon: Factory,
    color: '#F4B400',
    image: '/images/gc/construction.webp',
  },
  {
    id: 'marine',
    title: '船舶海洋',
    description: '打桩船、挖泥船等船用液压系统',
    icon: Ship,
    color: '#F4B400',
    image: '/images/gc/marine.webp',
  },
  {
    id: 'wind',
    title: '风力发电',
    description: '联轴器压力/疲劳测试与风电系统测试',
    icon: Wind,
    color: '#F4B400',
    image: '/images/gc/wind.webp',
  },
  {
    id: 'aerospace',
    title: '航空航天',
    description: '制动系统测试与精密液压控制',
    icon: Plane,
    color: '#F4B400',
    image: '/images/gc/aerospace.webp',
  },
  {
    id: 'manufacturing',
    title: '工业制造',
    description: '发泡产线与自动化设备系统集成',
    icon: Cpu,
    color: '#F4B400',
    image: '/images/gc/manufacturing.webp',
  },
];

export default function ApplicationAreasSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1F3C] via-[#0A1628] to-[#0B0F16]" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#F4B400]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#F4B400]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#F4B400]/5 to-[#F4B400]/5 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <MotionReveal>
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F4B400]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B400]">
                Industries
              </span>
            </div>
            <h2 className="mb-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              六大核心应用领域
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-zinc-400 sm:text-base">
              覆盖轨道交通、工程机械、船舶海洋、风力发电、航空航天与工业制造等关键行业，输出可验证的系统能力与交付质量
            </p>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applicationAreas.map((area, index) => {
            const Icon = area.icon;
            const isHovered = hoveredIndex === index;

            return (
              <MotionReveal key={area.id} delay={index * 0.08}>
                <motion.div
                  className="group relative h-[320px] cursor-pointer overflow-hidden rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    border: `2px solid ${isHovered ? 'none' : 'rgba(244, 180, 0, 0)'}`,
                    boxShadow: isHovered
                      ? `0 0 100px rgba(0, 73, 244, 0.4), 0 820px 0 0 rgba(0, 0, 0, 0.5)`
                      : '0 820px 0 0 rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/60 to-transparent" />

                  <div className="relative z-10 flex h-full flex-col justify-end p-6">
                    <motion.div
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{
                        background: 'rgba(10, 22, 40, 0.8)',
                        border: isHovered ? 'none' : '1px solid rgba(244, 180, 0, 0.5)',
                        boxShadow: isHovered ? '0 0 20px rgba(244, 180, 0, 0.4)' : 'none',
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon className="h-7 w-7" style={{ color: '#F4B400' }} strokeWidth={2} />
                    </motion.div>

                    <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-[#F4B400]">
                      {area.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-zinc-300">{area.description}</p>

                    <motion.div
                      className="mt-4 flex items-center gap-2 text-sm font-medium text-[#F4B400] opacity-0 transition-opacity group-hover:opacity-100"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      了解更多
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute right-4 top-4 h-2 w-2 rounded-full"
                    style={{ backgroundColor: '#F4B400' }}
                    animate={{
                      scale: isHovered ? [1, 1.5, 1] : 1,
                      opacity: isHovered ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </MotionReveal>
            );
          })}
        </div>

        <MotionReveal delay={0.6}>
          <div className="mt-16 text-center">
            <ButtonLink
              href="/cases"
              variant="accent"
              className="shadow-[0_0_30px_rgba(244,180,0,0.3)] hover:shadow-[0_0_40px_rgba(244,180,0,0.5)]"
            >
              查看全部工程案例
            </ButtonLink>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
