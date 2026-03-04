'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Train, 
  Factory, 
  Ship, 
  Wind, 
  Plane, 
  Cpu,
  ArrowRight
} from 'lucide-react';
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
    image: '/images/gc/rail.jpg',
  },
  {
    id: 'construction',
    title: '工程机械',
    description: '起重机、塔吊、建筑机械液压与电控系统',
    icon: Factory,
    color: '#F4B400',
    image: '/images/gc/construction.jpg',
  },
  {
    id: 'marine',
    title: '船舶海洋',
    description: '打桩船、挖泥船等船用液压系统',
    icon: Ship,
    color: '#F4B400',
    image: '/images/gc/marine.jpg',
  },
  {
    id: 'wind',
    title: '风力发电',
    description: '联轴器压力/疲劳测试与风电系统测试',
    icon: Wind,
    color: '#F4B400',
    image: '/images/gc/wind.jpg',
  },
  {
    id: 'aerospace',
    title: '航空航天',
    description: '制动系统测试与精密液压控制',
    icon: Plane,
    color: '#F4B400',
    image: '/images/gc/aerospace.jpg',
  },
  {
    id: 'manufacturing',
    title: '工业制造',
    description: '发泡产线与自动化设备系统集成',
    icon: Cpu,
    color: '#F4B400',
    image: '/images/gc/manufacturing.jpg',
  },
];

export default function ApplicationAreasSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0F1F3C] to-[#0A1628]" />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4B400]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F4B400]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#F4B400]/5 to-[#F4B400]/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <MotionReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-[#F4B400] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#F4B400] uppercase">
                Industries
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              六大核心应用领域
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
              覆盖轨道交通、工程机械、船舶海洋、风力发电、航空航天与工业制造等关键行业，输出可验证的系统能力与交付质量
            </p>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicationAreas.map((area, index) => {
            const Icon = area.icon;
            const isHovered = hoveredIndex === index;

            return (
              <MotionReveal key={area.id} delay={index * 0.08}>
                <motion.div
                  className="relative group h-[320px] rounded-2xl cursor-pointer overflow-hidden"
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

                  <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                    <motion.div
                      className="flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                      style={{
                        background: 'rgba(10, 22, 40, 0.8)',
                        border: isHovered ? 'none' : '1px solid rgba(244, 180, 0, 0.5)',
                        boxShadow: isHovered ? '0 0 20px rgba(244, 180, 0, 0.4)' : 'none',
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon 
                        className="w-7 h-7" 
                        style={{ color: '#F4B400' }}
                        strokeWidth={2}
                      />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#F4B400] transition-colors">
                      {area.title}
                    </h3>
                    
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {area.description}
                    </p>

                    <motion.div
                      className="mt-4 flex items-center gap-2 text-[#F4B400] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      了解更多
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 rounded-full"
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
