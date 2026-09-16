import React, { useState, useEffect, useRef } from 'react';
import { Save, Building2, Sparkles, Plus, Trash2, Upload, Image, Palette, X, FileDown } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { companyProfileApi } from '../api/companyProfileApi';
import { useToast } from '../context/ToastContext';
import { IconSelector } from '../components/common/IconSelector';

interface CompanyProfile {
  company_name?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  website?: string;
  sales_head_name?: string;
  sales_head_title?: string;
  mission?: string;
  vision?: string;
  core_values?: Array<{ title: string; description?: string; logo?: string }>;
  services?: Array<{ title: string; description?: string; logo?: string }>;
  bni_clients?: Array<string | { name: string; logo?: string }>;
  international_clients?: Array<string | { name: string; logo?: string }>;
  branch_offices?: Array<string | { name: string; logo?: string }>;
  logo_data?: string;
  logo_url?: string;
  qr_code?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  theme_config?: Record<string, string>;
  terms?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_branch?: string;
  upi_id?: string;
  swift_code?: string;
  iban?: string;
}

function LabeledField({ label, value, onChange, type = 'text', rows, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; rows?: number; placeholder?: string }) {
  return type === 'textarea' ? (
    <Textarea label={label} value={value || ''} onChange={onChange} rows={rows || 3} placeholder={placeholder} />
  ) : (
    <Input label={label} type={type} value={value || ''} onChange={onChange} placeholder={placeholder} />
  );
}

function LogoUploadButton({ currentLogo, onLogoChange, onLogoRemove, size = 'sm' }: { currentLogo?: string; onLogoChange: (logo: string) => void; onLogoRemove: () => void; size?: 'sm' | 'lg' }) {
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentLogo || null);
  }, [currentLogo]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
    // Clear the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onLogoRemove();
  };

  const iconSize = size === 'lg' ? 'w-8 h-8' : 'w-4 h-4';
  const previewSize = size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';
  const buttonSize = size === 'lg' ? 'px-3 py-2' : 'px-2 py-1.5';

  return (
    <div className="flex items-start gap-2">
      <div className={`relative ${previewSize} rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 flex-shrink-0`}>
        {preview ? (
          <>
            <img src={preview} alt="Logo preview" className="w-full h-full object-contain p-1" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
              aria-label="Remove logo"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <Image className={`${iconSize} text-slate-400`} />
        )}
      </div>
      <div className="space-y-1">
        <label className={`flex items-center gap-1.5 ${buttonSize} bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors`}>
          <Upload className="w-3 h-3" />
          <span>{preview ? 'Change Logo' : 'Add Logo'}</span>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
        <p className="text-[10px] text-slate-500">PNG, JPG, SVG (max 2MB)</p>
      </div>
    </div>
  );
}

function KeyValueArrayField({ label, items, onChange, placeholder = 'Enter title...', showLogo = false }: { label: string; items: Array<{ title: string; description?: string; logo?: string }> | Array<string | { name: string; logo?: string }>; onChange: (items: any[]) => void; placeholder?: string; showLogo?: boolean }) {
  const [titleValue, setTitleValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [logoValue, setLogoValue] = useState('');

  const addItem = () => {
    if (titleValue.trim()) {
      const newItem: any = { title: titleValue.trim(), description: descValue.trim() };
      if (showLogo && logoValue) {
        newItem.logo = logoValue;
      }
      onChange([...items, newItem]);
      setTitleValue('');
      setDescValue('');
      setLogoValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (typeof newItems[index] === 'string') {
      newItems[index] = { title: newItems[index] };
    }
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleLogoChange = (index: number, logo: string) => {
    updateItem(index, 'logo', logo);
  };

  const handleLogoRemove = (index: number) => {
    updateItem(index, 'logo', '');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      <div className={`grid grid-cols-1 ${showLogo ? 'sm:grid-cols-4' : 'sm:grid-cols-[minmax(0,1fr)_auto]'} gap-2 items-stretch`}>
        <Input placeholder={placeholder} value={titleValue} onChange={(e) => setTitleValue(e.target.value)} className="sm:col-span-2" />
        <Input placeholder="Description" value={descValue} onChange={(e) => setDescValue(e.target.value)} className="sm:col-span-2" />
        {showLogo && (
          <div className="flex items-center">
            <LogoUploadButton
              currentLogo={logoValue}
              onLogoChange={setLogoValue}
              onLogoRemove={() => setLogoValue('')}
              size="sm"
            />
          </div>
        )}
        <Button type="button" variant="outline" size="sm" icon={Plus} iconOnly onClick={addItem} className="flex items-center justify-center" />
      </div>
      {items.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {items.map((item, idx) => {
            const itemObj = typeof item === 'string' ? { title: item } : item;
            return (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{itemObj.title}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {itemObj.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{itemObj.description}</p>
                      )}
                    </div>
                  </div>
                  {showLogo && (
                    <LogoUploadButton
                      currentLogo={itemObj.logo || ''}
                      onLogoChange={(logo) => handleLogoChange(idx, logo)}
                      onLogoRemove={() => handleLogoRemove(idx)}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArrayField({ label, items, onChange, placeholder = 'Enter item...', showLogo = false }: { label: string; items: Array<string | { name: string; logo?: string }>; onChange: (items: any[]) => void; placeholder?: string; showLogo?: boolean }) {
  const [inputValue, setInputValue] = useState('');
  const [logoValue, setLogoValue] = useState('');

  const addItem = () => {
    if (inputValue.trim()) {
      if (showLogo) {
        onChange([...items, { name: inputValue.trim(), logo: logoValue }]);
      } else {
        onChange([...items, inputValue.trim()]);
      }
      setInputValue('');
      setLogoValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (typeof newItems[index] === 'string') {
      newItems[index] = { name: newItems[index] };
    }
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleLogoChange = (index: number, logo: string) => {
    updateItem(index, 'logo', logo);
  };

  const handleLogoRemove = (index: number) => {
    updateItem(index, 'logo', '');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      <div className={`flex gap-2 ${showLogo ? 'flex-wrap' : ''}`}>
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={showLogo ? 'flex-1 min-w-[200px]' : 'flex-1'}
        />
        {showLogo && (
          <div className="flex items-center">
            <LogoUploadButton
              currentLogo={logoValue}
              onLogoChange={setLogoValue}
              onLogoRemove={() => setLogoValue('')}
              size="sm"
            />
          </div>
        )}
        <Button type="button" variant="outline" size="sm" icon={Plus} iconOnly onClick={addItem} className="flex items-center justify-center" />
      </div>
      {items.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {items.map((item, idx) => {
            const itemObj = typeof item === 'string' ? { name: item } : item;
            return (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{String(itemObj.name || item)}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {showLogo && (
                    <LogoUploadButton
                      currentLogo={itemObj.logo || ''}
                      onLogoChange={(logo) => handleLogoChange(idx, logo)}
                      onLogoRemove={() => handleLogoRemove(idx)}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CompanySettingsPage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<CompanyProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
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

  const handleGeneratePdf = async () => {
    setPdfGenerating(true);
    try {
      const result: any = await companyProfileApi.generatePdf();
      addToast('Company Profile PDF generated successfully', 'success');
      if (result?.filename) {
        setTimeout(() => {
          companyProfileApi.downloadCompanyProfilePdf(result.filename);
        }, 500);
      }
    } catch (err) {
      addToast(err?.message || 'Failed to generate PDF', 'error');
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const getIcon = (section: string): string | undefined => {
    const config = profile.theme_config;
    if (!config) return undefined;
    if (typeof config === 'object' && !Array.isArray(config)) {
      return config[section];
    }
    if (Array.isArray(config)) {
      const entry = config.find((item: string) => typeof item === 'string' && item.startsWith(section + ':'));
      return entry ? (entry as string).split(':')[1] : undefined;
    }
    return undefined;
  };

  const setIcon = (section: string, iconName: string | undefined) => {
    const config = profile.theme_config;
    let newConfig: Record<string, string> = {};
    if (typeof config === 'object' && !Array.isArray(config)) {
      newConfig = { ...config };
    } else if (Array.isArray(config)) {
      config.forEach((item: string) => {
        if (typeof item === 'string' && item.includes(':')) {
          const [key, val] = item.split(':');
          if (key && val) newConfig[key] = val;
        }
      });
    }
    if (iconName === undefined) {
      delete newConfig[section];
    } else {
      newConfig[section] = iconName;
    }
    handleInputChange('theme_config', newConfig);
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
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={FileDown} isLoading={pdfGenerating} onClick={handleGeneratePdf}>
            Generate PDF
          </Button>
          <Button variant="primary" icon={Save} isLoading={saving} onClick={handleSave}>
            Save All Changes
          </Button>
        </div>
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
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-start gap-4">
                <LogoUploadButton
                  currentLogo={profile.qr_code || ''}
                  onLogoChange={(qrCode) => handleInputChange('qr_code', qrCode)}
                  onLogoRemove={() => handleInputChange('qr_code', '')}
                  size="lg"
                />
                <div className="flex-1 space-y-2 pt-1">
                  <h3 className="text-sm font-bold text-slate-900">Payment QR Code</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Upload the QR image clients scan for UPI or bank payments. PNG, JPG, or SVG up to 2 MB.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Theme Customizer */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-600" />
              Theme Colors
            </h2>
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
        </Card>

        {/* Mission & Vision */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <IconSelector value={getIcon('mission')} onChange={(icon) => setIcon('mission', icon)} />
              Mission & Vision
            </h2>
          </div>
          <Textarea label="Mission Statement" value={profile.mission || ''} onChange={(e) => handleInputChange('mission', e.target.value)} rows={4} />
          <Textarea label="Vision Statement" value={profile.vision || ''} onChange={(e) => handleInputChange('vision', e.target.value)} rows={4} />
        </Card>

        {/* Core Values */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <IconSelector value={getIcon('core_values')} onChange={(icon) => setIcon('core_values', icon)} />
              Core Values
            </h2>
          </div>
          <KeyValueArrayField
            label="Core Values"
            items={profile.core_values || []}
            onChange={(val) => handleInputChange('core_values', val)}
            placeholder="e.g. Integrity"
            showLogo={true}
          />
        </Card>

        {/* Services */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <IconSelector value={getIcon('services')} onChange={(icon) => setIcon('services', icon)} />
              Our Services
            </h2>
          </div>
          <KeyValueArrayField
            label="Services"
            items={profile.services || []}
            onChange={(val) => handleInputChange('services', val)}
            placeholder="e.g. Design & Illustration"
            showLogo={true}
          />
        </Card>

        {/* Clients */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <IconSelector value={getIcon('clients')} onChange={(icon) => setIcon('clients', icon)} />
              Top Clients
            </h2>
          </div>
          <ArrayField
            label="BNI Members & Regional Partners"
            items={profile.bni_clients || []}
            onChange={(val) => handleInputChange('bni_clients', val)}
            placeholder="e.g. Shree Cement"
            showLogo={true}
          />
          <ArrayField
            label="International Partners"
            items={profile.international_clients || []}
            onChange={(val) => handleInputChange('international_clients', val)}
            placeholder="e.g. TechFlow Inc. (USA)"
            showLogo={true}
          />
        </Card>

        {/* Branch Offices */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <IconSelector value={getIcon('branch_offices')} onChange={(icon) => setIcon('branch_offices', icon)} />
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
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <IconSelector value={getIcon('terms')} onChange={(icon) => setIcon('terms', icon)} />
              Terms & Conditions
            </h2>
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

