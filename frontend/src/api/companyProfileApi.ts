import { apiRequest } from './client';

const LOCAL_KEY = 'pravya_company_profile';

const DEFAULT_PROFILE = {
  company_name: 'PRAVYA TECH Solutions',
  tagline: 'Empowering Businesses Through Technology',
  email: 'contact@pravyatech.com',
  phone: '+91 98765 43210',
  website: 'www.pravyatech.com',
  address: 'Office: Rajkot, Gujarat, India',
  sales_head_name: 'Rahul Mehta',
  sales_head_title: 'Founder & CEO',
  mission: 'To empower businesses with cutting-edge digital solutions that transform challenges into opportunities, fostering growth and innovation across industries.',
  vision: 'To be a globally recognized technology partner known for integrity, innovation, and delivering exceptional value to our clients and stakeholders.',
  core_values: [
    { title: 'Integrity', description: 'We uphold the highest ethical standards in all our dealings.' },
    { title: 'Innovation', description: 'We embrace change and continuously seek better ways to solve problems.' },
    { title: 'Excellence', description: 'We are committed to delivering quality work that stands the test of time.' },
    { title: 'Collaboration', description: 'We believe in the power of teamwork and long-term partnerships.' },
  ],
  services: [
    { title: 'Design & Illustration', description: 'Creative visual assets, branding, and illustration services.' },
    { title: 'Website Designing', description: 'Responsive, user-centric website designs.' },
    { title: 'Research & Analysis', description: 'In-depth market research and data-driven analysis.' },
    { title: 'Content Marketing', description: 'Engaging content strategies that drive traffic, generate leads.' },
  ],
  bni_clients: ['Shree Cement', 'Adani Group', 'Reliance Industries', 'Tata Consultancy Services', 'Infosys', 'Wipro'],
  international_clients: [
    'TechFlow Inc. (USA)',
    'EuroTech Solutions (Germany)',
    'Asia Pacific Digital (Singapore)',
    'UK Digital Labs (London)',
    'Canada Tech Ventures (Toronto)',
  ],
  branch_offices: [
    'Rajkot - 150ft Rd, Gondal Rd, Gujarat, India',
    'California, USA',
  ],
  logo_data: null,
  logo_url: null,
  qr_code: null,
  primary_color: '#4F46E5',
  secondary_color: '#0F172A',
  accent_color: '#10B981',
  theme_config: {},
  terms: 'All proposals are valid for 30 days from the date of issuance.\n50% advance, 30% on milestone completion, 20% on final delivery.\nChanges to scope must be documented in writing.\nIP rights transfer upon full payment.\nConfidentiality required.\nGoverning Law: India.',
};

function getLocalProfile() {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    if (data) return JSON.parse(data);
  } catch {
    return null;
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(DEFAULT_PROFILE));
  return DEFAULT_PROFILE;
}

function saveLocalProfile(profile) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
}

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
    try {
      // Try to get full profile with relations first
      const profile = await apiRequest('/company-profile/full');
      return normalizeRelationalData(profile);
    } catch {
      // Fallback to basic profile
      try {
        return await apiRequest('/company-profile');
      } catch {
        return getLocalProfile();
      }
    }
  },

  async getCompanyProfileFull() {
    try {
      const profile = await apiRequest('/company-profile/full');
      return normalizeRelationalData(profile);
    } catch {
      return getLocalProfile();
    }
  },

  async updateCompanyProfile(profileData) {
    const updated = await apiRequest('/company-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    saveLocalProfile(updated);
    return updated;
  },

  async getPublicCompanyProfile() {
    try {
      return await apiRequest('/public/proposals/company-profile/full');
    } catch {
      try {
        return await apiRequest('/public/proposals/company-profile');
      } catch {
        return getLocalProfile();
      }
    }
  },

  async generatePdf() {
    try {
      return await apiRequest('/company-profile/pdf', { method: 'POST' });
    } catch (err) {
      throw err;
    }
  },

  async downloadCompanyProfilePdf(filename: string) {
    const backendHost = window.location.hostname;
    window.open(`http://${backendHost}:8000/generated_pdfs/${filename}`, '_blank');
  },
};
