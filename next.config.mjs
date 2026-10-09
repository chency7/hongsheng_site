/** 纯前端静态导出配置：产物输出到 out/，可部署到任意静态托管（Nginx / OSS+CDN / Vercel 等） */
const nextConfig = {
  output: 'export',
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    // 静态导出不支持 Next 内置图片优化，改用浏览器直接加载原始图片
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '124.221.2.206',
        port: '8000',
        pathname: '/storage/v1/object/public/files/**',
      },
    ],
  },
  poweredByHeader: false,
  experimental: {
    // 客户端路由缓存：静态导出下页面 payload 均为静态，缓存更久可减少
    // 每次点菜单都回源拉取 __next.*.__PAGE__.txt（弱网/带宽受限时导航明显变慢）
    staleTimes: {
      static: 600,
      dynamic: 60,
    },
  },
};

export default nextConfig;
