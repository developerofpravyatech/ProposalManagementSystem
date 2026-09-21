import { apiRequest } from './client';
import { getMockProposals, saveMockProposals, getMockViews, saveMockViews } from './mockData';
import { companyProfileApi } from './companyProfileApi';

export const publicApi = {
  async getCompanyProfile() {
    return await companyProfileApi.getPublicCompanyProfile();
  },

  async getProposalByToken(token) {
    try {
      return await apiRequest(`/public/proposals/${token}`);
    } catch {
      const proposals = getMockProposals();
      const found = proposals.find(p => p.unique_token === token);
      if (!found) throw new Error('Proposal not found or link has expired');
      return found;
    }
  },

  async recordView(token, metadata: { ip?: string; city?: string } = {}) {
    try {
      return await apiRequest(`/public/proposals/${token}/view`, {
        method: 'POST',
        body: JSON.stringify(metadata),
      });
    } catch {
      const proposals = getMockProposals();
      const proposal = proposals.find(p => p.unique_token === token);
      if (!proposal) return null;

      const now = new Date().toISOString();
      if (!proposal.first_opened_at) {
        proposal.first_opened_at = now;
      }
      proposal.last_opened_at = now;
      proposal.view_count = (proposal.view_count || 0) + 1;

      if (proposal.status === 'sent') {
        proposal.status = 'viewed';
      }

      saveMockProposals(proposals);

      const views = getMockViews();
      const newView = {
        id: views.length + 1,
        proposal_id: proposal.id,
        viewed_at: now,
        ip_address: metadata.ip || '103.21.244.18',
        city: metadata.city || 'Visitor Location',
        user_agent: navigator.userAgent,
        device_type: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser',
        action: 'Page Opened'
      };
      views.push(newView);
      saveMockViews(views);

      return { success: true, view_count: proposal.view_count };
    }
  },

  async recordDownload(token) {
    try {
      return await apiRequest(`/public/proposals/${token}/download`, {
        method: 'GET',
      });
    } catch {
      const proposals = getMockProposals();
      const proposal = proposals.find(p => p.unique_token === token);
      if (!proposal) return null;

      const now = new Date().toISOString();
      proposal.pdf_downloaded_at = now;
      saveMockProposals(proposals);

      const views = getMockViews();
      views.push({
        id: views.length + 1,
        proposal_id: proposal.id,
        viewed_at: now,
        ip_address: '103.21.244.18',
        city: 'Visitor Location',
        user_agent: navigator.userAgent,
        device_type: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        browser: 'Browser',
        action: 'PDF Downloaded'
      });
      saveMockViews(views);

      return { success: true, downloaded_at: now };
    }
  },

  async acceptQuotation(token, signPayload) {
    try {
      return await apiRequest(`/public/proposals/${token}/accept`, {
        method: 'POST',
        body: JSON.stringify(signPayload),
      });
    } catch {
      const proposals = getMockProposals();
      const proposal = proposals.find(p => p.unique_token === token);
      if (!proposal) throw new Error('Proposal not found');

      const now = new Date().toISOString();
      proposal.status = 'accepted';
      proposal.accepted_at = now;
      proposal.accepted_by = signPayload.accepted_by;
      proposal.signature_data = signPayload.signature_data;
      saveMockProposals(proposals);

      const views = getMockViews();
      views.push({
        id: views.length + 1,
        proposal_id: proposal.id,
        viewed_at: now,
        ip_address: '103.21.244.18',
        city: 'Visitor Location',
        user_agent: navigator.userAgent,
        device_type: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        browser: 'Browser',
        action: 'Quotation Accepted'
      });
      saveMockViews(views);

      return { success: true, proposal };
    }
  }
};
