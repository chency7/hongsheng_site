'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MessageSquare, Download, CheckCircle, Maximize2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import { type Product, products } from '@/data/products';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Tab = string;

export default function ProductDetailClient({ product }: { product: Product }) {
  // Use product's custom tabs if available, otherwise fallback to default tabs
  const defaultTabs = ['产品简介', '技术参数', '外形尺寸', '应用案例', '相关下载'];
  const tabs = product.detailTabs ? product.detailTabs.map(t => t.title) : defaultTabs;

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
            <div 
              className="relative aspect-[4/3] w-full bg-slate-50 border border-[#E8ECF0] rounded-[8px] overflow-hidden flex items-center justify-center group cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            >
               <Image src={product.images[activeImageIndex] || "/images/hs/hydraulic.svg"} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-100">
                   <Maximize2 className="w-6 h-6" />
                 </div>
               </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-[#4A90D9] scrollbar-track-[#F0F5FA] hover:scrollbar-thumb-[#1E3A5F] scrollbar-thumb-rounded-full">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 shrink-0 border-2 rounded-[4px] overflow-hidden ${
                      activeImageIndex === idx ? 'border-[#4A90D9] shadow-[0_0_0_1px_#4A90D9]' : 'border-[#E8ECF0] hover:border-[#4A90D9]/50'
                    }`}
                  >
                    <Image src={img || "/images/hs/hydraulic.svg"} alt={`${product.name} ${idx + 1}`} fill sizes="80px" className="object-cover p-1" />
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

        {/* Bottom Section: Tabs */}
        <div className="flex flex-col gap-8">
          
          {/* Main Content (Tabs) */}
          <div className="w-full bg-white rounded-[8px] border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
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
              {product.detailTabs ? (
                product.detailTabs.map(tab => (
                  activeTab === tab.title && (
                    <MotionReveal key={tab.title}>
                      {tab.type === 'file' && tab.fileUrl ? (
                        <div className="flex flex-col gap-6">
                          <div className="flex justify-between items-center bg-[#F9FAFB] p-6 rounded-lg border border-[#E8ECF0]">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded bg-[#F0F5FA] text-[#4A90D9] flex items-center justify-center">
                                <Download className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-[16px] font-medium text-[#333333] mb-1">{tab.content || '产品文档'}</h3>
                                <p className="text-[13px] text-[#999999]">
                                  {tab.fileUrl.split('.').pop()?.toUpperCase()} 文档
                                </p>
                              </div>
                            </div>
                            <a 
                              href={tab.fileUrl} 
                              download 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-6 py-2.5 bg-[#4A90D9] text-white text-[14px] font-medium rounded hover:bg-[#1E3A5F] transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                            >
                              <Download className="w-4 h-4" />
                              点击下载
                            </a>
                          </div>
                          {tab.fileUrl.endsWith('.pdf') && (
                            <div className="flex-1 w-full h-[800px] border border-[#E8ECF0] rounded-lg overflow-hidden bg-gray-100">
                              <iframe 
                                src={`${tab.fileUrl}#view=FitH`} 
                                className="w-full h-full border-none" 
                                title={tab.title}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="prose max-w-none text-[#666666] prose-headings:text-[#333333] prose-h3:text-[18px] prose-h3:font-bold prose-h3:mb-4 prose-p:text-[14px] prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-[14px] prose-ul:mb-6 prose-li:my-1 prose-table:w-full prose-table:text-left prose-table:text-[14px] prose-table:border-collapse prose-th:bg-[#F9FAFB] prose-th:py-3 prose-th:px-4 prose-th:font-medium prose-th:text-[#333333] prose-th:border-b prose-th:border-[#E8ECF0] prose-td:py-3 prose-td:px-4 prose-td:border-b prose-td:border-[#E8ECF0] prose-tr:hover:bg-[#F5F7FA]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {tab.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </MotionReveal>
                  )
                ))
              ) : (
                <>
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
                </>
              )}
              {/* Other tabs can be similarly populated */}
            </div>
          </div>
        </div>
      </Container>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
            onClick={() => setIsPreviewOpen(false)}
          >
            <button
              className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(false);
              }}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative h-full w-full max-h-[90vh] max-w-7xl overflow-hidden rounded-lg bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product.images[activeImageIndex] || "/images/hs/hydraulic.svg"}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </motion.div>
            
            {/* Thumbnail navigation in modal */}
            {product.images.length > 1 && (
              <div 
                className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 overflow-x-auto max-w-full px-4 py-3 bg-black/50 rounded-xl backdrop-blur-md scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent hover:scrollbar-thumb-white/60 scrollbar-thumb-rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 shrink-0 rounded-[4px] overflow-hidden transition-all ${
                      activeImageIndex === idx ? 'border-2 border-white ring-2 ring-blue-500 opacity-100 scale-110' : 'opacity-50 hover:opacity-100 border border-white/20'
                    }`}
                  >
                    <Image src={img || "/images/hs/hydraulic.svg"} alt={`${product.name} ${idx + 1}`} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
