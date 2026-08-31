import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card } from '../common/Card';

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'brand', // 'brand', 'black', 'emerald', 'amber'
  onClick,
}) {
  const colorSchemes = {
    brand: {
      bgIcon: 'bg-brand-50 text-brand-600 border-brand-200',
      glow: 'hover:border-brand-300 hover:shadow-glow-red',
    },
    black: {
      bgIcon: 'bg-slate-100 text-slate-900 border-slate-300',
      glow: 'hover:border-slate-400 hover:shadow-glow-black',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      glow: 'hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-200',
      glow: 'hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.brand;

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 bg-white border border-slate-200 shadow-sm ${scheme.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight mt-1">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${scheme.bgIcon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
        <span className="text-slate-500 font-medium">{subtitle}</span>
        {trend && (
          <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}
