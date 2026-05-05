import React from 'react';
import CasesClient from './CasesClient';

export const metadata = {
  title: '工程案例 - 液压系统项目案例',
  description:
    '湖南协力鸿胜液压系统工程案例展示：船舶海洋打桩船、挖泥船液压系统，工程机械起重机液压站，风电联轴器测试系统，轨道交通铰接器试验台等成功项目。',
  keywords: [
    '液压系统案例',
    '工程机械案例',
    '船舶液压项目',
    '风电液压测试',
    '轨道交通液压',
    '打桩船液压',
    '起重机液压站',
    '液压项目',
    '成功案例',
    '工程案例',
  ],
  openGraph: {
    title: '工程案例 - 液压系统项目案例 | 湖南协力鸿胜机械',
    description: '船舶海洋、工程机械、风电、轨道交通等行业液压系统成功案例。',
    url: 'https://www.xl-honsun.com/cases',
  },
  alternates: {
    canonical: 'https://www.xl-honsun.com/cases',
  },
};

export default function CasesPage() {
  return <CasesClient />;
}
