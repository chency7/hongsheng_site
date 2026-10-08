#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${ROOT_DIR}/offline-deploy"
IMAGE_NAME="hongsheng-site:latest"
TAR_NAME="hongsheng-site.tar"

cd "${ROOT_DIR}"

echo "[1/3] build image ${IMAGE_NAME}"
docker compose build

echo "[2/3] export image -> ${OUT_DIR}/${TAR_NAME}"
mkdir -p "${OUT_DIR}"
docker save -o "${OUT_DIR}/${TAR_NAME}" "${IMAGE_NAME}"

echo "[3/3] copy compose file"
cp "${ROOT_DIR}/docker-compose.yml" "${OUT_DIR}/docker-compose.yml"

if [[ -f "${ROOT_DIR}/.env" ]]; then
  cp "${ROOT_DIR}/.env" "${OUT_DIR}/.env"
  echo "copied .env"
else
  cat > "${OUT_DIR}/.env.example" <<'EOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
CONTACT_SENDER_EMAIL=
CONTACT_RECEIVER_EMAIL=
EOF
  echo "no .env found, wrote .env.example"
fi

cat > "${OUT_DIR}/README.txt" <<'EOF'
离线部署步骤（服务器只需 Docker）：

1. 把本目录拷到服务器
2. 若只有 .env.example，复制为 .env 并填入线上 Supabase 配置
3. docker load -i hongsheng-site.tar
4. docker compose up -d
5. 访问 http://服务器IP:3001
EOF

echo "done: ${OUT_DIR}"
ls -lh "${OUT_DIR}"