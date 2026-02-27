'use client';

import React, { useMemo, useState } from 'react';
import Container from '@/components/site/Container';
import MotionReveal from '@/components/site/MotionReveal';
import ButtonLink from '@/components/site/ButtonLink';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import MapLibreMap from '@/components/site/MapLibreMap';

type NeedType = '业务咨询' | '技术咨询' | '售后服务' | '合作咨询' | '其他';

type FormState = {
  name: string;
  phone: string;
  email: string;
  needType: NeedType;
  message: string;
};

type SubmitStatus = 'idle' | 'submitting' | 'success';

const needTypeOptions: NeedType[] = ['业务咨询', '技术咨询', '售后服务', '合作咨询', '其他'];

function isEmailValid(email: string) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactClient() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    needType: '业务咨询',
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const emailError = useMemo(() => {
    if (form.email && !isEmailValid(form.email)) return '邮箱格式不正确';
    return '';
  }, [form.email]);

  const requiredMissing = useMemo(() => {
    const missing: string[] = [];
    if (!form.name.trim()) missing.push('姓名');
    if (!form.phone.trim()) missing.push('电话');
    if (!form.message.trim()) missing.push('留言内容');
    return missing;
  }, [form.name, form.phone, form.message]);

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
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-black/30">
                  <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">联系方式</div>
                  <div className="mt-6 grid gap-5">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B2A4A]/5 text-[#0B2A4A] dark:bg-white/10 dark:text-[#F4B400]">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          公司地址
                        </div>
                        <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                          湖南省长沙市宁乡经济开发区车站路
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B2A4A]/5 text-[#0B2A4A] dark:bg-white/10 dark:text-[#F4B400]">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          联系电话
                        </div>
                        <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                          13574880391 / 13419668797
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            周一至周五 9:00 - 18:00
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B2A4A]/5 text-[#0B2A4A] dark:bg-white/10 dark:text-[#F4B400]">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          电子邮箱
                        </div>
                        <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                          william_tung@163.com
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.08}>
                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-black/30">
                  <div className="h-[375px] w-full">
                    <MapLibreMap className="h-full w-full" />
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
                              name: '',
                              phone: '',
                              email: '',
                              needType: '业务咨询',
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
                      <div>
                        <div className="text-lg font-semibold text-[#0B0F16] dark:text-white">
                          合作咨询
                        </div>
                        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                          欢迎留下您的需求信息，我们会尽快与您联系。
                        </div>
                      </div>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          姓名
                        </span>
                        <input
                          value={form.name}
                          onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                          placeholder="请输入您的姓名"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          联系电话
                        </span>
                        <input
                          value={form.phone}
                          onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
                          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                          placeholder="请输入您的联系电话"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          电子邮箱（选填）
                        </span>
                        <input
                          value={form.email}
                          onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                          placeholder="请输入您的电子邮箱（选填）"
                        />
                        {emailError ? (
                          <span className="text-xs font-semibold text-red-600">{emailError}</span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          需求类型
                        </span>
                        <select
                          value={form.needType}
                          onChange={(e) =>
                            setForm((v) => ({ ...v, needType: e.target.value as NeedType }))
                          }
                          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                        >
                          {needTypeOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[#0B0F16] dark:text-white">
                          留言内容
                        </span>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
                          className="min-h-[140px] rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-[#F4B400] dark:border-white/10 dark:bg-black/20 dark:text-white"
                          placeholder="请详细描述您的需求…"
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
                          'inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors',
                          canSubmit
                            ? 'bg-[#0B2A4A] text-white hover:bg-[#0B2A4A]/90 dark:bg-white dark:text-[#0B2A4A] dark:hover:bg-white/90'
                            : 'cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-white/10 dark:text-zinc-500',
                        ].join(' ')}
                      >
                        {status === 'submitting' ? (
                          '发送中…'
                        ) : (
                          <>
                            发送留言 <Send className="h-4 w-4" />
                          </>
                        )}
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
