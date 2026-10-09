import { Inter, Pacifico } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400'],
  fallback: ['system-ui', 'sans-serif'],
});

export const pacifico = Pacifico({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-Pacifico',
  fallback: ['cursive', 'system-ui'],
});

// 中文正文字体 LXGW WenKai 改为按需分包加载：
// 见 global.css 的 @import 'lxgw-wenkai-webfont/style.css' 与 --font-wenkai 定义。
// （原 next/font/local 整包 TTF 18.8MB，改为 unicode-range 分包后访客只下载用到的字形）

export const calSans = localFont({
  src: [
    {
      path: '../fonts/CalSans-SemiBold.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-calsans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
