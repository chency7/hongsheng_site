import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../public/images/partners');

// 确保目录存在
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 颜色配置
const COLORS = {
  bg: '#f8fafc', // zinc-50
  text: '#334155', // slate-700
  border: '#e2e8f0', // slate-200
};

const partners = [
  // --- 主要客户 (Customers) ---
  {
    name: '株洲时代新材料',
    url: 'https://crrcgc.cc/Portals/71/Skins/crrcgc-index/images/logo.png',
  },
  {
    name: '三一重工',
    url: 'https://www.sanygroup.com/img/sany-logo.png',
  },
  {
    name: '中联重科',
    url: 'https://www.zoomlion.com/images/header_logo.png',
  },
  {
    name: '徐工集团',
    url: 'https://www.xcmg.com/upload/images/2025/03/13/3f2acd7976c146619b241e189ab1b58e.png',
  },
  {
    name: '蓝天科技',
    url: 'https://www.lantiantech.com.cn/uploads/20240621/4300b8b09a70e70dda42953f14c83e5b.jpg',
  },
  {
    name: '飞翼股份',
    url: 'https://www.fenybackfilling.com/Upload/Template/web/SiteConfigPhoto/Original/202405/220e16aa-a4f3-482a-8ed4-faf8d2635692.png',
  },
  {
    name: '百通新材',
    url: 'https://www.betonm.cn/uploadfiles/2023/03/20230331100602282.png?bDEucG5n',
  },
  {
    name: '深蓝动力',
    url: null,
  },
  {
    name: '北路智控',
    url: null,
  },

  // --- 国际品牌 (International) ---
  {
    name: 'Parker',
    url: null,
  },
  {
    name: 'Sun Hydraulics',
    url: null,
  },
  {
    name: 'HAWE',
    url: null, // 尝试这个链接，如果不行会回退到生成
  },
  {
    name: 'Rexroth',
    url: null,
  },
  {
    name: 'Danfoss',
    url: null,
  },
  {
    name: 'HYDAC',
    url: null,
  },
  {
    name: 'Eaton',
    url: null,
  },
  {
    name: 'Wandfluh',
    url: null,
  },
  {
    name: 'ifm',
    url: null,
  },
  {
    name: 'Innovative Valve',
    url: null,
  },

  // --- 国内品牌 (Domestic) ---
  {
    name: '黎明液压',
    url: 'https://www.leemin.com.cn/template/default/images/logo2.png',
  },
  {
    name: 'DEO',
    url: null,
  },
  {
    name: '丰兴',
    url: null,
  },
  {
    name: 'AT Fluid',
    url: null,
  },
  {
    name: 'RADK-TECH',
    url: null,
  },
];

// 下载文件
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(false);
      return;
    }

    console.log(`Downloading ${path.basename(dest)}...`);
    const file = fs.createWriteStream(dest);

    const request = https.get(url, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve);
        return;
      }

      if (response.statusCode !== 200) {
        console.warn(`Failed to download ${url} (Status: ${response.statusCode})`);
        fs.unlink(dest, () => {});
        resolve(false);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`✓ Saved ${path.basename(dest)}`);
          resolve(true);
        });
      });
    });

    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      console.warn(`Error downloading ${url}: ${err.message}`);
      resolve(false);
    });
  });
}

// 生成占位 SVG
function generatePlaceholderSvg(text, dest) {
  // 计算大概的字体大小，字越多字越小
  const fontSize = text.length > 10 ? 16 : 20;

  const svgContent = `
<svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${COLORS.bg}"/>
  <rect x="2" y="2" width="196" height="96" fill="none" stroke="${COLORS.border}" stroke-width="2" rx="8"/>
  <text x="50%" y="50%" font-family="'Inter', sans-serif" font-weight="bold" font-size="${fontSize}" fill="${COLORS.text}" text-anchor="middle" dominant-baseline="middle">
    ${text}
  </text>
</svg>
`;
  fs.writeFileSync(dest, svgContent.trim());
  console.log(`+ Generated placeholder for: ${text}`);
}

async function main() {
  console.log('Start processing logos...');

  for (const p of partners) {
    // 如果没有 filename，根据 name 生成一个
    const filename = p.filename || `${p.name.replace(/\s+/g, '')}.png`;
    const dest = path.join(PUBLIC_DIR, filename);

    // 如果文件已存在，跳过（为了避免重复下载，如果想强制更新可以去掉这个检查）
    // 但考虑到可能是空文件或旧的，我们只检查是否存在
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log(`Skip existing: ${filename}`);
      continue;
    }

    let success = false;
    if (p.url) {
      try {
        success = await downloadFile(p.url, dest);
      } catch (e) {
        console.error(e);
      }
    }

    // 如果没有 URL 或者下载失败，生成占位符
    if (!success) {
      generatePlaceholderSvg(p.name, dest);
    }
  }

  console.log('All logos processed.');
}

main();
