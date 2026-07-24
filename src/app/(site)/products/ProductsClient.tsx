'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, Grid, List, X, ChevronRight, ChevronDown } from 'lucide-react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import type { CategoryOption, Product } from '@/data/products';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest';

const findSubCategoryById = (categoryOptions: CategoryOption[], subCategoryId: string) =>
  categoryOptions
    .flatMap((category) => category.subCategories ?? [])
    .find((sub) => sub.id === subCategoryId);

const getCategoryDisplayName = (categoryOptions: CategoryOption[], categoryId: string) =>
  findSubCategoryById(categoryOptions, categoryId)?.name ??
  categoryOptions.find((category) => category.id === categoryId)?.name ??
  categoryId;

export default function ProductsClient({
  products,
  categoryOptions,
}: {
  products: Product[];
  categoryOptions: CategoryOption[];
}) {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const requestedProduct = searchParams.get('product');
  const initialTopCategory = requestedCategory
    ? categoryOptions.find((category) => category.id === requestedCategory)
    : undefined;
  const initialCategoryIds = initialTopCategory
    ? [
        initialTopCategory.id,
        ...(initialTopCategory.subCategories
          ?.filter((subCategory) => subCategory.products?.length)
          .map((subCategory) => subCategory.id) ?? []),
      ]
    : requestedCategory
      ? [requestedCategory]
      : [];
  const initialExpandedCategoryId = initialTopCategory?.id ?? (
    requestedCategory
      ? categoryOptions.find((category) =>
          category.subCategories?.some((subCategory) => subCategory.id === requestedCategory),
        )?.id
      : undefined
  );
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategoryIds);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(requestedProduct);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [expandedTopCategories, setExpandedTopCategories] = useState<Set<string>>(
    () => new Set(initialExpandedCategoryId ? [initialExpandedCategoryId] : []),
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handlers
  const toggleCategory = (catId: string) => {
    if (catId === '全部') {
      setSelectedCategories([]);
      setSelectedProductId(null);
      return;
    }

    const topCategory = categoryOptions.find((c) => c.id === catId);
    if (topCategory && topCategory.subCategories) {
      const subIds = topCategory.subCategories
        .filter((sub) => sub.products && sub.products.length > 0)
        .map((sub) => sub.id);
      const selectableIds = [topCategory.id, ...subIds];
      const isAllSelected = selectableIds.every((id) => selectedCategories.includes(id));

      if (isAllSelected) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(selectableIds);
      }

      setSelectedProductId(null);
      return;
    }

    setSelectedCategories([catId]);
    setSelectedProductId(null);
  };

  const toggleTopCategoryExpand = (catId: string) => {
    setExpandedTopCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedProductId(null);
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const removeFilter = (type: 'category', value: string) => {
    if (type === 'category') {
      setSelectedCategories((prev) => prev.filter((c) => c !== value));
      setSelectedProductId(null);
    }
  };

  // Filter and Sort
  const filteredProducts = useMemo(() => {
    let result = products;

    if (debouncedQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          p.model.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }

    if (selectedProductId) {
      result = result.filter((p) => p.id === selectedProductId);
    } else if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [debouncedQuery, products, selectedCategories, selectedProductId, sortBy]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#333333]">
      {/* Breadcrumb */}
      <div className="border-b border-[#E8ECF0] bg-white py-3">
        <Container>
          <div className="flex items-center text-sm text-[#666666]">
            <Link href="/" className="hover:text-[#4A90D9]">
              首页
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium text-[#333333]">产品中心</span>
            {selectedCategories.length === 1 && (
              <>
                <ChevronRight className="mx-2 h-4 w-4" />
                <span className="text-[#4A90D9]">
                  {getCategoryDisplayName(categoryOptions, selectedCategories[0])}
                </span>
              </>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Sidebar - Filters */}
          <aside className="w-full shrink-0 space-y-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:w-[280px] lg:overflow-y-auto">
            <div className="overflow-hidden rounded-[8px] border border-[#E8ECF0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="border-b border-[#E8ECF0] p-4">
                <h3 className="text-[14px] font-semibold text-[#1E3A5F]">产品分类</h3>
              </div>
              <div className="space-y-1 p-2">
                <button
                  onClick={() => toggleCategory('全部')}
                  className={`w-full rounded-md px-4 py-2.5 text-left text-sm transition-colors ${
                    selectedCategories.length === 0
                      ? 'border-l-4 border-[#4A90D9] bg-[#F0F5FA] font-bold text-[#1E3A5F]'
                      : 'border-l-4 border-transparent text-[#666666] hover:bg-[#F5F7FA]'
                  }`}
                >
                  全部产品
                </button>
                {categoryOptions.map((cat) => {
                  const subIds = [
                    cat.id,
                    ...(cat.subCategories?.filter((sub) => sub.products?.length).map((sub) => sub.id) || []),
                  ];
                  const isAllSubSelected =
                    subIds.length > 0 && subIds.every((id) => selectedCategories.includes(id));
                  const isExpanded = expandedTopCategories.has(cat.id);
                  const hasSub = cat.subCategories && cat.subCategories.length > 0;

                  return (
                    <div key={cat.id} className="space-y-0.5">
                      <button
                        onClick={() => {
                          toggleCategory(cat.id);
                          if (hasSub && !isExpanded) toggleTopCategoryExpand(cat.id);
                        }}
                        className={`flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                          isAllSubSelected
                            ? 'border-l-4 border-[#4A90D9] bg-[#F0F5FA] text-[#1E3A5F]'
                            : 'border-l-4 border-transparent text-[#333333] hover:bg-[#F5F7FA]'
                        }`}
                      >
                        <span className="flex-1 truncate">{cat.name}</span>
                        {hasSub ? (
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-[#999999] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        ) : null}
                      </button>

                      {hasSub ? (
                        <div
                          className={`overflow-hidden transition-all duration-200 ${
                            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="space-y-0.5 px-0 pb-1 pl-6">
                            {cat.subCategories!.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => toggleCategory(sub.id)}
                                className={`w-full rounded-md px-4 py-2 text-left text-sm transition-colors ${
                                  selectedCategories.includes(sub.id)
                                    ? 'bg-[#F0F5FA] font-medium text-[#4A90D9]'
                                    : 'text-[#666666] hover:bg-[#F5F7FA]'
                                }`}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <div className="min-w-0 flex-1">
            {/* Active Filters */}
            {selectedCategories.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-[#666666]">已选条件：</span>
                {selectedCategories.map((catId) => {
                  return (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1 rounded border border-[#4A90D9] bg-white px-2 py-1 text-xs text-[#4A90D9]"
                    >
                      {getCategoryDisplayName(categoryOptions, catId)}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeFilter('category', catId)}
                      />
                    </span>
                  );
                })}
                <button
                  onClick={clearFilters}
                  className="ml-2 text-sm text-[#666666] hover:text-[#FF6B35]"
                >
                  清除全部
                </button>
              </div>
            )}

            {/* Top Toolbar */}
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-[8px] border border-[#E8ECF0] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center">
              <div className="text-sm text-[#666666]">
                找到{' '}
                <span className="mx-1 font-bold text-[#FF6B35]">{filteredProducts.length}</span>{' '}
                个产品
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索产品名称/型号..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-[#E8ECF0] py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-[#4A90D9] focus:ring-1 focus:ring-[#4A90D9]/20 sm:w-64"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <span className="text-sm text-[#666666]">排序：</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="cursor-pointer border-none bg-transparent text-sm font-medium text-[#333333] outline-none hover:text-[#4A90D9]"
                  >
                    <option value="newest">最新</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#F0F5FA] text-[#4A90D9]' : 'text-gray-400 hover:text-[#333333]'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#F0F5FA] text-[#4A90D9]' : 'text-gray-400 hover:text-[#333333]'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product List */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-[8px] border border-[#E8ECF0] bg-white p-16 text-center">
                <div className="mb-4 flex justify-center text-gray-400">
                  <Search className="h-12 w-12" />
                </div>
                <p className="text-lg font-medium text-[#333333]">未找到符合条件的产品</p>
                <button onClick={clearFilters} className="mt-4 text-[#4A90D9] hover:underline">
                  清除筛选条件
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredProducts.map((product, idx) => (
                  <MotionReveal key={product.id} delay={idx * 0.05}>
                    {viewMode === 'grid' ? (
                      // Grid Card
                      <Link
                        href={`/products/${product.id}`}
                        className="group block flex h-full flex-col overflow-hidden rounded-[8px] border border-[#E8ECF0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-[2px] hover:border-[#4A90D9] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                      >
                        <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden border-b border-[#E8ECF0] bg-white p-4">
                          {/* Fallback color block if image is not ready */}
                          <div className="absolute inset-0 bg-slate-50" />
                          {/* <Image src={product.image} alt={product.name} fill className="object-contain p-4 transition-transform duration-300 group-hover:scale-105 z-10" /> */}
                          <div className="relative z-10 h-full w-full transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src={product.image || '/images/hs/hydraulic.svg'}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <h4 className="mb-1 text-[16px] font-semibold text-[#333333] transition-colors group-hover:text-[#4A90D9]">
                            {product.name}
                          </h4>
                          <p className="mb-2 text-[14px] text-[#666666]">型号：{product.model}</p>
                          <p
                            className="mb-4 line-clamp-2 text-[13px] text-[#666666]"
                            title={product.description}
                          >
                            {product.description}
                          </p>

                          <div className="mb-4 mt-auto flex flex-wrap gap-2">
                            {product.specs.slice(0, 2).map((spec, i) => (
                              <span
                                key={i}
                                className="rounded-sm border border-[#E8ECF0] bg-[#F5F7FA] px-2 py-1 text-xs text-[#666666]"
                              >
                                {spec.label}: {spec.value}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-end border-t border-[#E8ECF0] pt-3">
                            <span className="rounded bg-[#4A90D9] px-3 py-1.5 text-[14px] font-medium text-white transition-colors hover:bg-[#1E3A5F]">
                              查看详情
                            </span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      // List Card
                      <Link
                        href={`/products/${product.id}`}
                        className="group block flex flex-col gap-6 rounded-[8px] border border-[#E8ECF0] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[#4A90D9] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:flex-row"
                      >
                        <div className="relative h-[150px] w-full shrink-0 overflow-hidden rounded-md border border-[#E8ECF0] bg-slate-50 sm:w-[200px]">
                          <Image
                            src={product.image || '/images/hs/hydraulic.svg'}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 200px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h4 className="mb-1 text-[18px] font-semibold text-[#333333] transition-colors group-hover:text-[#4A90D9]">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-4 text-[14px] text-[#666666]">
                                <span>型号：{product.model}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4 line-clamp-2 text-sm text-[#666666]">
                            简介：{product.description}
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2 divide-x divide-gray-300 text-sm text-[#666666]">
                              {product.specs.map((spec, i) => (
                                <span key={i} className={i > 0 ? 'pl-2' : ''}>
                                  {spec.label} {spec.value}
                                </span>
                              ))}
                            </div>
                            <span className="rounded bg-[#4A90D9] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#1E3A5F]">
                              查看详情
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </MotionReveal>
                ))}
              </div>
            )}

            {/* Pagination Placeholder (Hidden) */}
            {/* {filteredProducts.length > 0 && (
              <div className="mt-10 flex justify-center items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E8ECF0] bg-white text-[#666666] hover:bg-[#F5F7FA] hover:text-[#4A90D9]">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#4A90D9] text-white font-medium shadow-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E8ECF0] bg-white text-[#666666] hover:bg-[#F5F7FA] hover:text-[#4A90D9]">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E8ECF0] bg-white text-[#666666] hover:bg-[#F5F7FA] hover:text-[#4A90D9]">3</button>
                <span className="text-[#666666]">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E8ECF0] bg-white text-[#666666] hover:bg-[#F5F7FA] hover:text-[#4A90D9]">&gt;</button>
              </div>
            )} */}
          </div>
        </div>
      </Container>
    </div>
  );
}
