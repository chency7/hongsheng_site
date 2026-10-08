$ErrorActionPreference = "Stop"

$RootDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$OutDir = Join-Path $RootDir "offline-deploy"
$ImageName = "hongsheng-site:latest"
$TarName = "hongsheng-site.tar"

Set-Location $RootDir

Write-Host "[1/3] build image $ImageName"
docker compose build
if ($LASTEXITCODE -ne 0) { throw "docker compose build failed" }

Write-Host "[2/3] export image -> $OutDir\$TarName"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
docker save -o (Join-Path $OutDir $TarName) $ImageName
if ($LASTEXITCODE -ne 0) { throw "docker save failed" }

Write-Host "[3/3] copy compose file"
Copy-Item (Join-Path $RootDir "docker-compose.yml") (Join-Path $OutDir "docker-compose.yml") -Force

$envFile = Join-Path $RootDir ".env"
if (Test-Path $envFile) {
  Copy-Item $envFile (Join-Path $OutDir ".env") -Force
  Write-Host "copied .env"
} else {
  @"
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
CONTACT_SENDER_EMAIL=
CONTACT_RECEIVER_EMAIL=
"@ | Set-Content -Path (Join-Path $OutDir ".env.example") -Encoding utf8
  Write-Host "no .env found, wrote .env.example"
}

@"
离线部署步骤（服务器只需 Docker）：

1. 把本目录拷到服务器
2. 若只有 .env.example，复制为 .env 并填入线上 Supabase 配置
3. docker load -i hongsheng-site.tar
4. docker compose up -d
5. 访问 http://服务器IP:3001
"@ | Set-Content -Path (Join-Path $OutDir "README.txt") -Encoding utf8

Write-Host "done: $OutDir"
Get-ChildItem $OutDir | Format-Table Name, Length