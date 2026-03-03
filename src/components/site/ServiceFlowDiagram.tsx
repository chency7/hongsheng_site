'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lightbulb, Wrench, Headphones } from 'lucide-react';

type Step = {
  title: string;
  description: string;
};

export default function ServiceFlowDiagram({ steps }: { steps: Step[] }) {
  const reducedMotion = useReducedMotion();

  const icons = [Lightbulb, Wrench, Headphones] as const;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_15%_25%,rgba(56,189,248,0.16),transparent_60%),radial-gradient(900px_520px_at_85%_75%,rgba(59,130,246,0.14),transparent_62%),radial-gradient(700px_420px_at_55%_50%,rgba(244,180,0,0.08),transparent_62%)]" />
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(56,189,248,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.10)_1px,transparent_1px)] [background-size:88px_88px]" />

      <div className="relative hidden md:block">
        <motion.svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="flowLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#60A5FA" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#F4B400" stopOpacity="0.55" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            d="M90 130 C 260 130, 240 130, 500 130 S 740 130, 910 130"
            fill="none"
            stroke="url(#flowLine)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
            strokeDasharray="10 12"
            animate={reducedMotion ? undefined : { strokeDashoffset: [0, -220] }}
            transition={reducedMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.svg>

        <div className="grid grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const Icon = icons[i] ?? Lightbulb;
            return (
              <div key={s.title} className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(260px_180px_at_30%_20%,rgba(56,189,248,0.14),transparent_65%)] opacity-80" />
                <div className="relative rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#38BDF8]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-semibold tracking-[0.22em] text-white/60">
                      STEP {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-semibold text-white">{s.title}</div>
                  <div className="mt-2 text-sm leading-7 text-zinc-200/80">{s.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative grid gap-4 md:hidden">
        {steps.map((s, i) => {
          const Icon = icons[i] ?? Lightbulb;
          return (
            <div key={s.title} className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="absolute inset-0 bg-[radial-gradient(420px_200px_at_15%_15%,rgba(56,189,248,0.14),transparent_62%)]" />
              <div className="relative flex items-start gap-4">
                <div className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#38BDF8]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-[0.22em] text-white/60">
                    STEP {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="mt-2 text-base font-semibold text-white">{s.title}</div>
                  <div className="mt-2 text-sm leading-7 text-zinc-200/80">{s.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

