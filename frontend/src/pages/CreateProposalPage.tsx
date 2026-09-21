import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Settings
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { LineItemForm } from '../components/admin/LineItemForm';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';
import { ProposalType } from '../types';

export function CreateProposalPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proposal Form State
  const [proposalType, setProposalType] = useState<ProposalType>('quotation_proposal');
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

  const buildProposalContent = () => ({
    cover: {
      project_title: projectTitle,
      cover_tagline: projectSubtitle || (proposalType === 'profile_only' ? 'PRAVYA TECH Company Profile & Digital Capabilities' : ''),
      client_name: clientName,
      client_designation: 'Executive Director',
      client_website: companyName,
      prepared_by_name: 'PRAVYA TECH Team',
      prepared_by_designation: 'Sales & Delivery',
      issued_date: new Date().toISOString(),
      valid_till: renewalDate,
    },
    cover_letter: {
      recipient_name: clientName,
      recipient_designation: 'Director',
      letter_date: new Date().toISOString(),
      proposal_introduction: `Thank you for considering PRAVYA TECH for ${projectTitle}. We look forward to building a lasting partnership.`,
    },
    company_profile: {
      positioning: 'A Creative, Strategic & Accountable Design Agency.',
      vision: 'To become a global leader in mobile-first technology by empowering businesses and individuals with innovative, intuitive, and impactful digital solutions.',
      mission: 'At PRAVYA Tech, our mission is to design and develop smart, scalable, and user-centric mobile and web applications that solve real-world problems. We strive to deliver high-quality tech solutions with a focus on simplicity, speed, and seamless user experience—enabling our clients to grow, connect, and thrive in the digital age.',
      core_values: [
        { title: 'Customers First', description: 'Client outcomes guide every decision.' },
        { title: 'Act with Integrity', description: 'We earn trust through transparent work.' },
        { title: 'Great Teamwork', description: 'Shared ownership produces better outcomes.' },
        { title: 'Focus on Solutions', description: 'We turn constraints into practical progress.' },
      ],
    },
    services: {
      positioning: 'We help ambitious teams turn ideas into reliable digital products.',
    },
    process: {
      intro: 'We work with clients to develop the right strategy from the very first stage to the last stage.',
    },
    terms_sections: {
      payment_terms: ['50% Advanced', '50% Immediately After Deployment', '18% GST will be applicable as per government regulations.'],
      annual_maintenance_contract: ['25% of project value as per bill.', 'AMC applies when existing features are not working or technical bugs occur.', 'New features and requirements are not included in AMC.'],
      services_limitations: ['PRAVYA TECH is not liable for issues occurring in integrated third-party services.'],
      exclusions: ['Anything not specified in the approved specification and demo system.', 'Third-party software and API integrations not specifically mentioned.', 'Cloud hosting charges.', 'Future updates in App, Web, or Software.'],
      client_side_support: ['One decision-maker is required from the client side.'],
      project_cancellation: ['Payment is non-refundable once work has started from PRAVYA TECH side.'],
    },
    clients: {
      bni: ['Shree Cement', 'Adani Group', 'Reliance Industries', 'Tata Consultancy Services', 'Infosys', 'Wipro'],
      international: ['TechFlow Inc. (USA)', 'EuroTech Solutions (Germany)', 'Asia Pacific Digital (Singapore)', 'UK Digital Labs (London)', 'Canada Tech Ventures (Toronto)'],
    },
    pricing: {
      items: lineItems.map((item) => ({
        name: item.title,
        description: [item.description || ''],
        price: `${currencySymbols[currency] || ''}${Number(item.subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        unit: contractDuration,
      })),
      currency,
      note: `Total investment: ${currencySymbols[currency] || ''}${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`,
    },
    payment_methods: {
      upi_id: 'PRAVYA2618@OKSBI',
      bank_name: 'STATE BANK OF INDIA',
      account_number: '40410281486',
      branch_name: 'Rajkot',
      ifsc: 'SBIN0001851',
    },
    acceptance: {
      text: 'By signing this document, the client confirms acceptance of the quote and authorizes PRAVYA TECH to commence the project.',
      additional_work_clause: 'Additional work outside the agreed scope may require a separate quotation and written approval.',
    },
    branches: [
      { branch_name: 'PRAVYA TECH (MAIN BRANCH)', address: '618 Level 6, 150 Feet Ring Road, Opp. Imperial Heights, Rajkot 360005.', phone: '+91 898 0000 196', email: 'talk@pravyatech.com', website: 'www.pravyatech.com' },
      { branch_name: 'PRAVYA TECH (SECOND BRANCH)', address: 'Rajkot, Gujarat, India', phone: '+91 898 0000 196', email: 'talk@pravyatech.com', website: 'www.pravyatech.com' },
      { branch_name: 'PRAVYA TECH (CALIFORNIA)', address: 'Fremont, California, USA', phone: '+1 408 507 6353', email: 'talk@pravyatech.com', website: 'www.pravyatech.com' },
    ],
    closing_statement: 'Take your business to the next level.',
  });

  const handleSubmit = async (e?: React.FormEvent) => {
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
      const mappedLineItems = lineItems.map(item => ({
        name: item.title,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.subtotal,
      }));
      
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
        line_items: proposalType === 'quotation_proposal' ? mappedLineItems : [],
        content: buildProposalContent(),
      };

      const created = await proposalApi.createProposal(payload);
      addToast(`Proposal #${created.proposal_no} generated!`, 'success');
      addToast('Generating official PDF package...', 'info');
      try {
        await proposalApi.generatePdf(created.id);
        addToast(`PDF ready for Proposal #${created.proposal_no}`, 'success');
      } catch {
        addToast('Proposal created (PDF can be regenerated)', 'success');
      }
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

        <button
          onClick={() => navigate('/admin/company-settings')}
          className="text-xs text-slate-500 hover:text-brand-600 font-bold flex items-center gap-1.5 mb-2 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" /> Company Settings
        </button>

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
                setStep(2);
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
      {step === 3 && proposalType === 'quotation_proposal' && (
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

