import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  glass = true,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  [key: string]: any;
}) {
  const baseClasses = glass ? 'glass-card' : 'bg-white border border-slate-200 shadow-sm';
  const hoverClasses = hover ? 'glass-card-hover cursor-pointer' : '';

  return (
    <div
      className={`rounded-2xl p-6 ${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

