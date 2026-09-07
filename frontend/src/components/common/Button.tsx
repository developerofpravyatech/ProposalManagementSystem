import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost', 'whatsapp'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/25 hover:shadow-brand-600/40 focus:ring-brand-600 border border-brand-500/40',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 focus:ring-slate-900 shadow-sm',
    outline: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 focus:ring-brand-600 shadow-sm',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-600 shadow-md shadow-rose-600/20',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    whatsapp: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 border border-emerald-500/30 focus:ring-emerald-500',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
    </button>
  );
}

