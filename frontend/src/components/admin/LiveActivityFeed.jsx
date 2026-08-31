import React from 'react';
import { Eye, Download, CheckCircle, Smartphone, Monitor, Clock } from 'lucide-react';
import { Card } from '../common/Card';

export function LiveActivityFeed({ activities = [] }) {
  const getActionDetails = (action) => {
    switch (action) {
      case 'Quotation Accepted':
        return {
          icon: CheckCircle,
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          label: 'Accepted quotation and signed agreement',
        };
      case 'PDF Downloaded':
        return {
          icon: Download,
          color: 'text-brand-700 bg-brand-50 border-brand-200',
          label: 'Downloaded official PDF package',
        };
      case 'Page Opened':
      default:
        return {
          icon: Eye,
          color: 'text-slate-800 bg-slate-100 border-slate-200',
          label: 'Opened private proposal link',
        };
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diff = (new Date() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Card className="space-y-4 bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Live Forensic Activity Feed
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Silent Real-time Tracker</span>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No live viewing activity recorded yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {activities.map((act) => {
            const details = getActionDetails(act.action);
            const Icon = details.icon;
            const DeviceIcon = act.device_type === 'Mobile' ? Smartphone : Monitor;

            return (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${details.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{act.company_name}</span>
                      <span className="text-slate-500 font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {act.proposal_no}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 font-medium">{details.label}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <DeviceIcon className="w-3 h-3 text-slate-500" />
                        {act.device_type || 'Desktop'}
                      </span>
                      {act.city && <span>• {act.city}</span>}
                    </div>
                  </div>
                </div>

                <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(act.viewed_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
