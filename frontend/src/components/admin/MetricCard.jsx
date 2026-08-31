import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card } from '../common/Card';

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'brand', // 'brand', 'cyan', 'emerald', 'amber'
  onClick,
}) {
  const colorSchemes = {
    brand: {
      bgIcon: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
      glow: 'hover:border-brand-500/30 hover:shadow-glow-brand',
    },
    cyan: {
      bgIcon: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      glow: 'hover:border-cyan-500/30 hover:shadow-glow-cyan',
    },
    emerald: {
      bgIcon: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      glow: 'hover:border-emerald-500/30 hover:shadow-glow-emerald',
    },
    amber: {
      bgIcon: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      glow: 'hover:border-amber-500/30 hover:shadow-amber-500/20',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.brand;

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 ${scheme.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mt-1">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${scheme.bgIcon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-400">{subtitle}</span>
        {trend && (
          <span className="flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}
