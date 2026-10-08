'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MessageSquare, Download, CheckCircle, Maximize2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import { type Product, type ProductSubCategory } from '@/data/products';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  canonicalProductDetailTab,
  findProductDetailTab,
  productDetailTabTitles,
} from '@/lib/product-detail-tabs';

type Tab = string;

function formatFileSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function EmptyDetailState({ title, download = false }: { title: string; download?: boolean }) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-[#DCE5EE] bg-[#F9FAFB] px-6 text-center">
      {download ? <Download className="h-8 w-8 text-[#9ABCE0]" /> : null}
      <h3 className={`${download ? 'mt-3' : ''} text-[16px] font-medium text-[#333333]`}>暂无{title}</h3>
      <p className="mt-2 text-[13px] text-[#999999]">内容将在产品资料完善后展示。</p>
    </div>
  );
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const tabs = productDetailTabTitles(product.detailTabs);

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeSubCategory = useMemo(() => {
    if (!product.subCategories || product.subCategories.length === 0) return null;
    return product.subCategories.find((subCategory) => subCategory.name === product.name) ?? product.subCategories[0];
  }, [product.name, product.subCategories]);

  const [selectedSubCategory, setSelectedSubCategory] = useState<ProductSubCategory | null>(
    activeSubCategory
  );

  const currentImages = selectedSubCategory?.images || product.images;
  const currentSpecs = selectedSubCategory?.specs || product.specs;
  const visibleActiveTab = tabs.includes(activeTab) ? activeTab : tabs[0];
  const activeDetailTab = findProductDetailTab(product.detailTabs, visibleActiveTab);
  const activeStandardTab = canonicalProductDetailTab(visibleActiveTab);
  const activeDetailTabIsFile = activeDetailTab?.type === 'file' || activeDetailTab?.type === 'pdf';
  const shouldRenderActiveDetailTab = Boolean(
    activeDetailTab && (activeDetailTabIsFile || activeDetailTab.content?.trim()),
  );

  const handleSubCategoryChange = (subCat: ProductSubCategory) => {
    setSelectedSubCategory(subCat);
    setActiveImageIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20 text-[#333333]">
      {/* Breadcrumb */}
      <div className="border-b border-[#E8ECF0] bg-white py-3">
        <Container>
          <div className="flex items-center text-sm text-[#666666]">
            <Link href="/" className="hover:text-[#4A90D9]">
              首页
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href="/products" className="hover:text-[#4A90D9]">
              产品中心
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium text-[#333333]">{product.name}</span>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Top Section: Gallery & Info */}
        <div className="mb-8 flex flex-col gap-10 rounded-[8px] border border-[#E8ECF0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] lg:flex-row">
          {/* Left: Gallery (60%) */}
          <div className="flex flex-col gap-4 lg:w-[60%]">
            <div
              className="group relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[8px] border border-[#E8ECF0] bg-slate-50"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Image
                src={currentImages[activeImageIndex] || '/images/hs/hydraulic.svg'}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                <div className="flex h-12 w-12 scale-90 transform items-center justify-center rounded-full bg-white/80 text-gray-800 opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:scale-100 group-hover:opacity-100">
                  <Maximize2 className="h-6 w-6" />
                </div>
              </div>
            </div>
            {currentImages.length > 1 && (
              <div className="scrollbar-thin scrollbar-thumb-[#4A90D9] scrollbar-track-[#F0F5FA] hover:scrollbar-thumb-[#1E3A5F] scrollbar-thumb-rounded-full flex items-center gap-3 overflow-x-auto pb-4 pt-1">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[4px] border-2 ${
                      activeImageIndex === idx
                        ? 'border-[#4A90D9] shadow-[0_0_0_1px_#4A90D9]'
                        : 'border-[#E8ECF0] hover:border-[#4A90D9]/50'
                    }`}
                  >
                    <Image
                      src={img || '/images/hs/hydraulic.svg'}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info (40%) */}
          <div className="flex flex-col lg:w-[40%]">
            <h1 className="mb-2 text-[24px] font-bold text-[#333333]">{product.name}</h1>
            {product.model && (
              <p className="mb-6 border-b border-[#E8ECF0] pb-6 text-[16px] text-[#666666]">
                型号：{product.model}
              </p>
            )}

            {/* Sub-category Switcher */}
            {product.subCategories && product.subCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-[14px] font-medium text-[#333333]">选择产品类型：</h3>
                <div className="flex flex-wrap gap-2">
                  {product.subCategories.map((subCat) => (
                    <button
                      key={subCat.id}
                      onClick={() => handleSubCategoryChange(subCat)}
                      className={`rounded-[4px] px-4 py-2 text-[13px] font-medium transition-all ${
                        selectedSubCategory?.id === subCat.id
                          ? 'bg-[#4A90D9] text-white shadow-sm'
                          : 'border border-[#E8ECF0] bg-[#F5F7FA] text-[#666666] hover:border-[#4A90D9] hover:text-[#4A90D9]'
                      }`}
                    >
                      {subCat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {currentSpecs.map((spec, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[12px] text-[#666666]">{spec.label}</span>
                    <span className="text-[14px] font-medium text-[#333333]">{spec.value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E8ECF0] pt-4">
                <h3 className="mb-2 text-[14px] font-medium text-[#333333]">核心特性：</h3>
                <ul className="space-y-2">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-[14px] text-[#666666]">
                      <CheckCircle className="h-4 w-4 text-[#28A745]" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex gap-4">
                <ButtonLink
                  href="/contact"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[4px] bg-[#1E3A5F] font-medium text-white shadow-sm transition-all hover:-translate-y-[1px] hover:bg-[#162A45]"
                >
                  <MessageSquare className="h-5 w-5" />
                  获取方案与报价
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <div className="flex flex-col gap-8">
          {/* Main Content (Tabs) */}
          <div className="w-full overflow-hidden rounded-[8px] border border-[#E8ECF0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex overflow-x-auto border-b border-[#E8ECF0] bg-[#F5F7FA]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative whitespace-nowrap px-8 py-4 text-[16px] font-medium transition-colors ${
                    visibleActiveTab === tab
                      ? 'bg-white text-[#1E3A5F]'
                      : 'text-[#666666] hover:text-[#4A90D9]'
                  }`}
                >
                  {tab}
                  {visibleActiveTab === tab && (
                    <div className="absolute left-0 right-0 top-0 h-1 bg-[#4A90D9]" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px] p-8">
              {shouldRenderActiveDetailTab && activeDetailTab ? (
                <MotionReveal key={activeDetailTab.title}>
                  {activeDetailTabIsFile && activeDetailTab.fileUrl ? (
                          <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between rounded-lg border border-[#E8ECF0] bg-[#F9FAFB] p-6">
                              <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded bg-[#F0F5FA] text-[#4A90D9]">
                                  <Download className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="mb-1 text-[16px] font-medium text-[#333333]">
                                    {activeDetailTab.fileName || activeDetailTab.content || '产品文档'}
                                  </h3>
                                  <p className="text-[13px] text-[#999999]">
                                    {(activeDetailTab.fileType || activeDetailTab.fileUrl.split('.').pop())?.toUpperCase()} 文档
                                    {activeDetailTab.fileSize ? ` · ${formatFileSize(activeDetailTab.fileSize)}` : ''}
                                  </p>
                                </div>
                              </div>
                              <a
                                href={activeDetailTab.fileUrl}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded bg-[#4A90D9] px-6 py-2.5 text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-[#1E3A5F] hover:shadow-md"
                              >
                                <Download className="h-4 w-4" />
                                点击下载
                              </a>
                            </div>

                          </div>
                  ) : activeDetailTabIsFile ? (
                    <EmptyDetailState title={activeStandardTab || activeDetailTab.title} download />
                  ) : activeDetailTab.content?.trim() ? (
                          <div className="prose max-w-none text-[#666666] prose-headings:text-[#333333] prose-h3:mb-4 prose-h3:text-[18px] prose-h3:font-bold prose-p:mb-6 prose-p:text-[14px] prose-p:leading-relaxed prose-ul:mb-6 prose-ul:text-[14px] prose-li:my-1 prose-table:w-full prose-table:border-collapse prose-table:text-left prose-table:text-[14px] prose-tr:hover:bg-[#F5F7FA] prose-th:border-b prose-th:border-[#E8ECF0] prose-th:bg-[#F9FAFB] prose-th:px-4 prose-th:py-3 prose-th:font-medium prose-th:text-[#333333] prose-td:border-b prose-td:border-[#E8ECF0] prose-td:px-4 prose-td:py-3">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeDetailTab.content}</ReactMarkdown>
                          </div>
                  ) : (
                    <EmptyDetailState title={activeStandardTab || activeDetailTab.title} />
                  )}
                </MotionReveal>
              ) : (
                <>
                  {activeStandardTab === '产品简介' && (
                    <MotionReveal>
                      <h3 className="mb-4 text-[18px] font-bold text-[#333333]">产品概述</h3>
                      <p className="mb-6 text-[14px] leading-relaxed text-[#666666]">
                        {product.description}
                      </p>
                    </MotionReveal>
                  )}
                  {activeStandardTab === '技术参数' && (
                    <MotionReveal>
                      <table className="w-full border-collapse text-left text-[14px] text-[#666666]">
                        <tbody>
                          {product.specs.map((spec, i) => (
                            <tr key={i} className="border-b border-[#E8ECF0] hover:bg-[#F5F7FA]">
                              <th className="w-1/3 bg-[#F9FAFB] px-4 py-3 font-medium text-[#333333]">
                                {spec.label}
                              </th>
                              <td className="px-4 py-3">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </MotionReveal>
                  )}
                  {(activeStandardTab === '外形尺寸' || activeStandardTab === '应用案例') && (
                    <MotionReveal>
                      <EmptyDetailState title={`${activeStandardTab}内容`} />
                    </MotionReveal>
                  )}
                  {activeStandardTab === '相关下载' && (
                    <MotionReveal>
                      <EmptyDetailState title="相关下载" download />
                    </MotionReveal>
                  )}
                  {!activeStandardTab && (
                    <MotionReveal>
                      <EmptyDetailState title={`${visibleActiveTab}内容`} />
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
              className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
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
              className="relative h-full max-h-[90vh] w-full max-w-7xl overflow-hidden rounded-lg bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImages[activeImageIndex] || '/images/hs/hydraulic.svg'}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </motion.div>

            {/* Thumbnail navigation in modal */}
            {currentImages.length > 1 && (
              <div
                className="scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent hover:scrollbar-thumb-white/60 scrollbar-thumb-rounded-full absolute bottom-4 left-1/2 flex max-w-full -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-xl bg-black/50 px-4 py-3 backdrop-blur-md sm:bottom-8"
                onClick={(e) => e.stopPropagation()}
              >
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[4px] transition-all ${
                      activeImageIndex === idx
                        ? 'scale-110 border-2 border-white opacity-100 ring-2 ring-blue-500'
                        : 'border border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img || '/images/hs/hydraulic.svg'}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
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
