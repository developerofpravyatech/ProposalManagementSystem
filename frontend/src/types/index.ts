export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Client {
  id: number;
  client_name: string;
  company_name?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalItem {
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type ProposalType = 'profile_only' | 'quotation_proposal';

export type ProposalStatus = 'sent' | 'viewed' | 'accepted' | 'renewal_due' | 'renewed';

export interface Proposal {
  id: number;
  type: ProposalType;
  proposal_no?: string;
  client_name: string;
  company_name?: string;
  phone?: string;
  email?: string;
  project_title?: string;
  project_subtitle?: string;
  amount?: number;
  currency?: string;
  currency_symbol?: string;
  contract_duration?: string;
  renewal_date?: string;
  terms?: string;
  line_items?: ProposalItem[];
  content?: Record<string, any>;
  pdf_path?: string;
  unique_token: string;
  sent_at?: string;
  first_opened_at?: string;
  last_opened_at?: string;
  view_count: number;
  pdf_downloaded_at?: string;
  accepted_by?: string;
  accepted_at?: string;
  signature_data?: string;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

export interface ProposalView {
  id: number;
  proposal_id: number;
  viewed_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface TrackingEvent {
  id: number;
  proposal_id: number;
  viewed_at: string;
  ip_address: string;
  city?: string;
  user_agent?: string;
  device_type: string;
  browser: string;
  action: string;
}

export interface ProposalTracking {
  total_views: number;
  unique_devices: number;
  first_opened_at?: string;
  last_opened_at?: string;
  views: TrackingEvent[];
  downloads: TrackingEvent[];
}

export interface ProposalAnalytics {
  total_views: number;
  unique_devices: number;
  first_opened_at?: string;
  last_opened_at?: string;
  downloaded: boolean;
  downloaded_at?: string;
  events: ProposalView[];
}

export interface DashboardStats {
  totalProposals: number;
  profileCount: number;
  quotationCount: number;
  totalViews: number;
  openRate: number;
  acceptedCount: number;
  totalAcceptedValue: number;
  renewalsDueCount: number;
  recentActivity: any[];
}

export interface CoreValueRead {
  id: number;
  title: string;
  description?: string;
  logo?: string;
  sort_order: number;
}

export interface CompanyProfile {
  id: number;
  company_name: string;
  tagline?: string;
  email?: string;
  phone?: string;
  website?: string;
  sales_head_name?: string;
sales_head_title?: string;
   mission?: string;
   vision?: string;
   core_values?: Array<{ title: string; description?: string; logo?: string }>;
   services?: any[];
   bni_clients?: any[];
   international_clients?: any[];
   branch_offices?: any[];
   logo_data?: string;
   logo_url?: string;
   signature_data?: string;
   qr_code?: string;
   work_process_steps?: Array<{ icon?: string; title: string; description?: string }>;
   terms?: string;
   contract_terms?: Array<{ title: string; bullets: string[] }>;
   created_at: string;
   updated_at: string;
   core_values_rel?: CoreValueRead[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
}
