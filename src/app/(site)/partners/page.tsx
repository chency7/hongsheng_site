'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Phone, Handshake, Store, ArrowRight, Activity, Zap, Shield, Globe } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/site/Container';

// --- Types & Data ---

type Category = '全部' | '建筑' | '科技' | '汽车' | '能源';

type ClientItem = {
  name: string;
  logo: string;
  category: Category;
  color: string; // Brand dot color
};

const categories: Category[] = ['全部', '建筑', '科技', '汽车', '能源'];

const clients: ClientItem[] = [
  { name: '三一重工', logo: '/images/partners/三一重工.webp', category: '建筑', color: '#e3001b' },
  { name: '中联重科', logo: '/images/partners/中联重科.webp', category: '建筑', color: '#007632' },
  { name: '徐工集团', logo: '/images/partners/徐工集团.webp', category: '建筑', color: '#ffd100' },
  { name: '北路智控', logo: '/images/partners/北路智控.webp', category: '科技', color: '#003366' },
  { name: '蓝天科技', logo: '/images/partners/蓝天科技.webp', category: '科技', color: '#005bac' },
  { name: 'DEO', logo: '/images/partners/deo.webp', category: '科技', color: '#f37021' },
  {
    name: '株洲时代',
    logo: '/images/partners/株洲时代新材料.webp',
    category: '汽车',
    color: '#c8102e',
  },
  { name: '黎明液压', logo: '/images/partners/黎明液压.webp', category: '汽车', color: '#c41230' },
  { name: '百通新材', logo: '/images/partners/百通新材.webp', category: '能源', color: '#e60012' },
  { name: '深蓝动力', logo: '/images/partners/深蓝动力.webp', category: '能源', color: '#009fe3' },
  { name: '飞翼股份', logo: '/images/partners/飞翼股份.webp', category: '能源', color: '#f58220' },
  {
    name: '中国中车',
    logo: '/images/partners/株洲时代新材料.webp',
    category: '汽车',
    color: '#c8102e',
  },
];

const methods = [
  {
    title: '联系我们',
    desc: '专业团队快速响应您的业务咨询与技术需求。',
    icon: Phone,
    color: 'text-blue-500',
    borderColor: 'border-blue-500',
    link: '/contact',
    bgHover: 'group-hover:bg-blue-50',
  },
  {
    title: '商务合作',
    desc: '探讨供应链整合、技术研发与市场拓展合作。',
    icon: Handshake,
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500',
    link: '/contact',
    bgHover: 'group-hover:bg-emerald-50',
  },
  {
    title: '技术支持',
    desc: '依托资深工程师团队，提供系统设计与故障诊断服务。',
    icon: Shield,
    color: 'text-amber-500',
    borderColor: 'border-amber-500',
    link: '/contact',
    bgHover: 'group-hover:bg-amber-50',
  },
];

// --- Components ---

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e0f2fe] to-[#ffffff] pb-24 pt-32">
      {/* Animated wave illustration background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <svg
          className="absolute bottom-0 h-auto w-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            fill="#3b82f6"
            fillOpacity="0.1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                'M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
                'M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
                'M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="relative mb-4 inline-block text-4xl font-bold text-[#1a365d] md:text-5xl">
            合作伙伴
            <motion.div
              className="absolute -bottom-3 left-0 right-0 h-1 rounded-full bg-[#d4a84b]"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#64748b]">
            汇聚行业顶尖力量，共筑液压机械新生态
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

const ClientsSection = () => {
  const [activeTab, setActiveTab] = useState<Category>('全部');

  const filteredClients =
    activeTab === '全部' ? clients : clients.filter((c) => c.category === activeTab);

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="rounded-3xl bg-white p-4 md:p-8">
          <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#1a365d]">主要客户</h2>
              <p className="mt-2 text-[#64748b]">与行业领军企业建立长期稳定的合作关系</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 rounded-full bg-[#f1f5f9] p-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    activeTab === cat
                      ? 'bg-[#3b82f6] text-white shadow-md'
                      : 'text-[#64748b] hover:bg-white hover:text-[#1a365d]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client, idx) => (
                <motion.div
                  key={`${client.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  {/* Brand Color Dot Indicator */}
                  <div
                    className="absolute right-4 top-4 h-2 w-2 rounded-full"
                    style={{ backgroundColor: client.color }}
                  />

                  <div className="relative flex h-full w-full items-center justify-center">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={140}
                      height={70}
                      className="max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

const BrandsSection = () => {
  return (
    <section className="bg-[#f1f5f9] py-24">
      <Container>
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a365d]">合作品牌</h2>
              <p className="text-sm text-[#64748b]">Global Strategic Partners</p>
            </div>
          </div>
          <div className="ml-8 hidden h-[1px] flex-1 bg-slate-200 md:block" />
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/partners/hezuokehu1.webp"
            alt="合作品牌"
            width={1200}
            height={600}
            className="max-w-8xl h-auto w-full object-contain"
          />
        </div>
      </Container>
    </section>
  );
};

const MethodsSection = () => {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#1a365d]">合作方式</h2>
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[#d4a84b]" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {methods.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`group overflow-hidden rounded-2xl border-t-4 bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${item.borderColor}`}
            >
              <div className="flex h-full flex-col p-8">
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 transition-colors duration-300 ${item.bgHover}`}
                >
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>

                <h3 className="mb-4 text-xl font-bold text-[#1a365d]">{item.title}</h3>
                <p className="mb-8 flex-grow leading-relaxed text-[#64748b]">{item.desc}</p>

                <Link
                  href={item.link}
                  className={`inline-flex items-center text-sm font-bold ${item.color} decoration-2 underline-offset-4 hover:underline`}
                >
                  了解更多 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#d4a84b] to-[#f59e0b] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-200 hover:brightness-110"
          >
            立即咨询合作
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a365d]">
      <HeroSection />
      <ClientsSection />
      <BrandsSection />
      <MethodsSection />
    </div>
  );
}
