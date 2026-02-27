import React from 'react';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={['mx-auto w-full max-w-6xl px-6', className].filter(Boolean).join(' ')}>{children}</div>;
}

