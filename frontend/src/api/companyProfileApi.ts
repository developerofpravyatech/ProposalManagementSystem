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
  if (profile.regional_clients_rel && profile.regional_clients_rel.length > 0) {
    profile.regional_clients = profile.regional_clients_rel.map((c: any) => ({
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
      title: o.title,
      name: o.name,
    }));
  }
  if (profile.work_process_steps_rel && profile.work_process_steps_rel.length > 0) {
    profile.work_process_steps = profile.work_process_steps_rel.map((s: any) => ({
      icon: s.icon,
      title: s.title,
      description: s.description,
    }));
  }
  if (profile.signatures_rel && profile.signatures_rel.length > 0) {
    // Take the first signature for backward compatibility
    profile.signature_data = profile.signatures_rel[0].image_data;
    profile.cover_letter_signature_image = profile.signatures_rel[0].image_data;
    profile.signatures = profile.signatures_rel.map((s: any) => ({
      image_data: s.image_data,
    }));
  }
  if (profile.statement_of_work_rel && profile.statement_of_work_rel.length > 0) {
    profile.statement_of_work = profile.statement_of_work_rel.map((s: any) => ({
      title: s.heading,
      description: s.description,
    }));
  }
  if (profile.payment_method_rel) {
    const pm = profile.payment_method_rel;
    profile.bank_name = pm.bank_name;
    profile.bank_account_name = pm.account_name;
    profile.bank_account_number = pm.account_number;
    profile.bank_ifsc = pm.ifsc;
    profile.bank_branch = pm.branch;
    profile.upi_id = pm.upi_id;
    profile.qr_code = pm.qr_code;
    profile.swift_code = pm.swift_code;
  }
  if (profile.bank_details_rel) {
    const bd = profile.bank_details_rel;
    if (bd.bank_name != null) profile.bank_name = bd.bank_name;
    if (bd.account_name != null) profile.bank_account_name = bd.account_name;
    if (bd.account_number != null) profile.bank_account_number = bd.account_number;
    if (bd.ifsc != null) profile.bank_ifsc = bd.ifsc;
    if (bd.branch != null) profile.bank_branch = bd.branch;
    if (bd.upi_id != null) profile.upi_id = bd.upi_id;
    if (bd.qr_code) profile.qr_code = bd.qr_code;
    if (bd.swift_code != null) profile.swift_code = bd.swift_code;
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
    const profile = await apiRequest('/public/proposals/company-profile/full');
    return normalizeRelationalData(profile);
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
      headers: {},
    });
    return response.url;
  },

  async uploadSignature(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiRequest('/company-profile/upload-signature', {
      method: 'POST',
      body: formData,
      headers: {},
    });
    return response.url;
  },

  async uploadItemLogo(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiRequest('/company-profile/upload-item-logo', {
      method: 'POST',
      body: formData,
      headers: {},
    });
    return response.url;
  },

  async uploadQrCode(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiRequest('/company-profile/upload-qr-code', {
      method: 'POST',
      body: formData,
      headers: {},
    });
    return response.url;
  },
};
