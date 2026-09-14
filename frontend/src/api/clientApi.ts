import { apiRequest } from './client';

export const clientApi = {
  async getClients(skip: number = 0, limit: number = 50, search?: string) {
    const params = new URLSearchParams();
    params.set('skip', String(skip));
    params.set('limit', String(limit));
    if (search) params.set('search', search);
    return apiRequest(`/clients?${params.toString()}`);
  },

  async getClient(clientId: number) {
    return apiRequest(`/clients/${clientId}`);
  },

  async createClient(clientData: { client_name: string; company_name?: string; phone?: string; email?: string }) {
    return apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },

  async updateClient(clientId: number, clientData: { client_name?: string; company_name?: string; phone?: string; email?: string }) {
    return apiRequest(`/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  },

  async deleteClient(clientId: number) {
    return apiRequest(`/clients/${clientId}`, { method: 'DELETE' });
  },
};
