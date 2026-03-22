'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Grid, List, X, ChevronDown, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import { products, categoryOptions, type ProductCategory, type CategoryOption } from '@/data/products';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest';

export default function ProductsClient() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

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
      return;
    }
    
    // 如果点击的是一级分类，则选中/取消选中该分类下的所有二级分类
    const topCategory = categoryOptions.find(c => c.id === catId);
    if (topCategory && topCategory.subCategories) {
      const subIds = topCategory.subCategories.map(sub => sub.id);
      const isAllSelected = subIds.every(id => selectedCategories.includes(id));
      
      if (isAllSelected) {
        // 取消全选
        setSelectedCategories(prev => prev.filter(id => !subIds.includes(id)));
      } else {
        // 全选
        setSelectedCategories(prev => {
          const newSet = new Set([...prev, ...subIds]);
          return Array.from(newSet);
        });
      }
      return;
    }

    // 单击二级分类
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const removeFilter = (type: 'category', value: string) => {
    if (type === 'category') setSelectedCategories(prev => prev.filter(c => c !== value));
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

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [debouncedQuery, selectedCategories, sortBy]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#333333]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8ECF0] py-3">
        <Container>
          <div className="flex items-center text-sm text-[#666666]">
            <Link href="/" className="hover:text-[#4A90D9]">首页</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#333333] font-medium">产品中心</span>
            {selectedCategories.length === 1 && (
              <>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-[#4A90D9]">{selectedCategories[0]}</span>
              </>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="w-full lg:w-[240px] shrink-0 space-y-6">
            <div className="bg-white rounded-[8px] border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-4 border-b border-[#E8ECF0]">
                <h3 className="font-semibold text-[#1E3A5F] text-[14px]">产品分类</h3>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => toggleCategory('全部')}
                  className={`w-full text-left px-4 py-2.5 rounded-md text-sm transition-colors ${
                    selectedCategories.length === 0
                      ? 'bg-[#F0F5FA] text-[#1E3A5F] font-bold border-l-4 border-[#4A90D9]'
                      : 'text-[#666666] hover:bg-[#F5F7FA] border-l-4 border-transparent'
                  }`}
                >
                  全部产品
                </button>
                {categoryOptions.map(cat => {
                  const subIds = cat.subCategories?.map(sub => sub.id) || [];
                  const isAllSubSelected = subIds.length > 0 && subIds.every(id => selectedCategories.includes(id));
                  
                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex justify-between items-center ${
                          isAllSubSelected
                            ? 'bg-[#F0F5FA] text-[#1E3A5F] border-l-4 border-[#4A90D9]'
                            : 'text-[#333333] hover:bg-[#F5F7FA] border-l-4 border-transparent'
                        }`}
                      >
                        {cat.name}
                      </button>
                      
                      {/* 默认全部展开子分类 */}
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        <div className="pl-6 space-y-1 pb-2">
                          {cat.subCategories.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => toggleCategory(sub.id)}
                              className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                                selectedCategories.includes(sub.id)
                                  ? 'text-[#4A90D9] bg-[#F0F5FA] font-medium'
                                  : 'text-[#666666] hover:bg-[#F5F7FA]'
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="pl-6 pb-2">
                          <div className="px-4 py-2 text-xs text-gray-400 italic">
                            暂无产品分类
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-[#666666]">已选条件：</span>
                {selectedCategories.map(catId => {
                  let catName = catId;
                  // 尝试查找二级分类的名称
                  categoryOptions.forEach(cat => {
                    const sub = cat.subCategories?.find(s => s.id === catId);
                    if (sub) catName = sub.name;
                  });
                  
                  return (
                    <span key={catId} className="inline-flex items-center gap-1 bg-white border border-[#4A90D9] text-[#4A90D9] px-2 py-1 rounded text-xs">
                      {catName}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeFilter('category', catId)} />
                    </span>
                  );
                })}
                <button onClick={clearFilters} className="text-sm text-[#666666] hover:text-[#FF6B35] ml-2">
                  清除全部
                </button>
              </div>
            )}

            {/* Top Toolbar */}
            <div className="bg-white rounded-[8px] border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-[#666666]">
                找到 <span className="font-bold text-[#FF6B35] mx-1">{filteredProducts.length}</span> 个产品
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索产品名称/型号..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full sm:w-64 border border-[#E8ECF0] rounded-md text-sm outline-none focus:border-[#4A90D9] focus:ring-1 focus:ring-[#4A90D9]/20 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <span className="text-sm text-[#666666]">排序：</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border-none text-sm outline-none bg-transparent cursor-pointer font-medium text-[#333333] hover:text-[#4A90D9]"
                  >
                    <option value="newest">最新</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#F0F5FA] text-[#4A90D9]' : 'text-gray-400 hover:text-[#333333]'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-[#F0F5FA] text-[#4A90D9]' : 'text-gray-400 hover:text-[#333333]'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[8px] border border-[#E8ECF0] p-16 text-center">
                <div className="text-gray-400 mb-4 flex justify-center"><Search className="w-12 h-12" /></div>
                <p className="text-lg font-medium text-[#333333]">未找到符合条件的产品</p>
                <button onClick={clearFilters} className="mt-4 text-[#4A90D9] hover:underline">清除筛选条件</button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }>
                {filteredProducts.map((product, idx) => (
                  <MotionReveal key={product.id} delay={idx * 0.05}>
                    {viewMode === 'grid' ? (
                      // Grid Card
                      <Link href={`/products/${product.id}`} className="block group bg-white rounded-[8px] border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:border-[#4A90D9] hover:-translate-y-[2px] transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <div className="relative h-[180px] w-full bg-white p-4 flex items-center justify-center border-b border-[#E8ECF0] overflow-hidden">
                          {/* Fallback color block if image is not ready */}
                          <div className="absolute inset-0 bg-slate-50" />
                          {/* <Image src={product.image} alt={product.name} fill className="object-contain p-4 transition-transform duration-300 group-hover:scale-105 z-10" /> */}
                          <div className="z-10 w-full h-full relative transition-transform duration-300 group-hover:scale-105">
                            <Image src={product.image || "/images/hs/hydraulic.svg"} alt={product.name} fill className="object-cover" />
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h4 className="text-[16px] font-semibold text-[#333333] mb-1 group-hover:text-[#4A90D9] transition-colors">{product.name}</h4>
                          <p className="text-[14px] text-[#666666] mb-2">型号：{product.model}</p>
                          <p className="text-[13px] text-[#666666] mb-4 line-clamp-2" title={product.description}>
                            {product.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                            {product.specs.slice(0, 2).map((spec, i) => (
                              <span key={i} className="bg-[#F5F7FA] text-[#666666] text-xs px-2 py-1 rounded-sm border border-[#E8ECF0]">
                                {spec.label}: {spec.value}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-end pt-3 border-t border-[#E8ECF0]">
                            <span className="text-[14px] font-medium text-white bg-[#4A90D9] px-3 py-1.5 rounded hover:bg-[#1E3A5F] transition-colors">
                              查看详情
                            </span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      // List Card
                      <Link href={`/products/${product.id}`} className="block group bg-white rounded-[8px] border border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:border-[#4A90D9] transition-all duration-300 p-4 flex flex-col sm:flex-row gap-6">
                        <div className="relative w-full sm:w-[200px] h-[150px] shrink-0 bg-slate-50 rounded-md border border-[#E8ECF0] overflow-hidden">
                           <Image src={product.image || "/images/hs/hydraulic.svg"} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-[18px] font-semibold text-[#333333] mb-1 group-hover:text-[#4A90D9] transition-colors">{product.name}</h4>
                              <div className="flex items-center gap-4 text-[14px] text-[#666666]">
                                <span>型号：{product.model}</span>
                                <span>品牌：{product.brand}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-sm text-[#666666] mb-4 line-clamp-2">
                            简介：{product.description}
                          </div>
                          
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[#666666] divide-x divide-gray-300">
                              {product.specs.map((spec, i) => (
                                <span key={i} className={i > 0 ? "pl-2" : ""}>{spec.label} {spec.value}</span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <span className="text-[14px] font-medium text-[#333333] border border-[#E8ECF0] bg-white px-4 py-2 rounded hover:bg-[#F5F7FA] transition-colors">
                                加入对比
                              </span>
                              <span className="text-[14px] font-medium text-white bg-[#FF6B35] px-4 py-2 rounded hover:bg-[#e05b29] transition-colors shadow-sm">
                                加入询价单
                              </span>
                            </div>
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
