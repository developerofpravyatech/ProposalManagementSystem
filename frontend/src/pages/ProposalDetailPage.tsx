import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  ExternalLink, 
  MessageSquare, 
  BarChart3,
  RotateCw,
  Trash2,
  CheckCircle2,
  Download,
  Eye,
  Clock,
  Calendar,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Send,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { WhatsAppModal } from '../components/admin/WhatsAppModal';
import { AnalyticsModal } from '../components/admin/AnalyticsModal';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';
import { ProposalStatus } from '../types';

const statusColors: Record<string, string> = {
  sent: 'bg-slate-100 text-slate-700 border-slate-300',
  viewed: 'bg-brand-50 text-brand-700 border-brand-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  renewal_due: 'bg-amber-50 text-amber-800 border-amber-300',
  renewed: 'bg-blue-50 text-blue-700 border-blue-200',
};

export function ProposalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWhatsAppProposal, setActiveWhatsAppProposal] = useState<any>(null);
  const [activeAnalyticsProposal, setActiveAnalyticsProposal] = useState<any>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const loadProposal = async () => {
    try {
      const data = await proposalApi.getProposalById(id);
      setProposal(data);
    } catch (err) {
      setError(err.message || 'Failed to load proposal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposal();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    try {
      await proposalApi.deleteProposal(Number(id));
      addToast('Proposal deleted successfully', 'success');
      navigate('/admin/proposals');
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleGeneratePdf = async () => {
    try {
      await proposalApi.generatePdf(Number(id));
      addToast('PDF generated successfully', 'success');
      loadProposal();
    } catch (err) {
      addToast(err.message || 'Failed to generate PDF', 'error');
    }
  };

  const handleRenew = async () => {
    try {
      const cloned = await proposalApi.duplicateForRenewal(Number(id));
      addToast(`Renewal created: ${cloned.proposal_no}`, 'success');
      loadProposal();
    } catch (err) {
      addToast(err.message || 'Failed to create renewal', 'error');
    }
  };

  const handleAccept = () => {
    setProposal(prev => prev ? { ...prev, status: 'accepted' as ProposalStatus } : null);
    addToast('Quote accepted (simulated)', 'success');
  };

  const handleCopyToken = () => {
    if (proposal?.unique_token) {
      const url = `${window.location.origin}/p/${proposal.unique_token}`;
      navigator.clipboard.writeText(url);
      setCopiedToken(true);
      addToast('Proposal link copied!', 'success');
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  const isEditable = proposal?.status !== 'sent';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-slate-600 font-bold">Loading proposal details...</div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500">{error || 'Proposal not found'}</p>
          <Button variant="secondary" onClick={() => navigate('/admin/proposals')}>
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  const canRenew = proposal.type === 'quotation_proposal' && proposal.renewal_date;

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/admin/proposals')} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              {proposal.proposal_no || `Proposal #${proposal.id}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {proposal.client_name} &bull; {proposal.type === 'profile_only' ? 'Company Profile' : 'Project Quotation'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={ExternalLink} onClick={() => window.open(`/p/${proposal.unique_token}`, '_blank')}>
            View Public Link
          </Button>
          <Button variant="primary" icon={Edit} onClick={() => navigate(`/admin/proposals/${id}/edit`)}>
            Edit
          </Button>
        </div>
      </div>

      {/* Token Link */}
      <Card className="p-4 bg-slate-50 border-slate-200">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 font-medium">Private Token:</span>
            <code className="font-mono text-slate-900 font-bold bg-white px-2 py-1 rounded border border-slate-200">
              {proposal.unique_token}
            </code>
            <span className="text-slate-400 text-xs">/p/{proposal.unique_token}</span>
          </div>
          <Button size="sm" variant="outline" icon={copiedToken ? Check : Copy} onClick={handleCopyToken}>
            {copiedToken ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </Card>

      {/* Status Banner */}
      <div className={`p-4 rounded-2xl border ${statusColors[proposal.status] || statusColors.sent} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm uppercase tracking-wider">Status:</span>
          <Badge status={proposal.status} type={proposal.type} count={proposal.view_count} />
        </div>
        <span className="text-xs font-medium opacity-80">
          Created {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Details Card */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Proposal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Client Name</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">{proposal.client_name || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Company</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">{proposal.company_name || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Email</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">{proposal.email || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Phone</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">{proposal.phone || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Project Title</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">{proposal.project_title || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Contract Duration</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">{proposal.contract_duration || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Amount</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {proposal.currency_symbol || '$'}{proposal.amount ? Number(proposal.amount).toLocaleString() : '0'} {proposal.currency || 'USD'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Renewal Date</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {proposal.renewal_date ? new Date(proposal.renewal_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
              {proposal.project_subtitle && (
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Subtitle</span>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{proposal.project_subtitle}</p>
                </div>
              )}
            </div>
          </Card>

          {/* PDF Preview Section */}
          {proposal.pdf_path && (
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                PDF Preview
              </h3>
              <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <FileText className="w-16 h-16 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-medium">PDF generated and available for download</p>
                <p className="text-xs text-slate-400 font-mono">{proposal.pdf_path}</p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="primary" icon={Download} onClick={() => window.open(`/generated_pdfs/${proposal.pdf_path.split('/').pop()}`, '_blank')}>
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Line Items (quotation type) */}
          {proposal.type === 'quotation_proposal' && proposal.line_items && Array.isArray(proposal.line_items) && proposal.line_items.length > 0 && (
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Unit Price</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {proposal.line_items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-mono text-xs">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{item.title || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{item.description || ''}</div>
                        </td>
                        <td className="px-4 py-3 font-mono">{item.quantity}</td>
                        <td className="px-4 py-3 font-mono">{(proposal.currency_symbol || '$')}{item.unit_price?.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono font-bold">{(proposal.currency_symbol || '$')}{(item.subtotal || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Tracking Timeline */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              Engagement Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Eye className="w-5 h-5 text-brand-600" />
                <div>
                  <span className="text-sm font-bold text-slate-900">{proposal.view_count || 0} views</span>
                  <span className="text-xs text-slate-500 ml-2">total page opens</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Clock className="w-5 h-5 text-slate-600" />
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">First Opened</span>
                  <p className="text-sm font-semibold text-slate-900">
                    {proposal.first_opened_at ? new Date(proposal.first_opened_at).toLocaleString() : 'Not yet opened'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Clock className="w-5 h-5 text-slate-600" />
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Last Opened</span>
                  <p className="text-sm font-semibold text-slate-900">
                    {proposal.last_opened_at ? new Date(proposal.last_opened_at).toLocaleString() : 'Not yet opened'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Download className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">PDF Downloaded</span>
                  <p className="text-sm font-semibold text-slate-900">
                    {proposal.pdf_downloaded_at ? new Date(proposal.pdf_downloaded_at).toLocaleString() : 'Not downloaded'}
                  </p>
                </div>
              </div>
              {proposal.accepted_at && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-700">Accepted</span>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(proposal.accepted_at).toLocaleString()} by {proposal.accepted_by || 'Unknown'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start"
                icon={RefreshCw}
                onClick={handleGeneratePdf}
              >
                Regenerate PDF
              </Button>
              <Button
                variant="whatsapp"
                className="w-full justify-start"
                icon={MessageSquare}
                onClick={() => setActiveWhatsAppProposal(proposal)}
              >
                Share via WhatsApp
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon={BarChart3}
                onClick={() => setActiveAnalyticsProposal(proposal)}
              >
                View Analytics
              </Button>
              <Button
                variant="whatsapp"
                className="w-full justify-start"
                icon={Eye}
                onClick={() => navigate(`/admin/proposals/${id}/tracking`)}
              >
                View Tracking
              </Button>
              {proposal.type === 'quotation_proposal' && proposal.status !== 'accepted' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={CheckCircle2}
                  onClick={handleAccept}
                >
                  Accept Quote (Simulate)
                </Button>
              )}
              {canRenew && proposal.status !== 'renewed' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={RotateCw}
                  onClick={handleRenew}
                >
                  Create Renewal
                </Button>
              )}
              {proposal.status === 'accepted' && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <span className="text-sm font-bold text-emerald-700">Quote Accepted</span>
                </div>
              )}
              <Button
                variant="danger"
                className="w-full justify-start"
                icon={Trash2}
                onClick={handleDelete}
              >
                Delete Proposal
              </Button>
            </div>
          </Card>

          {/* Status History */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Status Flow</h3>
            <div className="space-y-2">
              {['sent', 'viewed', 'accepted', 'renewal_due', 'renewed'].map((status, idx) => {
                const isActive = proposal.status === status;
                const isPast = ['sent', 'viewed', 'accepted', 'renewal_due', 'renewed'].indexOf(proposal.status) >= idx;
                return (
                  <div key={status} className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold ${
                    isActive ? 'bg-brand-50 border border-brand-200 text-brand-700' :
                    isPast ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                    'bg-slate-50 border border-slate-200 text-slate-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-brand-600' : isPast ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                    {isActive && <span className="ml-auto text-[10px] uppercase">(current)</span>}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Info */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Proposal Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Token</span>
                <code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{proposal.unique_token}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span>{proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Updated</span>
                <span>{proposal.updated_at ? new Date(proposal.updated_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sent Date</span>
                <span>{proposal.sent_at ? new Date(proposal.sent_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <WhatsAppModal
        isOpen={!!activeWhatsAppProposal}
        onClose={() => setActiveWhatsAppProposal(null)}
        proposal={activeWhatsAppProposal || proposal}
      />
      <AnalyticsModal
        isOpen={!!activeAnalyticsProposal}
        onClose={() => setActiveAnalyticsProposal(null)}
        proposal={activeAnalyticsProposal || proposal}
      />
    </div>
  );
}
