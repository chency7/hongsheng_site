import React from 'react';
import ContactClient from './ContactClient';

export const metadata = {
  title: '联系我们 - 湖南协力鸿胜机械有限公司',
  description:
    '联系湖南协力鸿胜机械有限公司获取液压系统解决方案。地址:湖南省长沙市，提供液压泵站、试验检测设备定制服务，24小时技术支持热线。',
  keywords: [
    '联系我们',
    '液压系统咨询',
    '工程机械液压',
    '长沙液压公司',
    '湖南液压系统',
    '液压系统定制',
    '技术咨询',
    '商务合作',
    '联系方式',
    '客户服务',
  ],
  openGraph: {
    title: '联系我们 - 湖南协力鸿胜机械有限公司',
    description: '获取液压系统解决方案，24小时技术支持。',
    url: 'https://www.xl-honsun.com/contact',
  },
  alternates: {
    canonical: 'https://www.xl-honsun.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
