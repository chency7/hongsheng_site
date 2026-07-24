# 后台管理 Supabase + Docker 部署

## 1. 创建 Supabase 表

在 Supabase 项目的 SQL Editor 中执行：

```sql
-- scripts/supabase-admin-state.sql
```

该脚本会创建 `public.admin_state` 表。后台会把分类、产品、图片 URL、详情 Tab 等管理数据保存为一个 `catalog` JSONB 文档。

## 2. 配置环境变量

在部署环境中至少配置：

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` 只会在 Next.js 服务端使用，不会暴露给浏览器。不要把它写入 `NEXT_PUBLIC_*` 变量。

## 3. 创建后台管理员

后台登录账号由 Supabase Auth 管理，不再由前端或部署环境变量保存用户名和密码：

登录后台后，可以在 `账号权限` 页面创建新账号、授予管理员权限或取消管理员权限。该页面会通过服务端 API 使用 `SUPABASE_SERVICE_ROLE_KEY` 调用 Supabase Auth Admin API，浏览器不会拿到 service role key。

首次没有任何管理员可登录时，可以先用 Supabase Studio 或 SQL 授权一个初始管理员：

1. 打开 Supabase Studio 的 `Authentication > Users`，创建邮箱密码用户。
2. 在 SQL Editor 中执行 `scripts/supabase-admin-auth.sql`，创建管理员判断和授权函数。
3. 使用邮箱授权管理员账号：

```sql
select * from public.promote_admin('admin@example.com');
```

把 `admin@example.com` 替换成要授权的账号。该函数会给用户的 `app_metadata` 追加 `{"role":"admin"}`，并保留原有 `provider` / `providers` 等字段。
4. 授权后让用户重新登录后台。后台代码会校验 `app_metadata.role = "admin"`，或 `app_metadata.roles` 数组里包含 `"admin"`。

如果 Studio 可以编辑 `Raw App Meta Data` / `app_metadata`，也可以直接设置为 `{"role":"admin"}`。如果原来已有内容，就在原 JSON 里追加 `"role":"admin"`，不要覆盖其它字段。请勿直接在项目代码、SQL 文件或 `.env` 中保存管理员明文密码。

如果只想执行一次临时 SQL，也可以直接在 Supabase SQL Editor 执行下面语句，把邮箱替换成要授权的账号：

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where lower(email) = lower('admin@example.com');
```

仅在 `Authentication > Users` 里创建账号密码还不能进入后台；必须完成上面的 `admin` 授权，否则登录接口会返回“该账号没有后台管理权限”。

登录成功后，Supabase access token 和 refresh token 仅保存在 HttpOnly Cookie 中；浏览器 JavaScript 无法读取 token，受保护的后台 API 会在服务端验证用户及 `admin` 权限。

## 4. 一键部署

```bash
docker compose up -d --build
```

默认映射为宿主机 `3001` 到容器 `3000`，访问：

```txt
http://localhost:3001
http://localhost:3001/admin/login
```

## 5. 行为说明

- 如果 Supabase 环境变量未配置，后台仍会显示由 `src/data/products.ts` 生成的默认数据，但修改不会持久化。
- 配置 Supabase 后，第一次访问后台会自动把默认产品目录写入 `admin_state`。
- 后台增删改会通过 `/api/admin/catalog` 写入 Supabase。
- 前台产品中心与产品详情页读取同一份 Supabase catalog；生产环境 Supabase 读取失败时会直接暴露错误，不会静默回退到 `src/data/products.ts` 的本地媒体地址。
- 产品图片和产品资料统一存放在 `files` bucket。执行 `pnpm supabase:sync-product-media` 可重复同步本地种子媒体，并清理 catalog 已不再引用的产品媒体。
