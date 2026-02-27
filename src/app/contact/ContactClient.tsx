'use client';

import React, { useMemo, useState } from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import SectionHeading from '@/components/site/SectionHeading';
import ButtonLink from '@/components/site/ButtonLink';
import Image from 'next/image';

type Industry =
  | '工程机械'
  | '船舶海洋'
  | '风力发电'
  | '轨道交通'
  | '航空航天/其他'
  | '工业制造'
  | '其他';

type FormState = {
  company: string;
  name: string;
  phone: string;
  email: string;
  industry: Industry;
  message: string;
};

type SubmitStatus = 'idle' | 'submitting' | 'success';

const industryOptions: Industry[] = [
  '工程机械',
  '船舶海洋',
  '风力发电',
  '轨道交通',
  '航空航天/其他',
  '工业制造',
  '其他',
];

function isEmailValid(email: string) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactClient() {
  const [form, setForm] = useState<FormState>({
    company: '',
    name: '',
    phone: '',
    email: '',
    industry: '工程机械',
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const emailError = useMemo(() => {
    if (form.email && !isEmailValid(form.email)) return '邮箱格式不正确';
    return '';
  }, [form.email]);

  const requiredMissing = useMemo(() => {
    const missing: string[] = [];
    if (!form.company.trim()) missing.push('公司/单位');
    if (!form.name.trim()) missing.push('姓名');
    if (!form.phone.trim()) missing.push('电话');
    if (!form.message.trim()) missing.push('需求描述');
    return missing;
  }, [form.company, form.name, form.phone, form.message]);

  const canSubmit = requiredMissing.length === 0 && !emailError && status !== 'submitting';

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('submitting');

    await new Promise((r) => setTimeout(r, 600));

    setStatus('success');
  };

  return (
    <div>
      <section className="border-b border-zinc-200/70 bg-zinc-50 py-12 dark:border-white/10 dark:bg-white/5 sm:py-16">
        <Container>
          <MotionReveal>
            <div className="text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">
              CONTACT
            </div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B0F16] dark:text-white sm:text-4xl">
              联系我们
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.09}>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              湖南协力鸿胜机械有限公司 · Hunan Xieli Hongsheng Machinery Co.,Ltd.
            </div>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              提交工况与需求，我们将在方案评审中对齐边界、指标与交付范围，并提供选型建议与系统方案。
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/10 dark:bg-black/30">
              <div className="relative aspect-[16/8]">
                <Image
                  src="/images/hs/service.svg"
                  alt="联系页面主视觉占位图"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/service" variant="secondary">
                查看服务支持
              </ButtonLink>
              <ButtonLink href="/cases" variant="secondary">
                查看工程案例
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <MotionReveal>
                <SectionHeading
                  eyebrow="REQUEST"
                  title="快速提交需求"
                  description="字段尽量精简，便于快速进入方案评审；更详细参数可在沟通中补充。"
                />
              </MotionReveal>

              <MotionReveal delay={0.1}>
                <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-7 text-sm leading-7 text-zinc-700 dark:border-white/10 dark:bg-black/30 dark:text-zinc-300">
                  <div className="font-semibold text-[#0B0F16] dark:text-white">售后承诺</div>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/5">
                      24小时专业售后响应
                    </div>
                    <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/5">
                      预防性维护与系统升级支持
                    </div>
                    <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/5">
                      全生命周期管理方案
                    </div>
                  </div>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.16}>
                <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                    联系信息（占位）
                  </div>
                  <div className="mt-4 grid gap-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/5">
                      地址：湖南省长沙市宁乡经济开发区车站路
                      <span className="block text-xs text-zinc-500 dark:text-zinc-500">
                        Add: Station road, Economy Development Zone, Ningxiang, Changsha, Hunan,
                        China
                      </span>
                    </div>
                    <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/5">
                      销售热线：13574880391 / 13419668797
                      <span className="block text-xs text-zinc-500 dark:text-zinc-500">
                        Sale Hot Line: +86-13574880391 / +86-13419668797
                      </span>
                    </div>
                    <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/5">
                      邮编：410600
                      <span className="block text-xs text-zinc-500 dark:text-zinc-500">
                        Post Code: 410600
                      </span>
                    </div>
                    <div className="rounded-lg bg-zinc-50 px-4 py-3 dark:bg-white/5">
                      电子邮箱：william_tung@163.com / 13419668797@163.com
                      <span className="block text-xs text-zinc-500 dark:text-zinc-500">
                        E-mail: william_tung@163.com / 13419668797@163.com
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200/70 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src="/images/hs/factory.svg"
                        alt="地图与位置占位图"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </MotionReveal>
            </div>

            <div className="lg:col-span-7">
              <MotionReveal>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 dark:border-white/10 dark:bg-black/30">
                  {status === 'success' ? (
                    <div>
                      <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">
                        提交成功
                      </div>
                      <div className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                        已收到需求信息。下一步建议对齐工况与目标指标，我们将据此组织方案评审。
                      </div>
                      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-lg bg-[#0B2A4A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B2A4A]/90 dark:bg-white dark:text-[#0B2A4A] dark:hover:bg-white/90"
                          onClick={() => {
                            setStatus('idle');
                            setForm({
                              company: '',
                              name: '',
                              phone: '',
                              email: '',
                              industry: '工程机械',
                              message: '',
                            });
                          }}
                        >
                          继续提交
                        </button>
                        <ButtonLink href="/solutions" variant="secondary">
                          查看定制方案
                        </ButtonLink>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                            公司/单位
                          </span>
                          <input
                            value={form.company}
                            onChange={(e) => setForm((v) => ({ ...v, company: e.target.value }))}
                            className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                            placeholder="请输入公司名称"
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                            姓名
                          </span>
                          <input
                            value={form.name}
                            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                            className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                            placeholder="请输入联系人姓名"
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                            电话
                          </span>
                          <input
                            value={form.phone}
                            onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
                            className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                            placeholder="请输入联系电话"
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                            邮箱（可选）
                          </span>
                          <input
                            value={form.email}
                            onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                            className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                            placeholder="name@company.com"
                          />
                          {emailError ? (
                            <span className="text-xs font-semibold text-red-600">{emailError}</span>
                          ) : null}
                        </label>
                      </div>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          行业
                        </span>
                        <select
                          value={form.industry}
                          onChange={(e) =>
                            setForm((v) => ({ ...v, industry: e.target.value as Industry }))
                          }
                          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                        >
                          {industryOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          需求描述
                        </span>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
                          className="min-h-[140px] rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                          placeholder="请描述应用场景、工况、目标指标、接口与安装约束等"
                        />
                      </label>

                      {requiredMissing.length > 0 ? (
                        <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                          <div className="font-semibold text-[#0B0F16] dark:text-white">
                            请补充必填项
                          </div>
                          <div className="mt-2">{requiredMissing.join('、')}</div>
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className={[
                          'inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors',
                          canSubmit
                            ? 'bg-[#F4B400] text-[#0B0F16] hover:bg-[#F4B400]/90'
                            : 'cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-white/10 dark:text-zinc-500',
                        ].join(' ')}
                      >
                        {status === 'submitting' ? '提交中…' : '提交需求'}
                      </button>
                    </form>
                  )}
                </div>
              </MotionReveal>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
