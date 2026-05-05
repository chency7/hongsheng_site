import './global.css';
import { Metadata } from 'next';
import { inter, pacifico, lxgwWenKai, calSans } from '@/utils/fonts';
import { OrganizationSchema, LocalBusinessSchema } from '@/components/seo/SchemaOrg';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.xl-honsun.com'),
  title: {
    default: '湖南协力鸿胜机械有限公司 - 液压系统与电控系统专家',
    template: '%s | 湖南协力鸿胜机械有限公司',
  },
  description:
    '湖南协力鸿胜机械有限公司专注液压系统与电控系统的设计、研发与制造。提供工程机械液压站、试验检测设备、定制化液压解决方案。服务工程机械、船舶海洋、风电、轨道交通等行业。',
  keywords: [
    '液压系统',
    '液压泵站',
    '液压站',
    '工程机械液压',
    '电控系统',
    '试验检测设备',
    '液压系统设计',
    '液压系统制造',
    '定制液压解决方案',
    '工程机械液压站',
    '船用液压系统',
    '风电液压测试',
    '轨道交通液压',
    '长沙液压系统',
    '湖南液压系统',
    '鸿胜机械',
    '协力鸿胜',
  ],
  authors: [{ name: '湖南协力鸿胜机械有限公司' }],
  creator: '湖南协力鸿胜机械有限公司',
  publisher: '湖南协力鸿胜机械有限公司',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.xl-honsun.com',
    siteName: '湖南协力鸿胜机械有限公司',
    title: '湖南协力鸿胜机械有限公司 - 液压系统与电控系统专家',
    description:
      '专注液压系统与电控系统的设计、研发与制造。提供工程机械液压站、试验检测设备、定制化液压解决方案。',
    images: [
      {
        url: '/images/hs/logo.png',
        width: 1200,
        height: 630,
        alt: '湖南协力鸿胜机械有限公司',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '湖南协力鸿胜机械有限公司 - 液压系统与电控系统专家',
    description:
      '专注液压系统与电控系统的设计、研发与制造。提供工程机械液压站、试验检测设备、定制化液压解决方案。',
    images: ['/images/hs/logo.png'],
  },
  alternates: {
    canonical: 'https://www.xl-honsun.com',
  },
  icons: {
    shortcut: '/images/hs/logo.png',
    icon: '/images/hs/logo.png',
    apple: '/images/hs/logo.png',
  },
  verification: {
    other: {
      'baidu-site-verification': 'codeva-LHvZdrkgpc',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh"
      className={[lxgwWenKai.variable, pacifico.variable, calSans.variable].join(' ')}
      suppressHydrationWarning
    >
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
