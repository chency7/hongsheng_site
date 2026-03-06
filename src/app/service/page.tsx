import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';
import { Lightbulb, Wrench, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: '服务支持',
};

export default function ServicePage() {
  const serviceCards = [
    {
      title: '创新设计',
      description: '我们专注于液压及电控系统集成设计，为客户提供从需求分析到运维支持的高效节能定制化解决方案。团队精通流体动力学与智能控制技术，采用全比仿真模块化设计，确保系统可靠性与性能超越行业标准，助力客户降本增效，为复杂工况提供稳定动力支持。',
      keywords: ['液压系统', '电控集成', '定制方案'],
      color: 'bg-blue-600',
      icon: Lightbulb,
      image: '/images/service/创新设计.png',
      iconColor: 'text-blue-600',
    },
    {
      title: '精益制造',
      description: '我们以全流程精益管理为核心，通过工艺优化与零缺陷品控理念，实现液压系统集成制造的高效与精准。从工程机械到特种设备，我们以精益制造赋能客户，降低运维成本，提升产品竞争力，为客户交付经久耐用的高性能液压及电控解决方案。',
      keywords: ['精益管理', '零缺陷品控', '高效精准'],
      color: 'bg-green-600',
      icon: Wrench,
      image: '/images/service/精益制造.png',
      iconColor: 'text-green-600',
    },
    {
      title: '用心服务',
      description: '公司秉承着“客户至上、合作共赢”的理念，24小时专业售后团队全天候响应故障处理，并提供预防性维护、系统升级及全生命周期管理方案。确保客户设备寿命延长、运维成本优化，助力客户实现高效产出与持续降本目标。',
      keywords: ['24小时服务', '全生命周期管理'],
      color: 'bg-[#F4B400]',
      icon: HeartHandshake,
      image: '/images/service/用心服务.png',
      iconColor: 'text-[#F4B400]',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white py-20 sm:py-24">
        <Container>
          <div className="max-w-4xl">
            <MotionReveal>
              <h1 className="font-display text-5xl font-bold tracking-tight text-[#0B2A4A] sm:text-6xl">
                一站式服务
              </h1>
              <div className="mt-2 text-3xl font-bold text-[#F4B400] tracking-wider uppercase">
                ONE STOP SERVICE
              </div>
              <div className="mt-6 h-1 w-24 bg-[#F4B400]" />
            </MotionReveal>
            <MotionReveal delay={0.1}>
              <p className="mt-8 text-lg leading-8 text-zinc-500 max-w-2xl">
                从创新设计到精益制造，再到全方位的用心服务，我们为您提供贯穿全生命周期的专业支持，确保每一环节都超越期待。
              </p>
            </MotionReveal>
          </div>
        </Container>
      </section>

      {/* Service Cards Section */}
      <section className="pb-24 pt-12">
        <Container>
          <div className="grid gap-12 lg:grid-cols-1">
            {serviceCards.map((card, idx) => (
              <MotionReveal key={card.title} delay={idx * 0.1}>
                <div className={`group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl`}>
                  <div className={`h-2 w-full ${card.color}`} />
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image Side - Alternating */}
                    <div className={`relative h-64 lg:h-auto ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Content Side */}
                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl bg-gray-50 ${card.iconColor}`}>
                          <card.icon size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#0B2A4A]">
                          {card.title}
                        </h2>
                        <span className="text-6xl font-bold text-gray-100 ml-auto select-none">
                          0{idx + 1}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <div className={`absolute -left-12 top-0 bottom-0 w-1 ${card.color} hidden lg:block`} />
                        <p className="text-zinc-600 leading-relaxed text-lg mb-8 text-justify">
                          {card.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-auto">
                        {card.keywords.map((keyword) => (
                          <span 
                            key={keyword}
                            className="px-4 py-2 rounded-lg bg-gray-50 text-zinc-600 text-sm font-medium border border-gray-100"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-20 text-center">
            <ButtonLink 
              href="/contact" 
              variant="accent" 
              className="bg-[#0B2A4A] text-white hover:bg-[#1a3f66] px-10 py-4 text-lg shadow-xl shadow-blue-900/10"
            >
              立即咨询服务
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
