import { apiRequest } from './client';
import { getMockProposals, saveMockProposals, getMockViews, generateToken } from './mockData';

export const proposalApi = {
  async getDashboardStats() {
    try {
      return await apiRequest('/proposals/dashboard-stats');
    } catch {
      const proposals = getMockProposals();
      const views = getMockViews();

      const totalProposals = proposals.length;
      const profileCount = proposals.filter(p => p.proposal_type === 'profile').length;
      const quotationCount = proposals.filter(p => p.proposal_type === 'quotation').length;
      
      const totalViews = views.length;
      const viewedProposals = proposals.filter(p => (p.view_count || 0) > 0).length;
      const openRate = totalProposals > 0 ? Math.round((viewedProposals / totalProposals) * 100) : 0;

      const acceptedProposals = proposals.filter(p => p.status === 'accepted');
      const totalAcceptedValue = acceptedProposals.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Renewals due in <= 30 days
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
            proposal_number: prop?.proposal_number || 'Proposal',
            company_name: prop?.company_name || 'Client',
            action: v.action,
            viewed_at: v.viewed_at,
            device_type: v.device_type,
            city: v.city
          };
        })
      };
    }
  },

  async getProposals(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      return await apiRequest(`/proposals?${params.toString()}`);
    } catch {
      let list = getMockProposals();

      if (filters.status && filters.status !== 'all') {
        list = list.filter(p => p.status === filters.status);
      }
      if (filters.type && filters.type !== 'all') {
        list = list.filter(p => p.proposal_type === filters.type);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(p => 
          p.proposal_number.toLowerCase().includes(q) ||
          p.client_name.toLowerCase().includes(q) ||
          p.company_name.toLowerCase().includes(q) ||
          p.project_title.toLowerCase().includes(q) ||
          p.token.toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  async getProposalById(id) {
    try {
      return await apiRequest(`/proposals/${id}`);
    } catch {
      const list = getMockProposals();
      const found = list.find(p => p.id === Number(id));
      if (!found) throw new Error('Proposal not found');
      return found;
    }
  },

  async createProposal(proposalData) {
    try {
      return await apiRequest('/proposals', {
        method: 'POST',
        body: JSON.stringify(proposalData),
      });
    } catch {
      const list = getMockProposals();
      const nextId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
      const proposal_number = `PT-2026-${String(100 + nextId).padStart(3, '0')}`;
      const token = generateToken(proposalData.project_title, proposalData.company_name);

      const newProposal = {
        id: nextId,
        proposal_number,
        token,
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

  async updateProposal(id, updateData) {
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

  async deleteProposal(id) {
    try {
      return await apiRequest(`/proposals/${id}`, { method: 'DELETE' });
    } catch {
      const list = getMockProposals();
      const filtered = list.filter(p => p.id !== Number(id));
      saveMockProposals(filtered);
      return { success: true };
    }
  },

  async duplicateForRenewal(id, renewalPayload = {}) {
    try {
      return await apiRequest(`/proposals/${id}/renew`, {
        method: 'POST',
        body: JSON.stringify(renewalPayload),
      });
    } catch {
      const list = getMockProposals();
      const original = list.find(p => p.id === Number(id));
      if (!original) throw new Error('Original proposal not found');

      // Mark original as renewed
      original.status = 'renewed';

      // Create new cloned proposal
      const nextId = Math.max(...list.map(p => p.id)) + 1;
      const proposal_number = `PT-2026-${String(100 + nextId).padStart(3, '0')}`;
      const token = generateToken(`renewal-${original.project_title}`, original.company_name);

      const cloned = {
        ...original,
        id: nextId,
        proposal_number,
        token,
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
        contract_duration: renewalPayload.contract_duration || original.contract_duration,
        project_title: renewalPayload.project_title || `${original.project_title} (Renewal)`,
      };

      list.unshift(cloned);
      saveMockProposals(list);
      return cloned;
    }
  },

  async getProposalAnalytics(id) {
    try {
      return await apiRequest(`/proposals/${id}/analytics`);
    } catch {
      const list = getMockProposals();
      const proposal = list.find(p => p.id === Number(id));
      if (!proposal) throw new Error('Proposal not found');

      const allViews = getMockViews();
      const views = allViews.filter(v => v.proposal_id === Number(id)).reverse();

      return {
        proposal,
        total_views: proposal.view_count || views.length,
        first_opened_at: proposal.first_opened_at,
        last_opened_at: proposal.last_opened_at,
        pdf_downloaded_at: proposal.pdf_downloaded_at,
        views
      };
    }
  }
};
