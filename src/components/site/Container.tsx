import React from 'react';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={['mx-auto w-full max-w-[1600px] px-6 md:px-8', className].filter(Boolean).join(' ')}>{children}</div>;
}

