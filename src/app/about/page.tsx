import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';
import { Target, Users, History, Zap, Shield, Globe } from 'lucide-react';

export const metadata = {
  title: '关于我们',
};

export default function AboutPage() {
  const values = [
    {
      title: '客户至上',
      description: '以客户需求为起点，以交付质量为结果。我们深知客户的成功就是我们的成功，因此始终将客户利益放在首位，提供超越预期的服务与价值。',
      icon: Users,
      color: 'bg-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      title: '创新驱动',
      description: '坚持技术创新与方法革新，持续提升系统集成能力。通过引入先进的仿真技术与模块化设计理念，不断突破行业技术瓶颈。',
      icon: Zap,
      color: 'bg-[#F4B400]',
      iconColor: 'text-[#F4B400]',
    },
    {
      title: '质量为本',
      description: '严格把控每一个环节，从设计到制造，以工艺优化与严苛品控保障产品的可靠性与一致性，确保交付零缺陷。',
      icon: Shield,
      color: 'bg-green-600',
      iconColor: 'text-green-600',
    },
    {
      title: '协作共赢',
      description: '与客户、合作伙伴及员工建立长期稳定的合作关系，在互信互利的基础上共同成长，共建行业生态，实现多方共赢。',
      icon: Globe,
      color: 'bg-purple-600',
      iconColor: 'text-purple-600',
    },
  ];

  const milestones = [
    { 
      year: '2023', 
      title: '扬帆起航', 
      desc: '公司正式成立，总部落地长沙。组建了核心液压与电控系统集成团队，确立了以技术驱动发展的战略方向。',
      image: '/images/about/milestone-2023.jpg'
    },
    { 
      year: '至今', 
      title: '蓬勃发展', 
      desc: '持续完善设备与制造能力，业务已覆盖工程机械、船舶海洋、风力发电等多行业，成功交付多个大型系统与试验检测平台。',
      image: '/images/about/milestone-now.jpg'
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white py-20 sm:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <MotionReveal>
                <h1 className="font-display text-5xl font-bold tracking-tight text-[#0B2A4A] sm:text-6xl">
                  关于我们
                </h1>
                <div className="mt-2 text-3xl font-bold text-[#F4B400] tracking-wider uppercase">
                  ABOUT US
                </div>
                <div className="mt-6 h-1 w-24 bg-[#F4B400]" />
              </MotionReveal>
              <MotionReveal delay={0.1}>
                <p className="mt-8 text-lg leading-8 text-zinc-500">
                  湖南协力鸿胜机械有限公司致力于以尖端技术为工业领域提供定制化的智能液压与电控系统解决方案，助力中国装备制造升级。
                </p>
              </MotionReveal>
            </div>
            <MotionReveal delay={0.2}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src="/images/banner.jpg"
                  alt="Company Building"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <MotionReveal>
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/images/about/mission.jpg"
                  alt="Mission"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="text-sm font-bold tracking-wider uppercase mb-2 text-[#F4B400]">Our Mission</div>
                  <h3 className="text-3xl font-bold">赋能装备制造，智造工业未来</h3>
                </div>
              </div>
            </MotionReveal>
            
            <MotionReveal delay={0.1}>
              <div>
                <h2 className="text-3xl font-bold text-[#0B2A4A] mb-6">企业定位</h2>
                <p className="text-lg text-zinc-600 leading-relaxed mb-8 text-justify">
                  作为一家高新技术企业，我们专注于液压系统设计、研发与制造。凭借资深的工程团队与先进的设计理念，我们为客户提供从需求分析、方案设计、仿真验证到精益制造、运维支持的一站式智能液压与电控系统解决方案，致力于成为行业领军企业。
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    '高新技术企业',
                    '液压系统专家',
                    '智能电控集成',
                    '行业领军者'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="h-2 w-2 rounded-full bg-[#F4B400]" />
                      <span className="font-semibold text-[#0B2A4A]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <MotionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-[#0B2A4A] mb-4">核心价值观</h2>
              <div className="h-1 w-20 bg-[#F4B400] mx-auto rounded-full" />
              <p className="mt-6 text-zinc-600">
                这些价值观是我们行动的指南，也是我们对客户、伙伴和社会的承诺。
              </p>
            </div>
          </MotionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <MotionReveal key={val.title} delay={idx * 0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 h-full flex flex-col">
                  <div className={`w-14 h-14 rounded-xl ${val.color} bg-opacity-10 flex items-center justify-center mb-6`}>
                    <val.icon className={`w-7 h-7 ${val.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B2A4A] mb-3">{val.title}</h3>
                  <p className="text-zinc-600 leading-relaxed text-sm flex-grow">
                    {val.description}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Milestones Section */}
      <section className="py-20">
        <Container>
          <MotionReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0B2A4A] mb-2">发展历程</h2>
                <div className="h-1 w-20 bg-[#F4B400] rounded-full" />
              </div>
              <p className="text-zinc-600 max-w-md md:text-right">
                以系统能力建设为主线，持续投入研发与制造能力，稳步前行。
              </p>
            </div>
          </MotionReveal>

          <div className="space-y-12">
            {milestones.map((item, idx) => (
              <MotionReveal key={item.year} delay={idx * 0.1}>
                <div className="group relative bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className="grid lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-5 relative h-64 lg:h-auto">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#0B2A4A]/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl font-bold text-gray-100 select-none">{item.year}</span>
                        <div className="h-px flex-grow bg-gray-100" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0B2A4A] mb-4">{item.title}</h3>
                      <p className="text-zinc-600 leading-relaxed text-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-20 text-center">
            <ButtonLink 
              href="/products" 
              variant="secondary"
              className="bg-gray-100 text-[#0B2A4A] hover:bg-gray-200 px-8 py-3"
            >
              查看产品体系
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
