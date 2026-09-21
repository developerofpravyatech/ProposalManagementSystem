import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Download, 
  CheckCircle, 
  Monitor, 
  Smartphone, 
  Clock, 
  MapPin, 
  Globe, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { proposalApi } from '../../api/proposalApi';

export function AnalyticsModal({ isOpen, onClose, proposal }) {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    if (!proposal) return;
    setLoading(true);
    try {
      const data = await proposalApi.getProposalAnalytics(proposal.id);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && proposal) {
      fetchAnalytics();
    }
  }, [isOpen, proposal]);

  if (!proposal) return null;

  const views = analytics?.views || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title={`Engagement Analytics & Forensic Audit Trail`}
      subtitle={`${proposal.proposal_no} — ${proposal.company_name}`}
    >
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Opens</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {proposal.view_count || 0}
            </div>
            <span className="text-[11px] text-brand-600 font-bold flex items-center gap-1 mt-0.5">
              <Eye className="w-3 h-3" /> Tracked views
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Current Status</span>
            <div className="mt-2">
              <Badge status={proposal.status} type={proposal.type} count={proposal.view_count} />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">PDF Download</span>
            <div className="text-sm font-bold text-slate-900 mt-2">
              {proposal.pdf_downloaded_at ? (
                <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                  <CheckCircle className="w-4 h-4" /> Downloaded
                </span>
              ) : (
                <span className="text-slate-400 font-medium">Not downloaded</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">First Opened</span>
            <div className="text-xs font-bold text-slate-800 mt-2 truncate">
              {proposal.first_opened_at
                ? new Date(proposal.first_opened_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Never'}
            </div>
          </div>
        </div>

        {/* Forensic Viewing Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Event Audit Trail ({views.length} events logged)
            </h4>
            <button
              onClick={fetchAnalytics}
              className="text-xs text-brand-600 font-bold hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {views.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Client has not opened the private proposal link yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {views.map((v) => {
                const isMobile = v.device_type === 'Mobile';
                const DeviceIcon = isMobile ? Smartphone : Monitor;

                return (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-sm shrink-0">
                        {v.action === 'PDF Downloaded' ? (
                          <Download className="w-4 h-4 text-brand-600" />
                        ) : v.action === 'Quotation Accepted' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-700" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{v.action}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-medium">
                          <span className="flex items-center gap-1">
                            <DeviceIcon className="w-3 h-3 text-slate-400" />
                            {v.browser || 'Browser'} on {v.device_type || 'Desktop'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Globe className="w-3 h-3 text-slate-400" />
                            {v.ip_address}
                          </span>
                          {v.city && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {v.city}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:text-right shrink-0">
                      <span className="font-mono text-slate-800 font-bold block">
                        {new Date(v.viewed_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(v.viewed_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

