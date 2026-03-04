import Link from 'next/link';

import Image from 'next/image';

import React from 'react';

import { MapPin, Phone, Mail } from 'lucide-react';
import Container from '@/components/site/Container';



type FooterLink = {

  href: string;

  label: string;

};



type PartnerLogo = {
  name: string;
  logo: string;
};

export default function SiteFooter({ showPartners = false }: { showPartners?: boolean }) {
  const productLinks: FooterLink[] = [

    { href: '/products', label: '产品中心' },

    { href: '/cases', label: '工程案例' },

    { href: '/capability', label: '技术实力' },

  ];



  const supportLinks: FooterLink[] = [

    { href: '/service', label: '服务支持' },

    { href: '/partners', label: '合作伙伴' },

    { href: '/about', label: '关于我们' },

    { href: '/contact', label: '联系我们' },

  ];



  const partnerLogos: PartnerLogo[] = [
    { name: '中国中车', logo: '/images/partners/株洲时代新材料.png' },
    { name: '三一重工', logo: '/images/partners/三一重工.png' },
    { name: '中联重科', logo: '/images/partners/中联重科.png' },
    { name: '徐工集团', logo: '/images/partners/徐工集团.png' },
    { name: '蓝天科技', logo: '/images/partners/蓝天科技.png' },
    { name: '飞翼股份', logo: '/images/partners/飞翼股份.png' },
    { name: '百通新材', logo: '/images/partners/百通新材.png' },
    { name: '深蓝动力', logo: '/images/partners/深蓝动力.png' },
    { name: '北路智控', logo: '/images/partners/北路智控.png' },
  ];

  const year = new Date().getFullYear();



  return (

    <footer className="border-t border-zinc-200/20 bg-[#0B0F16] text-white">

      <Container className="py-16">

        <div className="grid gap-12 lg:grid-cols-12">

          {/* Brand Column */}

          <div className="lg:col-span-4">

            <Link href="/" className="flex items-center gap-3">

              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/5 p-1">

                <Image

                  src="/images/hs/logo.png"

                  alt="Logo"

                  fill

                  className="object-contain"

                />

              </div>

              <div className="leading-tight">

                <div className="text-base font-bold text-white">

                  湖南协力鸿胜机械有限公司

                </div>

                <div className="text-[10px] text-zinc-400">

                  Hunan Xieli Hongsheng Machinery Co.,Ltd.

                </div>

              </div>

            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">

              立足长沙，专注液压系统与电气控制集成设计，面向复杂工况提供定制化、智能化、一站式系统解决方案。

            </p>

            <div className="mt-8 flex gap-4">

               {/* Social placeholders or extra badges could go here */}

               <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400 border border-white/10">

                 智能液压

               </div>

               <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400 border border-white/10">

                 电控系统

               </div>

            </div>

          </div>



          {/* Links Columns */}

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">

            <div>

              <h3 className="text-sm font-semibold text-white">业务领域</h3>

              <ul className="mt-6 space-y-4">

                {productLinks.map((l) => (

                  <li key={l.href}>

                    <Link

                      href={l.href}

                      className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-[#F4B400]"

                    >

                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 transition-colors group-hover:bg-[#F4B400]" />

                      {l.label}

                    </Link>

                  </li>

                ))}

              </ul>

            </div>

            <div>

              <h3 className="text-sm font-semibold text-white">关于与支持</h3>

              <ul className="mt-6 space-y-4">

                {supportLinks.map((l) => (

                  <li key={l.href}>

                    <Link

                      href={l.href}

                      className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-[#F4B400]"

                    >

                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 transition-colors group-hover:bg-[#F4B400]" />

                      {l.label}

                    </Link>

                  </li>

                ))}

              </ul>

            </div>

          </div>



          {/* Contact Column */}

          <div className="lg:col-span-4">

            <h3 className="text-sm font-semibold text-white">联系方式</h3>

            <ul className="mt-6 space-y-6">

              <li className="flex gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#F4B400]">

                  <MapPin className="h-4 w-4" />

                </div>

                <div className="text-sm leading-6 text-zinc-400">

                  <span className="block text-white">公司地址</span>

                  湖南省长沙市宁乡经济开发区车站路

                  <span className="block text-xs opacity-70 mt-1">

                    Station road, Economy Development Zone, Ningxiang, Changsha

                  </span>

                </div>

              </li>

              <li className="flex gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#F4B400]">

                  <Phone className="h-4 w-4" />

                </div>

                <div className="text-sm leading-6 text-zinc-400">

                  <span className="block text-white">销售热线</span>

                  13574880391 / 13419668797

                </div>

              </li>

              <li className="flex gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#F4B400]">

                  <Mail className="h-4 w-4" />

                </div>

                <div className="text-sm leading-6 text-zinc-400">

                  <span className="block text-white">电子邮箱</span>

                  william_tung@163.com

                </div>

              </li>

            </ul>

          </div>

        </div>



        {showPartners ? (
          <div className="mt-12 border-t border-white/10 pt-8">
            <div className="text-sm font-semibold text-white">合作伙伴</div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {partnerLogos.map((partner) => (
                <div
                  key={partner.name}
                  className="relative flex h-12 w-full items-center justify-center rounded-xl bg-white/95 px-4 shadow-sm ring-1 ring-white/10"
                >
                  <div className="relative h-8 w-full">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">

            <span>© {year} 湖南协力鸿胜机械有限公司</span>

            <span className="hidden sm:block">|</span>

            <span>Hunan Xieli Hongsheng Machinery Co.,Ltd.</span>

          </div>

          <div className="flex items-center gap-4">

            <span className="text-zinc-600">Designed for Reliability</span>

          </div>

        </div>

      </Container>

    </footer>

  );

}

