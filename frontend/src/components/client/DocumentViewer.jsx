import React, { useState } from 'react';
import { 
  Building2, 
  Code2, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  Zap,
  Lock,
  Compass,
  Globe
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { PricingTable } from './PricingTable';
import { Button } from '../common/Button';

export function DocumentViewer({ proposal, companyProfile, onOpenAcceptModal }) {
  const [activeSection, setActiveSection] = useState('cover');
  const isQuotation = proposal.type === 'quotation_proposal';
  const isAccepted = proposal.status === 'accepted';
  const cp = companyProfile || {};
  const companyName = cp.company_name || 'PRAVYA TECH Solutions';
  const tagline = cp.tagline || 'Empowering Businesses Through Technology';
  const email = cp.email || 'contact@pravyatech.com';
  const phone = cp.phone || '+91 98765 43210';
  const website = cp.website || 'www.pravyatech.com';
  const address = cp.address || 'Office: Rajkot, Gujarat, India';
  const salesHead = cp.sales_head_name || 'Rahul Mehta';
  const salesHeadTitle = cp.sales_head_title || 'Founder & CEO';
  const mission = cp.mission || '';
  const vision = cp.vision || '';
  const coreValues = cp.core_values || [];
  const services = cp.services || [];
  const bniClients = cp.bni_clients || [];
  const intlClients = cp.international_clients || [];
  const branchOffices = cp.branch_offices || [];
  const terms = cp.terms || '';

  const sections = isQuotation
    ? [
        { id: 'cover', label: '1. Cover' },
        { id: 'summary', label: '2. Executive Summary' },
        { id: 'scope', label: '3. Scope & Deliverables' },
        { id: 'architecture', label: '4. Technical Solution' },
        { id: 'pricing', label: '5. Commercial Quotation' },
        { id: 'terms', label: '6. SLA & Terms' },
        { id: 'signoff', label: '7. Sign-off' },
      ]
    : [
        { id: 'cover', label: '1. Cover' },
        { id: 'cover-letter', label: '2. Cover Letter' },
        { id: 'mission-vision', label: '3. Mission & Vision' },
        { id: 'services', label: '4. Services' },
        { id: 'process', label: '5. Work Process' },
        { id: 'clients-bni', label: '6. Clients (BNI)' },
        { id: 'clients-intl', label: '7. Clients (Intl)' },
        { id: 'terms', label: '8. Terms' },
        { id: 'back-cover', label: '9. Back Cover' },
      ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Sticky Section Jump Navigator */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md overflow-x-auto flex items-center gap-1">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSection === sec.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* 1. Cover Hero Section */}
      <section id="cover" className="relative rounded-3xl overflow-hidden bg-white p-8 sm:p-14 border border-slate-200 shadow-md mesh-bg">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            {(cp.logo_data || cp.logo_url) ? (
              <img src={cp.logo_data || cp.logo_url} alt={companyName} className="w-10 h-10 rounded-xl object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-950 p-[1px] shadow-sm flex items-center justify-center border border-slate-900">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center font-display font-black text-white text-base">
                  P<span className="text-brand-500">T</span>
                </div>
              </div>
            )}
            <Badge type={proposal.type} />
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Ref: {proposal.proposal_no}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-black text-brand-600">
              {isQuotation ? 'Exclusive Project Quotation & Delivery Plan' : 'Corporate Capabilities & Company Profile'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
              {proposal.project_title}
            </h1>
            {proposal.project_subtitle && (
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                {proposal.project_subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block uppercase tracking-wider font-bold">Prepared For</span>
              <p className="text-slate-900 font-extrabold text-base mt-0.5">{proposal.company_name}</p>
              <p className="text-slate-600 font-medium">{proposal.client_name} {proposal.email && `(${proposal.email})`}</p>
            </div>
            <div>
              <span className="text-slate-400 block uppercase tracking-wider font-bold">Prepared By</span>
              <p className="text-slate-600 font-medium">{companyName}</p>
              <p className="text-slate-600 font-medium">{salesHead} • {salesHeadTitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* MODE B CONTENT */}
      {isQuotation && (
        <>
          {/* 2. Executive Summary */}
          <section id="summary" className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-900 font-display">Executive Summary & Objectives</h2>
            </div>
            <Card className="space-y-4 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 shadow-sm">
              <p>
                PRAVYA TECH is pleased to present this custom architectural proposal and quotation to <strong className="text-slate-900">{proposal.company_name}</strong>. Our mission is to engineer high-resilience, enterprise-grade digital systems engineered for long-term scalability, low operational overhead, and airtight security.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <Zap className="w-5 h-5 text-brand-600" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">High Velocity</h4>
                  <p className="text-xs text-slate-500">Iterative agile sprint cycles with continuous staging previews.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Zero Vulnerability</h4>
                  <p className="text-xs text-slate-500">Strict OWASP compliance, RBAC, and encrypted transmission.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <Cpu className="w-5 h-5 text-slate-900" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Modern Stack</h4>
                  <p className="text-xs text-slate-500">PostgreSQL 16, FastAPI, React 18, and Dockerized microservices.</p>
                </div>
              </div>
            </Card>
          </section>

          {/* 3. Scope & Deliverables */}
          <section id="scope" className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-900 font-display">Scope of Work & Deliverables</h2>
            </div>
            <Card className="space-y-3 bg-white border border-slate-200 shadow-sm">
              {(proposal.line_items || proposal.lineItems || []).map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </Card>
          </section>

          {/* 4. Technical Architecture */}
          <section id="architecture" className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-900 font-display">Technical Solution & Architecture</h2>
            </div>
            <Card className="space-y-4 text-sm text-slate-600 bg-white border border-slate-200 shadow-sm">
              <p>
                The solution will be structured into decoupled layers allowing seamless maintenance and future horizontal scaling:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-brand-600 font-mono font-bold block mb-1">FRONTEND LAYER</span>
                  <p className="text-slate-500">React + Vite SPA with TailwindCSS, dynamic state management, and mobile-optimized responsiveness.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-900 font-mono font-bold block mb-1">BACKEND API LAYER</span>
                  <p className="text-slate-500">High-performance async FastAPI endpoints with Pydantic v2 validation and JWT role-based security.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-emerald-700 font-mono font-bold block mb-1">DATABASE & STORAGE</span>
                  <p className="text-slate-500">PostgreSQL with connection pooling, automated backups, and encrypted sensitive parameters.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-amber-700 font-mono font-bold block mb-1">DEVOPS & MONITORING</span>
                  <p className="text-slate-500">Docker containerization, CI/CD automated test verification, and Prometheus health checks.</p>
                </div>
              </div>
            </Card>
          </section>

          {/* 5. Commercial Quotation & Investment */}
          <section id="pricing" className="space-y-4">
            <PricingTable proposal={proposal} />
          </section>

          {/* 6. SLA & Warranty Terms */}
          <section id="terms" className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-900 font-display">Service Level Agreement & Warranty</h2>
            </div>
            <Card className="space-y-3 text-xs text-slate-600 leading-relaxed bg-white border border-slate-200 shadow-sm">
              <ul className="space-y-2 list-disc list-inside">
                <li><strong className="text-slate-900">Bug Warranty:</strong> 90 days comprehensive post-launch warranty covering any defects or regressions at zero additional cost.</li>
                <li><strong className="text-slate-900">IP Ownership:</strong> All custom code, database schemas, and documentation become 100% the intellectual property of {proposal.company_name} upon settlement of final milestone.</li>
                <li><strong className="text-slate-900">Confidentiality:</strong> Strict non-disclosure protection for all proprietary client data, business logic, and operational assets.</li>
                <li><strong className="text-slate-900">Renewal & Annual Maintenance:</strong> Ongoing support agreements can be renewed seamlessly upon contract anniversary date ({proposal.renewal_date || 'Annual'}).</li>
              </ul>
            </Card>
          </section>

          {/* 7. Client Sign-off */}
          <section id="signoff" className="space-y-4">
            <Card className="border-slate-200 bg-slate-50 p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto border border-brand-200 shadow-sm">
                {isAccepted ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Sparkles className="w-6 h-6" />}
              </div>

              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {isAccepted ? 'Quotation Accepted & Signed' : 'Ready to Proceed?'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isAccepted
                    ? `Formally signed by ${proposal.accepted_by || 'Authorized Representative'} on ${new Date(proposal.accepted_at).toLocaleDateString()}`
                    : 'Approve this proposal digitally to lock in the timeline and initiate project kickoff.'}
                </p>
              </div>

              {!isAccepted ? (
                <Button
                  size="lg"
                  variant="primary"
                  icon={Sparkles}
                  onClick={onOpenAcceptModal}
                  className="mx-auto"
                >
                  Accept & Sign Proposal Now
                </Button>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold shadow-sm">
                  <CheckCircle2 className="w-4 h-4" /> Agreement Confirmed & Archived
                </div>
              )}
            </Card>
          </section>
        </>
      )}

      {/* MODE A CONTENT (9-Page Company Profile) */}
      {!isQuotation && (
        <>
           {/* PAGE 2: Cover Letter */}
           <section id="cover-letter" className="space-y-4">
             <div className="flex items-center gap-2">
               <Mail className="w-5 h-5" style={{ color: cp.primary_color || '#4F46E5' }} />
               <h2 className="text-xl font-bold text-slate-900 font-display">Cover Letter</h2>
             </div>
            <Card className="space-y-4 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 shadow-sm">
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>To:</strong> {proposal.client_name}, {proposal.company_name || ''}</p>
              <p>Dear Sir/Madam,</p>
              <p>
                It is with great pleasure that {companyName} presents this Company Profile for your consideration. 
                As a trusted technology partner, we have consistently delivered innovative solutions that drive business growth 
                and operational excellence for our clients worldwide.
              </p>
              <p>
                At {companyName}, we believe in building lasting partnerships through transparency, technical excellence, 
                and a client-first approach. Our team of seasoned professionals is committed to understanding your unique 
                challenges and crafting solutions that exceed expectations.
              </p>
              <p>We look forward to the opportunity to collaborate with you.</p>
              <div className="pt-4">
                <p>Warm regards,</p>
                <p><strong>{salesHead}</strong></p>
                <p>{salesHeadTitle}, {companyName}</p>
              </div>
            </Card>
          </section>

          {/* PAGE 3: Mission, Vision & Values */}
          <section id="mission-vision" className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: cp.primary_color || '#4F46E5' }} />
              <h2 className="text-xl font-bold text-slate-900 font-display">Mission, Vision & Core Values</h2>
            </div>
            <Card className="space-y-4 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 shadow-sm">
              <div>
                <h3 className="font-bold text-slate-900">Mission</h3>
                <p>{mission || 'To empower businesses with cutting-edge digital solutions.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Vision</h3>
                <p>{vision || 'To be a globally recognized technology partner.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Our {coreValues.length} Core Values</h3>
                {coreValues.length > 0 ? (
                  coreValues.map((val, idx) => (
                    <p key={idx}>{idx + 1}. <strong>{typeof val === 'object' ? val.title : val}:</strong> {typeof val === 'object' ? val.description : ''}</p>
                  ))
                ) : (
                  <p>Loading values...</p>
                )}
              </div>
            </Card>
          </section>

          {/* PAGE 4: Services */}
          <section id="services" className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5" style={{ color: cp.primary_color || '#4F46E5' }} />
              <h2 className="text-xl font-bold text-slate-900 font-display">Our Services</h2>
            </div>
            <Card className="space-y-3 text-sm text-slate-600 bg-white border border-slate-200 shadow-sm">
              {services.length > 0 ? (
                services.map((svc, idx) => (
                  <p key={idx}><strong>{idx + 1}. {typeof svc === 'object' ? svc.title : svc}</strong> — {typeof svc === 'object' ? svc.description : ''}</p>
                ))
              ) : (
                <p>Loading services...</p>
              )}
            </Card>
          </section>

          {/* PAGE 5: Work Process */}
          <section id="process" className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: cp.primary_color || '#4F46E5' }} />
              <h2 className="text-xl font-bold text-slate-900 font-display">Our Work Process</h2>
            </div>
            <Card className="space-y-3 text-sm text-slate-600 bg-white border border-slate-200 shadow-sm">
              <p><strong>Step 01: Discovery</strong> — Understanding your business goals and requirements.</p>
              <p><strong>Step 02: Strategy</strong> — Developing a comprehensive project roadmap.</p>
              <p><strong>Step 03: Design & Development</strong> — Executing with agile sprints and QA checks.</p>
              <p><strong>Step 04: Testing & Review</strong> — Rigorous testing across devices and scenarios.</p>
              <p><strong>Step 05: Launch & Support</strong> — Seamless deployment and ongoing support.</p>
            </Card>
          </section>

           {/* PAGE 6: Top Clients (BNI Members) */}
           <section id="clients-bni" className="space-y-4">
             <div className="flex items-center gap-2">
               <Building2 className="w-5 h-5" style={{ color: cp.primary_color || '#4F46E5' }} />
               <h2 className="text-xl font-bold text-slate-900 font-display">Top Clients Showcase (BNI Members)</h2>
             </div>
            <Card className="space-y-3 text-sm text-slate-600 bg-white border border-slate-200 shadow-sm">
              <p>We are proud to collaborate with leading organizations:</p>
              {bniClients.map((client, idx) => (
                <p key={idx}>• {client}</p>
              ))}
            </Card>
          </section>

          {/* PAGE 7: Top Clients (International) */}
          <section id="clients-intl" className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" style={{ color: cp.primary_color || '#4F46E5' }} />
              <h2 className="text-xl font-bold text-slate-900 font-display">Top Clients Showcase (International)</h2>
            </div>
             <Card className="space-y-3 text-sm text-slate-600 bg-white border border-slate-200 shadow-sm">
              <p>Our reach extends beyond borders:</p>
              {intlClients.map((client, idx) => (
                <p key={idx}>• {client}</p>
              ))}
            </Card>
          </section>

          {/* PAGE 8: General Terms & Conditions */}
          <section id="terms" className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" style={{ color: cp.primary_color || '#4F46E5' }} />
              <h2 className="text-xl font-bold text-slate-900 font-display">General Terms & Conditions</h2>
            </div>
            <Card className="space-y-3 text-sm text-slate-600 bg-white border border-slate-200 shadow-sm">
              <p><strong>Statement of Work</strong></p>
              {terms.split('\n').map((line, idx) => {
                if (!line.trim()) return null;
                if (line.includes('Governing Law')) {
                  const [label, ...rest] = line.split(':');
                  return <p key={idx} className="pt-2"><strong>{label}:</strong> {rest.join(':')}</p>;
                }
                return <p key={idx}>{line}</p>;
              })}
            </Card>
          </section>

          {/* PAGE 9: Back Cover */}
          <section id="back-cover" className="space-y-4">
            <Card className="p-8 text-center space-y-4 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 font-display">{companyName}</h2>
              <p className="text-sm text-slate-600">{tagline}</p>
              <div className="space-y-1 text-xs text-slate-500">
                <p><strong>Branch Offices:</strong></p>
                {branchOffices.map((office, idx) => (
                  <p key={idx}>{office}</p>
                ))}
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p>{email}</p>
                <p>{phone}</p>
                <p>{website}</p>
              </div>
              <p className="text-xs text-slate-400 pt-4">Thank you for considering {companyName} as your technology partner.</p>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
