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
  { name: '三一重工', logo: '/images/partners/三一重工.png', category: '建筑', color: '#e3001b' },
  { name: '中联重科', logo: '/images/partners/中联重科.png', category: '建筑', color: '#007632' },
  { name: '徐工集团', logo: '/images/partners/徐工集团.png', category: '建筑', color: '#ffd100' },
  { name: '北路智控', logo: '/images/partners/北路智控.png', category: '科技', color: '#003366' },
  { name: '蓝天科技', logo: '/images/partners/蓝天科技.png', category: '科技', color: '#005bac' },
  { name: 'DEO', logo: '/images/partners/deo.png', category: '科技', color: '#f37021' },
  { name: '株洲时代', logo: '/images/partners/株洲时代新材料.png', category: '汽车', color: '#c8102e' },
  { name: '黎明液压', logo: '/images/partners/黎明液压.png', category: '汽车', color: '#c41230' },
  { name: '百通新材', logo: '/images/partners/百通新材.png', category: '能源', color: '#e60012' },
  { name: '深蓝动力', logo: '/images/partners/深蓝动力.png', category: '能源', color: '#009fe3' },
  { name: '飞翼股份', logo: '/images/partners/飞翼股份.png', category: '能源', color: '#f58220' },
  { name: '中国中车', logo: '/images/partners/株洲时代新材料.png', category: '汽车', color: '#c8102e' },
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e0f2fe] to-[#ffffff] pt-32 pb-24">
      {/* Animated wave illustration background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <svg className="absolute bottom-0 w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            fill="#3b82f6" 
            fillOpacity="0.1" 
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{ 
              d: [
                "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
      
      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a365d] mb-4 relative inline-block">
            合作伙伴
            <motion.div 
              className="absolute -bottom-3 left-0 right-0 h-1 bg-[#d4a84b] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </h1>
          <p className="mt-6 text-lg text-[#64748b] max-w-2xl mx-auto">
            汇聚行业顶尖力量，共筑液压机械新生态
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

const ClientsSection = () => {
  const [activeTab, setActiveTab] = useState<Category>('全部');

  const filteredClients = activeTab === '全部' 
    ? clients 
    : clients.filter(c => c.category === activeTab);

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="bg-white rounded-3xl p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#1a365d]">主要客户</h2>
              <p className="text-[#64748b] mt-2">与行业领军企业建立长期稳定的合作关系</p>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 bg-[#f1f5f9] p-1.5 rounded-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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

          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredClients.map((client, idx) => (
                <motion.div
                  key={`${client.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white rounded-xl border border-slate-100 h-36 flex items-center justify-center p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100"
                >
                  {/* Brand Color Dot Indicator */}
                  <div 
                    className="absolute top-4 right-4 w-2 h-2 rounded-full"
                    style={{ backgroundColor: client.color }}
                  />
                  
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image 
                      src={client.logo} 
                      alt={client.name} 
                      width={140} 
                      height={70} 
                      className="object-contain max-h-20 w-auto transition-transform duration-300 group-hover:scale-105" 
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
    <section className="py-24 bg-[#f1f5f9]">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a365d]">合作品牌</h2>
              <p className="text-[#64748b] text-sm">Global Strategic Partners</p>
            </div>
          </div>
          <div className="h-[1px] flex-1 bg-slate-200 ml-8 hidden md:block" />
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/partners/hezuokehu1.png"
            alt="合作品牌"
            width={1200}
            height={600}
            className="w-full max-w-8xl h-auto object-contain"
          />
        </div>
      </Container>
    </section>
  );
};

const MethodsSection = () => {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1a365d]">合作方式</h2>
          <div className="w-12 h-1 bg-[#d4a84b] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {methods.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-t-4 ${item.borderColor}`}
            >
              <div className="p-8 flex flex-col h-full">
                <div className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 transition-colors duration-300 ${item.bgHover}`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-[#1a365d] mb-4">{item.title}</h3>
                <p className="text-[#64748b] leading-relaxed mb-8 flex-grow">
                  {item.desc}
                </p>
                
                <Link 
                  href={item.link}
                  className={`inline-flex items-center text-sm font-bold ${item.color} hover:underline decoration-2 underline-offset-4`}
                >
                  了解更多 <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#d4a84b] to-[#f59e0b] rounded-full shadow-lg hover:shadow-orange-200 hover:-translate-y-1 hover:brightness-110"
          >
            立即咨询合作
            <ArrowRight className="ml-2 w-5 h-5" />
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
