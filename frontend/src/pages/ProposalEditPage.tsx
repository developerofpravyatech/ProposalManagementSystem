import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';

export function ProposalEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [proposal, setProposal] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await proposalApi.getProposalById(id);
        setProposal(data);
      } catch (err) {
        addToast('Failed to load proposal', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!proposal) return;
    setSaving(true);
    try {
      await proposalApi.updateProposal(id, proposal);
      addToast('Proposal updated successfully', 'success');
      navigate(`/admin/proposals/${id}`);
    } catch (err) {
      addToast(err.message || 'Failed to update proposal', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600 font-bold">Loading proposal...</div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-slate-500">Proposal not found</p>
          <Button variant="secondary" onClick={() => navigate('/admin/proposals')} className="mt-4">
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(`/admin/proposals/${id}`)} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              Edit {proposal.proposal_no || `Proposal #${proposal.id}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Update proposal details
            </p>
          </div>
        </div>
        <Button variant="primary" icon={Save} onClick={handleSave} isLoading={saving}>
          Save Changes
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <Input
          label="Client Name"
          value={proposal.client_name || ''}
          onChange={(e) => setProposal({ ...proposal, client_name: e.target.value })}
        />
        <Input
          label="Company Name"
          value={proposal.company_name || ''}
          onChange={(e) => setProposal({ ...proposal, company_name: e.target.value })}
        />
        <Input
          label="Project Title"
          value={proposal.project_title || ''}
          onChange={(e) => setProposal({ ...proposal, project_title: e.target.value })}
        />
        <Input
          label="Amount"
          type="number"
          value={proposal.amount || ''}
          onChange={(e) => setProposal({ ...proposal, amount: parseFloat(e.target.value) || 0 })}
        />
      </Card>
    </div>
  );
}
