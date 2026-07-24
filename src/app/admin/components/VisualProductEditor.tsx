'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Image as ImageIcon,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import type {
  AdminCategory,
  AdminDetailTab,
  AdminProductSpec,
  AdminSubCategory,
} from '@/lib/admin-store';
import type { StandardProductDetailTab } from '@/lib/product-detail-tabs';
import { Switch } from '@/components/ui/switch';
import SubCategorySelect from './SubCategorySelect';
import VisualProductDetailsEditor from './VisualProductDetailsEditor';

interface VisualProductEditorProps {
  categories: AdminCategory[];
  subCategories: AdminSubCategory[];
  name: string;
  model: string;
  description: string;
  generatedSlug: string;
  subCategoryId: string;
  specs: AdminProductSpec[];
  features: string[];
  images: string[];
  sortOrder: number;
  isActive: boolean;
  uploadingImages: boolean;
  imageNotice: string;
  detailTabs: AdminDetailTab[];
  uploadingTabId: string;
  onNameChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  onSortOrderChange: (value: number) => void;
  onActiveChange: (value: boolean) => void;
  onAddSpec: () => void;
  onUpdateSpec: (id: string, field: 'label' | 'value', value: string) => void;
  onRemoveSpec: (id: string) => void;
  onAddFeature: () => void;
  onUpdateFeature: (index: number, value: string) => void;
  onRemoveFeature: (index: number) => void;
  onUploadImages: () => void;
  onMoveImage: (index: number, direction: -1 | 1) => void;
  onRemoveImage: (index: number) => void;
  onUpsertStandardTab: (
    title: StandardProductDetailTab,
    patch: { content?: string; type?: AdminDetailTab['type'] },
  ) => void;
  onSetStandardTabType: (title: StandardProductDetailTab, type: AdminDetailTab['type']) => void;
  onUpdateDetailTab: (id: string, field: string, value: string | number) => void;
  onUploadDocument: (title: string, file: File) => void;
  onRemoveDocument: (tab: AdminDetailTab) => void;
}

const inlineInputClass =
  'w-full min-w-0 border-0 bg-transparent p-0 outline-none placeholder:text-[#B8C0C8] focus:ring-0';

export default function VisualProductEditor({
  categories,
  subCategories,
  name,
  model,
  description,
  generatedSlug,
  subCategoryId,
  specs,
  features,
  images,
  sortOrder,
  isActive,
  uploadingImages,
  imageNotice,
  detailTabs,
  uploadingTabId,
  onNameChange,
  onModelChange,
  onDescriptionChange,
  onSubCategoryChange,
  onSortOrderChange,
  onActiveChange,
  onAddSpec,
  onUpdateSpec,
  onRemoveSpec,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
  onUploadImages,
  onMoveImage,
  onRemoveImage,
  onUpsertStandardTab,
  onSetStandardTabType,
  onUpdateDetailTab,
  onUploadDocument,
  onRemoveDocument,
}: VisualProductEditorProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const visibleImageIndex = Math.min(activeImageIndex, Math.max(0, images.length - 1));
  const activeImage = images[visibleImageIndex];

  return (
    <div className="overflow-hidden rounded-lg border border-[#DCE5EE] bg-[#F5F7FA] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="border-b border-[#E8ECF0] bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1E3A5F]">产品详情</p>
            <p className="mt-1 truncate font-mono text-xs text-[#999999]">
              /products/{name.trim() ? generatedSlug : 'new-product'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-[#666666]" htmlFor="visual-product-sort">
              排序
            </label>
            <input
              id="visual-product-sort"
              type="number"
              value={sortOrder}
              onChange={(event) => onSortOrderChange(Number(event.target.value))}
              className="h-9 w-20 rounded border border-[#DCE5EE] bg-white px-3 text-sm outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
            />
            <Switch checked={isActive} onCheckedChange={onActiveChange} />
            <span className="text-xs text-[#666666]">{isActive ? '启用' : '禁用'}</span>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-8 rounded-lg border border-[#E8ECF0] bg-white p-4 sm:p-6 lg:flex-row lg:gap-10">
          <div className="flex min-w-0 flex-col gap-4 lg:w-[58%]">
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-[#E8ECF0] bg-[#F8FAFC]">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={name || '产品图片'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain"
                  priority
                />
              ) : (
                <button
                  type="button"
                  disabled={uploadingImages}
                  onClick={onUploadImages}
                  className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-[#666666] transition-colors hover:text-[#4A90D9] disabled:opacity-50"
                >
                  {uploadingImages ? (
                    <LoaderCircle className="h-9 w-9 animate-spin" />
                  ) : (
                    <ImageIcon className="h-9 w-9" />
                  )}
                  {uploadingImages ? '压缩上传中...' : '上传产品图片'}
                </button>
              )}

              {activeImage ? (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded bg-white/95 p-1 shadow-sm">
                  <button
                    type="button"
                    title="上传图片"
                    aria-label="上传图片"
                    disabled={uploadingImages}
                    onClick={onUploadImages}
                    className="rounded p-2 text-[#666666] hover:bg-[#F0F5FA] hover:text-[#4A90D9] disabled:opacity-50"
                  >
                    {uploadingImages ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    title="删除当前图片"
                    aria-label="删除当前图片"
                    onClick={() => onRemoveImage(visibleImageIndex)}
                    className="rounded p-2 text-[#999999] hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>

            {images.length ? (
              <div className="flex min-h-20 items-center gap-3 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <div key={image} className="group relative shrink-0">
                    <button
                      type="button"
                      aria-label={`查看第 ${index + 1} 张图片`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-20 w-20 overflow-hidden rounded border-2 bg-white ${
                        visibleImageIndex === index
                          ? 'border-[#4A90D9]'
                          : 'border-[#E8ECF0] hover:border-[#9ABCE0]'
                      }`}
                    >
                      <Image src={image} alt={`${name || '产品'} ${index + 1}`} fill sizes="80px" className="object-contain p-1" />
                    </button>
                    {visibleImageIndex === index ? (
                      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 rounded border border-[#DCE5EE] bg-white shadow-sm">
                        <button
                          type="button"
                          title="图片前移"
                          aria-label="图片前移"
                          disabled={index === 0}
                          onClick={() => {
                            onMoveImage(index, -1);
                            setActiveImageIndex(index - 1);
                          }}
                          className="p-1 text-[#666666] hover:text-[#4A90D9] disabled:opacity-25"
                        >
                          <ArrowUp className="h-3 w-3 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          title="图片后移"
                          aria-label="图片后移"
                          disabled={index === images.length - 1}
                          onClick={() => {
                            onMoveImage(index, 1);
                            setActiveImageIndex(index + 1);
                          }}
                          className="p-1 text-[#666666] hover:text-[#4A90D9] disabled:opacity-25"
                        >
                          <ArrowDown className="h-3 w-3 -rotate-90" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
                <button
                  type="button"
                  title="上传更多图片"
                  aria-label="上传更多图片"
                  disabled={uploadingImages}
                  onClick={onUploadImages}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded border border-dashed border-[#B9C8D8] text-[#666666] hover:border-[#4A90D9] hover:text-[#4A90D9] disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            ) : null}

            {imageNotice ? (
              <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                {imageNotice}
              </p>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col lg:w-[42%]">
            <input
              type="text"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              aria-label="产品名称"
              placeholder="输入产品名称"
              className={`${inlineInputClass} mb-2 text-[24px] font-bold leading-tight text-[#333333]`}
              required
            />
            <div className="mb-5 border-b border-[#E8ECF0] pb-5">
              <div className="flex items-center gap-2 text-[15px] text-[#666666]">
                <span className="shrink-0">型号：</span>
                <input
                  type="text"
                  value={model}
                  onChange={(event) => onModelChange(event.target.value)}
                  aria-label="产品型号"
                  placeholder="输入产品型号"
                  className={`${inlineInputClass} text-[15px] text-[#666666]`}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-[13px] font-medium text-[#333333]">所属二级分类 *</label>
              <SubCategorySelect
                categories={categories}
                subCategories={subCategories}
                value={subCategoryId}
                onChange={onSubCategoryChange}
              />
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[14px] font-medium text-[#333333]">规格参数</h3>
                <button
                  type="button"
                  title="添加参数"
                  aria-label="添加参数"
                  onClick={onAddSpec}
                  className="rounded p-1.5 text-[#4A90D9] hover:bg-[#F0F5FA]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.id} className="group relative min-w-0 border-b border-[#EDF0F3] pb-2 pr-6">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(event) => onUpdateSpec(spec.id, 'label', event.target.value)}
                      aria-label="参数名称"
                      placeholder="参数名称"
                      className={`${inlineInputClass} text-[12px] text-[#666666]`}
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(event) => onUpdateSpec(spec.id, 'value', event.target.value)}
                      aria-label="参数值"
                      placeholder="参数值"
                      className={`${inlineInputClass} mt-1 text-[14px] font-medium text-[#333333]`}
                    />
                    <button
                      type="button"
                      title="删除参数"
                      aria-label="删除参数"
                      onClick={() => onRemoveSpec(spec.id)}
                      className="absolute right-0 top-2 rounded p-1 text-[#CCCCCC] opacity-100 hover:text-red-500 lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E8ECF0] pt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-[14px] font-medium text-[#333333]">核心特性</h3>
                <button
                  type="button"
                  title="添加特性"
                  aria-label="添加特性"
                  onClick={onAddFeature}
                  className="rounded p-1.5 text-[#4A90D9] hover:bg-[#F0F5FA]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="group flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#28A745]" />
                    <input
                      type="text"
                      value={feature}
                      onChange={(event) => onUpdateFeature(index, event.target.value)}
                      aria-label={`核心特性 ${index + 1}`}
                      placeholder="输入核心特性"
                      className={`${inlineInputClass} text-[14px] text-[#666666]`}
                    />
                    <button
                      type="button"
                      title="删除特性"
                      aria-label="删除特性"
                      onClick={() => onRemoveFeature(index)}
                      className="rounded p-1 text-[#CCCCCC] opacity-100 hover:text-red-500 lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <VisualProductDetailsEditor
          description={description}
          specs={specs}
          detailTabs={detailTabs}
          uploadingTabId={uploadingTabId}
          onDescriptionChange={onDescriptionChange}
          onUpsertStandardTab={onUpsertStandardTab}
          onSetStandardTabType={onSetStandardTabType}
          onUpdateDetailTab={onUpdateDetailTab}
          onUploadDocument={onUploadDocument}
          onRemoveDocument={onRemoveDocument}
        />
      </div>
    </div>
  );
}
