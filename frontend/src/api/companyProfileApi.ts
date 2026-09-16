import { apiRequest } from './client';

function normalizeRelationalData(profile: any) {
  // Convert relational data to the format expected by the frontend
  if (profile.core_values_rel && profile.core_values_rel.length > 0) {
    profile.core_values = profile.core_values_rel.map((v: any) => ({
      title: v.title,
      description: v.description,
      logo: v.logo,
    }));
  }
  if (profile.services_rel && profile.services_rel.length > 0) {
    profile.services = profile.services_rel.map((s: any) => ({
      title: s.title,
      description: s.description,
      logo: s.logo,
    }));
  }
  if (profile.bni_clients_rel && profile.bni_clients_rel.length > 0) {
    profile.bni_clients = profile.bni_clients_rel.map((c: any) => ({
      name: c.name,
      logo: c.logo,
    }));
  }
  if (profile.international_clients_rel && profile.international_clients_rel.length > 0) {
    profile.international_clients = profile.international_clients_rel.map((c: any) => ({
      name: c.name,
      logo: c.logo,
    }));
  }
  if (profile.branch_offices_rel && profile.branch_offices_rel.length > 0) {
    profile.branch_offices = profile.branch_offices_rel.map((o: any) => ({
      name: o.name,
      logo: o.logo,
    }));
  }
  if (profile.work_process_steps_rel && profile.work_process_steps_rel.length > 0) {
    profile.work_process_steps = profile.work_process_steps_rel.map((s: any) => ({
      icon: s.icon,
      title: s.title,
      description: s.description,
    }));
  }
  if (profile.theme_config_rel) {
    // theme_config_rel stores icon mappings
    try {
      const icons = JSON.parse(profile.theme_config_rel.icon_name || '{}');
      profile.theme_config = icons;
    } catch {
      profile.theme_config = {};
    }
  }
  return profile;
}

export const companyProfileApi = {
  async getCompanyProfile() {
    // Always hit the API - no localStorage fallback
    const profile = await apiRequest('/company-profile/full');
    return normalizeRelationalData(profile);
  },

  async getCompanyProfileFull() {
    // Always hit the API - no localStorage fallback
    const profile = await apiRequest('/company-profile/full');
    return normalizeRelationalData(profile);
  },

  async updateCompanyProfile(profileData) {
    const updated = await apiRequest('/company-profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return updated;
  },

  async getPublicCompanyProfile() {
    // Always hit the API - no localStorage fallback
    return await apiRequest('/public/proposals/company-profile/full');
  },

  async generatePdf() {
    return await apiRequest('/company-profile/pdf', { method: 'POST' });
  },

  async downloadCompanyProfilePdf(filename: string) {
    window.open(`/generated_pdfs/${filename}`, '_blank');
  },

  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiRequest('/company-profile/upload-logo', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type with boundary
    });
    return response.url; // Returns the URL like "/uploads/abc123.png"
  },
};
