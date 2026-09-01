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
  primary_color: '#4F46E5',
  secondary_color: '#0F172A',
  accent_color: '#10B981',
  theme_config: [],
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

export const companyProfileApi = {
  async getCompanyProfile() {
    try {
      return await apiRequest('/company-profile');
    } catch {
      return getLocalProfile();
    }
  },

  async updateCompanyProfile(profileData) {
    try {
      const updated = await apiRequest('/company-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      saveLocalProfile(updated);
      return updated;
    } catch {
      const merged = { ...getLocalProfile(), ...profileData };
      saveLocalProfile(merged);
      return merged;
    }
  },

  async getPublicCompanyProfile() {
    try {
      return await apiRequest('/public/proposals/company-profile');
    } catch {
      return getLocalProfile();
    }
  },
};
