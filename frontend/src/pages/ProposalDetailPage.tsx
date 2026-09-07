import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';

export function ProposalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [proposal, setProposal] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

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
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
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
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/admin/proposals')} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              {proposal.proposal_no || `Proposal #${proposal.id}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {proposal.client_name} - {proposal.type}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/admin/proposals/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="primary" icon={ExternalLink} onClick={() => window.open(`/p/${proposal.unique_token}`, '_blank')}>
            View Public Link
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Proposal Details</h3>
        <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto">
          {JSON.stringify(proposal, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
