import React from 'react';
import { LucideIcon } from 'lucide-react';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
  forceLight = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  forceLight?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <div
          className={`mb-2 text-xs font-semibold tracking-[0.18em] ${
            forceLight
              ? 'text-[#0B2A4A]/70 dark:text-[#0B2A4A]/70'
              : 'text-[#0B2A4A]/70 dark:text-white/60'
          }`}
        >
          {eyebrow}
        </div>
      ) : null}
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-8 w-8 text-[#F4B400]" />}
        <h2
          className={`font-display text-2xl font-semibold tracking-tight sm:text-3xl ${
            forceLight ? 'text-[#0B0F16] dark:text-[#0B0F16]' : 'text-[#0B0F16] dark:text-white'
          }`}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className={`mt-3 text-sm leading-7 ${
            forceLight ? 'text-zinc-700 dark:text-zinc-700' : 'text-zinc-700 dark:text-zinc-300'
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
