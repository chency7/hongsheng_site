'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  Package,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import type { AdminProduct, AdminProductSpec, AdminSubProduct, AdminDetailTab } from '@/lib/admin-store';
import SubCategorySelect from '../components/SubCategorySelect';
import { Switch } from '@/components/ui/switch';

interface Props {
  initialProduct?: AdminProduct;
}

function SectionHeader({
  title,
  icon: Icon,
  section,
  expanded,
  onToggle,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
  expanded: boolean;
  onToggle: (section: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(section)}
      className="flex w-full items-center justify-between rounded-xl border border-[#E8ECF0] bg-white px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:border-[#4A90D9]"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#4A90D9]" />
        <span className="text-[16px] font-semibold text-[#1E3A5F]">{title}</span>
      </div>
      {expanded ? (
        <ChevronUp className="h-5 w-5 text-[#999999]" />
      ) : (
        <ChevronDown className="h-5 w-5 text-[#999999]" />
      )}
    </button>
  );
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export default function ProductForm({ initialProduct }: Props) {
  const {
    getSubCategories,
    getCategories,
    createProduct,
    updateProduct,
  } = useAdminStore();

  const subCategories = getSubCategories();
  const categories = getCategories();
  const isEdit = !!initialProduct;

  // Basic info
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [model, setModel] = useState(initialProduct?.model || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '其他');
  const [subCategoryId, setSubCategoryId] = useState(initialProduct?.subCategoryId || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [coverImage, setCoverImage] = useState(initialProduct?.coverImage || '');
  const [sortOrder, setSortOrder] = useState(initialProduct?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [images, setImages] = useState<string[]>(initialProduct?.images || []);

  // Specs
  const [specs, setSpecs] = useState<AdminProductSpec[]>(
    initialProduct?.specs || [{ id: generateId(), label: '', value: '', sortOrder: 0 }]
  );

  // Features
  const [features, setFeatures] = useState<string[]>(initialProduct?.features || ['']);

  // Sub-products
  const [subProducts, setSubProducts] = useState<AdminSubProduct[]>(
    initialProduct?.subProducts || []
  );

  // Detail tabs
  const [detailTabs, setDetailTabs] = useState<AdminDetailTab[]>(
    initialProduct?.detailTabs || []
  );

  // UI state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    specs: true,
    features: true,
    subProducts: false,
    tabs: false,
    images: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Specs handlers
  const addSpec = () => {
    setSpecs([...specs, { id: generateId(), label: '', value: '', sortOrder: specs.length }]);
  };
  const updateSpec = (id: string, field: 'label' | 'value', val: string) => {
    setSpecs(specs.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };
  const removeSpec = (id: string) => {
    if (specs.length <= 1) return;
    setSpecs(specs.filter((s) => s.id !== id));
  };

  // Features handlers
  const addFeature = () => setFeatures([...features, '']);
  const updateFeature = (idx: number, val: string) => {
    setFeatures(features.map((f, i) => (i === idx ? val : f)));
  };
  const removeFeature = (idx: number) => {
    if (features.length <= 1) return;
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Images handlers
  const addImage = () => setImages([...images, '']);
  const updateImage = (idx: number, val: string) => setImages(images.map((img, i) => (i === idx ? val : img)));
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  // Sub-product handlers
  const addSubProduct = () => {
    const sp: AdminSubProduct = {
      id: generateId(),
      name: '',
      slug: '',
      model: '',
      coverImage: '',
      images: [],
      specs: [{ id: generateId(), label: '', value: '', sortOrder: 0 }],
      hydraulicParams: '',
      electricParams: '',
      sortOrder: subProducts.length,
    };
    setSubProducts([...subProducts, sp]);
  };
  const updateSubProduct = (id: string, field: string, val: string | string[] | AdminProductSpec[]) => {
    setSubProducts(subProducts.map((sp) => (sp.id === id ? { ...sp, [field]: val } : sp)));
  };
  const removeSubProduct = (id: string) => {
    setSubProducts(subProducts.filter((sp) => sp.id !== id));
  };
  const addSubProductSpec = (subId: string) => {
    setSubProducts(
      subProducts.map((sp) =>
        sp.id === subId
          ? { ...sp, specs: [...sp.specs, { id: generateId(), label: '', value: '', sortOrder: sp.specs.length }] }
          : sp
      )
    );
  };
  const updateSubProductSpec = (subId: string, specId: string, field: 'label' | 'value', val: string) => {
    setSubProducts(
      subProducts.map((sp) =>
        sp.id === subId
          ? { ...sp, specs: sp.specs.map((s) => (s.id === specId ? { ...s, [field]: val } : s)) }
          : sp
      )
    );
  };
  const removeSubProductSpec = (subId: string, specId: string) => {
    setSubProducts(
      subProducts.map((sp) =>
        sp.id === subId && sp.specs.length > 1
          ? { ...sp, specs: sp.specs.filter((s) => s.id !== specId) }
          : sp
      )
    );
  };
  const addSubProductImage = (subId: string) => {
    setSubProducts(
      subProducts.map((sp) =>
        sp.id === subId ? { ...sp, images: [...sp.images, ''] } : sp
      )
    );
  };
  const updateSubProductImage = (subId: string, idx: number, val: string) => {
    setSubProducts(
      subProducts.map((sp) =>
        sp.id === subId ? { ...sp, images: sp.images.map((img, i) => (i === idx ? val : img)) } : sp
      )
    );
  };
  const removeSubProductImage = (subId: string, idx: number) => {
    setSubProducts(
      subProducts.map((sp) =>
        sp.id === subId ? { ...sp, images: sp.images.filter((_, i) => i !== idx) } : sp
      )
    );
  };

  // Detail tabs handlers
  const addDetailTab = () => {
    const dt: AdminDetailTab = {
      id: generateId(),
      title: '',
      content: '',
      type: 'markdown',
      sortOrder: detailTabs.length,
    };
    setDetailTabs([...detailTabs, dt]);
  };
  const updateDetailTab = (id: string, field: string, val: string) => {
    setDetailTabs(detailTabs.map((dt) => (dt.id === id ? { ...dt, [field]: val } : dt)));
  };
  const removeDetailTab = (id: string) => {
    setDetailTabs(detailTabs.filter((dt) => dt.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!name.trim()) {
      setError('请输入产品名称');
      setSaving(false);
      return;
    }
    if (!subCategoryId) {
      setError('请选择所属分类');
      setSaving(false);
      return;
    }

    const validSpecs = specs.filter((s) => s.label.trim() && s.value.trim());
    const validFeatures = features.filter((f) => f.trim());
    const validImages = images.filter((i) => i.trim());
    const finalSlug = slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-');

    const productData = {
      slug: finalSlug,
      subCategoryId,
      name: name.trim(),
      model: model.trim(),
      brand,
      description: description.trim(),
      coverImage: coverImage.trim() || (validImages[0] || ''),
      images: validImages,
      specs: validSpecs,
      features: validFeatures,
      subProducts: subProducts
        .filter((sp) => sp.name.trim())
        .map((sp) => ({
          ...sp,
          specs: sp.specs.filter((s) => s.label.trim() && s.value.trim()),
          images: sp.images.filter((i) => i.trim()),
        })),
      detailTabs: detailTabs.filter((dt) => dt.title.trim()),
      files: initialProduct?.files || [],
      sortOrder,
      isActive,
    };

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (isEdit && initialProduct) {
      updateProduct(initialProduct.id, productData);
    } else {
      createProduct(productData as any);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="rounded-lg border border-[#E8ECF0] p-2 text-[#999999] hover:bg-[#F5F7FA] hover:text-[#333333] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold text-[#1E3A5F]">
              {isEdit ? '编辑产品' : '新增产品'}
            </h1>
            <p className="mt-1 text-sm text-[#999999]">
              {isEdit ? `正在编辑：${initialProduct?.name}` : '创建新的产品记录'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEdit && initialProduct && (
            <Link
              href={`/products/${initialProduct.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm font-medium text-[#666666] hover:bg-[#F5F7FA] transition-colors"
            >
              <Eye className="h-4 w-4" />
              前台预览
            </Link>
          )}
          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#28A745] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#28A745]/10 transition-all hover:bg-[#218838] hover:-translate-y-[1px] disabled:pointer-events-none disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? '保存中...' : saved ? '已保存' : '保存'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-600">
          {isEdit ? '产品信息已更新' : '产品创建成功'}{' '}
          <Link href="/admin/products" className="underline">
            返回产品列表
          </Link>
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Basic Info */}
        <SectionHeader title="基本信息" icon={FileText} section="basic" expanded={expandedSections.basic} onToggle={toggleSection} />
        {expandedSections.basic && (
          <div className="rounded-xl border border-[#E8ECF0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">产品名称 *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                  placeholder="例如：布料机液压站"
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">标识 (slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="例如：p-concrete-placing-boom"
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm font-mono outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">产品型号</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="例如：HS-17M-PB"
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">品牌</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                >
                  <option value="福艾德">福艾德</option>
                  <option value="派克">派克</option>
                  <option value="力士乐">力士乐</option>
                  <option value="贺德克">贺德克</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">所属分类 *</label>
                <SubCategorySelect
                  subCategories={subCategories}
                  categories={categories}
                  value={subCategoryId}
                  onChange={setSubCategoryId}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#666666]">简要描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="产品简要描述，显示在列表卡片中..."
                rows={3}
                className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">封面图片URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="例如：/images/products/xxx/1.jpg"
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">排序</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">状态</label>
                <div className="flex items-center gap-3 pt-1.5">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <span className="text-sm text-[#666666]">{isActive ? '启用' : '禁用'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Specs */}
        <SectionHeader title="规格参数" icon={FileText} section="specs" expanded={expandedSections.specs} onToggle={toggleSection} />
        {expandedSections.specs && (
          <div className="rounded-xl border border-[#E8ECF0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="space-y-3">
              {specs.map((spec) => (
                <div key={spec.id} className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 shrink-0 text-[#CCCCCC]" />
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => updateSpec(spec.id, 'label', e.target.value)}
                    placeholder="参数名（如：系统压力）"
                    className="flex-1 rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                    placeholder="参数值（如：30Mpa）"
                    className="flex-1 rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(spec.id)}
                    className="rounded p-1.5 text-[#CCCCCC] hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSpec}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#4A90D9] px-4 py-2 text-sm font-medium text-[#4A90D9] hover:bg-[#F0F5FA] transition-colors"
            >
              <Plus className="h-4 w-4" />
              添加参数
            </button>
          </div>
        )}

        {/* 3. Features */}
        <SectionHeader title="核心特性" icon={FileText} section="features" expanded={expandedSections.features} onToggle={toggleSection} />
        {expandedSections.features && (
          <div className="rounded-xl border border-[#E8ECF0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="space-y-3">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 shrink-0 text-[#CCCCCC]" />
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    placeholder="例如：全套一体化设计"
                    className="flex-1 rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="rounded p-1.5 text-[#CCCCCC] hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#4A90D9] px-4 py-2 text-sm font-medium text-[#4A90D9] hover:bg-[#F0F5FA] transition-colors"
            >
              <Plus className="h-4 w-4" />
              添加特性
            </button>
          </div>
        )}

        {/* 4. Images */}
        <SectionHeader title="产品图片" icon={ImageIcon} section="images" expanded={expandedSections.images} onToggle={toggleSection} />
        {expandedSections.images && (
          <div className="rounded-xl border border-[#E8ECF0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <p className="mb-4 text-sm text-[#999999]">
              添加产品图片URL。接入 Supabase 后将支持本地上传。
            </p>
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs text-[#999999]">{idx + 1}</span>
                  {img && (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-[#E8ECF0]">
                      <Image src={img || '/images/hs/hydraulic.svg'} alt="" fill className="object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => updateImage(idx, e.target.value)}
                    placeholder={`图片 ${idx + 1} URL`}
                    className="flex-1 rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="rounded p-1.5 text-[#CCCCCC] hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addImage}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#4A90D9] px-4 py-2 text-sm font-medium text-[#4A90D9] hover:bg-[#F0F5FA] transition-colors"
            >
              <Plus className="h-4 w-4" />
              添加图片
            </button>
          </div>
        )}

        {/* 5. Sub-products */}
        <SectionHeader title={`子产品变体 (${subProducts.length})`} icon={Package} section="subProducts" expanded={expandedSections.subProducts} onToggle={toggleSection} />
        {expandedSections.subProducts && (
          <div className="rounded-xl border border-[#E8ECF0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <p className="mb-4 text-sm text-[#999999]">
              同一产品的不同型号变体，如布料机有17米/33米/36米三种型号。
            </p>
            {subProducts.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#CCCCCC]">暂无子产品变体</p>
            ) : (
              <div className="space-y-6">
                {subProducts.map((sp) => (
                  <div key={sp.id} className="rounded-xl border border-[#E8ECF0] bg-[#F9FAFB] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-[15px] font-semibold text-[#333333]">
                        {sp.name || '未命名子产品'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeSubProduct(sp.id)}
                        className="rounded p-1.5 text-[#CCCCCC] hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">名称</label>
                        <input
                          type="text"
                          value={sp.name}
                          onChange={(e) => updateSubProduct(sp.id, 'name', e.target.value)}
                          placeholder="17米布料机泵站"
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">型号</label>
                        <input
                          type="text"
                          value={sp.model}
                          onChange={(e) => updateSubProduct(sp.id, 'model', e.target.value)}
                          placeholder="HS-17M-PB"
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">封面图URL</label>
                        <input
                          type="text"
                          value={sp.coverImage}
                          onChange={(e) => updateSubProduct(sp.id, 'coverImage', e.target.value)}
                          placeholder="/images/xxx/1.jpg"
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        />
                      </div>
                    </div>

                    {/* Sub-product specs */}
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-[#999999]">规格参数</p>
                      {sp.specs.map((spec) => (
                        <div key={spec.id} className="mb-2 flex items-center gap-2">
                          <input
                            value={spec.label}
                            onChange={(e) => updateSubProductSpec(sp.id, spec.id, 'label', e.target.value)}
                            placeholder="参数名"
                            className="flex-1 rounded border border-[#E8ECF0] px-2 py-1.5 text-xs outline-none focus:border-[#4A90D9]"
                          />
                          <input
                            value={spec.value}
                            onChange={(e) => updateSubProductSpec(sp.id, spec.id, 'value', e.target.value)}
                            placeholder="值"
                            className="flex-1 rounded border border-[#E8ECF0] px-2 py-1.5 text-xs outline-none focus:border-[#4A90D9]"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubProductSpec(sp.id, spec.id)}
                            className="rounded p-1 text-[#CCCCCC] hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSubProductSpec(sp.id)}
                        className="text-xs text-[#4A90D9] hover:underline"
                      >
                        + 添加参数
                      </button>
                    </div>

                    {/* Sub-product images */}
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-[#999999]">子产品图片</p>
                      {sp.images.map((img, idx) => (
                        <div key={idx} className="mb-2 flex items-center gap-2">
                          <input
                            value={img}
                            onChange={(e) => updateSubProductImage(sp.id, idx, e.target.value)}
                            placeholder={`图片 ${idx + 1} URL`}
                            className="flex-1 rounded border border-[#E8ECF0] px-2 py-1.5 text-xs outline-none focus:border-[#4A90D9]"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubProductImage(sp.id, idx)}
                            className="rounded p-1 text-[#CCCCCC] hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSubProductImage(sp.id)}
                        className="text-xs text-[#4A90D9] hover:underline"
                      >
                        + 添加图片
                      </button>
                    </div>

                    {/* Hydraulic & Electric params */}
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">液压参数 (Markdown表格)</label>
                        <textarea
                          value={sp.hydraulicParams}
                          onChange={(e) => updateSubProduct(sp.id, 'hydraulicParams', e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-xs font-mono outline-none focus:border-[#4A90D9] resize-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">电控参数 (Markdown表格)</label>
                        <textarea
                          value={sp.electricParams}
                          onChange={(e) => updateSubProduct(sp.id, 'electricParams', e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-xs font-mono outline-none focus:border-[#4A90D9] resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addSubProduct}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#4A90D9] px-4 py-2 text-sm font-medium text-[#4A90D9] hover:bg-[#F0F5FA] transition-colors"
            >
              <Plus className="h-4 w-4" />
              添加子产品变体
            </button>
          </div>
        )}

        {/* 6. Detail Tabs */}
        <SectionHeader title={`详情Tab页 (${detailTabs.length})`} icon={FileText} section="tabs" expanded={expandedSections.tabs} onToggle={toggleSection} />
        {expandedSections.tabs && (
          <div className="rounded-xl border border-[#E8ECF0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <p className="mb-4 text-sm text-[#999999]">
              详情页Tab内容，支持 Markdown 格式。类型为「file」时填写文件下载链接。
            </p>
            {detailTabs.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#CCCCCC]">暂无详情Tab</p>
            ) : (
              <div className="space-y-5">
                {detailTabs.map((tab, idx) => (
                  <div key={tab.id} className="rounded-xl border border-[#E8ECF0] bg-[#F9FAFB] p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-[15px] font-semibold text-[#333333]">
                        Tab #{idx + 1}: {tab.title || '未命名'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeDetailTab(tab.id)}
                        className="rounded p-1.5 text-[#CCCCCC] hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">Tab标题</label>
                        <input
                          type="text"
                          value={tab.title}
                          onChange={(e) => updateDetailTab(tab.id, 'title', e.target.value)}
                          placeholder="例如：产品简介 / 技术参数 / 产品资料"
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">类型</label>
                        <select
                          value={tab.type}
                          onChange={(e) => updateDetailTab(tab.id, 'type', e.target.value)}
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        >
                          <option value="markdown">Markdown内容</option>
                          <option value="file">文件下载</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3">
                      {tab.type === 'markdown' ? (
                        <>
                          <label className="mb-1 block text-xs font-medium text-[#999999]">Markdown内容</label>
                          <textarea
                            value={tab.content}
                            onChange={(e) => updateDetailTab(tab.id, 'content', e.target.value)}
                            rows={8}
                            className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm font-mono outline-none focus:border-[#4A90D9] resize-none"
                            placeholder="支持 Markdown 格式..."
                          />
                        </>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-[#999999]">文件名称</label>
                            <input
                              type="text"
                              value={tab.content}
                              onChange={(e) => updateDetailTab(tab.id, 'content', e.target.value)}
                              placeholder="产品宣传册.pdf"
                              className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-[#999999]">文件URL</label>
                            <input
                              type="text"
                              value={tab.content || ''}
                              onChange={(e) => updateDetailTab(tab.id, 'content', e.target.value)}
                              placeholder="/files/产品简介.pptx"
                              className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addDetailTab}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#4A90D9] px-4 py-2 text-sm font-medium text-[#4A90D9] hover:bg-[#F0F5FA] transition-colors"
            >
              <Plus className="h-4 w-4" />
              添加Tab
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
