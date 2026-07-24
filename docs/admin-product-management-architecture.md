# 产品后台管理模块维护说明

当前策略是保留现有 Next.js 项目里的 `/admin`，但把产品后台按可迁移边界拆开。以后如果要拆成独立后台项目，优先搬运这些边界层，而不是从页面组件里重写业务逻辑。

## 当前边界

- 页面与表单：`src/app/admin/**`
- 客户端后台数据 API：`src/lib/admin/catalog-client.ts`
- 服务端后台数据仓储：`src/lib/admin/catalog-repository.ts`
- Supabase 实现细节：`src/lib/supabase-admin-state.ts`
- 后台数据类型和初始化/归一化：`src/lib/admin-catalog.ts`
- Storage 媒体同步入口：`scripts/sync-product-media-to-storage.mjs`
- Storage 图片同步脚本：`scripts/upload-product-images-to-storage.mjs`
- Storage 产品资料同步脚本：`scripts/upload-product-documents-to-storage.mjs`

## 维护原则

1. 页面组件只使用 `useAdminStore` 或 `catalog-client`，不要直接请求 Supabase。
2. API Route 只调用 `catalog-repository`，不要把 Supabase 表名、RPC 名散落到路由里。
3. Supabase 读写实现保留在 `supabase-admin-state.ts`，后续换 CMS、独立后端或其他数据库时，只替换 repository 下游实现。
4. 产品目录写入前统一经过 `normalizeAdminCatalog`，确保产品归属到真实后台子分类，避免图片 Storage、导航菜单、后台筛选各用一套分类。
5. Storage 图片目录保持 `files/products/<categoryId>/<subCategoryId>/<productId>/<image>`。
6. 产品资料目录保持 `files/products/<categoryId>/<subCategoryId>/<productId>/documents/<document>`，上传、替换、删除都通过 `src/lib/admin/media-client.ts` 和服务端 media repository，不在页面中直连 Supabase。
7. 批量同步统一执行 `pnpm supabase:sync-product-media`；脚本可重复执行，只删除 catalog 已不再引用的产品媒体。
8. 图片同步时以 `public/images/products` 原图为源，自动旋转并等比缩放到最长边不超过 2400px，再以 WebP 质量 82 上传；本地原图保留用于未来重新生成，Supabase 和 catalog 只保存压缩版本。

## 未来拆独立项目时的迁移顺序

1. 复制 `src/lib/admin-catalog.ts`、`src/lib/admin/catalog-client.ts`、`src/lib/admin/catalog-repository.ts` 和后台页面。
2. 把 `/api/admin/catalog` 抽成独立后台项目的同名 API 或 SDK 方法。
3. 保持 `AdminCatalog` 数据结构不变，让官网继续通过 Supabase/RPC 读取发布后的产品目录。
4. 后台项目稳定后，再决定是否把认证、文件管理、Storage 上传做成独立服务。
