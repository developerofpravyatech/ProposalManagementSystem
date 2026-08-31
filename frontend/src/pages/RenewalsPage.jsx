import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Search,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';

export function RenewalsPage() {
  const { addToast } = useToast();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Renewal Modal State
  const [activeRenewalProposal, setActiveRenewalProposal] = useState(null);
  const [newDuration, setNewDuration] = useState('12 Months');
  const [newRenewalDate, setNewRenewalDate] = useState('');
  const [isRenewing, setIsRenewing] = useState(false);

  const fetchRenewals = async () => {
    setLoading(true);
    try {
      const data = await proposalApi.getProposals({ type: 'quotation' });
      setProposals(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load renewal pipeline', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  const openRenewalModal = (proposal) => {
    setActiveRenewalProposal(proposal);
    setNewDuration(proposal.contract_duration || '12 Months');

    const baseDate = proposal.renewal_date ? new Date(proposal.renewal_date) : new Date();
    baseDate.setFullYear(baseDate.getFullYear() + 1);
    setNewRenewalDate(baseDate.toISOString().split('T')[0]);
  };

  const handleConfirmRenewal = async (e) => {
    e.preventDefault();
    if (!activeRenewalProposal) return;

    setIsRenewing(true);
    try {
      const cloned = await proposalApi.duplicateForRenewal(activeRenewalProposal.id, {
        contract_duration: newDuration,
        renewal_date: newRenewalDate,
        project_title: `${activeRenewalProposal.project_title} (Renewal)`
      });

      addToast(`Renewal proposal #${cloned.proposal_number} generated!`, 'success');
      setActiveRenewalProposal(null);
      fetchRenewals();
    } catch (err) {
      addToast(err.message || 'Failed to clone renewal proposal', 'error');
    } finally {
      setIsRenewing(false);
    }
  };

  const now = new Date();
  const enhancedList = proposals
    .filter((p) => p.renewal_date)
    .map((p) => {
      const rDate = new Date(p.renewal_date);
      const diffTime = rDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...p, daysRemaining: diffDays };
    })
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.proposal_number.toLowerCase().includes(q) ||
        p.company_name.toLowerCase().includes(q) ||
        p.client_name.toLowerCase().includes(q) ||
        p.project_title.toLowerCase().includes(q)
      );
    });

  const dueSoon = enhancedList.filter((p) => p.daysRemaining <= 30 && p.daysRemaining >= 0 && p.status !== 'renewed');
  const overdue = enhancedList.filter((p) => p.daysRemaining < 0 && p.status !== 'renewed');
  const activeContracts = enhancedList.filter((p) => p.daysRemaining > 30 || p.status === 'renewed');

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Contract Renewal Management Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Monitor approaching contract anniversaries and generate renewal proposals with 1 click.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search renewals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 shadow-sm"
          />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-amber-50/50 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" /> Expiring in &le; 30 Days
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">
            {dueSoon.length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Requires follow-up proposal</p>
        </Card>

        <Card className="border-rose-200 bg-rose-50/50 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Overdue Contracts
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">
            {overdue.length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Past renewal anniversary date</p>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Healthy / Renewed
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">
            {activeContracts.length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Active engagement contracts</p>
        </Card>
      </div>

      {/* Action Pipeline Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Contract Pipeline ({enhancedList.length} Active Contracts)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Client / Proposal</th>
                <th className="px-6 py-4">Contract Value</th>
                <th className="px-6 py-4">Renewal Date</th>
                <th className="px-6 py-4">Urgency Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enhancedList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No quotations with renewal dates found.
                  </td>
                </tr>
              ) : (
                enhancedList.map((p) => {
                  let urgencyBadge = (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                      In {p.daysRemaining} days
                    </span>
                  );

                  if (p.status === 'renewed') {
                    urgencyBadge = (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-bold">
                        Renewed
                      </span>
                    );
                  } else if (p.daysRemaining < 0) {
                    urgencyBadge = (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-black animate-pulse">
                        Overdue by {Math.abs(p.daysRemaining)} days
                      </span>
                    );
                  } else if (p.daysRemaining <= 30) {
                    urgencyBadge = (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300 font-bold animate-pulse-subtle">
                        Due in {p.daysRemaining} days
                      </span>
                    );
                  }

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{p.company_name}</div>
                        <p className="text-xs text-slate-500 font-medium">{p.project_title}</p>
                        <span className="font-mono text-[11px] text-brand-600 font-bold mt-0.5 block">{p.proposal_number}</span>
                      </td>

                      <td className="px-6 py-4 font-mono font-black text-slate-900 whitespace-nowrap">
                        {p.currency_symbol || '$'}{p.amount ? p.amount.toLocaleString() : '0'} {p.currency}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-800 font-semibold">
                        {p.renewal_date}
                        <span className="text-slate-400 block text-[10px]">{p.contract_duration}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {urgencyBadge}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          size="sm"
                          variant="primary"
                          icon={RotateCw}
                          onClick={() => openRenewalModal(p)}
                        >
                          1-Click Renew
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewal Confirmation Modal */}
      <Modal
        isOpen={!!activeRenewalProposal}
        onClose={() => setActiveRenewalProposal(null)}
        title="Generate Renewal Proposal"
        subtitle={`Duplicate quotation for ${activeRenewalProposal?.company_name} with updated contract terms`}
      >
        <form onSubmit={handleConfirmRenewal} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200 text-xs text-slate-700 space-y-1 font-medium">
            <p>
              This will create a new proposal record with a fresh private link (`/p/{'{token}'}`) while archiving the previous contract history.
            </p>
          </div>

          <Select
            label="Renewal Contract Duration"
            options={[
              { value: '6 Months', label: '6 Months (Semi-Annual)' },
              { value: '12 Months', label: '12 Months (1 Year)' },
              { value: '24 Months', label: '24 Months (2 Years)' },
            ]}
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
          />

          <Input
            label="New Renewal Expiry Date"
            type="date"
            icon={Calendar}
            value={newRenewalDate}
            onChange={(e) => setNewRenewalDate(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveRenewalProposal(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Sparkles}
              isLoading={isRenewing}
            >
              Generate Renewal Proposal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
