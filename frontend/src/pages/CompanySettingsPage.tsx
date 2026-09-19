import React, { useState, useEffect, useRef } from 'react';
import { Save, Building2, Sparkles, Plus, Trash2, Upload, Image, X, FileDown } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { IconSelector } from '../components/common/IconSelector';
import { companyProfileApi } from '../api/companyProfileApi';
import { useToast } from '../context/ToastContext';

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
  work_process_steps?: Array<{ icon?: string; title: string; description?: string }>;
  logo_data?: string;
  logo_url?: string;
  qr_code?: string;
  terms?: string;
  contract_terms?: Array<{ title: string; bullets: string[] }>;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_branch?: string;
  upi_id?: string;
  swift_code?: string;
  iban?: string;
  quote_acceptance_message?: string;
  footer_tagline?: string;
  signatures?: Array<{ image_data: string }>;
  signature_data?: string;
  cover_letter_paragraphs?: string[];
  cover_letter_signature_name?: string;
  cover_letter_signature_designation?: string;
  cover_letter_signature_date?: string;
  cover_letter_signature_image?: string;
}

function LabeledField({ label, value, onChange, type = 'text', rows, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; rows?: number; placeholder?: string }) {
  return type === 'textarea' ? (
    <Textarea label={label} value={value || ''} onChange={onChange} rows={rows || 3} placeholder={placeholder} />
  ) : (
    <Input label={label} type={type} value={value || ''} onChange={onChange} placeholder={placeholder} />
  );
}

function ImageUploadButton({ currentLogo, onLogoChange, onLogoRemove, upload = companyProfileApi.uploadLogo, size = 'sm', label = 'Logo', allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'], accept = 'image/*', helpText = 'PNG, JPG, SVG, WebP (max 2MB)', previewAlt = 'Logo preview' }: { currentLogo?: string; onLogoChange: (logo: string) => void; onLogoRemove: () => void; upload?: (file: File) => Promise<string>; size?: 'sm' | 'lg'; label?: string; allowedTypes?: string[]; accept?: string; helpText?: string; previewAlt?: string }) {
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentLogo || null);
  }, [currentLogo]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const allowedTypesToCheck = allowedTypes;
    if (!allowedTypesToCheck.includes(file.type)) {
      alert(`Invalid file type. Allowed: ${helpText.replace(' (max 2MB)', '')}`);
      return;
    }

    // Create a temporary preview using object URL for immediate feedback
    const tempPreview = URL.createObjectURL(file);
    setPreview(tempPreview);
    setUploading(true);

    try {
      const result = await upload(file);
      // Revoke the temporary object URL
      URL.revokeObjectURL(tempPreview);
      // API functions return the data URL directly
      setPreview(result);
      onLogoChange(result);
    } catch (error) {
      console.error('Logo upload failed:', error);
      alert('Failed to upload logo. Please try again.');
      URL.revokeObjectURL(tempPreview);
      setPreview(currentLogo || null);
    } finally {
      setUploading(false);
    }

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
            <img src={preview} alt={previewAlt} className="w-full h-full object-contain p-1" />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Remove ${label.toLowerCase()}`}
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <Image className={`${iconSize} text-slate-400`} />
        )}
      </div>
      <div className="space-y-1">
        <label className={`flex items-center gap-1.5 ${buttonSize} bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-3 h-3" />
          <span>{uploading ? 'Uploading...' : preview ? `Change ${label}` : `Add ${label}`}</span>
          <input
            type="file"
            ref={fileInputRef}
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
        <p className="text-[10px] text-slate-500">{helpText}</p>
      </div>
    </div>
  );
}

function KeyValueArrayField({ label, items, onChange, placeholder = 'Enter title...', showLogo = false, error, fieldType = 'item' }: { label: string; items: Array<{ title: string; description?: string; logo?: string }> | Array<string | { name: string; logo?: string }>; onChange: (items: any[]) => void; placeholder?: string; showLogo?: boolean; error?: string; fieldType?: string }) {
  const [titleValue, setTitleValue] = useState('');
  const [logoValue, setLogoValue] = useState('');
  const [localError, setLocalError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [localError]);

  const addItem = () => {
    const hasEmptyItem = items.some(item => {
      const itemObj = typeof item === 'string' ? { title: item } : item;
      return !itemObj.title || !itemObj.title.trim();
    });
    if (hasEmptyItem) {
      setLocalError('Please fill the details in added box first');
      return;
    }
    if (titleValue.trim()) {
      const newItem: any = { title: titleValue.trim() };
      if (showLogo && logoValue) {
        newItem.logo = logoValue;
      }
      onChange([...items, newItem]);
      setTitleValue('');
      setLogoValue('');
      setLocalError('');
    } else {
      setLocalError(`Please add the ${fieldType}`);
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
        <Input placeholder={placeholder} value={titleValue} onChange={(e) => { setTitleValue(e.target.value); setLocalError(''); }} className="sm:col-span-2" error={error} />
        {showLogo && (
          <div className="flex items-center">
            <ImageUploadButton
              currentLogo={logoValue}
              onLogoChange={setLogoValue}
              onLogoRemove={() => setLogoValue('')}
              upload={companyProfileApi.uploadItemLogo}
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
            const isLast = idx === items.length - 1;
            return (
              <div key={idx} ref={isLast ? errorRef : null} className={`p-3 rounded-lg bg-slate-50 border space-y-2 ${isLast && localError ? 'border-rose-500' : 'border-slate-200'}`}>
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
                    <ImageUploadButton
                      currentLogo={itemObj.logo || ''}
                      onLogoChange={(logo) => handleLogoChange(idx, logo)}
                      onLogoRemove={() => handleLogoRemove(idx)}
                      upload={companyProfileApi.uploadItemLogo}
                      size="sm"
                    />

                  )}
                </div>
                {isLast && localError && (
                  <p className="text-xs text-rose-600 font-medium">{localError}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
      {localError && items.length === 0 && (
        <p className="text-xs text-rose-600 font-medium">{localError}</p>
      )}
    </div>
  );
}

function WorkProcessField({ label, items, onChange, error }: { label: string; items: Array<{ icon?: string; title: string; description?: string }>; onChange: (items: Array<{ icon?: string; title: string; description?: string }>) => void; error?: string }) {
  const [localError, setLocalError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [localError]);

  const addItem = () => {
    // Check if any existing step is not filled
    const hasEmptyStep = items.some(item => !item.title?.trim() || !item.description?.trim());
    if (hasEmptyStep) {
      setLocalError('Please fill the details in added box first');
      return;
    }
    const stepNum = items.length + 1;
    onChange([...items, { title: `Step ${stepNum}`, description: '', icon: undefined }]);
    setLocalError('');
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setLocalError('');
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addItem} className="flex items-center gap-1">
        Add Step
      </Button>
      {items.length > 0 && (
        <div className="space-y-2 mt-2">
          {items.map((item, idx) => (
            <div ref={idx === items.length - 1 ? errorRef : null} key={idx} className={`p-3 rounded-lg bg-slate-50 border space-y-2 ${idx === items.length - 1 && localError ? 'border-rose-500' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <IconSelector
                    value={item.icon}
                    onChange={(icon) => updateItem(idx, 'icon', icon)}
                    showLabel={false}
                  />
                  <Input
                    value={item.title || ''}
                    onChange={(e) => updateItem(idx, 'title', e.target.value)}
                    placeholder={`Step ${idx + 1}`}
                    className="flex-1 min-w-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1 flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <Textarea
                value={item.description || ''}
                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                placeholder="Short description (1-2 lines)"
                rows={2}
                className="text-sm"
              />
              {idx === items.length - 1 && localError && (
                <p className="text-xs text-rose-600 font-medium">{localError}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {localError && items.length === 0 && (
        <p className="text-xs text-rose-600 font-medium">{localError}</p>
      )}
    </div>
  );
}

function ArrayField({ label, items, onChange, placeholder = 'Enter item...', showLogo = false, error, fieldType = 'item' }: { label: string; items: Array<string | { name: string; logo?: string }>; onChange: (items: any[]) => void; placeholder?: string; showLogo?: boolean; error?: string; fieldType?: string }) {
  const [inputValue, setInputValue] = useState('');
  const [logoValue, setLogoValue] = useState('');
  const [localError, setLocalError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [localError]);

  const addItem = () => {
    const hasEmptyItem = items.some(item => {
      const itemObj = typeof item === 'string' ? { name: item } : item;
      return !itemObj.name || !itemObj.name.trim();
    });
    if (hasEmptyItem) {
      setLocalError('Please fill the details in added box first');
      return;
    }
    if (inputValue.trim()) {
      if (showLogo) {
        if (!logoValue) {
          setLocalError(`Please upload a logo before adding`);
          return;
        }
        onChange([...items, { name: inputValue.trim(), logo: logoValue }]);
      } else {
        onChange([...items, inputValue.trim()]);
      }
      setInputValue('');
      setLogoValue('');
      setLocalError('');
    } else {
      setLocalError(`Please add the ${fieldType}`);
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
          onChange={(e) => { setInputValue(e.target.value); setLocalError(''); }}
          className={showLogo ? 'flex-1 min-w-[200px]' : 'flex-1'}
          error={error}
        />
        {showLogo && (
          <div className="flex items-center">
            <ImageUploadButton
              currentLogo={logoValue}
              onLogoChange={setLogoValue}
              onLogoRemove={() => setLogoValue('')}
              upload={companyProfileApi.uploadItemLogo}
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
            const isLast = idx === items.length - 1;
            return (
              <div key={idx} ref={isLast ? errorRef : null} className={`p-3 rounded-lg bg-slate-50 border space-y-2 ${isLast && localError ? 'border-rose-500' : 'border-slate-200'}`}>
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
                    <ImageUploadButton
                      currentLogo={itemObj.logo || ''}
                      onLogoChange={(logo) => handleLogoChange(idx, logo)}
                      onLogoRemove={() => handleLogoRemove(idx)}
                      upload={companyProfileApi.uploadItemLogo}
                      size="sm"
                    />

                  )}
                </div>
                {isLast && localError && (
                  <p className="text-xs text-rose-600 font-medium">{localError}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
      {localError && items.length === 0 && (
        <p className="text-xs text-rose-600 font-medium">{localError}</p>
      )}
    </div>
  );
}

function ContractTermsField({ label, items, onChange, error }: { label: string; items: Array<{ title: string; bullets: string[] }>; onChange: (items: Array<{ title: string; bullets: string[] }>) => void; error?: string }) {
  const [termErrors, setTermErrors] = useState<Record<number, { title?: boolean; bullets?: boolean }>>({});
  const [bulletErrors, setBulletErrors] = useState<Record<number, boolean>>({});
  const prevTermErrors = useRef(termErrors);
  const prevBulletErrors = useRef(bulletErrors);

  useEffect(() => {
    const termIndices = Object.keys(termErrors).map(Number);
    for (const idx of termIndices) {
      const err = termErrors[idx];
      const prev = prevTermErrors.current[idx];
      if ((err?.title && !prev?.title) || (err?.bullets && !prev?.bullets)) {
        const el = document.getElementById(`term-card-${idx}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    for (const key of Object.keys(bulletErrors)) {
      if (bulletErrors[key] && !prevBulletErrors.current[key]) {
        const [itemIdx] = key.split('-');
        const el = document.getElementById(`term-card-${itemIdx}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    prevTermErrors.current = termErrors;
    prevBulletErrors.current = bulletErrors;
  }, [termErrors, bulletErrors]);

  const addItem = () => {
    // Check if the last term (most recently added) is empty
    if (items.length > 0) {
      const lastIndex = items.length - 1;
      const lastItem = items[lastIndex];
      
      if (!lastItem.title || !lastItem.title.trim()) {
        setTermErrors(prev => ({ ...prev, [lastIndex]: { ...prev[lastIndex], title: true } }));
        return;
      }
      if (!lastItem.bullets || lastItem.bullets.length === 0 || lastItem.bullets.some(b => !b.trim())) {
        setTermErrors(prev => ({ ...prev, [lastIndex]: { ...prev[lastIndex], bullets: true } }));
        return;
      }
    }
    
    // Clear any previous error for the last index since we're adding a new one
    setTermErrors(prev => {
      const next = { ...prev };
      if (items.length > 0) {
        delete next[items.length - 1];
      }
      return next;
    });
    
    onChange([...items, { title: '', bullets: [''] }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
    
    // Clear error when user starts typing
    if (field === 'title') {
      setTermErrors(prev => {
        const next = { ...prev };
        if (next[index]) {
          next[index] = { ...next[index], title: false };
          if (!next[index].bullets) delete next[index];
        }
        return next;
      });
    }
  };

  const addBullet = (index: number) => {
    const item = items[index];
    const firstEmptyIndex = item.bullets.findIndex(b => !b.trim());
    if (firstEmptyIndex !== -1) {
      setBulletErrors(prev => ({ ...prev, [`${index}-${firstEmptyIndex}`]: true }));
      // Also mark the term as having bullet errors
      setTermErrors(prev => ({ ...prev, [index]: { ...prev[index], bullets: true } }));
      return;
    }
    const newItems = [...items];
    newItems[index] = { ...newItems[index], bullets: [...newItems[index].bullets, ''] };
    onChange(newItems);
    // Clear bullet error for this term
    setTermErrors(prev => {
      const next = { ...prev };
      if (next[index]) {
        next[index] = { ...next[index], bullets: false };
        if (!next[index].title) delete next[index];
      }
      return next;
    });
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setBulletErrors(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        const [itemIdx] = key.split('-').map(Number);
        if (itemIdx === index) delete next[key];
        else if (itemIdx > index) {
          const [, bulletIdx] = key.split('-').map(Number);
          delete next[key];
          next[`${itemIdx - 1}-${bulletIdx}`] = true;
        }
      });
      return next;
    });
  };

  const removeBullet = (itemIndex: number, bulletIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      bullets: newItems[itemIndex].bullets.filter((_, i) => i !== bulletIndex),
    };
    onChange(newItems);
    setBulletErrors(prev => {
      const next = { ...prev };
      const key = `${itemIndex}-${bulletIndex}`;
      delete next[key];
      // Shift down subsequent bullet errors
      Object.keys(next).forEach(k => {
        const [idx, bIdx] = k.split('-').map(Number);
        if (idx === itemIndex && bIdx > bulletIndex) {
          delete next[k];
          next[`${idx}-${bIdx - 1}`] = true;
        }
      });
      return next;
    });
  };

  const updateBullet = (itemIndex: number, bulletIndex: number, value: string) => {
    const newItems = [...items];
    const newBullets = [...newItems[itemIndex].bullets];
    newBullets[bulletIndex] = value;
    newItems[itemIndex] = { ...newItems[itemIndex], bullets: newBullets };
    onChange(newItems);
  };

return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addItem} className="flex items-center gap-1">
        Add Term
      </Button>
      {items.length > 0 && (
        <div className="space-y-3 mt-2">
          {items.map((item, idx) => {
            const termError = termErrors[idx];
            const hasTermTitleError = termError?.title;
            const hasTermBulletsError = termError?.bullets;
            return (
            <div key={idx} id={`term-card-${idx}`} className={`p-3 rounded-lg bg-slate-50 border space-y-2 ${hasTermTitleError || hasTermBulletsError ? 'border-rose-500' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <Input
                    value={item.title || ''}
                    onChange={(e) => { updateItem(idx, 'title', e.target.value); }}
                    placeholder={`Term ${idx + 1} title`}
                    className="flex-1 min-w-0"
                    error={hasTermTitleError ? 'Please fill the term title' : undefined}
                  />
                  <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1 flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1.5 pl-9">
                {item.bullets.map((bullet, bIdx) => {
                  const bulletKey = `${idx}-${bIdx}`;
                  const hasBulletError = bulletErrors[bulletKey];
                  return (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono w-4 text-right flex-shrink-0">•</span>
                      <Input
                        value={bullet || ''}
                        onChange={(e) => { updateBullet(idx, bIdx, e.target.value); setBulletErrors(prev => ({ ...prev, [bulletKey]: false })); }}
                        placeholder={`Bullet point ${bIdx + 1}`}
                        className="flex-1 min-w-0 text-xs"
                        error={hasBulletError ? 'Please fill this first' : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(idx, bIdx)}
                        className="text-rose-400 hover:text-rose-600 p-0.5 flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                }                )}
                <button
                  type="button"
                  onClick={() => addBullet(idx)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 ml-4"
                >
                  <Plus className="w-3 h-3" /> Add bullet
                </button>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}

function CoverletterField({ label, paragraphs, onParagraphsChange, signatureName, onSignatureNameChange, signatureDesignation, onSignatureDesignationChange, signatureDate, onSignatureDateChange, signatureImage, onSignatureImageChange, errors, touched, submitAttempted }: { 
  label: string; 
  paragraphs: string[]; 
  onParagraphsChange: (paragraphs: string[]) => void;
  signatureName: string;
  onSignatureNameChange: (name: string) => void;
  signatureDesignation: string;
  onSignatureDesignationChange: (designation: string) => void;
  signatureDate: string;
  onSignatureDateChange: (date: string) => void;
  signatureImage: string;
  onSignatureImageChange: (image: string) => void;
  errors?: { cover_letter?: string; cover_letter_signature_name?: string; cover_letter_signature_designation?: string; cover_letter_signature_date?: string };
  touched?: Set<string>;
  submitAttempted?: boolean;
}) {
  const [newParagraph, setNewParagraph] = useState('');

  const [paragraphError, setParagraphError] = useState('');

  const addParagraph = () => {
    if (newParagraph.trim()) {
      onParagraphsChange([...paragraphs, newParagraph.trim()]);
      setNewParagraph('');
      setParagraphError('');
    } else {
      setParagraphError('Please enter paragraph content before adding');
    }
  };

  const removeParagraph = (index: number) => {
    onParagraphsChange(paragraphs.filter((_, i) => i !== index));
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    onParagraphsChange(newParagraphs);
  };

  const getCoverletterError = () => {
    if (!errors?.cover_letter || (!touched?.has('cover_letter') && !submitAttempted)) return undefined;
    return errors.cover_letter;
  };

  const getSignatureError = (field: string) => {
    if (!errors?.[field] || (!touched?.has(field) && !submitAttempted)) return undefined;
    return errors[field];
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
      
      {/* Paragraphs */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Textarea
            placeholder="Enter paragraph content..."
            value={newParagraph}
            onChange={(e) => { setNewParagraph(e.target.value); setParagraphError(''); }}
            rows={3}
            className="flex-1 min-w-0"
            error={paragraphError}
          />
          <Button type="button" variant="outline" size="sm" icon={Plus} iconOnly onClick={addParagraph} className="flex items-center justify-center mt-2" />
        </div>

        {paragraphs.length > 0 && (
          <div className="space-y-2">
            {paragraphs.map((paragraph, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                    placeholder={`Paragraph ${idx + 1} content...`}
                    rows={3}
                    className="flex-1 min-w-0 text-sm"
                    error={getCoverletterError()}
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1 flex-shrink-0 mt-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {paragraphs.length === 0 && (
          <p className="text-sm text-slate-500 italic">Add 4-5 paragraphs for the coverletter</p>
        )}
      </div>

      {/* Signature Fields */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input 
            label="Signature Name" 
            value={signatureName} 
            onChange={(e) => onSignatureNameChange(e.target.value)} 
            placeholder="Enter your full name"
            error={getSignatureError('cover_letter_signature_name')}
          />
          <Input 
            label="Designation" 
            value={signatureDesignation} 
            onChange={(e) => onSignatureDesignationChange(e.target.value)} 
            placeholder="Enter your designation (e.g., CEO, Founder)"
            error={getSignatureError('cover_letter_signature_designation')}
          />
          <Input 
            label="Date" 
            type="date" 
            value={signatureDate} 
            onChange={(e) => onSignatureDateChange(e.target.value)} 
            error={getSignatureError('cover_letter_signature_date')}
          />
        </div>
        
        {/* Signature Image Upload */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Signature Image</label>
          <ImageUploadButton
            currentLogo={signatureImage}
            onLogoChange={onSignatureImageChange}
            onLogoRemove={() => onSignatureImageChange('')}
            upload={companyProfileApi.uploadSignature}
            size="lg"
            label="Signature"
            allowedTypes={['image/png', 'image/jpeg', 'image/jpg']}
            accept="image/png,image/jpeg"
            helpText="PNG or JPEG (max 2MB)"
            previewAlt="Signature preview"
          />
        </div>
      </div>
    </div>
  );
}

interface ValidationErrors {
  [key: string]: string;
}

export function CompanySettingsPage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<CompanyProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [logoError, setLogoError] = useState('');
  const initialProfileRef = useRef<CompanyProfile>({});
  const dirtyFieldsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await companyProfileApi.getCompanyProfile();
      setProfile(data);
      initialProfileRef.current = data;
      dirtyFieldsRef.current = new Set();
    } catch (err) {
      addToast('Failed to load company profile', 'error');
    } finally {
      setLoading(false);
    }
  }

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'company_name':
        if (!value || !value.trim()) return 'Company name is required';
        if (value.trim().length < 2) return 'Company name must be at least 2 characters';
        if (value.trim().length > 100) return 'Company name must be less than 100 characters';
        break;
      case 'tagline':
        if (!value || !value.trim()) return 'Tagline is required';
        if (value.length > 150) return 'Tagline must be less than 150 characters';
        break;
      case 'email':
        if (!value || !value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value || !value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        break;
      case 'website':
        if (!value || !value.trim()) return 'Website is required';
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlRegex.test(value)) return 'Please enter a valid website URL (e.g., https://example.com)';
        break;
      case 'sales_head_name':
        if (!value || !value.trim()) return 'Sales head name is required';
        if (value.length > 100) return 'Sales head name must be less than 100 characters';
        break;
      case 'sales_head_title':
        if (!value || !value.trim()) return 'Sales head title is required';
        if (value.length > 100) return 'Sales head title must be less than 100 characters';
        break;
      case 'mission':
        if (!value || !value.trim()) return 'Mission statement is required';
        if (value.trim().length > 2000) return 'Mission statement must be less than 2000 characters';
        break;
      case 'vision':
        if (!value || !value.trim()) return 'Vision statement is required';
        if (value.trim().length > 2000) return 'Vision statement must be less than 2000 characters';
        break;
      case 'terms':
        if (value && value.length > 5000) return 'Terms must be less than 5000 characters';
        break;
      case 'bank_name':
        if (value && value.length > 255) return 'Bank name must be less than 255 characters';
        break;
      case 'bank_branch':
        if (value && value.length > 255) return 'Branch name must be less than 255 characters';
        break;
      case 'bank_account_number':
        if (value && value.length > 30) return 'Account number must be less than 30 characters';
        break;
      case 'bank_ifsc':
        if (value && value.length > 20) return 'IFSC code must be less than 20 characters';
        break;
      case 'swift_code':
        if (value && value.length > 20) return 'SWIFT code must be less than 20 characters';
        break;
      case 'iban':
        if (value && value.length > 34) return 'IBAN must be less than 34 characters';
        break;
      case 'upi_id':
        if (value && value.length > 50) return 'UPI ID must be less than 50 characters';
        break;
      case 'quote_acceptance_message':
        if (value && value.length > 2000) return 'Quote acceptance message must be less than 2000 characters';
        break;
      case 'footer_tagline':
        if (value && value.length > 500) return 'Footer tagline must be less than 500 characters';
        break;
    }
    return undefined;
  };

  const validateArrayField = (name: string, items: any[]): string | undefined => {
    if (items.length === 0) {
      const fieldLabels: Record<string, string> = {
        core_values: 'At least one core value is required',
        services: 'At least one service is required',
        bni_clients: 'At least one BNI client is required',
        international_clients: 'At least one international client is required',
        branch_offices: 'At least one branch office is required',
        work_process_steps: 'At least one work process step is required',
        contract_terms: 'At least one contract term is required',
      };
      return fieldLabels[name] || `${name} must have at least one item`;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (name === 'core_values' || name === 'services') {
        if (!item.title || !item.title.trim()) {
          return `${name === 'core_values' ? 'Core value' : 'Service'} ${i + 1}: Title is required`;
        }
        if (item.title.trim().length > 100) {
          return `${name === 'core_values' ? 'Core value' : 'Service'} ${i + 1}: Title must be less than 100 characters`;
        }
        if (item.description && item.description.length > 500) {
          return `${name === 'core_values' ? 'Core value' : 'Service'} ${i + 1}: Description must be less than 500 characters`;
        }
      } else if (name === 'bni_clients' || name === 'international_clients' || name === 'branch_offices') {
        const itemName = typeof item === 'string' ? item : item.name;
        if (!itemName || !itemName.trim()) {
          return `${name === 'bni_clients' ? 'BNI client' : name === 'international_clients' ? 'International client' : 'Branch office'} ${i + 1}: Name is required`;
        }
        if (itemName.trim().length > 100) {
          return `${name === 'bni_clients' ? 'BNI client' : name === 'international_clients' ? 'International client' : 'Branch office'} ${i + 1}: Name must be less than 100 characters`;
        }
      } else if (name === 'work_process_steps') {
        if (!item.title || !item.title.trim()) {
          return `Work process step ${i + 1}: Title is required`;
        }
        if (item.title.trim().length > 100) {
          return `Work process step ${i + 1}: Title must be less than 100 characters`;
        }
        if (item.description && item.description.length > 500) {
          return `Work process step ${i + 1}: Description must be less than 500 characters`;
        }
      } else if (name === 'contract_terms') {
        if (!item.title || !item.title.trim()) {
          return `Contract term ${i + 1}: Title is required`;
        }
        if (item.title.trim().length > 100) {
          return `Contract term ${i + 1}: Title must be less than 100 characters`;
        }
        if (!item.bullets || item.bullets.length === 0) {
          return `Contract term ${i + 1}: At least one bullet point is required`;
        }
        for (let j = 0; j < item.bullets.length; j++) {
          if (!item.bullets[j] || !item.bullets[j].trim()) {
            return `Contract term ${i + 1}, bullet ${j + 1}: Text is required`;
          }
        }
      }
    }
    return undefined;
  };

  const validateCoverletter = (paragraphs: string[], signatureName: string, signatureDesignation: string, signatureDate: string, newErrors: ValidationErrors): void => {
    if (!paragraphs || paragraphs.length === 0) {
      newErrors.cover_letter = 'At least one coverletter paragraph is required';
      return;
    }
    for (let i = 0; i < paragraphs.length; i++) {
      if (!paragraphs[i] || !paragraphs[i].trim()) {
        newErrors.cover_letter = `Coverletter paragraph ${i + 1}: Content is required`;
        return;
      }
      if (paragraphs[i].length > 2000) {
        newErrors.cover_letter = `Coverletter paragraph ${i + 1}: Must be less than 2000 characters`;
        return;
      }
    }
    if (!signatureName.trim()) newErrors.cover_letter_signature_name = 'Signature name is required';
    if (!signatureDesignation.trim()) newErrors.cover_letter_signature_designation = 'Signature designation is required';
    if (!signatureDate.trim()) newErrors.cover_letter_signature_date = 'Signature date is required';
  };

  const validateAll = (): boolean => {
    const newErrors: ValidationErrors = {};

    const basicFields = ['company_name', 'tagline', 'email', 'phone', 'website', 'sales_head_name', 'sales_head_title', 'mission', 'vision', 'terms', 'bank_name', 'bank_account_number', 'bank_branch', 'bank_ifsc', 'swift_code', 'iban', 'upi_id', 'quote_acceptance_message', 'footer_tagline'];
    basicFields.forEach(field => {
      const error = validateField(field, profile[field as keyof CompanyProfile]);
      if (error) newErrors[field] = error;
    });

    const arrayFields = ['core_values', 'services', 'bni_clients', 'international_clients', 'branch_offices', 'work_process_steps', 'contract_terms'];
    arrayFields.forEach(field => {
      const items = profile[field as keyof CompanyProfile] as any[];
      const error = validateArrayField(field, items || []);
      if (error) newErrors[field] = error;
    });

    const coverletterError = validateCoverletter(
      profile.cover_letter_paragraphs || [],
      profile.cover_letter_signature_name || '',
      profile.cover_letter_signature_designation || '',
      profile.cover_letter_signature_date || '',
      newErrors
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string, value: any) => {
    setTouched(prev => new Set(prev).add(field));
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayBlur = (field: string, items: any[]) => {
    setTouched(prev => new Set(prev).add(field));
    const error = validateArrayField(field, items);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateAll()) {
      addToast('Please fill proper fields', 'error');
      setTimeout(() => {
        const firstErrorEl = document.querySelector('.border-rose-500, p.text-rose-600');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setSaving(true);
    try {
      const payload = getDirtyProfilePayload();
      if (Object.keys(payload).length === 0) {
        addToast('Company profile saved successfully', 'success');
        return;
      }
      await companyProfileApi.updateCompanyProfile(payload);
      initialProfileRef.current = profile;
      dirtyFieldsRef.current.clear();
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
    dirtyFieldsRef.current.add(field);
  };

  const getDirtyProfilePayload = () => {
    const payload: Record<string, any> = {};
    for (const field of dirtyFieldsRef.current) {
      payload[field] = profile[field as keyof CompanyProfile];
    }
    return payload;
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
        </div>
      </div>

      {submitAttempted && Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-2 text-rose-800 mb-2">
            <span className="font-semibold">Please fix the following errors:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-rose-700">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {message}</li>
            ))}
          </ul>
        </div>
      )}

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
            <Input
              label="Company Name"
              value={profile.company_name || ''}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              onBlur={(e) => handleBlur('company_name', e.target.value)}
              placeholder="Enter company name (e.g., PRAVYA TECH)"
              error={errors.company_name && (touched.has('company_name') || submitAttempted) ? errors.company_name : undefined}
            />
            <Input
              label="Tagline"
              value={profile.tagline || ''}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              onBlur={(e) => handleBlur('tagline', e.target.value)}
              placeholder="Enter company tagline"
              error={errors.tagline && (touched.has('tagline') || submitAttempted) ? errors.tagline : undefined}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              placeholder="Enter email (e.g., info@pravyatech.com)"
              error={errors.email && (touched.has('email') || submitAttempted) ? errors.email : undefined}
            />
            <Input
              label="Phone"
              value={profile.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={(e) => handleBlur('phone', e.target.value)}
              placeholder="Enter phone (e.g., +91 98765 43210)"
              error={errors.phone && (touched.has('phone') || submitAttempted) ? errors.phone : undefined}
            />
            <Input
              label="Website"
              value={profile.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              onBlur={(e) => handleBlur('website', e.target.value)}
              placeholder="Enter website (e.g., https://pravyatech.com)"
              error={errors.website && (touched.has('website') || submitAttempted) ? errors.website : undefined}
            />
            <Input
              label="Sales Head Name"
              value={profile.sales_head_name || ''}
              onChange={(e) => handleInputChange('sales_head_name', e.target.value)}
              onBlur={(e) => handleBlur('sales_head_name', e.target.value)}
              placeholder="Enter sales head name"
              error={errors.sales_head_name && (touched.has('sales_head_name') || submitAttempted) ? errors.sales_head_name : undefined}
            />
            <Input
              label="Sales Head Title"
              value={profile.sales_head_title || ''}
              onChange={(e) => handleInputChange('sales_head_title', e.target.value)}
              onBlur={(e) => handleBlur('sales_head_title', e.target.value)}
              placeholder="Enter sales head title (e.g., VP Sales)"
              error={errors.sales_head_title && (touched.has('sales_head_title') || submitAttempted) ? errors.sales_head_title : undefined}
            />
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
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setLogoError('');
                        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
                        if (!allowedTypes.includes(file.type)) {
                          setLogoError('Invalid file type. Allowed: PNG, JPG, SVG, WebP');
                          return;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          setLogoError('File size must be less than 2MB');
                          return;
                        }
                        try {
                          const result = await companyProfileApi.uploadLogo(file);
                          handleInputChange('logo_data', result);
                          handleInputChange('logo_url', '');
                        } catch (error) {
                          console.error('Logo upload failed:', error);
                          setLogoError('Failed to upload logo. Please try again.');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-500">PNG, JPG, SVG, WebP (max 2MB)</p>
                  {logoError && <p className="text-xs text-rose-600 font-medium mt-1">{logoError}</p>}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Coverletter */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Profile Coverletter
            </h2>
          </div>
          <CoverletterField
            label="Coverletter Content"
            paragraphs={profile.cover_letter_paragraphs || []}
            onParagraphsChange={(val) => handleInputChange('cover_letter_paragraphs', val)}
            signatureName={profile.cover_letter_signature_name || ''}
            onSignatureNameChange={(val) => handleInputChange('cover_letter_signature_name', val)}
            signatureDesignation={profile.cover_letter_signature_designation || ''}
            onSignatureDesignationChange={(val) => handleInputChange('cover_letter_signature_designation', val)}
            signatureDate={profile.cover_letter_signature_date || ''}
            onSignatureDateChange={(val) => handleInputChange('cover_letter_signature_date', val)}
            signatureImage={profile.cover_letter_signature_image || profile.signature_data || ''}
            onSignatureImageChange={(val) => handleInputChange('cover_letter_signature_image', val)}
            errors={errors}
            touched={touched}
            submitAttempted={submitAttempted}
          />
        </Card>

        {/* Mission & Vision */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Mission & Vision
            </h2>
          </div>
          <Textarea
            label="Mission Statement"
            value={profile.mission || ''}
            onChange={(e) => handleInputChange('mission', e.target.value)}
            onBlur={(e) => handleBlur('mission', e.target.value)}
            rows={4}
            placeholder="Enter your company's mission statement..."
            error={errors.mission && (touched.has('mission') || submitAttempted) ? errors.mission : undefined}
          />
          <Textarea
            label="Vision Statement"
            value={profile.vision || ''}
            onChange={(e) => handleInputChange('vision', e.target.value)}
            onBlur={(e) => handleBlur('vision', e.target.value)}
            rows={4}
            placeholder="Enter your company's vision statement..."
            error={errors.vision && (touched.has('vision') || submitAttempted) ? errors.vision : undefined}
          />
        </Card>

        {/* Core Values */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Core Values
            </h2>
          </div>
          <KeyValueArrayField
            label="Core Values"
            items={profile.core_values || []}
            onChange={(val) => handleInputChange('core_values', val)}
            placeholder="e.g. Integrity"
            showLogo={true}
            fieldType="core value"
            error={errors.core_values && (touched.has('core_values') || submitAttempted) ? errors.core_values : undefined}
          />
        </Card>

        {/* Services */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Our Services
            </h2>
          </div>
          <KeyValueArrayField
            label="Services"
            items={profile.services || []}
            onChange={(val) => handleInputChange('services', val)}
            placeholder="e.g. Design & Illustration"
            showLogo={true}
            fieldType="service"
            error={errors.services && (touched.has('services') || submitAttempted) ? errors.services : undefined}
          />
        </Card>

        {/* Clients */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Top Clients
            </h2>
          </div>
          <ArrayField
            label="BNI Members & Regional Partners"
            items={profile.bni_clients || []}
            onChange={(val) => handleInputChange('bni_clients', val)}
            placeholder="e.g. Shree Cement"
            showLogo={true}
            fieldType="BNI OR Regional Partner Name"
            error={errors.bni_clients && (touched.has('bni_clients') || submitAttempted) ? errors.bni_clients : undefined}
          />
          <ArrayField
            label="International Partners"
            items={profile.international_clients || []}
            onChange={(val) => handleInputChange('international_clients', val)}
            placeholder="e.g. TechFlow Inc. (USA)"
            showLogo={true}
            fieldType="International Partner name"
            error={errors.international_clients && (touched.has('international_clients') || submitAttempted) ? errors.international_clients : undefined}
          />
        </Card>

        {/* Branch Offices */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Branch Offices
            </h2>
          </div>
          <ArrayField
            label="Branch Offices"
            items={profile.branch_offices || []}
            onChange={(val) => handleInputChange('branch_offices', val)}
            placeholder="e.g. Rajkot - 150ft Rd, Gujarat, India"
            showLogo={false}
            fieldType="branch office name"
            error={errors.branch_offices && (touched.has('branch_offices') || submitAttempted) ? errors.branch_offices : undefined}
          />
        </Card>

        {/* Work Process */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Our work process - From very first touch point to launch and beyond.
            </h2>
          </div>
          <WorkProcessField
            label="Work Process Steps"
            items={profile.work_process_steps || []}
            onChange={(val) => handleInputChange('work_process_steps', val)}
            error={errors.work_process_steps && (touched.has('work_process_steps') || submitAttempted) ? errors.work_process_steps : undefined}
          />
        </Card>

        {/* Statement of work and Contract Terms */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Statement of work and Contract Terms
            </h2>
          </div>
          <ContractTermsField
            label="Contract Terms"
            items={profile.contract_terms || []}
            onChange={(val) => handleInputChange('contract_terms', val)}
            error={errors.contract_terms && (touched.has('contract_terms') || submitAttempted) ? errors.contract_terms : undefined}
          />
        </Card>

        {/* Terms */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Terms & Conditions
            </h2>
          </div>
          <Textarea
            label="General Terms"
            value={profile.terms || ''}
            onChange={(e) => handleInputChange('terms', e.target.value)}
            onBlur={(e) => handleBlur('terms', e.target.value)}
            rows={6}
            placeholder="Enter terms and conditions (one term per line)..."
            error={errors.terms && (touched.has('terms') || submitAttempted) ? errors.terms : undefined}
          />
        </Card>

        {/* Payment Methods */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm" id="field-bank_name">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Payment Methods
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              value={profile.bank_name || ''}
              onChange={(e) => handleInputChange('bank_name', e.target.value)}
              onBlur={(e) => handleBlur('bank_name', e.target.value)}
              error={errors.bank_name && (touched.has('bank_name') || submitAttempted) ? errors.bank_name : undefined}
              placeholder="Enter bank name"
              helperText="Example: State Bank of India"
            />
            <Input
              label="Account Number"
              value={profile.bank_account_number || ''}
              onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
              onBlur={(e) => handleBlur('bank_account_number', e.target.value)}
              error={errors.bank_account_number && (touched.has('bank_account_number') || submitAttempted) ? errors.bank_account_number : undefined}
              placeholder="Enter account number"
            />
            <Input
              label="Branch Name"
              value={profile.bank_branch || ''}
              onChange={(e) => handleInputChange('bank_branch', e.target.value)}
              onBlur={(e) => handleBlur('bank_branch', e.target.value)}
              error={errors.bank_branch && (touched.has('bank_branch') || submitAttempted) ? errors.bank_branch : undefined}
              placeholder="Enter branch name"
            />
            <Input
              label="IFSC Code"
              value={profile.bank_ifsc || ''}
              onChange={(e) => handleInputChange('bank_ifsc', e.target.value)}
              onBlur={(e) => handleBlur('bank_ifsc', e.target.value)}
              error={errors.bank_ifsc && (touched.has('bank_ifsc') || submitAttempted) ? errors.bank_ifsc : undefined}
              placeholder="Enter IFSC code"
            />
            <Input
              label="UPI ID"
              value={profile.upi_id || ''}
              onChange={(e) => handleInputChange('upi_id', e.target.value)}
              onBlur={(e) => handleBlur('upi_id', e.target.value)}
              error={errors.upi_id && (touched.has('upi_id') || submitAttempted) ? errors.upi_id : undefined}
              placeholder="Enter UPI ID"
              helperText="Example: company@upi"
            />
            <Input
              label="Swift Code"
              value={profile.swift_code || ''}
              onChange={(e) => handleInputChange('swift_code', e.target.value)}
              onBlur={(e) => handleBlur('swift_code', e.target.value)}
              error={errors.swift_code && (touched.has('swift_code') || submitAttempted) ? errors.swift_code : undefined}
              placeholder="Enter Swift Code (Optional)"
            />
          </div>
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">QR Code</label>
            <ImageUploadButton
              label="QR Code"
              currentLogo={profile.qr_code || ''}
              onLogoChange={(logo) => {
                handleInputChange('qr_code', logo);
                handleBlur('qr_code', logo);
              }}
              onLogoRemove={() => {
                handleInputChange('qr_code', '');
                handleBlur('qr_code', '');
              }}
              upload={companyProfileApi.uploadLogo}
              size="lg"
              helpText="Upload a QR code for quick payments (PNG/JPG)"
            />
            {errors.qr_code && (touched.has('qr_code') || submitAttempted) && (
              <p className="text-xs text-rose-600 font-medium mt-1">{errors.qr_code}</p>
            )}
          </div>
        </Card>

        {/* Quote Sign Off / Footer */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm" id="field-quote_acceptance_message">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Quote Sign Off & Footer
            </h2>
          </div>
          
          <Textarea
            label="Quote Acceptance Terms"
            value={profile.quote_acceptance_message || ''}
            onChange={(e) => handleInputChange('quote_acceptance_message', e.target.value)}
            onBlur={(e) => handleBlur('quote_acceptance_message', e.target.value)}
            rows={4}
            placeholder="e.g. By signing below, the client confirms acceptance of the quote..."
            helperText="This message will be printed on the final acceptance page."
            error={errors.quote_acceptance_message && (touched.has('quote_acceptance_message') || submitAttempted) ? errors.quote_acceptance_message : undefined}
          />

          <Input
            label="Footer Tagline"
            value={profile.footer_tagline || ''}
            onChange={(e) => handleInputChange('footer_tagline', e.target.value)}
            onBlur={(e) => handleBlur('footer_tagline', e.target.value)}
            placeholder="e.g. Take your business to the next level."
            helperText="This is shown on the final back cover page."
            error={errors.footer_tagline && (touched.has('footer_tagline') || submitAttempted) ? errors.footer_tagline : undefined}
          />
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

