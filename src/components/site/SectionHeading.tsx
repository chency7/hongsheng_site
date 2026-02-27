import React from 'react';

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <div className="mb-2 text-xs font-semibold tracking-[0.18em] text-[#0B2A4A]/70 dark:text-white/60">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-display text-2xl font-semibold tracking-tight text-[#0B0F16] dark:text-white sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{description}</p>
      ) : null}
    </div>
  );
}

