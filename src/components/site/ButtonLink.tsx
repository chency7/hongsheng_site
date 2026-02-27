import Link from 'next/link';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent';

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0B2A4A] text-white hover:bg-[#0B2A4A]/90 dark:bg-white dark:text-[#0B2A4A] dark:hover:bg-white/90',
  secondary:
    'border border-[#0B2A4A]/30 bg-transparent text-[#0B2A4A] hover:bg-[#0B2A4A]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/5',
  accent: 'bg-[#F4B400] text-[#0B0F16] hover:bg-[#F4B400]/90',
};

export default function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black',
        variantClassName[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Link>
  );
}

