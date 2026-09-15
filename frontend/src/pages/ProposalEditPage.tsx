import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input, Textarea } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LineItemForm } from '../components/admin/LineItemForm';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';
import { ProposalType } from '../types';

export function ProposalEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadProposal = async () => {
    try {
      const data = await proposalApi.getProposalById(id);
      setProposal(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposal();
  }, [id]);

  const handleSave = async () => {
    if (!proposal) return;
    setSaving(true);
    try {
      await proposalApi.updateProposal(id, proposal);
      addToast('Proposal updated successfully', 'success');
      navigate(`/admin/proposals/${id}`);
    } catch (err) {
      addToast(err.message || 'Failed to update proposal', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setProposal((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateContentField = (path: string, value: any) => {
    setProposal((prev: any) => {
      const content = { ...(prev.content || {}) };
      const coverLetter = { ...(content.cover_letter || {}) };
      const keys = path.split('.');
      let target: any = coverLetter;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        target[key] = { ...(target[key] || {}) };
        target = target[key];
      }
      target[keys[keys.length - 1]] = value;
      return { ...prev, content: { ...content, cover_letter: coverLetter } };
    });
  };

  const coverLetter = proposal?.content?.cover_letter || {};

  const letterBodyLines = Array.isArray(coverLetter.letter_body) ? coverLetter.letter_body : (coverLetter.letter_body ? [coverLetter.letter_body] : ['']);

  const updateLetterBody = (lines: string[]) => {
    updateContentField('letter_body', lines.filter(l => l.trim()));
  };

  const addLetterBodyLine = () => {
    updateLetterBody([...letterBodyLines, '']);
  };

  const updateLetterBodyLine = (index: number, value: string) => {
    const newLines = [...letterBodyLines];
    newLines[index] = value;
    updateLetterBody(newLines);
  };

  const removeLetterBodyLine = (index: number) => {
    updateLetterBody(letterBodyLines.filter((_, i) => i !== index));
  };

  const companyProfile = proposal?.content?.company_profile || {};

  const updateCompanyField = (field: string, value: any) => {
    updateContentField('company_profile.' + field, value);
  };

  const coreValues = Array.isArray(companyProfile.core_values) ? companyProfile.core_values : [];

  const updateCoreValue = (index: number, field: string, value: string) => {
    const newValues = [...coreValues];
    newValues[index] = { ...newValues[index], [field]: value };
    updateCompanyField('core_values', newValues);
  };

  const addCoreValue = () => {
    updateCompanyField('core_values', [...coreValues, { title: '', description: '' }]);
  };

  const removeCoreValue = (index: number) => {
    updateCompanyField('core_values', coreValues.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-slate-600 font-bold">Loading proposal...</div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-4">
          <p className="text-slate-500">{error || 'Proposal not found'}</p>
          <Button variant="secondary" onClick={() => navigate('/admin/proposals')}>
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  const isQuotation = proposal.type === 'quotation_proposal';

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'INR', label: 'INR (₹)' },
    { value: 'AED', label: 'AED (د.إ)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
  ];

  const durationOptions = [
    { value: '3 Months', label: '3 Months' },
    { value: '6 Months', label: '6 Months' },
    { value: '12 Months', label: '12 Months' },
    { value: '24 Months', label: '24 Months' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(`/admin/proposals/${id}`)} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              Edit {proposal.proposal_no || `Proposal #${proposal.id}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">Update proposal details</p>
          </div>
        </div>
        <Button variant="primary" icon={Save} isLoading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setStep(1)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${step === 1 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
          General Info
        </button>
        {isQuotation && (
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-bold">›</span>
            <button onClick={() => setStep(2)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${step === 2 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              Commercials
            </button>
          </div>
        )}
      </div>

      {/* Step 1: General Information */}
      <Card className="p-6 bg-white space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-black text-slate-900 font-display">General Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Client Name"
            required
            value={proposal.client_name || ''}
            onChange={(e) => updateField('client_name', e.target.value)}
          />
          <Input
            label="Company Name"
            value={proposal.company_name || ''}
            onChange={(e) => updateField('company_name', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={proposal.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
          />
          <Input
            label="Phone"
            value={proposal.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
          />
        </div>

        <div className="border-t border-slate-200 pt-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Proposal Number"
            value={proposal.proposal_no || ''}
            onChange={(e) => updateField('proposal_no', e.target.value)}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Type</label>
            <select
              value={proposal.type || 'profile_only'}
              onChange={(e) => updateField('type', e.target.value)}
              disabled={true}
              className="w-full rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none cursor-not-allowed"
            >
              <option value="profile_only">Company Profile</option>
              <option value="quotation_proposal">Project Quotation</option>
            </select>
          </div>
          <Input
            label="Project Title"
            value={proposal.project_title || ''}
            onChange={(e) => updateField('project_title', e.target.value)}
          />
          <Input
            label="Project Subtitle"
            value={proposal.project_subtitle || ''}
            onChange={(e) => updateField('project_subtitle', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Status</label>
            <select
              value={proposal.status || 'sent'}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
            >
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="accepted">Accepted</option>
              <option value="renewal_due">Renewal Due</option>
              <option value="renewed">Renewed</option>
            </select>
          </div>
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={proposal.amount || ''}
            onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
          />
          <Select
            label="Currency"
            options={currencyOptions}
            value={proposal.currency || 'USD'}
            onChange={(e) => updateField('currency', e.target.value)}
          />
        </div>

        {isQuotation && (
          <>
            <div className="border-t border-slate-200 pt-4" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Contract Duration"
                options={durationOptions}
                value={proposal.contract_duration || '12 Months'}
                onChange={(e) => updateField('contract_duration', e.target.value)}
              />
              <Input
                label="Renewal Date"
                type="date"
                value={proposal.renewal_date ? proposal.renewal_date.split('T')[0] : ''}
                onChange={(e) => updateField('renewal_date', e.target.value)}
              />
              <Select
                label="Currency"
                options={currencyOptions}
                value={proposal.currency || 'USD'}
                onChange={(e) => updateField('currency', e.target.value)}
              />
            </div>
          </>
        )}

        <Textarea
          label="Terms & Conditions"
          rows={3}
          value={proposal.terms || ''}
          onChange={(e) => updateField('terms', e.target.value)}
        />

        {/* Cover Letter */}
        <Card className="p-6 bg-white space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display">Cover Letter</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Recipient Name"
              value={coverLetter.recipient_name || ''}
              onChange={(e) => updateContentField('recipient_name', e.target.value)}
            />
            <Input
              label="Recipient Designation"
              value={coverLetter.recipient_designation || ''}
              onChange={(e) => updateContentField('recipient_designation', e.target.value)}
            />
            <Input
              label="Date"
              type="date"
              value={coverLetter.letter_date ? (coverLetter.letter_date.includes('T') ? coverLetter.letter_date.split('T')[0] : coverLetter.letter_date) : ''}
              onChange={(e) => updateContentField('letter_date', e.target.value)}
            />
            <Input
              label="Signer Name"
              value={coverLetter.signer_name || ''}
              onChange={(e) => updateContentField('signer_name', e.target.value)}
            />
            <Input
              label="Signer Designation"
              value={coverLetter.signer_designation || ''}
              onChange={(e) => updateContentField('signer_designation', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Letter Body</label>
            {letterBodyLines.map((line, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <Textarea
                  value={line}
                  onChange={(e) => updateLetterBodyLine(idx, e.target.value)}
                  rows={2}
                  placeholder={`Paragraph ${idx + 1}...`}
                  className="flex-1"
                />
                {letterBodyLines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLetterBodyLine(idx)}
                    className="text-rose-500 hover:text-rose-700 p-2 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" icon={Plus} iconOnly onClick={addLetterBodyLine} className="flex items-center justify-center">
              Add Paragraph
            </Button>
          </div>

          <Textarea
            label="Proposal Introduction"
            rows={3}
            value={coverLetter.proposal_introduction || ''}
            onChange={(e) => updateContentField('proposal_introduction', e.target.value)}
            placeholder="Short introduction to the enclosed proposal..."
          />
        </Card>
      </Card>

      {/* Company Profile */}
      <Card className="p-6 bg-white space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-black text-slate-900 font-display">Company Profile</h2>
        </div>

        <Textarea
          label="Positioning"
          rows={2}
          value={companyProfile.positioning || ''}
          onChange={(e) => updateCompanyField('positioning', e.target.value)}
          placeholder="A Creative, Strategic & Accountable Design Agency."
        />

        <Textarea
          label="Vision"
          rows={2}
          value={companyProfile.vision || ''}
          onChange={(e) => updateCompanyField('vision', e.target.value)}
          placeholder="To become a global leader in mobile-first technology..."
        />

        <Textarea
          label="Mission"
          rows={4}
          value={companyProfile.mission || ''}
          onChange={(e) => updateCompanyField('mission', e.target.value)}
          placeholder="At PRAVYA Tech, our mission is to..."
        />

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Core Values</label>
          {coreValues.map((val, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={val.title || ''}
                  onChange={(e) => updateCoreValue(idx, 'title', e.target.value)}
                  placeholder="Value title (e.g. Customers First)"
                  className="flex-1"
                />
                {coreValues.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCoreValue(idx)}
                    className="text-rose-500 hover:text-rose-700 p-2 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Input
                value={val.description || ''}
                onChange={(e) => updateCoreValue(idx, 'description', e.target.value)}
                placeholder="Description"
              />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" icon={Plus} iconOnly onClick={addCoreValue} className="flex items-center justify-center">
            Add Core Value
          </Button>
        </div>
      </Card>

      {/* Step 2: Line Items (Quotation Only) */}
      {isQuotation && (
        <Card className="p-6 bg-white space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display">Line Items & Pricing</h2>
          </div>

          {proposal.line_items && Array.isArray(proposal.line_items) && proposal.line_items.length > 0 ? (
            <>
              <LineItemForm
                lineItems={proposal.line_items.map((item: any, idx: number) => ({
                  ...item,
                  id: item.id || idx + 1,
                  title: item.title || item.description || '',
                  description: item.description || '',
                  quantity: item.quantity || 1,
                  unit_price: item.unit_price || 0,
                  subtotal: item.subtotal || (item.quantity || 1) * (item.unit_price || 0),
                }))}
                onChange={(items) => updateField('line_items', items)}
                currency={proposal.currency || 'USD'}
                onCurrencyChange={(c) => updateField('currency', c)}
                contractDuration={proposal.contract_duration || '12 Months'}
                onDurationChange={(d) => updateField('contract_duration', d)}
                renewalDate={proposal.renewal_date}
                onRenewalDateChange={(d) => updateField('renewal_date', d)}
              />
            </>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>No line items yet. Add them using the form below.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
