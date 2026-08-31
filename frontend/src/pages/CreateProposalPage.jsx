import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Send,
  Calendar
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { LineItemForm } from '../components/admin/LineItemForm';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';

export function CreateProposalPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proposal Form State
  const [proposalType, setProposalType] = useState('quotation'); // 'profile' or 'quotation'
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSubtitle, setProjectSubtitle] = useState('');

  // Mode B Commercials
  const [currency, setCurrency] = useState('USD');
  const [contractDuration, setContractDuration] = useState('12 Months');
  const [renewalDate, setRenewalDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });
  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [terms, setTerms] = useState(
    '50% upfront upon project kickoff, 30% upon staging milestone approval, 20% on final production sign-off. Proposal valid for 30 days.'
  );

  const [lineItems, setLineItems] = useState([
    {
      id: 1,
      title: 'Full-Stack Architecture & Cloud Deployment',
      description: 'Production FastAPI backend, React web portal, and PostgreSQL multi-tenant database.',
      quantity: 1,
      unit_price: 12500,
      subtotal: 12500,
    },
    {
      id: 2,
      title: 'UI/UX Design System & Mobile Optimization',
      description: 'Custom glassmorphism design system, responsive breakpoints, and micro-interactions.',
      quantity: 1,
      unit_price: 4500,
      subtotal: 4500,
    },
  ]);

  const currencySymbols = {
    USD: '$',
    INR: '₹',
    AED: 'AED ',
    EUR: '€',
    GBP: '£',
  };

  const calculateTotal = () => {
    if (proposalType === 'profile') return 0;
    const rawSubtotal = lineItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    const discount = (rawSubtotal * (Number(discountRate) || 0)) / 100;
    const taxable = rawSubtotal - discount;
    const tax = (taxable * (Number(taxRate) || 0)) / 100;
    return taxable + tax;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!clientName.trim() || !companyName.trim()) {
      addToast('Please provide client and company name', 'error');
      return;
    }
    if (!projectTitle.trim()) {
      addToast('Please enter a project title', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        proposal_type: proposalType,
        client_name: clientName,
        company_name: companyName,
        phone,
        email,
        project_title: projectTitle,
        project_subtitle: projectSubtitle || (proposalType === 'profile' ? 'PRAVYA TECH Company Profile & Credentials' : ''),
        amount: calculateTotal(),
        currency,
        currency_symbol: currencySymbols[currency] || '$',
        contract_duration: proposalType === 'quotation' ? contractDuration : 'N/A',
        renewal_date: proposalType === 'quotation' ? renewalDate : null,
        line_items: proposalType === 'quotation' ? lineItems : [],
        terms: proposalType === 'quotation' ? terms : null,
      };

      const created = await proposalApi.createProposal(payload);
      addToast(`Proposal #${created.proposal_number} generated successfully!`, 'success');
      navigate('/admin/proposals');
    } catch (err) {
      addToast(err.message || 'Failed to create proposal', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/proposals')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Proposals
          </button>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">
            Proposal Creation Wizard
          </h1>
          <p className="text-xs text-slate-400">
            Generate and tokenize a new proposal or company profile in seconds.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s
                  ? 'bg-brand-500 text-white shadow-glow-brand'
                  : step > s
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: MODE SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-white">Select Proposal Document Type</h2>
            <p className="text-xs text-slate-400">Choose between introducing PRAVYA TECH or pitching a custom project quotation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Mode A: Company Profile */}
            <Card
              hover
              onClick={() => {
                setProposalType('profile');
                if (!projectTitle) setProjectTitle('PRAVYA TECH — Corporate Profile & Digital Capabilities');
              }}
              className={`space-y-4 border-2 transition-all ${
                proposalType === 'profile'
                  ? 'border-cyan-500 bg-cyan-950/20 shadow-glow-cyan'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Mode A</span>
                <h3 className="text-lg font-bold text-white">Company Profile & Capabilities</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fixed 9-page PRAVYA TECH corporate deck with case studies, tech stack, and service offerings. Perfect for new leads and initial discovery.
                </p>
              </div>
              <div className="pt-2 text-[11px] text-slate-300 font-semibold flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Standard 9-Page Showcase
              </div>
            </Card>

            {/* Mode B: Project Proposal & Quotation */}
            <Card
              hover
              onClick={() => {
                setProposalType('quotation');
                if (projectTitle === 'PRAVYA TECH — Corporate Profile & Digital Capabilities') setProjectTitle('');
              }}
              className={`space-y-4 border-2 transition-all ${
                proposalType === 'quotation'
                  ? 'border-brand-500 bg-brand-950/20 shadow-glow-brand'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-400 border border-brand-500/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Mode B</span>
                <h3 className="text-lg font-bold text-white">Custom Project Proposal & Quotation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dynamic 12-page quotation package with customizable deliverables, line items, pricing, contract renewal dates, and digital sign-off.
                </p>
              </div>
              <div className="pt-2 text-[11px] text-slate-300 font-semibold flex items-center gap-1.5 text-brand-300">
                <ShieldCheck className="w-4 h-4 text-brand-400" /> Dynamic 12-Page Quotation with Sign-off
              </div>
            </Card>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={() => setStep(2)}
            >
              Proceed to Client Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: CLIENT & PROJECT INFORMATION */}
      {step === 2 && (
        <Card className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white font-display">Client & Engagement Information</h2>
            <p className="text-xs text-slate-400">Enter recipient details for personalized tokenized access.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Recipient / Client Name"
              placeholder="e.g. Sarah Jenkins"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <Input
              label="Client Company Name"
              placeholder="e.g. Acme Global Industries"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <Input
              label="Official Client Email"
              type="email"
              placeholder="sarah@acmeglobal.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="WhatsApp / Phone Number"
              placeholder="+919876543210 (with country code)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-white/10">
            <Input
              label="Project Title"
              placeholder="e.g. Enterprise Cloud Infrastructure & Microservices Migration"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
            />
            <Input
              label="Project Subtitle / Scope Tagline"
              placeholder="e.g. Multi-Tenant Scalable Architecture with Real-Time Analytics"
              value={projectSubtitle}
              onChange={(e) => setProjectSubtitle(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Button
              variant="outline"
              type="button"
              icon={ArrowLeft}
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              type="button"
              icon={ArrowRight}
              onClick={() => {
                if (!clientName || !companyName || !projectTitle) {
                  addToast('Please fill out all required fields', 'error');
                  return;
                }
                if (proposalType === 'profile') {
                  handleSubmit();
                } else {
                  setStep(3);
                }
              }}
            >
              {proposalType === 'profile' ? 'Generate Company Profile' : 'Configure Commercials'}
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: COMMERCIALS & LINE ITEMS (Mode B Only) */}
      {step === 3 && proposalType === 'quotation' && (
        <Card className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white font-display">Commercials, Deliverables & Contract Terms</h2>
            <p className="text-xs text-slate-400">Configure structured pricing items and automated renewal dates.</p>
          </div>

          <LineItemForm
            lineItems={lineItems}
            onChange={setLineItems}
            currency={currency}
            onCurrencyChange={setCurrency}
            taxRate={taxRate}
            onTaxChange={setTaxRate}
            discountRate={discountRate}
            onDiscountChange={setDiscountRate}
            contractDuration={contractDuration}
            onDurationChange={setContractDuration}
            renewalDate={renewalDate}
            onRenewalDateChange={setRenewalDate}
          />

          <Textarea
            label="Invoicing & Milestone Terms"
            rows={3}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Button
              variant="outline"
              type="button"
              icon={ArrowLeft}
              onClick={() => setStep(2)}
            >
              Back to Client Details
            </Button>
            <Button
              variant="primary"
              type="button"
              icon={Sparkles}
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Generate Proposal & Private Link
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
