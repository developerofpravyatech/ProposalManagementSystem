import React, { useState } from 'react';
import { 
  Copy, 
  MessageSquare, 
  BarChart3, 
  Download, 
  RotateCw, 
  Trash2, 
  ExternalLink,
  Search,
  Check
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';

export function ProposalTable({
  proposals = [],
  onOpenWhatsApp,
  onOpenAnalytics,
  onRenew,
  onDelete,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const { addToast } = useToast();

  const handleCopyLink = (token, id) => {
    const origin = window.location.origin;
    const url = `${origin}/p/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast('Private proposal link copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      p.proposal_number.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase()) ||
      p.company_name.toLowerCase().includes(search.toLowerCase()) ||
      p.project_title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesType = typeFilter === 'all' || p.proposal_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'sent', label: 'Sent' },
    { id: 'viewed', label: 'Viewed' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'renewal_due', label: 'Renewal Due' },
    { id: 'renewed', label: 'Renewed' },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client, company, proposal #, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 pl-10 pr-4 py-2 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  statusFilter === st.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-600 shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="profile">Company Profile</option>
            <option value="quotation">Project Quotation</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Proposal</th>
                <th className="px-6 py-4">Client & Company</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status & Views</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <p className="text-base font-bold text-slate-700">No proposals match your search or filters</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the filters or creating a new proposal</p>
                  </td>
                </tr>
              ) : (
                filteredProposals.map((p) => {
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Proposal # & Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                            {p.proposal_number}
                          </span>
                          <Badge type={p.proposal_type} />
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1 max-w-[220px] truncate" title={p.project_title}>
                          {p.project_title}
                        </p>
                      </td>

                      {/* Client / Company */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{p.company_name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{p.client_name}</span>
                          {p.email && <span>• {p.email}</span>}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.proposal_type === 'quotation' ? (
                          <div>
                            <span className="font-mono font-black text-slate-900 text-sm">
                              {p.currency_symbol || '$'}
                              {p.amount ? p.amount.toLocaleString() : '0'}
                            </span>
                            <span className="text-[10px] text-slate-500 ml-1 uppercase font-bold">{p.currency}</span>
                            {p.contract_duration && p.contract_duration !== 'N/A' && (
                              <div className="text-[11px] text-slate-400 font-medium">{p.contract_duration}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Fixed Profile
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={p.status} count={p.view_count} />
                        {p.pdf_downloaded_at && (
                          <div className="text-[10px] text-brand-700 mt-1 flex items-center gap-1 font-bold">
                            <Download className="w-3 h-3" /> PDF Downloaded
                          </div>
                        )}
                      </td>

                      {/* Last Activity */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        {p.last_opened_at ? (
                          <div>
                            <span className="text-slate-800 font-semibold">
                              {new Date(p.last_opened_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono">Opened {p.view_count || 1} times</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not opened yet</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Private Link */}
                          <button
                            onClick={() => handleCopyLink(p.token, p.id)}
                            title="Copy Private Client Link (/p/{token})"
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
                          >
                            {copiedId === p.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* WhatsApp Share */}
                          <button
                            onClick={() => onOpenWhatsApp(p)}
                            title="1-Click WhatsApp Share"
                            className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-sm"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          {/* Analytics Modal */}
                          <button
                            onClick={() => onOpenAnalytics(p)}
                            title="Forensic Analytics & View Log"
                            className="p-2 rounded-xl text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all shadow-sm"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>

                          {/* Open Viewer In New Tab */}
                          <a
                            href={`/p/${p.token}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Open Client Viewer in New Tab"
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Renew Clone */}
                          {p.proposal_type === 'quotation' && (
                            <button
                              onClick={() => onRenew(p)}
                              title="Duplicate as Renewal Proposal"
                              className="p-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all shadow-sm"
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => onDelete(p.id)}
                            title="Delete Proposal"
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
