# Docker 离线部署

适用场景：服务器**没有 Git / Node**，外网也不方便。  
在有网络的电脑上构建镜像并打成离线包，拷到服务器后用 Docker 导入启动即可。

> 开发环境已接线上 Supabase。离线包只解决“部署网站”这件事；  
> 运行时服务器仍需能访问线上 Supabase（以及需要时的 SMTP）。

## 你需要什么

| 机器 | 需要 |
| --- | --- |
| 打包机（你的开发机） | Docker、可访问外网（构建镜像用） |
| 服务器 | 仅 Docker（建议 Docker Compose v2） |

不需要：服务器上的 Git、Node、pnpm、npm。

## 一、打包机：构建并导出

在项目根目录执行：

```bash
# 1. 构建镜像
docker compose build

# 2. 导出镜像为离线包
docker save -o hongsheng-site.tar hongsheng-site:latest
```

可选压缩（体积更小，传输更省事）：

```bash
# Linux / macOS
gzip -k hongsheng-site.tar

# Windows PowerShell
Compress-Archive -Path hongsheng-site.tar -DestinationPath hongsheng-site.tar.zip
```

准备要拷到服务器的文件：

```text
offline-deploy/
  hongsheng-site.tar          # 或 .tar.gz / .zip
  docker-compose.yml          # 仓库根目录同名文件
  .env                        # 运行配置（见下一节）
```

也可用项目脚本一键打包：

```bash
pnpm docker:package
```

会在 `offline-deploy/` 生成上述文件（`.env` 需你自行放入或在服务器创建）。

## 二、配置 `.env`

把开发环境同一套线上 Supabase 配置写进 `.env`：

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 联系表单需要时再配
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
CONTACT_SENDER_EMAIL=
CONTACT_RECEIVER_EMAIL=
```

说明：

- 密钥**不要**打进镜像，只放 `.env`
- 不要使用 `NEXT_PUBLIC_*` 暴露 `SERVICE_ROLE_KEY`

## 三、服务器：导入并启动

1. 把 `offline-deploy/` 整个目录拷到服务器（U 盘 / 内网 / 跳板机均可）
2. 进入目录：

```bash
cd offline-deploy
```

3. 若是压缩包，先解压镜像：

```bash
# .tar.gz
gunzip -k hongsheng-site.tar.gz

# 或 .zip
# Windows: Expand-Archive hongsheng-site.tar.zip
```

4. 导入镜像：

```bash
docker load -i hongsheng-site.tar
```

看到类似输出即成功：

```text
Loaded image: hongsheng-site:latest
```

5. 确认目录里有：

```text
docker-compose.yml
.env
```

6. 启动（**不要**加 `--build`，服务器不构建）：

```bash
docker compose up -d
```

没有 Compose 插件时，可用：

```bash
docker run -d \
  --name next-start \
  --restart unless-stopped \
  -p 3001:3000 \
  --env-file .env \
  -e NODE_ENV=production \
  -e PORT=3000 \
  hongsheng-site:latest
```

## 四、访问

| 页面 | 地址 |
| --- | --- |
| 官网 | http://服务器IP:3001 |
| 后台 | http://服务器IP:3001/admin/login |
| 健康检查 | http://服务器IP:3001/api/health |

## 五、常用运维

```bash
# 状态
docker compose ps

# 日志
docker compose logs -f app

# 停止
docker compose down

# 改了 .env 后重生容器（不用重新 load 镜像）
docker compose up -d --force-recreate
```

### 版本更新（仍走离线包）

1. 打包机重新 `docker compose build` + `docker save`
2. 把新的 `hongsheng-site.tar` 拷到服务器
3. 服务器执行：

```bash
docker compose down
docker load -i hongsheng-site.tar
docker compose up -d
```

## 六、注意

1. **服务器最低要求**：已安装 Docker；能访问线上 Supabase
2. **不要在服务器执行** `docker compose up --build`（会尝试联网构建，且无源码）
3. 镜像架构要一致：打包机与服务器同为 `amd64` 或同为 `arm64`  
   交叉打包示例（在 Apple Silicon 打 Linux x86 包）：

```bash
docker buildx build --platform linux/amd64 -t hongsheng-site:latest --load .
docker save -o hongsheng-site.tar hongsheng-site:latest
```

4. 完整生产检查清单见 [deployment.md](./deployment.md)
