'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Upload,
  ExternalLink,
  X,
  ArrowUp,
  ArrowDown,
  LoaderCircle,
  LayoutTemplate,
  SlidersHorizontal,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { generateProductSlug, uniqueProductSlug } from '@/lib/admin-catalog';
import { adminProductToProduct } from '@/lib/admin/product-view';
import {
  canonicalProductDetailTab,
  findProductDetailTab,
  type StandardProductDetailTab,
} from '@/lib/product-detail-tabs';
import ProductDetailClient from '@/app/(site)/products/[id]/ProductDetailClient';
import type {
  AdminProduct,
  AdminProductFile,
  AdminProductSpec,
  AdminSubProduct,
  AdminDetailTab,
} from '@/lib/admin-store';
import {
  deleteAdminProductDocument,
  deleteAdminProductMedia,
  uploadAdminProductImage,
  uploadAdminProductDocument,
} from '@/lib/admin/media-client';
import { thumbnailUrlFromProductImageUrl } from '@/lib/admin/product-thumbnails';
import SubCategorySelect from '../components/SubCategorySelect';
import VisualProductEditor from '../components/VisualProductEditor';
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
      className="flex w-full items-center justify-between rounded-xl border border-[#E8ECF0] bg-white px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors duration-150 hover:border-[#4A90D9]"
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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function detailTabEditorType(tab: AdminDetailTab): AdminDetailTab['type'] {
  const standardTitle = canonicalProductDetailTab(tab.title);
  if (standardTitle === '技术参数') return 'markdown';
  if (standardTitle === '应用案例') return 'file';
  return tab.type;
}

function isFixedDetailTabType(tab: AdminDetailTab) {
  const standardTitle = canonicalProductDetailTab(tab.title);
  return standardTitle === '技术参数' || standardTitle === '应用案例';
}

function detailTabUsesFileEditor(tab: AdminDetailTab) {
  const standardTitle = canonicalProductDetailTab(tab.title);
  if (standardTitle === '技术参数') return false;
  return standardTitle === '应用案例' || tab.type === 'file' || tab.type === 'pdf';
}

function detailTabDocumentKind(tab: AdminDetailTab): 'general' | 'presentation' {
  const standardTitle = canonicalProductDetailTab(tab.title);
  return standardTitle === '应用案例' || standardTitle === '外形尺寸'
    ? 'presentation'
    : 'general';
}

function detailTabFileAccept(tab: AdminDetailTab) {
  return detailTabDocumentKind(tab) === 'presentation'
    ? '.pdf,.pptx'
    : '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip';
}

function detailTabUploadLabel(tab: AdminDetailTab) {
  const standardTitle = canonicalProductDetailTab(tab.title);
  if (standardTitle === '应用案例') return '选择应用案例 PDF / PPTX';
  if (standardTitle === '外形尺寸') return '选择外形尺寸 PDF / PPTX';
  return '选择产品资料';
}

export default function ProductForm({ initialProduct }: Props) {
  const {
    getSubCategories,
    getCategories,
    getProducts,
    createProduct,
    updateProduct,
  } = useAdminStore();

  const subCategories = getSubCategories();
  const categories = getCategories();
  const products = getProducts();
  const isEdit = !!initialProduct;
  const [draftProductId] = useState(() => initialProduct?.id || `draft-${generateId()}`);

  // Basic info
  const [name, setName] = useState(initialProduct?.name || '');
  const [lockedSlug, setLockedSlug] = useState(initialProduct?.slug || '');
  const [model, setModel] = useState(initialProduct?.model || '');
  const [subCategoryId, setSubCategoryId] = useState(initialProduct?.subCategoryId || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [sortOrder, setSortOrder] = useState(initialProduct?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [images, setImages] = useState<string[]>(() =>
    Array.from(new Set([initialProduct?.coverImage, ...(initialProduct?.images || [])].filter(Boolean) as string[])),
  );

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
  const [productFiles, setProductFiles] = useState<AdminProductFile[]>(initialProduct?.files || []);
  const [pendingDocumentDeletes, setPendingDocumentDeletes] = useState<string[]>([]);
  const [pendingImageDeletes, setPendingImageDeletes] = useState<string[]>([]);
  const [uploadingTabId, setUploadingTabId] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingSubProductId, setUploadingSubProductId] = useState('');
  const [imageNotice, setImageNotice] = useState('');
  const documentInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const productImageInputRef = useRef<HTMLInputElement | null>(null);
  const subProductImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const uploadedMediaUrlsRef = useRef(new Set<string>());
  const thumbnailByImageUrlRef = useRef(new Map<string, string>());

  // UI state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [previewDraft, setPreviewDraft] = useState<AdminProduct | null>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'fields'>('visual');

  useEffect(() => () => {
    uploadedMediaUrlsRef.current.forEach((url) => {
      void deleteAdminProductMedia(url).catch(() => undefined);
    });
  }, []);
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

  const categoryContext = useMemo(() => {
    const subCategory = subCategories.find((item) => item.id === subCategoryId);
    return subCategory
      ? { categoryId: subCategory.categoryId, storageSubCategoryId: subCategory.id }
      : null;
  }, [subCategories, subCategoryId]);

  const generatedSlug = lockedSlug || uniqueProductSlug(generateProductSlug(name), products);

  const storageProductId = initialProduct?.id || generatedSlug;

  const queueImageDelete = (url: string) => {
    if (!url) return;
    setPendingImageDeletes((urls) => Array.from(new Set([...urls, url])));
  };

  const thumbnailForImage = (url: string, fallback?: string) => (
    thumbnailByImageUrlRef.current.get(url) ||
    fallback ||
    thumbnailUrlFromProductImageUrl(url) ||
    ''
  );

  const removeImage = (idx: number) => {
    const image = images[idx];
    queueImageDelete(image);
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== idx));
  };

  const moveImage = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= images.length) return;
    setImages((current) => {
      const next = [...current];
      [next[idx], next[target]] = [next[target], next[idx]];
      const nextThumbnail = thumbnailForImage(next[0] || '');
      setPreviewDraft((draft) => draft ? { ...draft, coverThumbnail: nextThumbnail } : draft);
      return next;
    });
  };

  const uploadImages = async (files: File[]) => {
    if (!categoryContext || !name.trim()) {
      setError('请先填写产品名称并选择所属二级分类');
      return;
    }
    setError('');
    setImageNotice('');
    setUploadingImages(true);
    setLockedSlug(generatedSlug);
    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadAdminProductImage({
          file,
          categoryId: categoryContext.categoryId,
          subCategoryId: categoryContext.storageSubCategoryId,
          productId: storageProductId,
        })),
      );
      uploaded.forEach((image) => {
        uploadedMediaUrlsRef.current.add(image.url);
        thumbnailByImageUrlRef.current.set(image.url, image.thumbnailUrl);
      });
      setImages((current) => Array.from(new Set([...current, ...uploaded.map((image) => image.url)])));
      setImageNotice(`已上传 ${uploaded.length} 张图片，原图与缩略图都已生成，列表加载会更轻快。`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '产品图片上传失败，请重试');
    } finally {
      setUploadingImages(false);
      if (productImageInputRef.current) productImageInputRef.current.value = '';
    }
  };

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
    const removed = subProducts.find((subProduct) => subProduct.id === id);
    removed?.images.forEach(queueImageDelete);
    if (removed?.coverImage && !removed.images.includes(removed.coverImage)) queueImageDelete(removed.coverImage);
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
  const removeSubProductImage = (subId: string, idx: number) => {
    const removedImage = subProducts.find((sp) => sp.id === subId)?.images[idx];
    if (removedImage) queueImageDelete(removedImage);
    setSubProducts(
      subProducts.map((sp) =>
        sp.id === subId
          ? {
              ...sp,
              images: sp.images.filter((_, i) => i !== idx),
              coverImage: sp.images.filter((_, i) => i !== idx)[0] || '',
            }
          : sp
      )
    );
  };

  const uploadSubProductImages = async (subProduct: AdminSubProduct, files: File[]) => {
    if (!categoryContext || !name.trim()) {
      setError('请先填写产品名称并选择所属二级分类');
      return;
    }
    setError('');
    setUploadingSubProductId(subProduct.id);
    setLockedSlug(generatedSlug);
    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadAdminProductImage({
          file,
          categoryId: categoryContext.categoryId,
          subCategoryId: categoryContext.storageSubCategoryId,
          productId: `${storageProductId}-${subProduct.id}`,
        })),
      );
      uploaded.forEach((image) => {
        uploadedMediaUrlsRef.current.add(image.url);
        thumbnailByImageUrlRef.current.set(image.url, image.thumbnailUrl);
      });
      setSubProducts((current) => current.map((item) => {
        if (item.id !== subProduct.id) return item;
        const nextImages = Array.from(new Set([...item.images, ...uploaded.map((image) => image.url)]));
        return {
          ...item,
          images: nextImages,
          coverImage: nextImages[0] || '',
          coverThumbnail: thumbnailForImage(nextImages[0] || '', item.coverThumbnail),
        };
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '子产品图片上传失败，请重试');
    } finally {
      setUploadingSubProductId('');
      const input = subProductImageInputRefs.current[subProduct.id];
      if (input) input.value = '';
    }
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
  const updateDetailTab = (id: string, field: string, val: string | number) => {
    setDetailTabs(detailTabs.map((dt) => (dt.id === id ? { ...dt, [field]: val } : dt)));
  };
  const removeDetailTab = (id: string) => {
    const tab = detailTabs.find((item) => item.id === id);
    if (tab?.fileUrl) {
      setPendingDocumentDeletes((urls) => Array.from(new Set([...urls, tab.fileUrl!])));
    }
    setProductFiles((files) => files.filter((file) => file.detailTabId !== id));
    setDetailTabs(detailTabs.filter((dt) => dt.id !== id));
  };

  const updateDetailTabType = (id: string, type: AdminDetailTab['type']) => {
    const tab = detailTabs.find((item) => item.id === id);
    if (type === 'markdown' && tab?.fileUrl) {
      setPendingDocumentDeletes((urls) => Array.from(new Set([...urls, tab.fileUrl!])));
      setProductFiles((files) => files.filter((file) => file.detailTabId !== id));
    }
    setDetailTabs((tabs) =>
      tabs.map((item) =>
        item.id === id
          ? {
              ...item,
              type,
              ...(type === 'markdown'
                ? {
                    fileId: undefined,
                    fileName: undefined,
                    fileUrl: undefined,
                    fileType: undefined,
                    fileSize: undefined,
                    storageObjectPath: undefined,
                  }
                : {}),
            }
          : item,
      ),
    );
  };

  const uploadDocument = async (
    tab: AdminDetailTab,
    file: File,
    documentKind: 'general' | 'presentation' = 'general',
  ) => {
    if (!categoryContext || !name.trim()) {
      setError('请先填写产品名称并选择所属二级分类');
      return;
    }

    setError('');
    setUploadingTabId(tab.id);
    setLockedSlug(generatedSlug);
    try {
      const storedFile = await uploadAdminProductDocument({
        file,
        categoryId: categoryContext.categoryId,
        subCategoryId: categoryContext.storageSubCategoryId,
        productId: storageProductId,
        detailTabId: tab.id,
        documentKind,
      });
      uploadedMediaUrlsRef.current.add(storedFile.url);
      if (tab.fileUrl && tab.fileUrl !== storedFile.url) {
        setPendingDocumentDeletes((urls) => Array.from(new Set([...urls, tab.fileUrl!])));
      }
      setProductFiles((files) => [
        ...files.filter((item) => item.detailTabId !== tab.id),
        storedFile,
      ]);
      setDetailTabs((tabs) =>
        tabs.map((item) =>
          item.id === tab.id
            ? {
                ...item,
                type: 'file',
                fileId: storedFile.id,
                fileName: storedFile.name,
                fileUrl: storedFile.url,
                fileType: storedFile.fileType,
                fileSize: storedFile.fileSize,
                storageObjectPath: storedFile.storageObjectPath,
              }
            : item,
        ),
      );
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '产品资料上传失败');
    } finally {
      setUploadingTabId('');
      const input = documentInputRefs.current[tab.id];
      if (input) input.value = '';
    }
  };

  const removeDocument = (tab: AdminDetailTab) => {
    if (tab.fileUrl) {
      setPendingDocumentDeletes((urls) => Array.from(new Set([...urls, tab.fileUrl!])));
    }
    setProductFiles((files) => files.filter((file) => file.detailTabId !== tab.id));
    setDetailTabs((tabs) =>
      tabs.map((item) =>
        item.id === tab.id
          ? {
              ...item,
              fileId: undefined,
              fileName: undefined,
              fileUrl: undefined,
              fileType: undefined,
              fileSize: undefined,
              storageObjectPath: undefined,
            }
          : item,
      ),
    );
  };

  const upsertStandardDetailTab = (
    title: StandardProductDetailTab,
    patch: { content?: string; type?: AdminDetailTab['type'] },
  ) => {
    setDetailTabs((tabs) => {
      const existingTab = findProductDetailTab(tabs, title);
      if (existingTab) {
        return tabs.map((tab) => (tab.id === existingTab.id ? { ...tab, ...patch } : tab));
      }

      return [
        ...tabs,
        {
          id: generateId(),
          title,
          content: patch.content || '',
          type: patch.type || (title === '相关下载' ? 'file' : 'markdown'),
          sortOrder: tabs.length,
        },
      ];
    });
  };

  const setStandardDetailTabType = (
    title: StandardProductDetailTab,
    type: AdminDetailTab['type'],
  ) => {
    const existingTab = findProductDetailTab(detailTabs, title);
    if (existingTab) {
      updateDetailTabType(existingTab.id, type);
      return;
    }
    upsertStandardDetailTab(title, { type });
  };

  const uploadVisualDocument = (title: string, file: File) => {
    const existingTab = findProductDetailTab(detailTabs, title);
    const tab: AdminDetailTab = existingTab || {
      id: generateId(),
      title,
      content: '',
      type: 'file',
      sortOrder: detailTabs.length,
    };

    if (!existingTab) setDetailTabs((tabs) => [...tabs, tab]);
    const standardTitle = canonicalProductDetailTab(title);
    const documentKind = standardTitle === '应用案例' || standardTitle === '外形尺寸'
      ? 'presentation'
      : 'general';
    void uploadDocument(tab, file, documentKind);
  };

  const buildDraftProduct = (): AdminProduct => {
    const validImages = images.filter(Boolean);
    const validDetailTabs = detailTabs
      .filter((tab) => tab.title.trim())
      .map((tab) => {
        const standardTitle = canonicalProductDetailTab(tab.title);
        if (standardTitle === '技术参数') {
          return {
            ...tab,
            type: 'markdown' as const,
            fileId: undefined,
            fileName: undefined,
            fileUrl: undefined,
            fileType: undefined,
            fileSize: undefined,
            storageObjectPath: undefined,
          };
        }
        if (standardTitle === '应用案例') return { ...tab, type: 'file' as const };
        return tab;
      });

    return {
      id: initialProduct?.id || draftProductId,
      slug: generatedSlug,
      subCategoryId,
      name: name.trim(),
      model: model.trim(),
      description: description.trim(),
      coverImage: validImages[0] || '',
      coverThumbnail: thumbnailForImage(validImages[0] || '', initialProduct?.coverImage === validImages[0] ? initialProduct?.coverThumbnail : ''),
      images: validImages,
      specs: specs.filter((spec) => spec.label.trim() && spec.value.trim()),
      features: features.filter((feature) => feature.trim()),
      subProducts: subProducts
        .filter((subProduct) => subProduct.name.trim())
        .map((subProduct) => {
          const validSubProductImages = subProduct.images.filter(Boolean);
          return {
            ...subProduct,
            slug: subProduct.slug || generateProductSlug(subProduct.name),
            coverImage: validSubProductImages[0] || '',
            coverThumbnail: thumbnailForImage(validSubProductImages[0] || '', subProduct.coverImage === validSubProductImages[0] ? subProduct.coverThumbnail : ''),
            images: validSubProductImages,
            specs: subProduct.specs.filter((spec) => spec.label.trim() && spec.value.trim()),
          };
        }),
      detailTabs: validDetailTabs,
      files: productFiles.filter((file) =>
        validDetailTabs.some((tab) => tab.id === file.detailTabId && tab.fileUrl === file.url),
      ),
      sortOrder,
      isActive,
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('请输入产品名称');
      return;
    }
    if (!subCategories.some((item) => item.id === subCategoryId)) {
      setError('请选择所属二级分类');
      return;
    }
    if (uploadingImages || uploadingSubProductId || uploadingTabId) {
      setError('请等待文件上传完成后再预览');
      return;
    }

    const obsoleteTechnicalFiles = detailTabs
      .filter((tab) => canonicalProductDetailTab(tab.title) === '技术参数' && tab.fileUrl)
      .map((tab) => tab.fileUrl!);
    if (obsoleteTechnicalFiles.length) {
      setPendingDocumentDeletes((urls) => Array.from(new Set([...urls, ...obsoleteTechnicalFiles])));
    }

    setPreviewDraft(buildDraftProduct());
  };

  const confirmSave = async () => {
    if (!previewDraft) return;
    setError('');
    setSaving(true);

    const { id: _draftId, createdAt: _createdAt, updatedAt: _updatedAt, ...productData } = previewDraft;
    const stagedUploadedMediaUrls = Array.from(uploadedMediaUrlsRef.current);
    uploadedMediaUrlsRef.current.clear();

    try {
      if (isEdit && initialProduct) {
        await updateProduct(initialProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      const cleanupResults = await Promise.allSettled(
        [
          ...pendingDocumentDeletes.map((url) => deleteAdminProductDocument(url)),
          ...pendingImageDeletes.map((url) => deleteAdminProductMedia(url)),
        ],
      );
      const cleanupFailed = cleanupResults.some((result) => result.status === 'rejected');
      setPendingDocumentDeletes([]);
      setPendingImageDeletes([]);
      setPreviewDraft(null);
      setSaved(true);
      if (cleanupFailed) {
        setError('产品已保存，但部分旧媒体清理失败，请稍后重试');
      }
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      stagedUploadedMediaUrls.forEach((url) => uploadedMediaUrlsRef.current.add(url));
      setError(saveError instanceof Error ? saveError.message : '产品保存失败');
    } finally {
      setSaving(false);
    }
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
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="flex w-full rounded-lg border border-[#DCE5EE] bg-white p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setEditorMode('visual')}
              className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
                editorMode === 'visual'
                  ? 'bg-[#EAF2FA] text-[#1E3A5F]'
                  : 'text-[#666666] hover:bg-[#F5F7FA]'
              }`}
            >
              <LayoutTemplate className="h-4 w-4" />
              可视化编辑
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('fields')}
              className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
                editorMode === 'fields'
                  ? 'bg-[#EAF2FA] text-[#1E3A5F]'
                  : 'text-[#666666] hover:bg-[#F5F7FA]'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              字段编辑
            </button>
          </div>
          <button
            type="submit"
            form="product-form"
            disabled={saving || uploadingImages || Boolean(uploadingSubProductId) || Boolean(uploadingTabId)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#162A45] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          >
            <Eye className="h-4 w-4" />
            预览并保存
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
        <input
          ref={productImageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            if (files.length) void uploadImages(files);
          }}
        />

        {editorMode === 'visual' ? (
          <VisualProductEditor
            categories={categories}
            subCategories={subCategories}
            name={name}
            model={model}
            description={description}
            generatedSlug={generatedSlug}
            subCategoryId={subCategoryId}
            specs={specs}
            features={features}
            images={images}
            sortOrder={sortOrder}
            isActive={isActive}
            uploadingImages={uploadingImages}
            imageNotice={imageNotice}
            detailTabs={detailTabs}
            uploadingTabId={uploadingTabId}
            onNameChange={setName}
            onModelChange={setModel}
            onDescriptionChange={setDescription}
            onSubCategoryChange={setSubCategoryId}
            onSortOrderChange={setSortOrder}
            onActiveChange={setIsActive}
            onAddSpec={addSpec}
            onUpdateSpec={updateSpec}
            onRemoveSpec={removeSpec}
            onAddFeature={addFeature}
            onUpdateFeature={updateFeature}
            onRemoveFeature={removeFeature}
            onUploadImages={() => productImageInputRef.current?.click()}
            onMoveImage={moveImage}
            onRemoveImage={removeImage}
            onUpsertStandardTab={upsertStandardDetailTab}
            onSetStandardTabType={setStandardDetailTabType}
            onUpdateDetailTab={updateDetailTab}
            onUploadDocument={uploadVisualDocument}
            onRemoveDocument={removeDocument}
          />
        ) : (
          <>
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：布料机液压站"
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">产品型号</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="例如：HS-17M-PB"
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">所属二级分类 *</label>
                <SubCategorySelect
                  subCategories={subCategories}
                  categories={categories}
                  value={subCategoryId}
                  onChange={setSubCategoryId}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">页面标识</label>
                <div className="flex h-[42px] items-center rounded-lg border border-[#E8ECF0] bg-[#F9FAFB] px-4 font-mono text-sm text-[#666666]">
                  {name.trim() ? generatedSlug : '填写名称后自动生成'}
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#666666]">简要描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="产品简要描述，显示在列表卡片中..."
                rows={3}
                className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#666666]">排序</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#E8ECF0] px-4 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
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
                <div key={spec.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <GripVertical className="hidden h-4 w-4 shrink-0 text-[#CCCCCC] sm:block" />
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => updateSpec(spec.id, 'label', e.target.value)}
                    placeholder="参数名（如：系统压力）"
                    className="w-full min-w-0 flex-1 rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                    placeholder="参数值（如：30Mpa）"
                    className="w-full min-w-0 flex-1 rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(spec.id)}
                    className="self-end rounded p-1.5 text-[#CCCCCC] transition-colors hover:bg-red-50 hover:text-red-500 sm:self-auto"
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
                    className="min-w-0 flex-1 rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
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
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#666666]">第一张图片会作为产品封面。</p>
                <p className="mt-1 text-xs text-[#999999]">上传时自动转为 WebP，质量 82，最长边不超过 2400px。</p>
              </div>
              <button
                type="button"
                disabled={uploadingImages}
                onClick={() => productImageInputRef.current?.click()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4A90D9] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1E3A5F] disabled:opacity-50"
              >
                {uploadingImages ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadingImages ? '压缩上传中...' : '上传图片'}
              </button>
            </div>
            {imageNotice ? (
              <p className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">{imageNotice}</p>
            ) : null}
            {images.length ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {images.map((img, idx) => (
                <div key={img} className="overflow-hidden rounded-lg border border-[#E8ECF0] bg-[#F9FAFB]">
                  <div className="relative aspect-[4/3] w-full bg-white">
                    <Image src={img} alt={`${name || '产品'}图片${idx + 1}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-contain" />
                    {idx === 0 ? (
                      <span className="absolute left-2 top-2 rounded bg-[#1E3A5F] px-2 py-1 text-xs font-medium text-white">封面</span>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E8ECF0] px-3 py-2">
                    <span className="text-xs text-[#999999]">第 {idx + 1} 张</span>
                    <div className="flex items-center gap-1">
                      <button type="button" title="上移" disabled={idx === 0} onClick={() => moveImage(idx, -1)} className="rounded p-1.5 text-[#666666] hover:bg-white disabled:opacity-30">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button type="button" title="下移" disabled={idx === images.length - 1} onClick={() => moveImage(idx, 1)} className="rounded p-1.5 text-[#666666] hover:bg-white disabled:opacity-30">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button type="button" title="删除图片" onClick={() => removeImage(idx)} className="rounded p-1.5 text-[#999999] hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <button
                type="button"
                disabled={uploadingImages}
                onClick={() => productImageInputRef.current?.click()}
                className="flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#B9C8D8] bg-[#F9FAFB] text-sm text-[#666666] hover:border-[#4A90D9] hover:text-[#4A90D9] disabled:opacity-50"
              >
                <ImageIcon className="h-8 w-8" />
                选择本地产品图片
              </button>
            )}
          </div>
        )}
          </>
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">名称</label>
                        <input
                          type="text"
                          value={sp.name}
                          onChange={(e) => updateSubProduct(sp.id, 'name', e.target.value)}
                          placeholder="17米布料机泵站"
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">型号</label>
                        <input
                          type="text"
                          value={sp.model}
                          onChange={(e) => updateSubProduct(sp.id, 'model', e.target.value)}
                          placeholder="HS-17M-PB"
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        />
                      </div>
                    </div>

                    {/* Sub-product specs */}
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-[#999999]">规格参数</p>
                      {sp.specs.map((spec) => (
                        <div key={spec.id} className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                          <input
                            value={spec.label}
                            onChange={(e) => updateSubProductSpec(sp.id, spec.id, 'label', e.target.value)}
                            placeholder="参数名"
                            className="w-full min-w-0 flex-1 rounded border border-[#E8ECF0] px-2 py-1.5 text-xs outline-none focus:border-[#4A90D9]"
                          />
                          <input
                            value={spec.value}
                            onChange={(e) => updateSubProductSpec(sp.id, spec.id, 'value', e.target.value)}
                            placeholder="值"
                            className="w-full min-w-0 flex-1 rounded border border-[#E8ECF0] px-2 py-1.5 text-xs outline-none focus:border-[#4A90D9]"
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
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-xs font-medium text-[#999999]">子产品图片</p>
                        <input
                          ref={(element) => { subProductImageInputRefs.current[sp.id] = element; }}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            const files = Array.from(event.target.files || []);
                            if (files.length) void uploadSubProductImages(sp, files);
                          }}
                        />
                        <button
                          type="button"
                          disabled={uploadingSubProductId === sp.id}
                          onClick={() => subProductImageInputRefs.current[sp.id]?.click()}
                          className="inline-flex items-center gap-1.5 rounded border border-[#4A90D9] px-3 py-1.5 text-xs font-medium text-[#4A90D9] hover:bg-white disabled:opacity-50"
                        >
                          {uploadingSubProductId === sp.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                          {uploadingSubProductId === sp.id ? '上传中' : '上传图片'}
                        </button>
                      </div>
                      {sp.images.length ? (
                        <div className="flex flex-wrap gap-2">
                          {sp.images.map((img, idx) => (
                            <div key={img} className="group relative h-20 w-20 overflow-hidden rounded border border-[#E8ECF0] bg-white">
                              <Image src={img} alt={`${sp.name || '子产品'}图片${idx + 1}`} fill sizes="80px" className="object-contain" />
                              <button
                                type="button"
                                title="删除图片"
                                onClick={() => removeSubProductImage(sp.id, idx)}
                                className="absolute right-1 top-1 rounded bg-white/90 p-1 text-[#999999] shadow hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded border border-dashed border-[#DCE5EE] bg-white px-3 py-4 text-center text-xs text-[#999999]">暂无图片</p>
                      )}
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
              产品资料会直接上传到 Supabase Storage，并随产品目录发布到前台。
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
                          onChange={(e) => {
                            const nextTitle = e.target.value;
                            updateDetailTab(tab.id, 'title', nextTitle);
                            const standardTitle = canonicalProductDetailTab(nextTitle);
                            if (standardTitle === '技术参数') updateDetailTabType(tab.id, 'markdown');
                            if (standardTitle === '应用案例') updateDetailTabType(tab.id, 'file');
                          }}
                          placeholder="例如：产品简介 / 技术参数 / 产品资料"
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[#999999]">类型</label>
                        <select
                          value={detailTabEditorType(tab)}
                          onChange={(e) => updateDetailTabType(tab.id, e.target.value as AdminDetailTab['type'])}
                          disabled={isFixedDetailTabType(tab)}
                          className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                        >
                          {canonicalProductDetailTab(tab.title) !== '应用案例' ? (
                            <option value="markdown">Markdown内容</option>
                          ) : null}
                          {canonicalProductDetailTab(tab.title) !== '技术参数' ? (
                            <option value="file">文件下载</option>
                          ) : null}
                        </select>
                      </div>
                    </div>
                    <div className="mt-3">
                      {!detailTabUsesFileEditor(tab) ? (
                        <>
                          <label className="mb-1 block text-xs font-medium text-[#999999]">Markdown内容</label>
                          <textarea
                            value={tab.content}
                            onChange={(e) => updateDetailTab(tab.id, 'content', e.target.value)}
                            rows={8}
                            className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm font-mono outline-none focus:border-[#4A90D9] resize-none"
                            placeholder={canonicalProductDetailTab(tab.title) === '技术参数'
                              ? '| 参数 | 规格 |\n| --- | --- |\n| 系统压力 | 31.5 MPa |'
                              : '支持 Markdown 格式...'}
                          />
                        </>
                      ) : (
                        <div className="space-y-3">
                          <label className="block text-xs font-medium text-[#999999]">产品资料</label>
                          <input
                            ref={(element) => { documentInputRefs.current[tab.id] = element; }}
                            type="file"
                            accept={detailTabFileAccept(tab)}
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void uploadDocument(tab, file, detailTabDocumentKind(tab));
                            }}
                          />
                          {tab.fileUrl ? (
                            <div className="flex flex-col gap-3 rounded-lg border border-[#DCE5EE] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[#333333]">{tab.fileName || '产品资料'}</p>
                                <p className="mt-1 text-xs uppercase text-[#999999]">
                                  {tab.fileType || 'FILE'}{tab.fileSize ? ` · ${formatFileSize(tab.fileSize)}` : ''}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <a
                                  href={tab.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="打开资料"
                                  className="rounded p-2 text-[#666666] hover:bg-[#F0F5FA] hover:text-[#4A90D9]"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                                <button
                                  type="button"
                                  disabled={uploadingTabId === tab.id}
                                  onClick={() => documentInputRefs.current[tab.id]?.click()}
                                  className="inline-flex items-center gap-2 rounded-lg border border-[#4A90D9] px-3 py-2 text-xs font-medium text-[#4A90D9] hover:bg-[#F0F5FA] disabled:opacity-50"
                                >
                                  <Upload className="h-4 w-4" />
                                  {uploadingTabId === tab.id ? '上传中...' : '替换'}
                                </button>
                                <button
                                  type="button"
                                  title="移除资料"
                                  onClick={() => removeDocument(tab)}
                                  className="rounded p-2 text-[#999999] hover:bg-red-50 hover:text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={uploadingTabId === tab.id}
                              onClick={() => documentInputRefs.current[tab.id]?.click()}
                              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#4A90D9] bg-white px-4 py-6 text-sm font-medium text-[#4A90D9] hover:bg-[#F0F5FA] disabled:opacity-50"
                            >
                              <Upload className="h-5 w-5" />
                              {uploadingTabId === tab.id
                                ? '正在上传到 Supabase...'
                                : detailTabUploadLabel(tab)}
                            </button>
                          )}
                          <input
                            type="text"
                            value={tab.content || ''}
                            onChange={(e) => updateDetailTab(tab.id, 'content', e.target.value)}
                            placeholder="资料说明（可选）"
                            className="w-full rounded-lg border border-[#E8ECF0] px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10"
                          />
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

      {previewDraft ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#F5F7FA]">
          <div className="sticky top-0 z-[110] border-b border-[#DCE5EE] bg-white shadow-sm">
            <div className="mx-auto flex min-h-16 max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1E3A5F]">产品详情预览</p>
                <p className="truncate text-xs text-[#999999]">此时尚未保存到 Supabase，请核对图片、参数和详情内容。</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setPreviewDraft(null)}
                  className="inline-flex items-center gap-2 rounded border border-[#DCE5EE] px-4 py-2 text-sm font-medium text-[#666666] hover:bg-[#F5F7FA] disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回编辑
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void confirmSave()}
                  className="inline-flex items-center gap-2 rounded bg-[#28A745] px-4 py-2 text-sm font-medium text-white hover:bg-[#218838] disabled:opacity-50"
                >
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? '保存中...' : '确认保存'}
                </button>
              </div>
            </div>
          </div>
          <ProductDetailClient product={adminProductToProduct(previewDraft)} />
        </div>
      ) : null}
    </div>
  );
}
