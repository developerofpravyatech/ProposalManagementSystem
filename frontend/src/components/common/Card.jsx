import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  glass = true,
  ...props
}) {
  const baseClasses = glass ? 'glass-card' : 'bg-slate-900 border border-slate-800';
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
