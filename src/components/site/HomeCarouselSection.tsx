'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Factory, 
  Cpu, 
  Zap, 
  Target, 
  CircleDot, 
  Bot, 
  Flame, 
  Palette, 
  Activity 
} from 'lucide-react';
import Container from '@/components/site/Container';
import ButtonLink from '@/components/site/ButtonLink';
import MotionReveal from '@/components/site/MotionReveal';
import EquipmentCarousel from '@/components/site/EquipmentCarousel';

const slides = [
  { src: '/images/scsb/生产基地.png', name: '生产基地', icon: Factory, desc: '现代化制造基地' },
  { src: '/images/scsb/数控设备.png', name: '数控设备', icon: Cpu, desc: '高精度数控机群' },
  { src: '/images/scsb/数控高速加工中心.png', name: '高速加工', icon: Zap, desc: '高效精密加工' },
  { src: '/images/scsb/4.5米长加工中心.png', name: '大型加工', icon: Target, desc: '4.5米长工件加工' },
  { src: '/images/scsb/大型深孔镗.png', name: '深孔镗床', icon: CircleDot, desc: '复杂深孔加工' },
  { src: '/images/scsb/焊接机器人工作站.png', name: '焊接机器人', icon: Bot, desc: '自动化焊接工作站' },
  { src: '/images/scsb/数控焊接摆塔机.png', name: '焊接摆塔', icon: Flame, desc: '精密焊接工艺' },
  { src: '/images/scsb/油漆线.png', name: '表面处理', icon: Palette, desc: '专业油漆涂装线' },
  { src: '/images/scsb/液压试验台.png', name: '试验检测', icon: Activity, desc: '全功能液压测试' },
];

export default function HomeCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-zinc-50 py-16 sm:py-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-[500px] w-[500px] rounded-full bg-orange-100/50 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left Column: Immersive Factory Scene (Carousel) */}
          <div className="lg:col-span-8">
            <MotionReveal>
              <div className="relative group rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                
                <EquipmentCarousel
                  aspect="16/9"
                  captionMode="none"
                  imageSizes="(min-width: 1024px) 60vw, 100vw"
                  frameClassName="rounded-xl"
                  activeIndex={activeIndex}
                  onIndexChange={setActiveIndex}
                  showControls={false} // Custom controls on right
                  showArrows={false}
                  slides={slides}
                  className="transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Overlay Info on Image */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-px w-8 bg-[#F4B400]" />
                      <span className="text-xs font-bold tracking-wider text-[#F4B400] uppercase">
                        Current View
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      {slides[activeIndex].name}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-300 max-w-md">
                      {slides[activeIndex].desc}
                    </p>
                  </motion.div>
                </div>
              </div>
            </MotionReveal>
          </div>

          {/* Right Column: Core Competitiveness Content */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <MotionReveal delay={0.1}>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-[#F4B400] animate-pulse" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#0B2A4A]/70 uppercase">
                  Manufacturing Capability
                </span>
              </div>
              
              <h2 className="text-3xl font-display font-bold text-[#0B0F16] sm:text-4xl mb-6 leading-tight">
                核心竞争力 <br />
                <span className="inline-block py-1 text-transparent bg-clip-text bg-gradient-to-r from-[#0B2A4A] to-[#0B2A4A]/70">
                  现代化生产与检测
                </span>
              </h2>
              
              <p className="text-zinc-600 leading-relaxed mb-8 border-l-2 border-[#0B2A4A]/10 pl-4">
                以精密加工、自动化焊接与试验检测为基础，结合精益管理与工艺优化，保障交付一致性并降低运维成本。
              </p>

              {/* Animated Icon Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                {slides.map((slide, idx) => {
                  const isActive = activeIndex === idx;
                  const Icon = slide.icon;
                  
                  return (
                    <button
                      key={slide.name}
                      onClick={() => setActiveIndex(idx)}
                      className={`
                        relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300
                        ${isActive 
                          ? 'bg-[#F4B400]/10 border-[#F4B400] shadow-[0_0_20px_rgba(244,180,0,0.15)]' 
                          : 'bg-white border-zinc-200 hover:border-[#F4B400]/50 hover:shadow-lg'
                        }
                      `}
                    >
                      <Icon 
                        className={`w-6 h-6 mb-2 transition-colors duration-300 ${
                          isActive ? 'text-[#F4B400]' : 'text-zinc-400 group-hover:text-[#F4B400]'
                        }`} 
                        strokeWidth={1.5}
                      />
                      <span className={`text-xs font-medium transition-colors duration-300 ${
                        isActive ? 'text-[#0B0F16]' : 'text-zinc-500 group-hover:text-zinc-800'
                      }`}>
                        {slide.name}
                      </span>
                      
                      {/* Active Indicator Dot */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeDot"
                          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#F4B400]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink 
                  href="/capability" 
                  variant="accent"
                  className="shadow-[0_0_20px_rgba(244,180,0,0.2)] hover:shadow-[0_0_30px_rgba(244,180,0,0.4)]"
                >
                  探索制造实力
                </ButtonLink>
                <ButtonLink 
                  href="/contact" 
                  variant="secondary"
                  className="border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                >
                  预约工厂参观
                </ButtonLink>
              </div>
            </MotionReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
