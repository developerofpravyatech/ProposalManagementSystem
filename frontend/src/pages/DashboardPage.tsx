import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MetricCard } from '../components/admin/MetricCard';
import { LiveActivityFeed } from '../components/admin/LiveActivityFeed';
import { ProposalTable } from '../components/admin/ProposalTable';
import { WhatsAppModal } from '../components/admin/WhatsAppModal';
import { AnalyticsModal } from '../components/admin/AnalyticsModal';
import { Button } from '../components/common/Button';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';

const STATUS_COLORS: Record<string, string> = {
  sent: '#94A3B8',
  viewed: '#DC2626',
  accepted: '#10B981',
  renewal_due: '#F59E0B',
  renewed: '#3B82F6',
};

const TYPE_COLORS: Record<string, string> = {
  profile_only: '#0F172A',
  quotation_proposal: '#DC2626',
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeWhatsAppProposal, setActiveWhatsAppProposal] = useState(null);
  const [activeAnalyticsProposal, setActiveAnalyticsProposal] = useState(null);

  const loadDashboardData = async () => {
    try {
      const [statsData, proposalsData] = await Promise.all([
        proposalApi.getDashboardStats(),
        proposalApi.getProposals(),
      ]);
      setStats(statsData);
      setProposals(proposalsData);
    } catch (err) {
      console.error(err);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const chartData = React.useMemo(() => {
    const statusCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    proposals.forEach((p) => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
    });
    return {
      status: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
      types: Object.entries(typeCounts).map(([name, value]) => ({
        name: name === 'profile_only' ? 'Profile' : 'Quotation',
        value,
      })),
    };
  }, [proposals]);

  const handleRenew = async (proposal) => {
    try {
      const cloned = await proposalApi.duplicateForRenewal(proposal.id);
      addToast(`Renewed proposal created: ${cloned.proposal_no}`, 'success');
      loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to duplicate renewal', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    try {
      await proposalApi.deleteProposal(id);
      addToast('Proposal deleted successfully', 'success');
      loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mesh-bg">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            PRAVYA TECH Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
            Proposal Intelligence & Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Real-time telemetry, 1-click WhatsApp distribution, and contract renewals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/admin/proposals/create')}
          >
            Create Proposal
          </Button>
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <MetricCard
          title="Total Proposals"
          value={stats?.totalProposals || '0'}
          subtitle={`${stats?.profileCount || 0} Profiles • ${stats?.quotationCount || 0} Quotes`}
          icon={FileSpreadsheet}
          color="black"
          onClick={() => navigate('/admin/proposals')}
        />

        <MetricCard
          title="Sent"
          value={stats?.sentCount || '0'}
          subtitle="Awaiting Response"
          icon={FileSpreadsheet}
          color="brand"
        />

        <MetricCard
          title="Client Engagement"
          value={stats?.totalViews ? `${stats.totalViews} Views` : '0 Views'}
          subtitle={`${stats?.openRate || 0}% Open Rate`}
          icon={Eye}
          color="brand"
          trend="+18% this wk"
        />

        <MetricCard
          title="Accepted Deals"
          value={stats?.acceptedCount ? `${stats.acceptedCount} Deals` : '0 Deals'}
          subtitle={`$${(stats?.totalAcceptedValue || 0).toLocaleString()} Total Value`}
          icon={CheckCircle2}
          color="emerald"
        />

        <MetricCard
          title="Renewals Due (<30d)"
          value={stats?.renewalsDueCount || '0'}
          subtitle="Approaching Expiration"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/admin/renewals')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 font-display mb-4">Status Distribution</h3>
          {chartData.status.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData.status}
                  dataKey="value"
                  nameKey="name"
                  cx="45%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent }) => `${name.replace('_', ' ')} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.status.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">No data available</div>
          )}
        </div>

        {/* Type Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 font-display mb-4">Proposal Types</h3>
          {chartData.types.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData.types} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#CBD5E1' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#DC2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">No data available</div>
          )}
        </div>
      </div>

      {/* Two Column Grid: Recent Proposals & Live Forensic Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Proposal Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 font-display">Recent Proposals</h3>
            <button
              onClick={() => navigate('/admin/proposals')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              View All Proposals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <ProposalTable
            proposals={proposals.slice(0, 5)}
            onOpenWhatsApp={(p) => setActiveWhatsAppProposal(p)}
            onOpenAnalytics={(p) => setActiveAnalyticsProposal(p)}
            onRenew={handleRenew}
            onDelete={handleDelete}
            onGeneratePdf={(id) => console.log('Generate PDF for', id)}
          />
        </div>

        {/* Live Forensic Activity Feed */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 font-display">Client Telemetry</h3>
          <LiveActivityFeed activities={stats?.recentActivity || []} />
        </div>
      </div>

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

