import React from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';
import { Target, Users, History, Zap, Shield, Globe } from 'lucide-react';

export const metadata = {
  title: '关于我们 - 湖南协力鸿胜机械有限公司',
  description:
    '湖南协力鸿胜机械有限公司成立于2023年，总部位于长沙，专注液压系统与电控系统的设计、研发与制造。拥有资深液压与电气工程师团队，服务工程机械、船舶海洋、风电、轨道交通等行业。',
  keywords: [
    '湖南协力鸿胜',
    '鸿胜机械',
    '液压系统公司',
    '长沙液压系统',
    '高新技术企业',
    '液压系统设计',
    '电控系统集成',
    '工程机械液压',
    '公司简介',
    '企业介绍',
  ],
  openGraph: {
    title: '关于我们 - 湖南协力鸿胜机械有限公司',
    description: '专注液压系统与电控系统的设计、研发与制造的高新技术企业。',
    url: 'https://www.xl-honsun.com/about',
  },
  alternates: {
    canonical: 'https://www.xl-honsun.com/about',
  },
};

export default function AboutPage() {
  const values = [
    {
      title: '客户至上',
      description:
        '以客户需求为起点，以交付质量为结果。我们深知客户的成功就是我们的成功，因此始终将客户利益放在首位，提供超越预期的服务与价值。',
      icon: Users,
      color: 'bg-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      title: '创新驱动',
      description:
        '坚持技术创新与方法革新，持续提升系统集成能力。通过引入先进的仿真技术与模块化设计理念，不断突破行业技术瓶颈。',
      icon: Zap,
      color: 'bg-[#F4B400]',
      iconColor: 'text-[#F4B400]',
    },
    {
      title: '质量为本',
      description:
        '严格把控每一个环节，从设计到制造，以工艺优化与严苛品控保障产品的可靠性与一致性，确保交付零缺陷。',
      icon: Shield,
      color: 'bg-green-600',
      iconColor: 'text-green-600',
    },
    {
      title: '协作共赢',
      description:
        '与客户、合作伙伴及员工建立长期稳定的合作关系，在互信互利的基础上共同成长，共建行业生态，实现多方共赢。',
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
      image: '/images/banner.jpg',
    },
    {
      year: '至今',
      title: '蓬勃发展',
      desc: '持续完善设备与制造能力，业务已覆盖工程机械、船舶海洋、风力发电等多行业，成功交付多个大型系统与试验检测平台。',
      image: '/images/about/system-integration.jpg',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <MotionReveal>
                <h1 className="font-display text-5xl font-bold tracking-tight text-[#0B2A4A] sm:text-6xl">
                  关于我们
                </h1>
                <div className="mt-2 text-3xl font-bold uppercase tracking-wider text-[#F4B400]">
                  ABOUT US
                </div>
                <div className="mt-6 h-1 w-24 bg-[#F4B400]" />
              </MotionReveal>
              <MotionReveal delay={0.1}>
                <p className="mt-8 text-lg leading-8 text-zinc-500">
                  湖南协力鸿胜机械有限公司成立于2023年，总部位于中国工程机械之都--长沙，是一家专注于液压系统设计、研发与制造的高新技术企业。致力于以尖端技术为工业领域提供定制化
                  的智能解决方案，助力中国装备制造。公司拥有专业的液压系统与电气控制集成设计团队，其中有多名具有10年以上现场经验的资深高级液压工程师和电气工程师。采用需求导向-深度定制模式，精确定位客户需求，为每一位客户提供一流的机、电、液集成传动控制系统及相关产品。研发的产品及系统广泛应用于轨道交通、工程机械、船舶海洋、风力发电、航空航天等各领域。
                  公司秉承着“客户至上、创新驱动、质量为本、协作共赢99的核心价值观，严格按照管理体系要求，持续改进与创新，提升自身核心竞争优势，完善供应链及销售体系，力主成为智能液压及电控系统行业领军企业。
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
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <MotionReveal>
              <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src="/images/about/mission.jpg"
                  alt="Mission"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="mb-2 text-sm font-bold uppercase tracking-wider text-[#F4B400]">
                    Our Mission
                  </div>
                  <h3 className="text-3xl font-bold">赋能装备制造，智造工业未来</h3>
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.1}>
              <div>
                <h2 className="mb-6 text-3xl font-bold text-[#0B2A4A]">企业定位</h2>
                <p className="mb-8 text-justify text-lg leading-relaxed text-zinc-600">
                  作为一家高新技术企业，我们专注于液压系统设计、研发与制造。凭借资深的工程团队与先进的设计理念，我们为客户提供从需求分析、方案设计、仿真验证到精益制造、运维支持的一站式智能液压与电控系统解决方案，致力于成为行业领军企业。
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {['高新技术企业', '液压系统专家', '智能电控集成', '行业领军者'].map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="h-2 w-2 rounded-full bg-[#F4B400]" />
                        <span className="font-semibold text-[#0B2A4A]">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-20">
        <Container>
          <MotionReveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-[#0B2A4A]">核心价值观</h2>
              <div className="mx-auto h-1 w-20 rounded-full bg-[#F4B400]" />
              <p className="mt-6 text-zinc-600">
                这些价值观是我们行动的指南，也是我们对客户、伙伴和社会的承诺。
              </p>
            </div>
          </MotionReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((val, idx) => (
              <MotionReveal key={val.title} delay={idx * 0.1}>
                <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg">
                  <div
                    className={`h-14 w-14 rounded-xl ${val.color} mb-6 flex items-center justify-center bg-opacity-10`}
                  >
                    <val.icon className={`h-7 w-7 ${val.iconColor}`} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#0B2A4A]">{val.title}</h3>
                  <p className="flex-grow text-sm leading-relaxed text-zinc-600">
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
            <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-[#0B2A4A]">发展历程</h2>
                <div className="h-1 w-20 rounded-full bg-[#F4B400]" />
              </div>
              <p className="max-w-md text-zinc-600 md:text-right">
                以系统能力建设为主线，持续投入研发与制造能力，稳步前行。
              </p>
            </div>
          </MotionReveal>

          <div className="space-y-12">
            {milestones.map((item, idx) => (
              <MotionReveal key={item.year} delay={idx * 0.1}>
                <div className="group relative overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-lg transition-all hover:shadow-xl">
                  <div className="grid gap-0 lg:grid-cols-12">
                    <div className="relative h-64 lg:col-span-5 lg:h-auto">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#0B2A4A]/10 transition-colors group-hover:bg-transparent" />
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:col-span-7 lg:p-12">
                      <div className="mb-4 flex items-center gap-4">
                        <span className="select-none text-5xl font-bold text-gray-100">
                          {item.year}
                        </span>
                        <div className="h-px flex-grow bg-gray-100" />
                      </div>
                      <h3 className="mb-4 text-2xl font-bold text-[#0B2A4A]">{item.title}</h3>
                      <p className="text-lg leading-relaxed text-zinc-600">{item.desc}</p>
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
              className="bg-gray-100 px-8 py-3 text-[#0B2A4A] hover:bg-gray-200"
            >
              查看产品体系
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
