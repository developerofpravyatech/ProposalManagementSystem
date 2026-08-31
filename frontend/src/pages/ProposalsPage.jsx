import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { ProposalTable } from '../components/admin/ProposalTable';
import { WhatsAppModal } from '../components/admin/WhatsAppModal';
import { AnalyticsModal } from '../components/admin/AnalyticsModal';
import { Button } from '../components/common/Button';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';

export function ProposalsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeWhatsAppProposal, setActiveWhatsAppProposal] = useState(null);
  const [activeAnalyticsProposal, setActiveAnalyticsProposal] = useState(null);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await proposalApi.getProposals();
      setProposals(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load proposals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleRenew = async (proposal) => {
    try {
      const cloned = await proposalApi.duplicateForRenewal(proposal.id);
      addToast(`Renewed proposal created: ${cloned.proposal_number}`, 'success');
      fetchProposals();
    } catch (err) {
      addToast(err.message || 'Failed to duplicate renewal', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    try {
      await proposalApi.deleteProposal(id);
      addToast('Proposal deleted', 'success');
      fetchProposals();
    } catch (err) {
      addToast(err.message || 'Failed to delete proposal', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">
            Proposal Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage company profiles and custom quotations with real-time tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            icon={RefreshCw}
            isLoading={loading}
            onClick={fetchProposals}
          >
            Refresh
          </Button>

          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/admin/proposals/create')}
          >
            Create Proposal
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <ProposalTable
        proposals={proposals}
        onOpenWhatsApp={(p) => setActiveWhatsAppProposal(p)}
        onOpenAnalytics={(p) => setActiveAnalyticsProposal(p)}
        onRenew={handleRenew}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <WhatsAppModal
        isOpen={!!activeWhatsAppProposal}
        onClose={() => setActiveWhatsAppProposal(null)}
        proposal={activeWhatsAppProposal}
      />

      <AnalyticsModal
        isOpen={!!activeAnalyticsProposal}
        onClose={() => setActiveAnalyticsProposal(null)}
        proposal={activeAnalyticsProposal}
      />
    </div>
  );
}
