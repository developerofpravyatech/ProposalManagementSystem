import React, { useState } from 'react';
import { 
  Building2, 
  Code2, 
  Layers, 
  ShieldCheck, 
  Award, 
  Users, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  FileCheck, 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  ChevronRight,
  Zap,
  Lock,
  Compass
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { PricingTable } from './PricingTable';
import { Button } from '../common/Button';

export function DocumentViewer({ proposal, onOpenAcceptModal }) {
  const [activeSection, setActiveSection] = useState('cover');
  const isQuotation = proposal.proposal_type === 'quotation';
  const isAccepted = proposal.status === 'accepted';

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
        { id: 'about', label: '2. About PRAVYA TECH' },
        { id: 'services', label: '3. Enterprise Services' },
        { id: 'process', label: '4. Delivery Methodology' },
        { id: 'cases', label: '5. Case Studies' },
        { id: 'stack', label: '6. Technology Stack' },
        { id: 'contact', label: '7. Contact & Branches' },
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
      <div className="sticky top-16 z-20 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg overflow-x-auto flex items-center gap-1">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === sec.id
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* 1. Cover Hero Section */}
      <section id="cover" className="relative rounded-3xl overflow-hidden glass-card p-8 sm:p-14 border border-white/10 mesh-bg">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Badge type={proposal.proposal_type} />
            <span className="text-xs font-mono text-slate-400">Ref: {proposal.proposal_number}</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-400">
              {isQuotation ? 'Exclusive Project Quotation & Delivery Plan' : 'Corporate Capabilities & Company Profile'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
              {proposal.project_title}
            </h1>
            {proposal.project_subtitle && (
              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                {proposal.project_subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block uppercase tracking-wider font-semibold">Prepared For</span>
              <p className="text-white font-bold text-base mt-0.5">{proposal.company_name}</p>
              <p className="text-slate-300">{proposal.client_name} {proposal.email && `(${proposal.email})`}</p>
            </div>
            <div>
              <span className="text-slate-400 block uppercase tracking-wider font-semibold">Prepared By</span>
              <p className="text-white font-bold text-base mt-0.5">PRAVYA TECH Solutions</p>
              <p className="text-slate-300">Engineering & Cloud Architecture Division</p>
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
              <Compass className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white font-display">Executive Summary & Objectives</h2>
            </div>
            <Card className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                PRAVYA TECH is pleased to present this custom architectural proposal and quotation to <strong className="text-white">{proposal.company_name}</strong>. Our mission is to engineer high-resilience, enterprise-grade digital systems engineered for long-term scalability, low operational overhead, and airtight security.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">High Velocity</h4>
                  <p className="text-xs text-slate-400">Iterative agile sprint cycles with continuous staging previews.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Zero Vulnerability</h4>
                  <p className="text-xs text-slate-400">Strict OWASP compliance, RBAC, and encrypted transmission.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <Cpu className="w-5 h-5 text-brand-400" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Modern Stack</h4>
                  <p className="text-xs text-slate-400">PostgreSQL 16, FastAPI, React 18, and Dockerized microservices.</p>
                </div>
              </div>
            </Card>
          </section>

          {/* 3. Scope & Deliverables */}
          <section id="scope" className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white font-display">Scope of Work & Deliverables</h2>
            </div>
            <Card className="space-y-3">
              {(proposal.line_items || proposal.lineItems || []).map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </Card>
          </section>

          {/* 4. Technical Architecture */}
          <section id="architecture" className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white font-display">Technical Solution & Architecture</h2>
            </div>
            <Card className="space-y-4 text-sm text-slate-300">
              <p>
                The solution will be structured into decoupled layers allowing seamless maintenance and future horizontal scaling:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-brand-400 font-mono font-bold block mb-1">FRONTEND LAYER</span>
                  <p className="text-slate-400">React + Vite SPA with TailwindCSS, dynamic state management, and mobile-optimized responsiveness.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-cyan-400 font-mono font-bold block mb-1">BACKEND API LAYER</span>
                  <p className="text-slate-400">High-performance async FastAPI endpoints with Pydantic v2 validation and JWT role-based security.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-emerald-400 font-mono font-bold block mb-1">DATABASE & STORAGE</span>
                  <p className="text-slate-400">PostgreSQL with connection pooling, automated backups, and encrypted sensitive parameters.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-amber-400 font-mono font-bold block mb-1">DEVOPS & MONITORING</span>
                  <p className="text-slate-400">Docker containerization, CI/CD automated test verification, and Prometheus health checks.</p>
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
              <Lock className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white font-display">Service Level Agreement & Warranty</h2>
            </div>
            <Card className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <ul className="space-y-2 list-disc list-inside">
                <li><strong className="text-white">Bug Warranty:</strong> 90 days comprehensive post-launch warranty covering any defects or regressions at zero additional cost.</li>
                <li><strong className="text-white">IP Ownership:</strong> All custom code, database schemas, and documentation become 100% the intellectual property of {proposal.company_name} upon settlement of final milestone.</li>
                <li><strong className="text-white">Confidentiality:</strong> Strict non-disclosure protection for all proprietary client data, business logic, and operational assets.</li>
                <li><strong className="text-white">Renewal & Annual Maintenance:</strong> Ongoing support agreements can be renewed seamlessly upon contract anniversary date ({proposal.renewal_date || 'Annual'}).</li>
              </ul>
            </Card>
          </section>

          {/* 7. Client Sign-off */}
          <section id="signoff" className="space-y-4">
            <Card className="border-brand-500/30 bg-gradient-to-b from-brand-950/20 to-slate-900/80 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30 shadow-glow-brand">
                {isAccepted ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Sparkles className="w-6 h-6" />}
              </div>

              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-xl font-bold text-white font-display">
                  {isAccepted ? 'Quotation Accepted & Signed' : 'Ready to Proceed?'}
                </h3>
                <p className="text-xs text-slate-400">
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold shadow-glow-emerald">
                  <CheckCircle2 className="w-4 h-4" /> Agreement Confirmed & Archived
                </div>
              )}
            </Card>
          </section>
        </>
      )}

      {/* MODE A CONTENT (Company Profile Showcase) */}
      {!isQuotation && (
        <>
          {/* About PRAVYA TECH */}
          <section id="about" className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white font-display">About PRAVYA TECH</h2>
            </div>
            <Card className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>PRAVYA TECH</strong> is a premier technology consulting and digital engineering firm specializing in bespoke software architecture, multi-tenant cloud ecosystems, and AI integrations. We partner with forward-thinking enterprises to modernize legacy stacks and build high-performance products.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-3xl font-extrabold text-brand-400 font-display">99.9%</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Production Uptime</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-3xl font-extrabold text-cyan-400 font-display">40+</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Enterprise Deployments</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-3xl font-extrabold text-emerald-400 font-display">100%</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Client Retention</div>
                </div>
              </div>
            </Card>
          </section>

          {/* Enterprise Services */}
          <section id="services" className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white font-display">Core Capabilities & Services</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center border border-brand-500/30">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Custom Enterprise Software</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored web applications, ERP/CRM suites, and microservice architectures built for high concurrency.
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Cloud & DevOps Engineering</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Infrastructure as Code (Terraform), multi-region AWS/GCP clusters, and zero-downtime CI/CD pipelines.
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Security & Code Quality Audits</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Comprehensive vulnerability penetration testing, OWASP adherence, and code security sanitization.
                </p>
              </Card>
              <Card className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">AI & Data Pipelines</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Vector search implementations, LLM agent integration, automated ETL workflows, and real-time telemetry.
                </p>
              </Card>
            </div>
          </section>

          {/* Delivery Process */}
          <section id="process" className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white font-display">Our 5-Stage Delivery Methodology</h2>
            </div>
            <Card className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-brand-400 font-mono text-xs font-bold block">01. DISCOVER</span>
                  <p className="text-[11px] text-slate-400 mt-1">Requirements analysis and system architecture map.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-cyan-400 font-mono text-xs font-bold block">02. PROTOTYPE</span>
                  <p className="text-[11px] text-slate-400 mt-1">Figma design systems and interactive UI prototypes.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-emerald-400 font-mono text-xs font-bold block">03. SPRINT</span>
                  <p className="text-[11px] text-slate-400 mt-1">2-week agile development sprints with live previews.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-amber-400 font-mono text-xs font-bold block">04. QA & TEST</span>
                  <p className="text-[11px] text-slate-400 mt-1">Automated test suites, security scans, and UAT.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-blue-400 font-mono text-xs font-bold block">05. DEPLOY</span>
                  <p className="text-[11px] text-slate-400 mt-1">Cloud launch, DNS handover, and 24/7 SLA monitoring.</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Contact Details */}
          <section id="contact" className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white font-display">Get in Touch</h2>
            </div>
            <Card className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-semibold">Official Email</span>
                  <span className="text-white font-mono">contact@pravyatech.com</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-semibold">Direct WhatsApp</span>
                  <span className="text-white font-mono">+91 98765 43210</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-semibold">Global Operations</span>
                  <span className="text-white">Bangalore • Dubai • London</span>
                </div>
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
