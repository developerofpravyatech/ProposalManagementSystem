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
      subtitle={`${proposal.proposal_number} — ${proposal.company_name}`}
    >
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Opens</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {proposal.view_count || 0}
            </div>
            <span className="text-[11px] text-brand-400 flex items-center gap-1 mt-0.5">
              <Eye className="w-3 h-3" /> Tracked views
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Status</span>
            <div className="mt-2">
              <Badge status={proposal.status} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">PDF Download</span>
            <div className="text-sm font-bold text-white mt-2">
              {proposal.pdf_downloaded_at ? (
                <span className="text-cyan-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Downloaded
                </span>
              ) : (
                <span className="text-slate-400">Not downloaded</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">First Opened</span>
            <div className="text-xs font-medium text-slate-200 mt-2 truncate">
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Event Audit Trail ({views.length} events logged)
            </h4>
            <button
              onClick={fetchAnalytics}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {views.length === 0 ? (
            <div className="py-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
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
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                        {v.action === 'PDF Downloaded' ? (
                          <Download className="w-4 h-4 text-cyan-400" />
                        ) : v.action === 'Quotation Accepted' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-brand-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{v.action}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
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
                      <span className="font-mono text-slate-300 block">
                        {new Date(v.viewed_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] text-slate-400">
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
