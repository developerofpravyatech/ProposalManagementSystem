import { apiRequest } from './client';
import { Proposal, DashboardStats, ProposalAnalytics } from '../types';
import { getMockProposals, saveMockProposals, getMockViews, generateToken } from './mockData';

interface ProposalFilters {
  status?: string;
  type?: string;
  search?: string;
}

export const proposalApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      return await apiRequest('/proposals/dashboard-stats');
    } catch {
      const proposals = getMockProposals();
      const views = getMockViews();

      const totalProposals = proposals.length;
      const profileCount = proposals.filter(p => p.type === 'profile_only').length;
      const quotationCount = proposals.filter(p => p.type === 'quotation_proposal').length;

      const totalViews = proposals.reduce((sum, p) => sum + (p.view_count || 0), 0);
      const viewedProposals = proposals.filter(p => (p.view_count || 0) > 0).length;
      const openRate = totalProposals > 0 ? Math.round((viewedProposals / totalProposals) * 100) : 0;

      const acceptedProposals = proposals.filter(p => p.status === 'accepted');
      const totalAcceptedValue = acceptedProposals.reduce((sum, p) => sum + (p.amount || 0), 0);

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      const renewalsDue = proposals.filter(p => {
        if (!p.renewal_date || p.status === 'renewed') return false;
        const rDate = new Date(p.renewal_date);
        return rDate <= thirtyDaysFromNow;
      });

      return {
        totalProposals,
        profileCount,
        quotationCount,
        totalViews,
        openRate,
        acceptedCount: acceptedProposals.length,
        totalAcceptedValue,
        renewalsDueCount: renewalsDue.length,
        recentActivity: views.slice(-6).reverse().map(v => {
          const prop = proposals.find(p => p.id === v.proposal_id);
          return {
            id: v.id,
            proposal_number: prop?.proposal_no || 'Proposal',
            company_name: prop?.company_name || 'Client',
            action: v.action || 'Page Opened',
            viewed_at: v.viewed_at,
            device_type: v.device_type,
            city: v.city
          };
        })
      };
    }
  },

  async getProposals(filters: ProposalFilters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.set('status', filters.status);
      if (filters.type && filters.type !== 'all') params.set('type', filters.type);
      if (filters.search) params.set('search', filters.search);
      const query = params.toString();
      const list = await apiRequest(`/proposals${query ? '?' + query : ''}`);
      return list;
    } catch {
      let list = getMockProposals();

      if (filters.status && filters.status !== 'all') {
        list = list.filter(p => p.status === filters.status);
      }
      if (filters.type && filters.type !== 'all') {
        list = list.filter(p => p.type === filters.type);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(p =>
          (p.proposal_no || '').toLowerCase().includes(q) ||
          p.client_name.toLowerCase().includes(q) ||
          (p.company_name || '').toLowerCase().includes(q) ||
          (p.project_title || '').toLowerCase().includes(q) ||
          (p.unique_token || '').toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  async getProposalById(id: string | number) {
    try {
      return await apiRequest(`/proposals/${id}`);
    } catch {
      const list = getMockProposals();
      const found = list.find(p => p.id === Number(id));
      if (!found) throw new Error('Proposal not found');
      return found;
    }
  },

  async generatePdf(proposalId: string | number) {
    try {
      return await apiRequest(`/proposals/${proposalId}/pdf`, {
        method: 'POST',
      });
    } catch {
      return { detail: 'PDF generated (mock)', pdf_path: `/static/proposals/PT-2026-${100 + Number(proposalId)}.pdf` };
    }
  },

  async createProposal(proposalData: Partial<Proposal>) {
    try {
      return await apiRequest('/proposals', {
        method: 'POST',
        body: JSON.stringify(proposalData),
      });
    } catch {
      const list = getMockProposals();
      const nextId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
      const proposal_number = `PT-2026-${String(100 + nextId).padStart(3, '0')}`;
      const token = generateToken(proposalData.project_title || '', proposalData.company_name || '');

      const newProposal = {
        id: nextId,
        proposal_no: proposal_number,
        unique_token: token,
        status: 'sent',
        view_count: 0,
        first_opened_at: null,
        last_opened_at: null,
        pdf_downloaded_at: null,
        created_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        pdf_path: `/static/proposals/${proposal_number}.pdf`,
        ...proposalData,
      };

      list.unshift(newProposal);
      saveMockProposals(list);
      return newProposal;
    }
  },

  async updateProposal(id: string | number, updateData: Partial<Proposal>) {
    try {
      return await apiRequest(`/proposals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    } catch {
      const list = getMockProposals();
      const index = list.findIndex(p => p.id === Number(id));
      if (index === -1) throw new Error('Proposal not found');

      list[index] = { ...list[index], ...updateData, updated_at: new Date().toISOString() };
      saveMockProposals(list);
      return list[index];
    }
  },

  async deleteProposal(id: string | number) {
    try {
      return await apiRequest(`/proposals/${id}`, { method: 'DELETE' });
    } catch {
      const list = getMockProposals();
      const filtered = list.filter(p => p.id !== Number(id));
      saveMockProposals(filtered);
      return { success: true };
    }
  },

  async duplicateForRenewal(id: string | number, renewalPayload: Partial<Proposal> = {}) {
    try {
      return await apiRequest(`/proposals/${id}/renew`, {
        method: 'POST',
        body: JSON.stringify(renewalPayload),
      });
    } catch {
      const list = getMockProposals();
      const original = list.find(p => p.id === Number(id));
      if (!original) throw new Error('Original proposal not found');

      original.status = 'renewed';

      const nextId = Math.max(...list.map(p => p.id)) + 1;
      const proposal_number = `PT-2026-${String(100 + nextId).padStart(3, '0')}`;
      const token = generateToken(`renewal-${original.project_title || ''}`, original.company_name || '');

      const cloned = {
        ...original,
        id: nextId,
        proposal_no: proposal_number,
        unique_token: token,
        status: 'sent',
        view_count: 0,
        first_opened_at: null,
        last_opened_at: null,
        pdf_downloaded_at: null,
        accepted_at: null,
        accepted_by: null,
        signature_data: null,
        created_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        renewal_date: renewalPayload.renewal_date || original.renewal_date,
        project_title: renewalPayload.project_title || `${original.project_title || 'Proposal'} (Renewal)`,
      };

      list.unshift(cloned);
      saveMockProposals(list);
      return cloned;
    }
  },

  async getProposalAnalytics(id: string | number): Promise<ProposalAnalytics> {
    try {
      return await apiRequest(`/proposals/${id}/analytics`);
    } catch {
      const list = getMockProposals();
      const proposal = list.find(p => p.id === Number(id));
      if (!proposal) throw new Error('Proposal not found');

      const allViews = getMockViews();
      const views = allViews.filter(v => v.proposal_id === Number(id)).reverse();

      return {
        total_views: proposal.view_count || views.length,
        unique_devices: new Set(views.map(v => v.device_type)).size,
        first_opened_at: proposal.first_opened_at,
        last_opened_at: proposal.last_opened_at,
        pdf_downloaded_at: proposal.pdf_downloaded_at,
        downloaded: !!proposal.pdf_downloaded_at,
        events: views,
      };
    }
  }
};
