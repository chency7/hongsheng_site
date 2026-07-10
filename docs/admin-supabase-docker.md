# 后台管理 Supabase + Docker 部署

## 1. 创建 Supabase 表

在 Supabase 项目的 SQL Editor 中执行：

```sql
-- scripts/supabase-admin-state.sql
```

该脚本会创建 `public.admin_state` 表。后台会把分类、产品、图片 URL、详情 Tab 等管理数据保存为一个 `catalog` JSONB 文档。

## 2. 配置环境变量

复制 `.env.example` 为 `.env`，至少配置：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=your-long-random-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` 只会在 Next.js 服务端使用，不会暴露给浏览器。不要把它写入 `NEXT_PUBLIC_*` 变量。

## 3. 一键部署

```bash
docker compose up -d --build
```

默认映射为宿主机 `3001` 到容器 `3000`，访问：

```txt
http://localhost:3001
http://localhost:3001/admin/login
```

## 4. 行为说明

- 如果 Supabase 环境变量未配置，后台仍会显示由 `src/data/products.ts` 生成的默认数据，但修改不会持久化。
- 配置 Supabase 后，第一次访问后台会自动把默认产品目录写入 `admin_state`。
- 后台增删改会通过 `/api/admin/catalog` 写入 Supabase。
- 当前阶段后台数据已持久化，但前台产品页仍主要读取静态 `src/data/products.ts`；后续可继续把前台产品中心切到同一份 Supabase catalog。
