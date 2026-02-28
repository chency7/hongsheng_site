'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Slide = {
  src: string;
  name: string;
};

type CaptionMode = 'always' | 'hover' | 'none';

type Aspect = '16/9' | '16/10' | '16/11' | '21/9';

type EquipmentCarouselProps = {
  slides: Slide[];
  className?: string;
  autoplayMs?: number;
  overlay?: React.ReactNode;
  captionMode?: CaptionMode;
  aspect?: Aspect;
  imageSizes?: string;
  frameClassName?: string;
  controlsClassName?: string;
};

export default function EquipmentCarousel({
  slides,
  className,
  autoplayMs = 4500,
  overlay,
  captionMode = 'always',
  aspect = '16/11',
  imageSizes = '(min-width: 1024px) 55vw, 100vw',
  frameClassName,
  controlsClassName,
}: EquipmentCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);

  const safeSlides = useMemo<Slide[]>(() => slides.filter((s) => s.src && s.name), [slides]);
  const count = safeSlides.length;
  const aspectClassName = useMemo<string>(() => {
    switch (aspect) {
      case '16/9':
        return 'aspect-[16/9]';
      case '16/10':
        return 'aspect-[16/10]';
      case '21/9':
        return 'aspect-[21/9]';
      case '16/11':
      default:
        return 'aspect-[16/11]';
    }
  }, [aspect]);

  useEffect(() => {
    if (count <= 1) return;
    if (paused) return;
    if (reducedMotion) return;

    const t = window.setInterval(() => {
      setActiveIndex((v) => (v + 1) % count);
    }, autoplayMs);

    return () => window.clearInterval(t);
  }, [autoplayMs, count, paused, reducedMotion]);

  useEffect(() => {
    if (count === 0) return;
    if (activeIndex >= count) setActiveIndex(0);
  }, [activeIndex, count]);

  const go = (nextIndex: number) => {
    if (count === 0) return;
    const normalized = ((nextIndex % count) + count) % count;
    setActiveIndex(normalized);
  };

  const active = safeSlides[activeIndex];

  if (!active) return null;

  return (
    <div
      className={['group relative', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className={['relative w-full overflow-hidden bg-zinc-50 dark:bg-black/30', frameClassName]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(40%_40%_at_30%_10%,rgba(244,180,0,0.18),transparent_60%)]" />

        <div className={['relative w-full', aspectClassName].join(' ')}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.src}
              className="absolute inset-0"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Image
                src={active.src}
                alt={active.name}
                fill
                className="object-cover"
                priority
                sizes={imageSizes}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90" />
            </motion.div>
          </AnimatePresence>

          {/* Overlay Content Layer - Always on top of image but below controls */}
          {overlay ? (
            <div className="pointer-events-none absolute inset-0 z-20">{overlay}</div>
          ) : null}

          {/* Caption Layer */}
          {captionMode !== 'none' ? (
            <div
              className={[
                'pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 transition-opacity',
                captionMode === 'hover' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100',
              ].join(' ')}
            >
              <div className="inline-flex max-w-full items-center rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {active.name}
              </div>
            </div>
          ) : null}
        </div>

        {/* Navigation Arrows - High Z-Index */}
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="上一张"
              className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-[#F4B400]/60"
              onClick={() => go(activeIndex - 1)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="下一张"
              className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-[#F4B400]/60"
              onClick={() => go(activeIndex + 1)}
            >
              →
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          className={['mt-4 flex items-center justify-between gap-4', controlsClassName]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="flex flex-wrap gap-2">
            {safeSlides.map((s, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => go(idx)}
                  className={[
                    'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                    isActive
                      ? 'border-[#F4B400]/40 bg-[#F4B400]/10 text-[#0B0F16] dark:text-white'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-black/20 dark:text-zinc-200 dark:hover:bg-white/5',
                  ].join(' ')}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {activeIndex + 1} / {count}
          </div>
        </div>
      ) : (
        <div
          className={[
            'mt-4 text-sm font-semibold text-zinc-700 dark:text-zinc-200',
            controlsClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {active.name}
        </div>
      )}
    </div>
  );
}
