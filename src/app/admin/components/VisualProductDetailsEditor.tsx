'use client';

import { useId, useState } from 'react';
import {
  Download,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { AdminDetailTab, AdminProductSpec } from '@/lib/admin-store';
import {
  canonicalProductDetailTab,
  findProductDetailTab,
  productDetailTabTitles,
  type StandardProductDetailTab,
} from '@/lib/product-detail-tabs';

interface DetailTabPatch {
  content?: string;
  type?: AdminDetailTab['type'];
}

interface VisualProductDetailsEditorProps {
  description: string;
  specs: AdminProductSpec[];
  detailTabs: AdminDetailTab[];
  uploadingTabId: string;
  onDescriptionChange: (value: string) => void;
  onUpsertStandardTab: (title: StandardProductDetailTab, patch: DetailTabPatch) => void;
  onSetStandardTabType: (title: StandardProductDetailTab, type: AdminDetailTab['type']) => void;
  onUpdateDetailTab: (id: string, field: string, value: string | number) => void;
  onUploadDocument: (title: string, file: File) => void;
  onRemoveDocument: (tab: AdminDetailTab) => void;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function tabHasContent(
  title: string,
  tab: AdminDetailTab | undefined,
  description: string,
  specs: AdminProductSpec[],
) {
  const standardTitle = canonicalProductDetailTab(title);
  if (standardTitle === '产品简介') return Boolean(tab?.content.trim() || description.trim());
  if (standardTitle === '技术参数') {
    return Boolean(tab?.content.trim() || specs.some((spec) => spec.label.trim() && spec.value.trim()));
  }
  if (standardTitle === '应用案例' || standardTitle === '相关下载') {
    return Boolean(tab?.fileUrl);
  }
  if (standardTitle === '外形尺寸' && (tab?.type === 'file' || tab?.type === 'pdf')) {
    return Boolean(tab.fileUrl);
  }
  return Boolean(tab?.content.trim() || tab?.fileUrl);
}

export default function VisualProductDetailsEditor({
  description,
  specs,
  detailTabs,
  uploadingTabId,
  onDescriptionChange,
  onUpsertStandardTab,
  onSetStandardTabType,
  onUpdateDetailTab,
  onUploadDocument,
  onRemoveDocument,
}: VisualProductDetailsEditorProps) {
  const uploadInputPrefix = useId();
  const [activeTitle, setActiveTitle] = useState<string>('产品简介');
  const tabTitles = productDetailTabTitles(detailTabs);
  const visibleTitle = tabTitles.includes(activeTitle) ? activeTitle : '产品简介';
  const standardTitle = canonicalProductDetailTab(visibleTitle);
  const detailTab = findProductDetailTab(detailTabs, visibleTitle);
  const isUploading = Boolean(detailTab && uploadingTabId === detailTab.id);

  const updateContent = (value: string) => {
    if (standardTitle) {
      onUpsertStandardTab(standardTitle, { content: value, type: 'markdown' });
      return;
    }
    if (detailTab) onUpdateDetailTab(detailTab.id, 'content', value);
  };

  const renderMarkdownEditor = (
    placeholder: string,
    action?: { label: string; onClick: () => void },
  ) => (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-[#999999]">
          <FileText className="h-4 w-4" />
          支持标题、列表、表格和图片等 Markdown 内容
        </div>
        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center justify-center gap-2 rounded border border-[#4A90D9] px-3 py-2 text-xs font-medium text-[#4A90D9] hover:bg-[#F0F5FA]"
          >
            <Plus className="h-4 w-4" />
            {action.label}
          </button>
        ) : null}
      </div>
      <textarea
        value={detailTab?.content || ''}
        onChange={(event) => updateContent(event.target.value)}
        aria-label={`${visibleTitle}内容`}
        placeholder={placeholder}
        rows={12}
        className="min-h-[300px] w-full resize-y rounded border border-[#DCE5EE] bg-white px-4 py-3 font-mono text-[13px] leading-6 text-[#555555] outline-none placeholder:font-sans placeholder:text-[#B8C0C8] focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
      />
    </div>
  );

  const renderFileEditor = ({
    accept,
    prompt,
    hint,
  }: {
    accept: string;
    prompt: string;
    hint: string;
  }) => {
    const inputId = `${uploadInputPrefix}-${detailTab?.id || 'related-downloads'}`;
    return (
      <div className="space-y-4">
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUploadDocument(visibleTitle, file);
            event.currentTarget.value = '';
          }}
        />
        {detailTab?.fileUrl ? (
          <div className="flex flex-col gap-4 rounded-lg border border-[#E8ECF0] bg-[#F9FAFB] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#EAF2FA] text-[#4A90D9]">
                <Download className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#333333]">
                  {detailTab.fileName || detailTab.content || '产品资料'}
                </p>
                <p className="mt-1 text-xs uppercase text-[#999999]">
                  {detailTab.fileType || 'FILE'}
                  {detailTab.fileSize ? ` · ${formatFileSize(detailTab.fileSize)}` : ''}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={detailTab.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded border border-[#DCE5EE] bg-white px-3 py-2 text-xs font-medium text-[#666666] hover:border-[#4A90D9] hover:text-[#4A90D9]"
              >
                <Download className="h-4 w-4" />
                查看文件
              </a>
              <label
                htmlFor={inputId}
                className="inline-flex cursor-pointer items-center gap-2 rounded bg-[#4A90D9] px-3 py-2 text-xs font-medium text-white hover:bg-[#1E3A5F]"
              >
                {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {isUploading ? '上传中' : '替换'}
              </label>
              <button
                type="button"
                title="移除文件"
                aria-label="移除文件"
                onClick={() => onRemoveDocument(detailTab)}
                className="rounded p-2 text-[#999999] hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#9ABCE0] bg-[#F9FBFD] text-sm font-medium text-[#4A90D9] hover:bg-[#F0F5FA]"
          >
            {isUploading ? <LoaderCircle className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8" />}
            {isUploading ? '正在上传到 Supabase...' : prompt}
            <span className="text-xs font-normal text-[#999999]">{hint}</span>
          </label>
        )}
        <input
          type="text"
          value={detailTab?.content || ''}
          onChange={(event) => {
            if (standardTitle) {
              onUpsertStandardTab(standardTitle, { content: event.target.value, type: 'file' });
            } else if (detailTab) {
              onUpdateDetailTab(detailTab.id, 'content', event.target.value);
            }
          }}
          aria-label={`${visibleTitle}说明`}
          placeholder="文件说明（可选）"
          className="w-full rounded border border-[#DCE5EE] px-4 py-2.5 text-sm outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
        />
      </div>
    );
  };

  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-[#E8ECF0] bg-white">
      <div className="flex overflow-x-auto border-b border-[#E8ECF0] bg-[#F5F7FA]">
        {tabTitles.map((title) => {
          const tab = findProductDetailTab(detailTabs, title);
          const hasContent = tabHasContent(title, tab, description, specs);
          return (
            <button
              key={title}
              type="button"
              onClick={() => {
                setActiveTitle(title);
                if (canonicalProductDetailTab(title) === '技术参数') {
                  onSetStandardTabType('技术参数', 'markdown');
                } else if (canonicalProductDetailTab(title) === '应用案例') {
                  onSetStandardTabType('应用案例', 'file');
                }
              }}
              className={`relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-5 py-4 text-[14px] font-medium transition-colors sm:px-6 ${
                visibleTitle === title
                  ? 'bg-white text-[#1E3A5F]'
                  : 'text-[#666666] hover:text-[#4A90D9]'
              }`}
            >
              {title}
              <span
                title={hasContent ? '已有内容' : '尚未填写'}
                className={`h-1.5 w-1.5 rounded-full ${hasContent ? 'bg-[#28A745]' : 'bg-[#C7CDD4]'}`}
              />
              {visibleTitle === title ? <span className="absolute inset-x-0 top-0 h-1 bg-[#4A90D9]" /> : null}
            </button>
          );
        })}
      </div>

      <div className="min-h-[400px] p-5 sm:p-8">
        {standardTitle === '产品简介' && !detailTab ? (
          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            aria-label="产品简介"
            placeholder="输入产品简介"
            rows={10}
            className="min-h-[300px] w-full resize-y border-0 bg-transparent p-0 text-[14px] leading-7 text-[#666666] outline-none placeholder:text-[#B8C0C8] focus:ring-0"
          />
        ) : null}

        {standardTitle === '产品简介' && detailTab
          ? renderMarkdownEditor('输入完整产品介绍，可使用 Markdown 排版')
          : null}

        {standardTitle === '技术参数' && !detailTab ? (
          renderMarkdownEditor(
            '例如：\n\n### 液压参数\n\n| 参数 | 规格 |\n| --- | --- |\n| 系统压力 | 31.5 MPa |\n| 额定流量 | 120 L/min |',
            {
              label: '根据基础参数生成表格',
              onClick: () => onUpsertStandardTab('技术参数', {
                content: specsToMarkdownTable(specs),
                type: 'markdown',
              }),
            },
          )
        ) : null}

        {standardTitle === '技术参数' && detailTab
          ? renderMarkdownEditor('可使用 Markdown 表格编写详细技术参数', {
              label: '重新生成参数表格',
              onClick: () => onUpsertStandardTab('技术参数', {
                content: specsToMarkdownTable(specs),
                type: 'markdown',
              }),
            })
          : null}

        {standardTitle === '外形尺寸'
          ? (
              <div className="space-y-5">
                <div className="inline-flex rounded border border-[#DCE5EE] bg-[#F5F7FA] p-1">
                  <button
                    type="button"
                    onClick={() => onSetStandardTabType('外形尺寸', 'markdown')}
                    className={`rounded px-4 py-2 text-xs font-medium ${
                      detailTab?.type !== 'file' && detailTab?.type !== 'pdf'
                        ? 'bg-white text-[#1E3A5F] shadow-sm'
                        : 'text-[#666666] hover:text-[#4A90D9]'
                    }`}
                  >
                    Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetStandardTabType('外形尺寸', 'file')}
                    className={`rounded px-4 py-2 text-xs font-medium ${
                      detailTab?.type === 'file' || detailTab?.type === 'pdf'
                        ? 'bg-white text-[#1E3A5F] shadow-sm'
                        : 'text-[#666666] hover:text-[#4A90D9]'
                    }`}
                  >
                    PDF / PPTX 文件
                  </button>
                </div>
                {detailTab?.type === 'file' || detailTab?.type === 'pdf'
                  ? renderFileEditor({
                      accept: '.pdf,.pptx',
                      prompt: '上传外形尺寸文件',
                      hint: 'PDF 或 PPTX',
                    })
                  : renderMarkdownEditor('例如：\n\n### 安装尺寸\n\n| 项目 | 尺寸 |\n| --- | --- |\n| 长 × 宽 × 高 | 1200 × 800 × 950 mm |')}
              </div>
            )
          : null}

        {standardTitle === '应用案例'
          ? renderFileEditor({
              accept: '.pdf,.pptx',
              prompt: '上传应用案例文件',
              hint: 'PDF 或 PPTX',
            })
          : null}

        {standardTitle === '相关下载'
          ? renderFileEditor({
              accept: '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip',
              prompt: '上传产品手册或相关资料',
              hint: 'PDF、PPT、Word、Excel 或 ZIP',
            })
          : null}

        {!standardTitle && detailTab?.type !== 'file' && detailTab?.type !== 'pdf'
          ? renderMarkdownEditor('编辑此自定义详情内容')
          : null}

        {!standardTitle && (detailTab?.type === 'file' || detailTab?.type === 'pdf')
          ? renderFileEditor({
              accept: '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip',
              prompt: '上传产品资料',
              hint: 'PDF、PPT、Word、Excel 或 ZIP',
            })
          : null}
      </div>
    </div>
  );
}

function specsToMarkdownTable(specs: AdminProductSpec[]) {
  const rows = specs
    .filter((spec) => spec.label.trim() || spec.value.trim())
    .map((spec) => `| ${escapeMarkdownCell(spec.label)} | ${escapeMarkdownCell(spec.value)} |`);

  return [
    '### 技术参数',
    '',
    '| 参数 | 规格 |',
    '| --- | --- |',
    ...(rows.length ? rows : ['| 参数名称 | 参数值 |']),
  ].join('\n');
}

function escapeMarkdownCell(value: string) {
  return value.trim().replace(/\|/g, '\\|').replace(/\r?\n/g, '<br />');
}
