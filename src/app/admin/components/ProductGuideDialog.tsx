'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  BookOpen,
  Rocket,
  LayoutTemplate,
  SlidersHorizontal,
  Layers3,
  Image as ImageIcon,
  Package,
  FileText,
  Eye,
  Save,
  Lightbulb,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const tocItems = [
  { id: 'guide-quickstart', label: '快速上手' },
  { id: 'guide-editor', label: '两种编辑模式' },
  { id: 'guide-fields', label: '字段说明' },
  { id: 'guide-tabs', label: '详情Tab页' },
  { id: 'guide-save', label: '预览与保存' },
  { id: 'guide-faq', label: '常见问题' },
];

const fieldRows: { name: string; desc: string; required?: boolean }[] = [
  { name: '产品名称', desc: '产品的正式名称，会显示在列表与详情页标题。', required: true },
  { name: '产品型号', desc: '如 HS-17M-PB，用于区分不同规格，可选填。' },
  { name: '所属二级分类', desc: '决定产品归属与前台导航位置，必须先建好分类。', required: true },
  { name: '页面标识', desc: '由产品名称自动生成，用于前台链接，无需手动填写。' },
  { name: '简要描述', desc: '一句话卖点，显示在列表卡片的简介位置。' },
  { name: '排序', desc: '数字越小越靠前，用于调整产品展示顺序。' },
  { name: '状态', desc: '启用后前台可见；禁用后仅后台保留，前台不展示。' },
  { name: '规格参数', desc: '参数名 + 参数值，会显示在列表卡片与详情页。' },
  { name: '核心特性', desc: '产品卖点列表，逐条列出优势。' },
  { name: '产品图片', desc: '第一张自动作为封面，上传时会自动压缩为 WebP。' },
];

export default function ProductGuideDialog({ open, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState(tocItems[0].id);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/45 p-3 sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-guide-title"
        className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E8ECF0] bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E8ECF0] bg-[#1E3A5F] px-6 py-5 text-white">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 id="product-guide-title" className="text-[18px] font-bold">
                产品管理使用手册
              </h2>
              <p className="mt-1 text-xs text-white/70">5 分钟看懂产品从建分类到上线的完整流程</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭使用手册"
            className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* TOC */}
        <div className="flex flex-wrap gap-2 border-b border-[#E8ECF0] bg-[#F9FAFB] px-6 py-3">
          {tocItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeSection === item.id
                  ? 'bg-[#4A90D9] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#EAF2FA] hover:text-[#1E3A5F]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* 快速上手 */}
          <section id="guide-quickstart" className="scroll-mt-4">
            <SectionTitle icon={Rocket} title="快速上手：三步搞定一个产品" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StepCard
                step={1}
                title="先建分类"
                desc="到「分类管理」创建一级分类，再在下面添加二级分类。产品必须归属到一个二级分类。"
              />
              <StepCard
                step={2}
                title="新增产品"
                desc="在「产品管理」点击右上角「新增产品」，进入编辑页面。"
              />
              <StepCard
                step={3}
                title="填写并保存"
                desc="填写名称、分类、参数、上传图片，点「预览并保存」核对后「确认保存」。"
              />
            </div>
          </section>

          {/* 两种编辑模式 */}
          <section id="guide-editor" className="scroll-mt-4">
            <SectionTitle icon={LayoutTemplate} title="两种编辑模式，任选其一" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ModeCard
                icon={LayoutTemplate}
                name="可视化编辑（推荐）"
                desc="像前台详情页一样所见即所得，直接点对应位置就能填写。适合大多数情况，一眼就知道内容会展示成什么样。"
              />
              <ModeCard
                icon={SlidersHorizontal}
                name="字段编辑"
                desc="传统折叠式表单，按「基本信息 / 规格参数 / 核心特性 / 产品图片」等模块集中填写，适合结构化地核对或批量修改字段。"
              />
            </div>
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-[#F0F5FA] px-4 py-3 text-xs text-[#4A6580]">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#4A90D9]" />
              两种模式填写的是同一份数据，随时可切换，不会丢失已填内容。
            </p>
          </section>

          {/* 字段说明 */}
          <section id="guide-fields" className="scroll-mt-4">
            <SectionTitle icon={Layers3} title="字段说明" />
            <div className="overflow-hidden rounded-xl border border-[#E8ECF0]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F9FAFB] text-xs uppercase text-[#999999]">
                  <tr>
                    <th className="w-40 px-4 py-3 font-medium">字段</th>
                    <th className="px-4 py-3 font-medium">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldRows.map((row) => (
                    <tr key={row.name} className="border-t border-[#E8ECF0]">
                      <td className="px-4 py-3 align-top">
                        <span className="font-medium text-[#333333]">{row.name}</span>
                        {row.required ? (
                          <span className="ml-1 text-red-500" title="必填">
                            *
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 align-top text-[#666666]">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E8ECF0] bg-[#F9FAFB] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1E3A5F]">
                  <Package className="h-4 w-4 text-[#4A90D9]" />
                  子产品变体
                </div>
                <p className="text-xs leading-relaxed text-[#666666]">
                  同一产品的不同型号，例如布料机有 17 米 / 33 米 / 36
                  米。可分别设置各自的图片与参数，前台会在详情页合并展示。
                </p>
              </div>
              <div className="rounded-xl border border-[#E8ECF0] bg-[#F9FAFB] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1E3A5F]">
                  <ImageIcon className="h-4 w-4 text-[#4A90D9]" />
                  图片小贴士
                </div>
                <p className="text-xs leading-relaxed text-[#666666]">
                  第一张图作为封面；上传时自动转 WebP 并压缩，原图与缩略图都会生成，可上下调整顺序。
                </p>
              </div>
            </div>
          </section>

          {/* 详情Tab页 */}
          <section id="guide-tabs" className="scroll-mt-4">
            <SectionTitle icon={FileText} title="详情Tab页：丰富产品详情内容" />
            <ul className="space-y-2 text-sm text-[#666666]">
              <TabRow name="产品简介" desc="使用 Markdown 富文本编写，支持标题、列表、图片等。" />
              <TabRow name="技术参数" desc="使用 Markdown 表格填写参数明细。" />
              <TabRow name="应用案例" desc="上传 PDF / PPTX 文件作为案例展示。" />
              <TabRow name="相关下载" desc="上传说明书、图纸等资料，供前台下载。" />
              <TabRow name="外形尺寸" desc="上传 PDF / PPTX 展示尺寸图。" />
            </ul>
          </section>

          {/* 预览与保存 */}
          <section id="guide-save" className="scroll-mt-4">
            <SectionTitle icon={Save} title="预览与保存" />
            <ol className="space-y-2 text-sm text-[#666666]">
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#4A90D9]" />
                点击右上角「预览并保存」，会先弹出前台效果预览，此时内容
                <strong className="text-[#333333]">尚未写入</strong>。
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#4A90D9]" />
                在预览里核对图片、参数、详情内容，确认无误后点击「确认保存」。
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#4A90D9]" />
                图片 / 文件中<strong className="text-[#333333]">正在上传时</strong>
                请等待完成再预览，避免资料缺失。
              </li>
            </ol>
          </section>

          {/* 常见问题 */}
          <section id="guide-faq" className="scroll-mt-4">
            <SectionTitle icon={HelpCircle} title="常见问题" />
            <div className="space-y-3">
              <FaqItem
                q="为什么无法上传图片 / 资料？"
                a="上传前需要先填写「产品名称」并选择「所属二级分类」，否则系统不知道往哪个目录存文件。"
              />
              <FaqItem
                q="前台看不到刚添加的产品？"
                a="请依次检查：① 产品「状态」是否为启用；② 所属分类是否正确；③ 前台列表是否开启了筛选（可点「清除全部」）。"
              />
              <FaqItem
                q="删除产品后能恢复吗？"
                a="不能。删除的同时会清理该产品关联的图片与资料文件，请谨慎操作。"
              />
              <FaqItem q="如何调整前台展示顺序？" a="修改产品「排序」数字，数值越小越靠前。" />
              <FaqItem
                q="产品列表页的图标都是什么？"
                a="眼睛＝前台预览，铅笔＝编辑，垃圾桶＝删除；「状态」开关可直接启用 / 停用产品。"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-[#E8ECF0] bg-[#F9FAFB] px-6 py-4">
          <p className="hidden text-xs text-[#999999] sm:block">
            还有疑问？可先按「快速上手」走一遍流程。
          </p>
          <button
            onClick={onClose}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#162A45]"
          >
            <Eye className="h-4 w-4" />
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-[#1E3A5F]">
      <Icon className="h-5 w-5 text-[#4A90D9]" />
      {title}
    </h3>
  );
}

function StepCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-[#E8ECF0] bg-[#F9FAFB] p-4">
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#4A90D9] text-xs font-bold text-white">
        {step}
      </div>
      <p className="text-sm font-semibold text-[#333333]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#666666]">{desc}</p>
    </div>
  );
}

function ModeCard({
  icon: Icon,
  name,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-[#E8ECF0] p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1E3A5F]">
        <Icon className="h-4 w-4 text-[#4A90D9]" />
        {name}
      </div>
      <p className="text-xs leading-relaxed text-[#666666]">{desc}</p>
    </div>
  );
}

function TabRow({ name, desc }: { name: string; desc: string }) {
  return (
    <li className="flex flex-col gap-0.5 rounded-lg border border-[#E8ECF0] px-4 py-2.5 sm:flex-row sm:items-center sm:gap-3">
      <span className="w-24 shrink-0 font-medium text-[#333333]">{name}</span>
      <span className="text-xs text-[#666666] sm:text-sm">{desc}</span>
    </li>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-[#E8ECF0] bg-[#F9FAFB] p-4">
      <p className="flex items-start gap-2 text-sm font-medium text-[#333333]">
        <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B35]" />
        {q}
      </p>
      <p className="mt-1.5 pl-6 text-xs leading-relaxed text-[#666666]">{a}</p>
    </div>
  );
}
