import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ShieldCheck
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
  const [proposalType, setProposalType] = useState('quotation_proposal'); // 'profile_only' or 'quotation_proposal'
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
    if (proposalType === 'profile_only') return 0;
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
        type: proposalType,
        client_name: clientName,
        company_name: companyName,
        phone,
        email,
        project_title: projectTitle,
        project_subtitle: projectSubtitle || (proposalType === 'profile_only' ? 'PRAVYA TECH Company Profile & Credentials' : ''),
        amount: calculateTotal(),
        currency,
        currency_symbol: currencySymbols[currency] || '$',
        contract_duration: proposalType === 'quotation_proposal' ? contractDuration : 'N/A',
        renewal_date: proposalType === 'quotation_proposal' ? renewalDate : null,
        line_items: proposalType === 'quotation_proposal' ? lineItems : [],
        terms: proposalType === 'quotation_proposal' ? terms : null,
      };

      const created = await proposalApi.createProposal(payload);
      addToast(`Proposal #${created.proposal_no} generated successfully!`, 'success');
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
            className="text-xs text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Proposals
          </button>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Proposal Creation Wizard
          </h1>
          <p className="text-xs text-slate-600 font-medium">
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
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : step > s
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
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
            <h2 className="text-lg font-black text-slate-900 font-display">Select Proposal Document Type</h2>
            <p className="text-xs text-slate-600 font-medium">Choose between introducing PRAVYA TECH or pitching a custom project quotation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Mode A: Company Profile */}
            <Card
              hover
              onClick={() => {
                setProposalType('profile_only');
                if (!projectTitle) setProjectTitle('PRAVYA TECH — Corporate Profile & Digital Capabilities');
              }}
              className={`space-y-4 border-2 transition-all bg-white shadow-sm ${
                proposalType === 'profile_only'
                  ? 'border-slate-900 bg-slate-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-brand-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mode A</span>
                <h3 className="text-lg font-bold text-slate-900">Company Profile & Capabilities</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Fixed 9-page PRAVYA TECH corporate deck with case studies, tech stack, and service offerings. Perfect for new leads and initial discovery.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold flex items-center gap-1.5 text-slate-800">
                <ShieldCheck className="w-4 h-4 text-brand-600" /> Standard 9-Page Showcase
              </div>
            </Card>

            {/* Mode B: Project Proposal & Quotation */}
            <Card
              hover
              onClick={() => {
                setProposalType('quotation_proposal');
                if (projectTitle === 'PRAVYA TECH — Corporate Profile & Digital Capabilities') setProjectTitle('');
              }}
              className={`space-y-4 border-2 transition-all bg-white shadow-sm ${
                proposalType === 'quotation_proposal'
                  ? 'border-brand-600 bg-brand-50/30 shadow-md shadow-brand-600/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-600/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Mode B</span>
                <h3 className="text-lg font-bold text-slate-900">Custom Project Proposal & Quotation</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Dynamic 12-page quotation package with customizable deliverables, line items, pricing, contract renewal dates, and digital sign-off.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold flex items-center gap-1.5 text-brand-700">
                <ShieldCheck className="w-4 h-4 text-brand-600" /> Dynamic 12-Page Quotation with Sign-off
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
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display">Client & Engagement Information</h2>
            <p className="text-xs text-slate-500 font-medium">Enter recipient details for personalized tokenized access.</p>
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

          <div className="space-y-4 pt-2 border-t border-slate-200">
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

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
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
                if (proposalType === 'profile_only') {
                  handleSubmit();
                } else {
                  setStep(3);
                }
              }}
            >
              {proposalType === 'profile_only' ? 'Generate Company Profile' : 'Configure Commercials'}
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: COMMERCIALS & LINE ITEMS (Mode B Only) */}
      {step === 3 && proposalType === 'quotation' && (
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display">Commercials, Deliverables & Contract Terms</h2>
            <p className="text-xs text-slate-500 font-medium">Configure structured pricing items and automated renewal dates.</p>
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

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
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
