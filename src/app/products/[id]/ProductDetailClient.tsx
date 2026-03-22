'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MessageSquare, Download, CheckCircle } from 'lucide-react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import { type Product, products } from '@/data/products';

type Tab = '产品简介' | '技术参数' | '外形尺寸' | '应用案例' | '相关下载';

export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<Tab>('产品简介');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const tabs: Tab[] = ['产品简介', '技术参数', '外形尺寸', '应用案例', '相关下载'];

  const recommendedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#333333] pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8ECF0] py-3">
        <Container>
          <div className="flex items-center text-sm text-[#666666]">
            <Link href="/" className="hover:text-[#4A90D9]">首页</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/products" className="hover:text-[#4A90D9]">产品中心</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#333333] font-medium">{product.name}</span>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Top Section: Gallery & Info */}
        <div className="bg-white rounded-[8px] border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 mb-8 flex flex-col lg:flex-row gap-10">
          
          {/* Left: Gallery (60%) */}
          <div className="lg:w-[60%] flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full bg-slate-50 border border-[#E8ECF0] rounded-[8px] overflow-hidden flex items-center justify-center group">
               {/* <Image src={product.images[activeImageIndex]} alt={product.name} fill className="object-contain p-8 transition-transform duration-500 group-hover:scale-105" /> */}
               <Image src="/images/hs/hydraulic.svg" alt={product.name} fill className="object-contain p-8 transition-transform duration-500 group-hover:scale-105" />
            </div>
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 shrink-0 border-2 rounded-[4px] overflow-hidden ${
                      activeImageIndex === idx ? 'border-[#4A90D9]' : 'border-[#E8ECF0] hover:border-[#4A90D9]/50'
                    }`}
                  >
                    <Image src="/images/hs/hydraulic.svg" alt={`${product.name} ${idx + 1}`} fill className="object-cover p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info (40%) */}
          <div className="lg:w-[40%] flex flex-col">
            <h1 className="text-[24px] font-bold text-[#333333] mb-2">{product.name}</h1>
            <p className="text-[16px] text-[#666666] mb-6 pb-6 border-b border-[#E8ECF0]">型号：{product.model}</p>

            <div className="space-y-4 mb-8 flex-1">
              <div className="grid grid-cols-2 gap-4">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[12px] text-[#666666]">{spec.label}</span>
                    <span className="text-[14px] font-medium text-[#333333]">{spec.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-[#E8ECF0]">
                <h3 className="text-[14px] font-medium text-[#333333] mb-2">核心特性：</h3>
                <ul className="space-y-2">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-[14px] text-[#666666]">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-auto">
              <div className="flex gap-4">
                <ButtonLink href="/contact" className="flex-1 bg-[#1E3A5F] text-white h-12 rounded-[4px] font-medium flex items-center justify-center gap-2 hover:bg-[#162A45] hover:-translate-y-[1px] transition-all shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                  获取方案与报价
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs & Recommended */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (Tabs) */}
          <div className="flex-1 bg-white rounded-[8px] border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex overflow-x-auto border-b border-[#E8ECF0] bg-[#F5F7FA]">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-[16px] font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === tab ? 'text-[#1E3A5F] bg-white' : 'text-[#666666] hover:text-[#4A90D9]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#4A90D9]" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-8 min-h-[400px]">
              {activeTab === '产品简介' && (
                <MotionReveal>
                  <h3 className="text-[18px] font-bold text-[#333333] mb-4">产品概述</h3>
                  <p className="text-[14px] text-[#666666] leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <p className="text-[14px] text-[#666666] leading-relaxed">
                    本产品系列采用高品质材料制造，结合先进的制造工艺，确保在恶劣工况下依然保持卓越的性能和可靠性。通过严格的质量控制体系，每一件出厂产品均经过100%的性能测试，满足国际标准要求。
                  </p>
                </MotionReveal>
              )}
              {activeTab === '技术参数' && (
                <MotionReveal>
                  <table className="w-full text-left text-[14px] text-[#666666] border-collapse">
                    <tbody>
                      {product.specs.map((spec, i) => (
                        <tr key={i} className="border-b border-[#E8ECF0] hover:bg-[#F5F7FA]">
                          <th className="py-3 px-4 font-medium text-[#333333] w-1/3 bg-[#F9FAFB]">{spec.label}</th>
                          <td className="py-3 px-4">{spec.value}</td>
                        </tr>
                      ))}
                      <tr className="border-b border-[#E8ECF0] hover:bg-[#F5F7FA]">
                        <th className="py-3 px-4 font-medium text-[#333333] w-1/3 bg-[#F9FAFB]">工作温度</th>
                        <td className="py-3 px-4">-20℃ ~ +80℃</td>
                      </tr>
                      <tr className="border-b border-[#E8ECF0] hover:bg-[#F5F7FA]">
                        <th className="py-3 px-4 font-medium text-[#333333] w-1/3 bg-[#F9FAFB]">防护等级</th>
                        <td className="py-3 px-4">IP65</td>
                      </tr>
                    </tbody>
                  </table>
                </MotionReveal>
              )}
              {activeTab === '相关下载' && (
                <MotionReveal>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border border-[#E8ECF0] rounded-[8px] hover:border-[#4A90D9] transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#F0F5FA] text-[#4A90D9] flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#333333] group-hover:text-[#4A90D9]">产品选型手册</div>
                          <div className="text-[12px] text-[#999999]">PDF · 2.4 MB</div>
                        </div>
                      </div>
                      <button className="text-[#4A90D9] text-[14px] hover:underline">下载</button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-[#E8ECF0] rounded-[8px] hover:border-[#4A90D9] transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#F0F5FA] text-[#4A90D9] flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#333333] group-hover:text-[#4A90D9]">安装使用说明书</div>
                          <div className="text-[12px] text-[#999999]">PDF · 1.8 MB</div>
                        </div>
                      </div>
                      <button className="text-[#4A90D9] text-[14px] hover:underline">下载</button>
                    </div>
                  </div>
                </MotionReveal>
              )}
              {/* Other tabs can be similarly populated */}
            </div>
          </div>

          {/* Sidebar Recommended */}
          <div className="lg:w-[300px] shrink-0">
            <div className="bg-white rounded-[8px] border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-4">
              <h3 className="text-[16px] font-bold text-[#1E3A5F] mb-4 pb-2 border-b border-[#E8ECF0]">相关产品推荐</h3>
              <div className="space-y-4">
                {recommendedProducts.map(rec => (
                  <Link key={rec.id} href={`/products/${rec.id}`} className="flex gap-3 group">
                    <div className="relative w-20 h-20 shrink-0 bg-slate-50 rounded border border-[#E8ECF0] overflow-hidden">
                       <Image src="/images/hs/hydraulic.svg" alt={rec.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[14px] font-medium text-[#333333] group-hover:text-[#4A90D9] line-clamp-1 mb-1">{rec.name}</div>
                      <div className="text-[12px] text-[#666666] mb-1">型号: {rec.model}</div>
                      <div className="text-[12px] text-[#999999] line-clamp-1">{rec.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
