import React from 'react';
import { Send, Eye, CheckCircle, Clock, RotateCw, FileText, Sparkles } from 'lucide-react';

export function Badge({ status, type, count, className = '' }) {
  if (type) {
    if (type === 'profile_only') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white border border-slate-800 shadow-sm ${className}`}>
          <FileText className="w-3 h-3 text-brand-400" />
          Company Profile
        </span>
      );
    }
    if (type === 'quotation_proposal') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 shadow-sm ${className}`}>
          <Sparkles className="w-3 h-3 text-brand-600" />
          Project Quotation
        </span>
      );
    }
  }

  const configs = {
    sent: {
      label: 'Sent',
      icon: Send,
      classes: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    viewed: {
      label: count ? `Viewed (${count}x)` : 'Viewed',
      icon: Eye,
      classes: 'bg-brand-50 text-brand-700 border-brand-200 font-semibold',
    },
    accepted: {
      label: 'Accepted',
      icon: CheckCircle,
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold shadow-sm',
    },
    renewal_due: {
      label: 'Renewal Due',
      icon: Clock,
      classes: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold animate-pulse-subtle',
    },
    renewed: {
      label: 'Renewed',
      icon: RotateCw,
      classes: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
    },
  };

  const current = configs[status] || configs.sent;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${current.classes} ${className}`}>
      <Icon className="w-3 h-3" />
      {current.label}
    </span>
  );
}
