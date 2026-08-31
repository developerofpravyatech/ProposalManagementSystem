import React from 'react';
import { Send, Eye, CheckCircle, Clock, RotateCw, FileText, Sparkles } from 'lucide-react';

export function Badge({ status, type, count, className = '' }) {
  if (type) {
    if (type === 'profile') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ${className}`}>
          <FileText className="w-3 h-3" />
          Company Profile
        </span>
      );
    }
    if (type === 'quotation') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/30 ${className}`}>
          <Sparkles className="w-3 h-3" />
          Project Quotation
        </span>
      );
    }
  }

  const configs = {
    sent: {
      label: 'Sent',
      icon: Send,
      classes: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    },
    viewed: {
      label: count ? `Viewed (${count}x)` : 'Viewed',
      icon: Eye,
      classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    },
    accepted: {
      label: 'Accepted',
      icon: CheckCircle,
      classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-950',
    },
    renewal_due: {
      label: 'Renewal Due',
      icon: Clock,
      classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse-subtle',
    },
    renewed: {
      label: 'Renewed',
      icon: RotateCw,
      classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    },
  };

  const current = configs[status] || configs.sent;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${current.classes} ${className}`}>
      <Icon className="w-3 h-3" />
      {current.label}
    </span>
  );
}
