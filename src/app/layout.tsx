import './global.css';
import { Metadata } from 'next';
import { inter, pacifico, lxgwWenKai, calSans } from '@/utils/fonts';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: {
    default: 'HONGSHENG MACHINERY',
    template: '%s | HONGSHENG MACHINERY',
  },
  description:
    '湖南协力鸿胜机械有限公司（HONGSHENG MACHINERY）专注液压系统与电控系统的设计、研发与制造，提供定制化、智能化、一站式系统解决方案。',
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
  icons: {
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh"
      className={[lxgwWenKai.variable, pacifico.variable, calSans.variable].join(' ')}
      suppressHydrationWarning
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
