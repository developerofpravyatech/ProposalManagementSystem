import React, { useState, useEffect, useRef } from 'react';
import { Save, Building2, Users, Globe, MapPin, Mail, Phone, FileText, Sparkles, Plus, Trash2, Upload, Image, Palette } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { companyProfileApi } from '../api/companyProfileApi';
import { useToast } from '../context/ToastContext';

function LabeledField({ label, value, onChange, type = 'text', rows, placeholder }) {
  return type === 'textarea' ? (
    <Textarea label={label} value={value || ''} onChange={onChange} rows={rows || 3} placeholder={placeholder} />
  ) : (
    <Input label={label} type={type} value={value || ''} onChange={onChange} placeholder={placeholder} />
  );
}

function ArrayField({ label, items, onChange, placeholder = 'Enter item...' }) {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    if (inputValue.trim()) {
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addItem} />
      </div>
      {items.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-700">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-rose-500 hover:text-rose-700 p-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function KeyValueArrayField({ label, items, onChange, placeholder = 'Enter title...' }) {
  const [titleValue, setTitleValue] = useState('');
  const [descValue, setDescValue] = useState('');

  const addItem = () => {
    if (titleValue.trim()) {
      onChange([...items, { title: titleValue.trim(), description: descValue.trim() }]);
      setTitleValue('');
      setDescValue('');
    }
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input placeholder={placeholder} value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />
        <Input placeholder="Description" value={descValue} onChange={(e) => setDescValue(e.target.value)} />
        <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addItem} />
      </div>
      {items.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {items.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{item.title || item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {typeof item === 'object' && item.description && (
                <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompanySettingsPage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await companyProfileApi.getCompanyProfile();
      setProfile(data);
    } catch (err) {
      addToast('Failed to load company profile', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companyProfileApi.updateCompanyProfile(profile);
      addToast('Company profile saved successfully', 'success');
    } catch (err) {
      addToast('Failed to save company profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <div className="text-center py-12 text-slate-500">Loading company profile...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            Company Profile Settings
          </h1>
          <p className="text-xs text-slate-600 font-medium">Configure PRAVYA TECH's company details, values, services, and clients</p>
        </div>
        <Button variant="primary" icon={Save} isLoading={saving} onClick={handleSave}>
          Save All Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Company Identity
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name" value={profile.company_name || ''} onChange={(e) => handleInputChange('company_name', e.target.value)} />
            <Input label="Tagline" value={profile.tagline || ''} onChange={(e) => handleInputChange('tagline', e.target.value)} />
            <Input label="Email" type="email" value={profile.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
            <Input label="Phone" value={profile.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
            <Input label="Website" value={profile.website || ''} onChange={(e) => handleInputChange('website', e.target.value)} />
            <Input label="Sales Head Name" value={profile.sales_head_name || ''} onChange={(e) => handleInputChange('sales_head_name', e.target.value)} />
            <Input label="Sales Head Title" value={profile.sales_head_title || ''} onChange={(e) => handleInputChange('sales_head_title', e.target.value)} />
          </div>
          <Textarea label="Address / Office Location" value={profile.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} />
         </Card>

        {/* Logo & Brand */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Image className="w-5 h-5 text-brand-600" />
              Company Logo & Brand
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Company Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                  {profile.logo_data ? (
                    <img src={profile.logo_data} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : profile.logo_url ? (
                    <img src={profile.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Image className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          handleInputChange('logo_data', ev.target.result);
                          handleInputChange('logo_url', '');
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-500">PNG, JPG, SVG (max 2MB)</p>
                </div>
              </div>
            </div>

            <Input
              label="Or enter logo URL"
              placeholder="https://example.com/logo.png"
              value={profile.logo_url || ''}
              onChange={(e) => handleInputChange('logo_url', e.target.value)}
            />
          </div>
        </Card>

        {/* Theme Customizer */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-600" />
              Theme Colors & Custom Icons
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Customize brand colors displayed across the PDF and client portal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={profile.primary_color || '#4F46E5'}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
                />
                <Input
                  value={profile.primary_color || ''}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  placeholder="#4F46E5"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={profile.secondary_color || '#0F172A'}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
                />
                <Input
                  value={profile.secondary_color || ''}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  placeholder="#0F172A"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={profile.accent_color || '#10B981'}
                  onChange={(e) => handleInputChange('accent_color', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
                />
                <Input
                  value={profile.accent_color || ''}
                  onChange={(e) => handleInputChange('accent_color', e.target.value)}
                  placeholder="#10B981"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Custom Icon Set</label>
            <p className="text-[11px] text-slate-500">Configure SVG icon paths for document sections (optional).</p>
            <ArrayField
              label="Icon Mappings (e.g. section:icon-name)"
              items={profile.theme_config || []}
              onChange={(val) => handleInputChange('theme_config', val)}
              placeholder="services:Cpu, mission:Sparkles, clients:Building2"
            />
          </div>
        </Card>

        {/* Mission & Vision */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display">Mission & Vision</h2>
          </div>
          <Textarea label="Mission Statement" value={profile.mission || ''} onChange={(e) => handleInputChange('mission', e.target.value)} rows={4} />
          <Textarea label="Vision Statement" value={profile.vision || ''} onChange={(e) => handleInputChange('vision', e.target.value)} rows={4} />
        </Card>

        {/* Core Values */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              Core Values
            </h2>
          </div>
          <KeyValueArrayField
            label="Core Values"
            items={profile.core_values || []}
            onChange={(val) => handleInputChange('core_values', val)}
            placeholder="e.g. Integrity"
          />
        </Card>

        {/* Services */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" />
              Our Services
            </h2>
          </div>
          <KeyValueArrayField
            label="Services"
            items={profile.services || []}
            onChange={(val) => handleInputChange('services', val)}
            placeholder="e.g. Design & Illustration"
          />
        </Card>

        {/* Clients */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Top Clients
            </h2>
          </div>
          <ArrayField
            label="BNI Members & Regional Partners"
            items={profile.bni_clients || []}
            onChange={(val) => handleInputChange('bni_clients', val)}
            placeholder="e.g. Shree Cement"
          />
          <ArrayField
            label="International Partners"
            items={profile.international_clients || []}
            onChange={(val) => handleInputChange('international_clients', val)}
            placeholder="e.g. TechFlow Inc. (USA)"
          />
        </Card>

        {/* Branch Offices */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              Branch Offices
            </h2>
          </div>
          <ArrayField
            label="Branch Offices"
            items={profile.branch_offices || []}
            onChange={(val) => handleInputChange('branch_offices', val)}
            placeholder="e.g. Rajkot - 150ft Rd, Gujarat, India"
          />
        </Card>

        {/* Terms */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display">Terms & Conditions</h2>
          </div>
          <Textarea label="General Terms" value={profile.terms || ''} onChange={(e) => handleInputChange('terms', e.target.value)} rows={6} placeholder="One term per line" />
        </Card>

        <div className="flex justify-end pt-4">
          <Button variant="primary" icon={Save} isLoading={saving} type="submit">
            Save Company Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
