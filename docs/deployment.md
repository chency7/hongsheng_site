# 鸿胜官网部署流程

本文档基于当前仓库实际代码与配置整理，覆盖生产部署前的环境准备、Supabase 初始化、Docker 上线、验收与日常运维。

关联文档：

- [Docker 部署（简版）](./docker.md)
- [后台管理 Supabase + Docker](./admin-supabase-docker.md)
- [产品后台架构边界](./admin-product-management-architecture.md)

---

## 1. 项目核查结论

### 1.1 运行形态

| 项 | 现状 |
| --- | --- |
| 框架 | Next.js 16（App Router） |
| 包管理 | pnpm |
| 生产输出 | `next.config.mjs` 已开启 `output: 'standalone'` |
| 推荐部署 | Docker multi-stage 构建 + `docker compose` |
| 默认访问端口 | 宿主机 `3001` -> 容器 `3000` |
| 容器名 | `next-start` |
| 数据与鉴权 | Supabase（服务端使用 `SERVICE_ROLE_KEY`） |
| 邮件咨询 | Nodemailer + SMTP 环境变量 |
| 本地开发 Node | `.nvmdrc` 指定 `24.10.0`；Dockerfile 使用 `node:22.20-alpine` |

### 1.2 生产关键依赖

生产环境下前台产品目录**必须**可读 Supabase：

- 未配置 `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` 时，生产会直接抛错
- 已配置但 catalog 为空时，生产也会抛错
- 开发环境未配置 Supabase 时会回退到 `src/data/products.ts` 本地种子数据

应用优先调用 RPC：

1. `get_admin_catalog()`
2. `replace_admin_catalog(catalog)`

若 RPC 不可用，会回退读写 `public.admin_state` 中 `key = 'catalog'` 的 JSONB 文档。

### 1.3 当前仓库需注意点

部署前请知悉以下与 README / compose 不一致或需人工确认的事项：

1. README 中的 `pnpm docker:run` 不存在；正确命令是 `pnpm docker:up` 或 `docker compose up -d --build`
2. `docker-compose.yml` 仍传入 `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`，但当前后台登录已改为 **Supabase Auth + admin 角色**，这三项不再被代码使用
3. `next.config.mjs` 的 `images.remotePatterns` 目前只允许 `http://124.221.2.206:8000/storage/...`。若生产 Supabase 域名或协议不同，必须先改这里再构建，否则 Next Image 可能拒绝加载产品图
4. Docker `HEALTHCHECK` 探测的是 `http://localhost:3000/`，不是 `/api/health`
5. 生产镜像构建时不会把 `.env*` 打进镜像（见 `.dockerignore`），运行时必须通过 compose / 环境变量注入密钥

---

## 2. 部署架构

```text
用户浏览器
  -> 反向代理（可选 Nginx / Caddy / 云负载均衡）
    -> Docker 容器 next-start:3000
      -> Next.js standalone server.js
        -> Supabase REST / Auth / Storage
        -> SMTP 服务器（联系我们表单）
```

核心服务边界：

| 能力 | 入口 | 外部依赖 |
| --- | --- | --- |
| 官网前台 | `/`、产品页等 | Supabase catalog / Storage 公网 URL |
| 健康检查 | `GET /api/health` | 无 |
| 联系表单 | `POST /api/contact` | SMTP |
| 后台登录 | `/admin/login`、`/api/admin/login` | Supabase Auth |
| 后台目录 | `/api/admin/catalog` | Supabase RPC / admin_state |
| 后台媒体 | `/api/admin/media` | Supabase Storage `files` bucket |

---

## 3. 部署前准备

### 3.1 服务器要求

- Linux / Windows Server / 任意可运行 Docker 的主机
- 已安装：
  - Docker Engine 24+
  - Docker Compose v2（`docker compose` 命令可用）
- 建议可用内存 >= 2 GB
- 开放端口：
  - 生产直连：`3001`（或你自定义的宿主机端口）
  - 若前面有 Nginx：仅开放 `80/443`，再反代到 `127.0.0.1:3001`

本地构建前也可使用 Node + pnpm 验证：

```bash
# 推荐使用与 .nvmdrc 接近的 Node 版本
node -v
corepack enable
pnpm install
pnpm build
```

### 3.2 需要提前准备的外部资源

1. **Supabase 项目**
   - Project URL
   - `service_role` key（仅服务端使用，禁止写到 `NEXT_PUBLIC_*`）
2. **SMTP 邮箱**（联系我们功能）
   - host / port / user / pass
   - 收件邮箱、发件邮箱
3. **初始管理员邮箱**
   - 用于 Supabase Auth 建号并授予 `admin` 角色
4. **生产域名**（可选但推荐）
   - 用于 HTTPS 与 Cookie 安全属性

---

## 4. 环境变量清单

在项目根目录创建 `.env`（不要提交到 Git）。Docker Compose 会自动读取同目录 `.env`。

```bash
# ---- 基础 ----
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000

# ---- Supabase（生产必填）----
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ---- 联系表单 SMTP（不配则 /api/contact 返回 500）----
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
CONTACT_SENDER_EMAIL=noreply@example.com
CONTACT_RECEIVER_EMAIL=sales@example.com

# ---- 以下变量目前 compose 仍会传入，但业务代码未使用 ----
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=change-me
# ADMIN_SESSION_SECRET=change-me-session-secret
```

### 变量说明

| 变量 | 是否必填 | 用途 |
| --- | --- | --- |
| `SUPABASE_URL` | 生产必填 | Supabase 项目地址，末尾 `/` 会被自动去掉 |
| `SUPABASE_SERVICE_ROLE_KEY` | 生产必填 | 服务端读写 catalog / Storage / Auth Admin |
| `SMTP_HOST` | 联系表单必填 | SMTP 主机 |
| `SMTP_PORT` | 建议填 | 默认 `465`；`465` 走 secure |
| `SMTP_USER` / `SMTP_PASS` | 联系表单必填 | SMTP 认证 |
| `CONTACT_SENDER_EMAIL` | 建议填 | 发件人；缺省回退 `SMTP_USER` |
| `CONTACT_RECEIVER_EMAIL` | 建议填 | 收件人；缺省有代码内默认邮箱 |

安全要求：

- 永远不要把 `SUPABASE_SERVICE_ROLE_KEY` 放进前端或 `NEXT_PUBLIC_*`
- `.env` 已被 `.gitignore` 忽略
- 生产镜像构建阶段不会复制 `.env*`

---

## 5. Supabase 初始化（首次部署必须）

按顺序在 Supabase SQL Editor 执行仓库脚本。

### 5.1 执行 SQL

1. 执行 [`scripts/supabase-admin-state.sql`](../scripts/supabase-admin-state.sql)
   - 创建 `public.admin_state`
   - 开启 RLS，仅 `service_role` 可访问
2. 执行 [`scripts/supabase-admin-catalog.sql`](../scripts/supabase-admin-catalog.sql)
   - 创建 `admin_categories` / `admin_sub_categories` / `admin_products`
   - 创建 RPC：`get_admin_catalog()`、`replace_admin_catalog(catalog jsonb)`
   - 写入时同步维护 `admin_state.catalog`
3. 执行 [`scripts/supabase-admin-auth.sql`](../scripts/supabase-admin-auth.sql)
   - 创建 `public.is_admin()`
   - 创建 `public.promote_admin(admin_email text)`

### 5.2 创建 Storage Bucket

产品图片与资料统一放在公有 bucket：`files`

路径约定：

```text
files/products/<categoryId>/<subCategoryId>/<productId>/<image>.webp
files/products/<categoryId>/<subCategoryId>/<productId>/documents/<document>
```

两种方式任选其一：

1. 在 Supabase Dashboard > Storage 手动创建公有 bucket `files`
2. 本地配置好 `.env` 后执行媒体同步脚本，脚本会尝试自动确保 bucket 存在：

```bash
pnpm install
pnpm supabase:sync-product-media
```

该命令会依次执行：

- `scripts/upload-product-images-to-storage.mjs`
- `scripts/upload-product-documents-to-storage.mjs`

说明：

- 可重复执行
- 图片会压缩为 WebP 后上传
- 会清理 catalog 已不再引用的产品媒体

### 5.3 创建初始管理员

后台账号走 Supabase Auth，不再使用环境变量账号密码。

1. 打开 Supabase Studio：`Authentication > Users`
2. 创建邮箱密码用户，例如 `admin@example.com`
3. 在 SQL Editor 授权管理员：

```sql
select * from public.promote_admin('admin@example.com');
```

或直接更新：

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where lower(email) = lower('admin@example.com');
```

4. 用户重新登录后台

后台权限判断规则：

- `app_metadata.role = "admin"`
- 或 `app_metadata.roles` 数组包含 `"admin"`

登录成功后，access / refresh token 写入 HttpOnly Cookie：

- `hs_admin_access_token`
- `hs_admin_refresh_token`

仅创建 Auth 用户但未授予 `admin`，登录接口会返回无后台权限。

### 5.4 首次写入产品目录

有两种方式：

1. **后台自动/手工维护**
   - 配置好 Supabase 后启动应用
   - 登录 `/admin/login`
   - 在后台维护分类、产品、图片与资料
2. **脚本同步本地种子媒体**
   - 先保证 catalog 中已有产品结构
   - 再执行 `pnpm supabase:sync-product-media`

注意：生产环境 catalog 为空会报错，因此上线前至少要有一份可读的产品目录。

---

## 6. Next Image 远程域名配置

构建前检查 [`next.config.mjs`](../next.config.mjs)：

```js
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: '124.221.2.206',
      port: '8000',
      pathname: '/storage/v1/object/public/files/**',
    },
  ],
}
```

如果实际 `SUPABASE_URL` 不是上述主机，请在构建前改成真实协议 / 域名 / 端口，例如：

```js
{
  protocol: 'https',
  hostname: 'your-project.supabase.co',
  pathname: '/storage/v1/object/public/files/**',
}
```

改完后需要重新构建镜像，否则图片优化接口可能失败。

---

## 7. Docker 生产部署（推荐）

### 7.1 准备代码与环境文件

```bash
# 1. 拉取代码
git clone <your-repo-url> hongsheng_site
cd hongsheng_site

# 2. 写入环境变量
# Windows PowerShell 可直接新建 .env 后编辑
# Linux / macOS:
cp .env.example .env   # 若仓库后续补充了示例文件
# 或手动创建 .env，填入第 4 节变量
```

确认至少存在：

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SMTP_HOST=...
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
CONTACT_SENDER_EMAIL=...
CONTACT_RECEIVER_EMAIL=...
```

### 7.2 构建并启动

仓库已提供脚本：

```bash
# 构建镜像
pnpm docker:build

# 后台启动
pnpm docker:up

# 查看日志
pnpm docker:logs
```

等价原生命令：

```bash
docker compose --progress plain build
docker compose up -d
docker compose logs -f app
```

一键构建并启动：

```bash
docker compose up -d --build
```

无缓存重建：

```bash
pnpm docker:rebuild
# 或
docker compose --progress plain build --no-cache
```

### 7.3 镜像构建过程说明

[`Dockerfile`](../Dockerfile) 分两阶段：

1. **builder**
   - 基于 `node:22.20-alpine`
   - 安装 `libc6-compat python3 make g++`（兼容原生模块）
   - `pnpm install --frozen-lockfile`
   - `pnpm build` 生成 standalone 产物
2. **runner**
   - 仅复制：
     - `public/`
     - `.next/standalone/`
     - `.next/static/`
   - 以非 root 用户 `nextjs(uid=1001)` 运行
   - `CMD ["node", "server.js"]`
   - 暴露 `3000`
   - HEALTHCHECK：每 30 秒请求 `http://localhost:3000/`

### 7.4 Compose 运行参数

[`docker-compose.yml`](../docker-compose.yml) 关键配置：

```yaml
services:
  app:
    container_name: next-start
    ports:
      - "3001:3000"
    restart: unless-stopped
```

如需改端口，例如改为 `8080`：

```yaml
ports:
  - "8080:3000"
```

### 7.5 验证服务

```bash
# 容器状态
docker compose ps

# 健康接口
curl http://127.0.0.1:3001/api/health

# 首页
curl -I http://127.0.0.1:3001/

# 后台登录页
curl -I http://127.0.0.1:3001/admin/login
```

期望：

- `/api/health` 返回 JSON：`{"status":"ok", ...}`
- 首页 HTTP 200
- 后台登录页可打开
- 使用已授权管理员账号可登录
- 产品中心可读取 Supabase catalog
- 产品图片可正常显示

---

## 8. 非 Docker 部署（备选）

适用于已有 Node 运行时、不用容器的场景。

```bash
# 1. 安装依赖
corepack enable
pnpm install --frozen-lockfile

# 2. 准备环境变量
# 导出与第 4 节相同的变量，或使用进程管理器注入

# 3. 构建
pnpm build

# 4. 启动
pnpm start
# 默认监听 3000
```

生产建议用进程管理器守护，例如 systemd / pm2：

```bash
# pm2 示例
pnpm build
pm2 start pnpm --name hongsheng-site -- start
pm2 save
```

若使用 standalone 产物直接运行：

```bash
node .next/standalone/server.js
```

并确保同时可访问：

- `.next/static`
- `public`

（Docker 镜像已处理这些复制；裸机 standalone 需自行对齐目录结构。）

---

## 9. 反向代理与 HTTPS（推荐）

### 9.1 Nginx 示例

```nginx
server {
  listen 80;
  server_name www.example.com;

  client_max_body_size 50m;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

建议再配置 HTTPS（Let’s Encrypt / 云证书）。后台 Cookie 在生产环境会按 secure 策略处理，务必保证外网以 HTTPS 访问。

### 9.2 上传体积

后台会上传产品图片与资料，反向代理的 `client_max_body_size` / 负载均衡请求体限制建议 >= 20~50MB。

---

## 10. 上线检查清单

### 10.1 上线前

- [ ] `.env` 已配置 Supabase 与 SMTP
- [ ] SQL 脚本已按顺序执行
- [ ] 初始管理员已创建并 `promote_admin`
- [ ] Storage bucket `files` 已创建且为 public
- [ ] catalog 已有可发布产品数据
- [ ] 如有需要，已同步本地种子媒体
- [ ] `next.config.mjs` 远程图片域名与真实 Supabase 一致
- [ ] 镜像构建成功

### 10.2 上线后

- [ ] `GET /api/health` 正常
- [ ] 首页、产品中心、产品详情可打开
- [ ] 产品图片 / 资料 URL 可访问
- [ ] `/admin/login` 可登录
- [ ] 后台增删改后前台数据更新
- [ ] 联系表单可成功发信
- [ ] 容器 `restart: unless-stopped` 生效（重启主机后自动拉起）

### 10.3 常见失败对照

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| 生产首页/产品页直接报错 | 未配 Supabase 或 catalog 为空 | 检查环境变量；确认 RPC/表数据 |
| 后台提示 Auth 未配置 | 缺少 `SUPABASE_*` | 补齐并重启容器 |
| 登录提示无后台权限 | 用户未授予 admin | 执行 `promote_admin` |
| 联系表单失败 | SMTP 未配或鉴权失败 | 检查 SMTP 变量与邮箱服务商授权码 |
| 图片不显示 / Image 优化失败 | `remotePatterns` 与真实域名不一致 | 修改 `next.config.mjs` 后重建 |
| 容器反复重启 | 构建产物异常或端口占用 | `docker compose logs -f app` 排查 |
| 修改 `.env` 后不生效 | 容器未重建/未重建环境 | `docker compose up -d --force-recreate` |

---

## 11. 日常运维

### 11.1 常用命令

```bash
# 查看状态
docker compose ps

# 跟踪日志
pnpm docker:logs

# 停止
pnpm docker:down

# 更新代码后重新发布
git pull
docker compose up -d --build

# 仅重建 app 服务
docker compose up -d --build app
```

### 11.2 滚动更新建议

1. 拉取最新代码
2. 确认 SQL / 环境变量是否有新增要求
3. 如有 `next.config.mjs` 或依赖变更，执行重建
4. `docker compose up -d --build`
5. 验证 `/api/health`、首页、后台登录

### 11.3 备份建议

至少备份：

1. Supabase 数据库（`admin_*` 表、`admin_state`、Auth 用户）
2. Storage bucket `files`
3. 部署机上的 `.env`（离线安全保存，勿入库）

---

## 12. 开发环境快速启动（非生产）

```bash
pnpm install
pnpm dev
```

默认：

- 地址：`http://localhost:3000`
- 未配置 Supabase 时使用本地种子 catalog
- 后台持久化、媒体上传仍依赖 Supabase 配置

---

## 13. 推荐标准上线顺序（汇总）

把下面流程当作首次生产部署的标准 checklist：

1. 准备服务器 Docker / Compose
2. 创建 Supabase 项目，拿到 URL 与 service role key
3. 按顺序执行 3 个 SQL 脚本
4. 创建 Auth 用户并 `promote_admin`
5. 创建 / 确认 Storage bucket `files`
6. 配置服务器 `.env`
7. 校正 `next.config.mjs` 图片远程域名
8. （可选）在可访问 Supabase 的机器执行 `pnpm supabase:sync-product-media`
9. `docker compose up -d --build`
10. 验收健康检查、前台、后台、邮件
11. 配置 Nginx/HTTPS 与开机自启（compose 已 `restart: unless-stopped`）

---

## 14. 相关文件索引

| 文件 | 作用 |
| --- | --- |
| [`Dockerfile`](../Dockerfile) | 生产镜像 multi-stage 构建 |
| [`docker-compose.yml`](../docker-compose.yml) | 容器编排、端口、环境变量 |
| [`.dockerignore`](../.dockerignore) | 排除 `.env*`、`node_modules`、`.next` 等 |
| [`next.config.mjs`](../next.config.mjs) | standalone 输出、图片域名、安全头 |
| [`package.json`](../package.json) | `build` / `start` / `docker:*` / 媒体同步脚本 |
| [`scripts/supabase-admin-state.sql`](../scripts/supabase-admin-state.sql) | admin_state 表 |
| [`scripts/supabase-admin-catalog.sql`](../scripts/supabase-admin-catalog.sql) | 分类产品表 + RPC |
| [`scripts/supabase-admin-auth.sql`](../scripts/supabase-admin-auth.sql) | 管理员授权函数 |
| [`src/lib/supabase-admin-state.ts`](../src/lib/supabase-admin-state.ts) | 生产 catalog 读写逻辑 |
| [`src/lib/admin-auth.ts`](../src/lib/admin-auth.ts) | 后台 Supabase Auth |
| [`src/app/api/contact/route.ts`](../src/app/api/contact/route.ts) | 联系表单邮件发送 |
| [`src/app/api/health/route.ts`](../src/app/api/health/route.ts) | 健康检查接口 |
