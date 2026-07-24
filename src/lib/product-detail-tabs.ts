export const STANDARD_PRODUCT_DETAIL_TABS = [
  '产品简介',
  '技术参数',
  '外形尺寸',
  '应用案例',
  '相关下载',
] as const;

export type StandardProductDetailTab = (typeof STANDARD_PRODUCT_DETAIL_TABS)[number];

const STANDARD_TAB_ALIASES: Record<StandardProductDetailTab, readonly string[]> = {
  产品简介: ['产品简介', '产品概述'],
  技术参数: ['技术参数', '规格参数'],
  外形尺寸: ['外形尺寸', '安装尺寸'],
  应用案例: ['应用案例', '应用场景'],
  相关下载: ['相关下载', '资料下载', '产品资料', '产品手册'],
};

export function canonicalProductDetailTab(title: string): StandardProductDetailTab | null {
  const normalizedTitle = title.trim();
  return STANDARD_PRODUCT_DETAIL_TABS.find((standardTitle) =>
    STANDARD_TAB_ALIASES[standardTitle].includes(normalizedTitle),
  ) || null;
}

export function findProductDetailTab<T extends { title: string }>(
  tabs: readonly T[] | undefined,
  title: string,
): T | undefined {
  const canonicalTitle = canonicalProductDetailTab(title);
  return tabs?.find((tab) => {
    if (!canonicalTitle) return tab.title.trim() === title.trim();
    return canonicalProductDetailTab(tab.title) === canonicalTitle;
  });
}

export function productDetailTabTitles<T extends { title: string }>(tabs: readonly T[] | undefined) {
  const customTitles = (tabs || [])
    .filter((tab) => !canonicalProductDetailTab(tab.title))
    .map((tab) => tab.title.trim())
    .filter(Boolean);

  return Array.from(new Set<string>([...STANDARD_PRODUCT_DETAIL_TABS, ...customTitles]));
}
