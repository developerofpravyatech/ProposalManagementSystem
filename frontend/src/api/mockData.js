// Rich mock dataset initialized into localStorage for instant offline and interactive use

const INITIAL_PROPOSALS = [
  {
    id: 1,
    proposal_type: "quotation", // 'profile' (Mode A) or 'quotation' (Mode B)
    proposal_number: "PT-2026-101",
    token: "acme-corp-q1-2026",
    client_name: "Sarah Jenkins",
    company_name: "Acme Global Solutions",
    phone: "+919876543210",
    email: "sarah.j@acmeglobal.com",
    project_title: "Enterprise ERP Modernization & Cloud Infrastructure",
    project_subtitle: "Scalable Multi-Tenant Cloud ERP Architecture with Automated CI/CD",
    amount: 18500,
    currency: "USD",
    currency_symbol: "$",
    status: "viewed", // sent, viewed, accepted, renewal_due, renewed
    contract_duration: "12 Months",
    renewal_date: "2027-08-31",
    created_at: "2026-08-25T10:30:00Z",
    sent_at: "2026-08-25T10:45:00Z",
    first_opened_at: "2026-08-25T11:20:15Z",
    last_opened_at: "2026-08-30T14:45:10Z",
    pdf_downloaded_at: "2026-08-26T09:12:00Z",
    view_count: 7,
    pdf_path: "/static/proposals/PT-2026-101.pdf",
    line_items: [
      {
        id: 101,
        title: "Core ERP Module Engineering",
        description: "Custom accounting, inventory tracking, HRMS, and role-based permissions matrix.",
        quantity: 1,
        unit_price: 9500,
        subtotal: 9500
      },
      {
        id: 102,
        title: "AWS Multi-Region Cloud Migration",
        description: "Terraform-managed infrastructure, auto-scaling ECS clusters, and Aurora PostgreSQL.",
        quantity: 1,
        unit_price: 5500,
        subtotal: 5500
      },
      {
        id: 103,
        title: "24/7 SLA & Maintenance Support (Annual)",
        description: "Priority incident resolution, automated security patches, and monthly performance tuning.",
        quantity: 1,
        unit_price: 3500,
        subtotal: 3500
      }
    ],
    terms: "50% upfront upon milestone 1 kickoff, 30% upon UAT deployment, 20% upon final production sign-off. Validity 30 days."
  },
  {
    id: 2,
    proposal_type: "profile",
    proposal_number: "PT-2026-102",
    token: "nova-ventures-profile",
    client_name: "Marcus Vance",
    company_name: "Nova Ventures Capital",
    phone: "+971501234567",
    email: "m.vance@novaventures.ae",
    project_title: "PRAVYA TECH — Corporate Profile & Digital Capabilities",
    project_subtitle: "Overview of Engineering Practices, Case Studies, and Enterprise Services",
    amount: 0,
    currency: "USD",
    currency_symbol: "$",
    status: "sent",
    contract_duration: "N/A",
    renewal_date: null,
    created_at: "2026-08-29T14:15:00Z",
    sent_at: "2026-08-29T14:20:00Z",
    first_opened_at: null,
    last_opened_at: null,
    pdf_downloaded_at: null,
    view_count: 0,
    pdf_path: "/static/proposals/PT-2026-102.pdf",
    line_items: []
  },
  {
    id: 3,
    proposal_type: "quotation",
    proposal_number: "PT-2026-103",
    token: "zenith-health-portal",
    client_name: "Dr. Arvind Menon",
    company_name: "Zenith Healthcare Labs",
    phone: "+919845012345",
    email: "arvind@zenithlabs.in",
    project_title: "HIPAA-Compliant Patient Diagnostic & Telehealth Platform",
    project_subtitle: "Real-time Lab Reporting, Video Consultations & Secure EHR Integration",
    amount: 1250000,
    currency: "INR",
    currency_symbol: "₹",
    status: "accepted",
    contract_duration: "6 Months",
    renewal_date: "2027-02-28",
    created_at: "2026-08-20T09:00:00Z",
    sent_at: "2026-08-20T09:30:00Z",
    first_opened_at: "2026-08-20T10:15:00Z",
    last_opened_at: "2026-08-22T16:40:00Z",
    pdf_downloaded_at: "2026-08-21T11:00:00Z",
    accepted_at: "2026-08-22T16:45:00Z",
    accepted_by: "Dr. Arvind Menon (Managing Director)",
    signature_data: "Arvind Menon",
    view_count: 4,
    pdf_path: "/static/proposals/PT-2026-103.pdf",
    line_items: [
      {
        id: 301,
        title: "Patient Telehealth & Consultation Engine",
        description: "WebRTC encrypted video consultations, waiting room, and doctor prescription generator.",
        quantity: 1,
        unit_price: 750000,
        subtotal: 750000
      },
      {
        id: 302,
        title: "Diagnostic Lab API & EHR Integration",
        description: "Automated HL7/FHIR compliant lab analyzer synchronization with real-time SMS/WhatsApp dispatch.",
        quantity: 1,
        unit_price: 500000,
        subtotal: 500000
      }
    ],
    terms: "Milestone-based billing. Standard 1-year warranty on bugs and security patches."
  },
  {
    id: 4,
    proposal_type: "quotation",
    proposal_number: "PT-2026-104",
    token: "cyberscale-ai-infra",
    client_name: "Elena Rostova",
    company_name: "CyberScale Analytics",
    phone: "+447700900123",
    email: "elena@cyberscale.io",
    project_title: "AI Inference Pipeline & Microservices Architecture",
    project_subtitle: "High-Throughput Vector Search & Model Deployment Infrastructure",
    amount: 8400,
    currency: "USD",
    currency_symbol: "$",
    status: "renewal_due",
    contract_duration: "1 Year",
    renewal_date: "2026-09-12", // Expiring in 12 days!
    created_at: "2025-09-12T08:00:00Z",
    sent_at: "2025-09-12T08:30:00Z",
    first_opened_at: "2025-09-12T09:00:00Z",
    last_opened_at: "2026-08-28T18:30:00Z",
    pdf_downloaded_at: "2025-09-15T14:20:00Z",
    view_count: 14,
    pdf_path: "/static/proposals/PT-2026-104.pdf",
    line_items: [
      {
        id: 401,
        title: "Model Server & Kubernetes Cluster Management",
        description: "Annual cluster maintenance, GPU auto-scaling, and latency optimization.",
        quantity: 1,
        unit_price: 8400,
        subtotal: 8400
      }
    ]
  }
];

const INITIAL_VIEWS = [
  {
    id: 1,
    proposal_id: 1,
    viewed_at: "2026-08-25T11:20:15Z",
    ip_address: "103.21.244.18",
    city: "San Francisco, CA, USA",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0",
    device_type: "Desktop",
    browser: "Chrome",
    action: "Page Opened"
  },
  {
    id: 2,
    proposal_id: 1,
    viewed_at: "2026-08-26T09:12:00Z",
    ip_address: "103.21.244.18",
    city: "San Francisco, CA, USA",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0",
    device_type: "Desktop",
    browser: "Chrome",
    action: "PDF Downloaded"
  },
  {
    id: 3,
    proposal_id: 1,
    viewed_at: "2026-08-30T14:45:10Z",
    ip_address: "172.56.21.90",
    city: "San Francisco, CA, USA",
    user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1",
    device_type: "Mobile",
    browser: "Safari",
    action: "Page Opened"
  },
  {
    id: 4,
    proposal_id: 3,
    viewed_at: "2026-08-20T10:15:00Z",
    ip_address: "49.37.112.44",
    city: "Bangalore, KA, IN",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0",
    device_type: "Desktop",
    browser: "Chrome",
    action: "Page Opened"
  },
  {
    id: 5,
    proposal_id: 3,
    viewed_at: "2026-08-22T16:45:00Z",
    ip_address: "49.37.112.44",
    city: "Bangalore, KA, IN",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0",
    device_type: "Desktop",
    browser: "Chrome",
    action: "Quotation Accepted"
  }
];

export function getMockProposals() {
  const data = localStorage.getItem('pravya_pms_proposals');
  if (!data) {
    localStorage.setItem('pravya_pms_proposals', JSON.stringify(INITIAL_PROPOSALS));
    return INITIAL_PROPOSALS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PROPOSALS;
  }
}

export function saveMockProposals(proposals) {
  localStorage.setItem('pravya_pms_proposals', JSON.stringify(proposals));
}

export function getMockViews() {
  const data = localStorage.getItem('pravya_pms_views');
  if (!data) {
    localStorage.setItem('pravya_pms_views', JSON.stringify(INITIAL_VIEWS));
    return INITIAL_VIEWS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_VIEWS;
  }
}

export function saveMockViews(views) {
  localStorage.setItem('pravya_pms_views', JSON.stringify(views));
}

export function generateToken(title, company) {
  const cleanTitle = (company || title || 'proposal')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanTitle}-${randomSuffix}`;
}
