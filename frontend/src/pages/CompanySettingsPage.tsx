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
  regional_clients?: Array<string | { name: string; logo?: string }>;
  international_clients?: Array<string | { name: string; logo?: string }>;
  branch_offices?: Array<{ title: string; name: string }>;
  work_process_steps?: Array<{ icon?: string; title?: string; description?: string }>;
  logo_data?: string;
  logo_url?: string;
  qr_code?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_branch?: string;
  upi_id?: string;
  swift_code?: string;
  footer_tagline?: string;
  signatures?: Array<{ image_data: string }>;
  signature_data?: string;
  cover_letter_paragraphs?: string[];
  cover_letter_signature_name?: string;
  cover_letter_signature_designation?: string;
  cover_letter_signature_date?: string;
   cover_letter_signature_image?: string;
   statement_of_work?: Array<{ title: string; description: string }>;
}

function LabeledField({ label, value, onChange, type = 'text', rows, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; rows?: number; placeholder?: string }) {
  return type === 'textarea' ? (
    <Textarea label={label} value={value || ''} onChange={onChange} rows={rows || 3} placeholder={placeholder} />
  ) : (
    <Input label={label} type={type} value={value || ''} onChange={onChange} placeholder={placeholder} />
  );
}

export function ImageUploadButton({ currentLogo, onLogoChange, onLogoRemove, upload = companyProfileApi.uploadLogo, size = 'sm', label = 'Logo', allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'], accept = 'image/*', helpText = 'PNG, JPG, SVG, WebP (max 2MB)', previewAlt = 'Logo preview' }: { currentLogo?: string; onLogoChange: (logo: string) => void; onLogoRemove: () => void; upload?: (file: File) => Promise<string>; size?: 'sm' | 'lg'; label?: string; allowedTypes?: string[]; accept?: string; helpText?: string; previewAlt?: string }) {
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentLogo || null);
  }, [currentLogo]);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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

    // Create a base64 data URL for immediate preview (works across machines and persists on refresh)
    const tempPreview = await fileToDataUrl(file);
    setPreview(tempPreview);
    setUploading(true);

    try {
      const result = await upload(file);
      // API functions return the data URL directly
      setPreview(result);
      onLogoChange(result);
    } catch (error) {
      console.error(`${label} upload failed:`, error);
      alert(`Failed to upload ${label.toLowerCase()}. Please try again.`);
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

function KeyValueArrayField({ label, items, onChange, placeholder = 'Enter title...', showLogo = false, showDescription = true, requireDescription = false, error, fieldType = 'item' }: { label: string; items: Array<{ title: string; description?: string; logo?: string }> | Array<string | { name: string; logo?: string }>; onChange: (items: any[]) => void; placeholder?: string; showLogo?: boolean; showDescription?: boolean; requireDescription?: boolean; error?: string; fieldType?: string }) {
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [logoValue, setLogoValue] = useState('');
  const [localError, setLocalError] = useState('');
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [localError]);

  const addItem = () => {
    const emptyIndices = items.map((item, i) => {
      const itemObj = typeof item === 'string' ? { title: item } : item;
      const titleEmpty = !itemObj.title || !itemObj.title.trim();
      const descEmpty = showDescription && requireDescription && (!itemObj.description || !itemObj.description.trim());
      return titleEmpty || descEmpty ? i : -1;
    }).filter(i => i !== -1);
    if (emptyIndices.length > 0) {
      setErrorIndices(new Set(emptyIndices));
      setLocalError('Please fill the details in added box first');
      return;
    }
    if (titleValue.trim()) {
      if (showDescription && requireDescription && !descriptionValue.trim()) {
        setLocalError('Description is required for each item');
        return;
      }
      const newItem: any = { title: titleValue.trim() };
      if (showLogo && logoValue) {
        newItem.logo = logoValue;
      }
      if (showDescription && descriptionValue.trim()) {
        newItem.description = descriptionValue.trim();
      }
      onChange([...items, newItem]);
      setTitleValue('');
      setDescriptionValue('');
      setLogoValue('');
      setLocalError('');
      setErrorIndices(new Set());
    } else {
      setLocalError(`Please add the ${fieldType}`);
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setErrorIndices(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (typeof newItems[index] === 'string') {
      newItems[index] = { title: newItems[index] };
    }
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
    if (field === 'title' && value.trim()) {
      setErrorIndices(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const handleLogoChange = (index: number, logo: string) => {
    updateItem(index, 'logo', logo);
  };

  const handleLogoRemove = (index: number) => {
    updateItem(index, 'logo', '');
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>

      {/* Add Row */}
      <div className="flex flex-col sm:flex-row gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex-1 min-w-0">
          <Input
            placeholder={placeholder}
            value={titleValue}
            onChange={(e) => { setTitleValue(e.target.value); setLocalError(''); }}
            className="w-full"
            error={localError || error}
          />
        </div>
        {showDescription && (
          <div className="flex-1 min-w-0">
            <Textarea
              placeholder="Enter description..."
              value={descriptionValue}
              onChange={(e) => { setDescriptionValue(e.target.value); setLocalError(''); }}
              rows={2}
              className="text-sm w-full"
              error={requireDescription && descriptionValue && !descriptionValue.trim() ? 'Description is required' : undefined}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {showLogo && (
            <ImageUploadButton
              currentLogo={logoValue}
              onLogoChange={setLogoValue}
              onLogoRemove={() => setLogoValue('')}
              upload={companyProfileApi.uploadItemLogo}
              size="sm"
            />
          )}
          <Button type="button" variant="primary" size="sm" icon={Plus} iconOnly onClick={addItem} />
        </div>
      </div>
      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => {
            const itemObj = typeof item === 'string' ? { title: item } : item;
            const isLast = idx === items.length - 1;
            const hasError = errorIndices.has(idx);
            return (
              <div key={idx} ref={isLast ? errorRef : null} className={`p-4 rounded-xl bg-white border shadow-sm transition-all ${hasError ? 'border-rose-400 shadow-rose-500/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Input
                      value={itemObj.title}
                      onChange={(e) => updateItem(idx, 'title', e.target.value)}
                      placeholder="Title"
                      className="max-w-md"
                      error={hasError && !itemObj.title?.trim() ? 'Title is required' : undefined}
                    />
                    {showDescription && (
                      <Textarea
                        value={itemObj.description || ''}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        placeholder="Short description (1-2 lines)"
                        rows={2}
                        className="text-sm max-w-md"
                        error={hasError && !itemObj.description?.trim() ? 'Description is required' : undefined}
                      />
                    )}
                  </div>
                  <div className="flex items-start gap-2 flex-shrink-0">
                    {showLogo && (
                      <ImageUploadButton
                        currentLogo={itemObj.logo || ''}
                        onLogoChange={(logo) => handleLogoChange(idx, logo)}
                        onLogoRemove={() => handleLogoRemove(idx)}
                        upload={companyProfileApi.uploadItemLogo}
                        size="sm"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-all mt-0.5"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BranchOfficeArrayField({ label, items, onChange, error, fieldType = 'branch office' }: { label: string; items: Array<{ title: string; name: string }>; onChange: (items: Array<{ title: string; name: string }>) => void; error?: string; fieldType?: string }) {
  const [titleValue, setTitleValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [localError, setLocalError] = useState('');
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [localError]);

  const addItem = () => {
    const emptyIndices = items.map((item, i) => {
      const titleEmpty = !item.title || !item.title.trim();
      const nameEmpty = !item.name || !item.name.trim();
      return titleEmpty || nameEmpty ? i : -1;
    }).filter(i => i !== -1);
    if (emptyIndices.length > 0) {
      setErrorIndices(new Set(emptyIndices));
      setLocalError('Please fill the details in added box first');
      return;
    }
    if (titleValue.trim() && nameValue.trim()) {
      onChange([...items, { title: titleValue.trim(), name: nameValue.trim() }]);
      setTitleValue('');
      setNameValue('');
      setLocalError('');
      setErrorIndices(new Set());
    } else {
      setLocalError(`Please add both title and ${fieldType} name`);
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setErrorIndices(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
    if (value && value.trim()) {
      setErrorIndices(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>

      {/* Add Row */}
      <div className="flex flex-col sm:flex-row gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Title (e.g. Head Office, Branch Office)"
            value={titleValue}
            onChange={(e) => { setTitleValue(e.target.value); setLocalError(''); }}
            className="w-full"
            error={localError || error}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Address / Name"
            value={nameValue}
            onChange={(e) => { setNameValue(e.target.value); setLocalError(''); }}
            className="w-full"
            error={error}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="primary" size="sm" icon={Plus} iconOnly onClick={addItem} />
        </div>
      </div>
      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const hasError = errorIndices.has(idx);
            return (
              <div key={idx} ref={isLast ? errorRef : null} className={`p-4 rounded-xl bg-white border shadow-sm transition-all ${hasError ? 'border-rose-400 shadow-rose-500/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(idx, 'title', e.target.value)}
                      placeholder="Title (e.g. Head Office, Branch Office)"
                      className="max-w-md"
                      error={hasError && !item.title?.trim() ? 'Title is required' : undefined}
                    />
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      placeholder="Address / Name"
                      className="max-w-md"
                      error={hasError && !item.name?.trim() ? 'Name is required' : undefined}
                    />
                  </div>
                  <div className="flex items-start gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-all mt-0.5"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WorkProcessField({ label, items, onChange, error }: { label: string; items: Array<{ icon?: string; title?: string; description?: string }>; onChange: (items: Array<{ icon?: string; title?: string; description?: string }>) => void; error?: string }) {
  const [localError, setLocalError] = useState('');
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [localError]);

  const addItem = () => {
    const emptyIndices = items.map((item, i) => {
      return !item.description?.trim() ? i : -1;
    }).filter(i => i !== -1);
    if (emptyIndices.length > 0) {
      setErrorIndices(new Set(emptyIndices));
      setLocalError('Please fill the details in added box first');
      return;
    }
    onChange([...items, { description: '', icon: undefined }]);
    setLocalError('');
    setErrorIndices(new Set());
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setErrorIndices(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
    if (value && value.trim()) {
      setErrorIndices(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
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
            <div ref={idx === items.length - 1 ? errorRef : null} key={idx} className={`p-3 rounded-lg bg-slate-50 border space-y-2 ${errorIndices.has(idx) ? 'border-rose-500' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <IconSelector
                    value={item.icon}
                    onChange={(icon) => updateItem(idx, 'icon', icon)}
                    showLabel={false}
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
                error={errorIndices.has(idx) && !item.description?.trim() ? 'Description is required' : undefined}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArrayField({ label, items, onChange, placeholder = 'Enter item...', showLogo = false, error, fieldType = 'item' }: { label: string; items: Array<string | { name: string; logo?: string }>; onChange: (items: any[]) => void; placeholder?: string; showLogo?: boolean; error?: string; fieldType?: string }) {
  const [inputValue, setInputValue] = useState('');
  const [logoValue, setLogoValue] = useState('');
  const [localError, setLocalError] = useState('');
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [localError]);

  const addItem = () => {
    const emptyIndices = items.map((item, i) => {
      const itemObj = typeof item === 'string' ? { name: item } : item;
      return !itemObj.name || !itemObj.name.trim() ? i : -1;
    }).filter(i => i !== -1);
    if (emptyIndices.length > 0) {
      setErrorIndices(new Set(emptyIndices));
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
      setErrorIndices(new Set());
    } else {
      setLocalError(`Please add the ${fieldType}`);
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setErrorIndices(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (typeof newItems[index] === 'string') {
      newItems[index] = { name: newItems[index] };
    }
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
    if (field === 'name' && value && value.trim()) {
      setErrorIndices(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
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
          error={localError && localError.startsWith('Please add') ? localError : error}
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
            const hasError = errorIndices.has(idx);
            return (
              <div key={idx} ref={isLast ? errorRef : null} className={`p-3 rounded-lg bg-slate-50 border space-y-2 ${hasError ? 'border-rose-500' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="min-w-0 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start justify-between gap-2 w-full">
                          <Input
                            value={String(itemObj.name || item)}
                            onChange={(e) => updateItem(idx, 'name', e.target.value)}
                            placeholder="Name"
                            className="flex-1 min-w-0"
                            error={hasError && !String(itemObj.name || item)?.trim() ? 'Name is required' : undefined}
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1 flex-shrink-0 mt-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
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
              </div>
            );
          })}
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

  const hasCoverletterError = !!getCoverletterError();

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
            error={paragraphError || (paragraphs.length === 0 ? getCoverletterError() : undefined)}
          />
          <Button type="button" variant="outline" size="sm" icon={Plus} iconOnly onClick={addParagraph} className="flex items-center justify-center mt-2" />
        </div>

        {paragraphs.length > 0 && (
          <div className="space-y-2">
            {paragraphs.map((paragraph, idx) => (
              <div key={idx} className={`p-3 rounded-lg bg-slate-50 border space-y-2 ${hasCoverletterError && !paragraph?.trim() ? 'border-rose-500' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                    placeholder={`Paragraph ${idx + 1} content...`}
                    rows={3}
                    className="flex-1 min-w-0 text-sm"
                    error={hasCoverletterError && !paragraph?.trim() ? 'Content is required' : undefined}
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
            placeholder="Enter your signature name"
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
      case 'bank_name':
        if (!value || !value.trim()) return 'Bank name is required';
        if (value.length > 255) return 'Bank name must be less than 255 characters';
        break;
      case 'bank_branch':
        if (!value || !value.trim()) return 'Branch name is required';
        if (value.length > 255) return 'Branch name must be less than 255 characters';
        break;
      case 'bank_account_number':
        if (!value || !value.trim()) return 'Account number is required';
        if (value.length > 30) return 'Account number must be less than 30 characters';
        break;
      case 'bank_ifsc':
        if (!value || !value.trim()) return 'IFSC code is required';
        if (value.length > 20) return 'IFSC code must be less than 20 characters';
        break;
      case 'swift_code':
        if (value && value.length > 20) return 'SWIFT code must be less than 20 characters';
        break;
      case 'upi_id':
        if (!value || !value.trim()) return 'UPI ID is required';
        if (value.length > 50) return 'UPI ID must be less than 50 characters';
        break;
      case 'qr_code':
        // QR code is optional - no validation needed for base64 data URL
        break;
      case 'footer_tagline':
        if (!value || !value.trim()) return 'Footer tagline is required';
        if (value.length > 500) return 'Footer tagline must be less than 500 characters';
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
        regional_clients: 'At least one regional client is required',
        international_clients: 'At least one international client is required',
        branch_offices: 'At least one branch office is required',
        work_process_steps: 'At least one work process step is required',
        statement_of_work: 'At least one statement of work item is required',
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
      } else if (name === 'bni_clients' || name === 'regional_clients' || name === 'international_clients') {
        const itemName = typeof item === 'string' ? item : item.name;
        if (!itemName || !itemName.trim()) {
          return `${name === 'bni_clients' ? 'BNI client' : name === 'regional_clients' ? 'Regional client' : 'International client'} ${i + 1}: Name is required`;
        }
        if (itemName.trim().length > 100) {
          return `${name === 'bni_clients' ? 'BNI client' : name === 'regional_clients' ? 'Regional client' : 'International client'} ${i + 1}: Name must be less than 100 characters`;
        }
      } else if (name === 'branch_offices') {
        const itemTitle = typeof item === 'string' ? '' : item.title;
        const itemName = typeof item === 'string' ? item : item.name;
        if (!itemTitle || !itemTitle.trim()) {
          return `Branch office ${i + 1}: Title is required`;
        }
        if (itemTitle.trim().length > 100) {
          return `Branch office ${i + 1}: Title must be less than 100 characters`;
        }
        if (!itemName || !itemName.trim()) {
          return `Branch office ${i + 1}: Name is required`;
        }
        if (itemName.trim().length > 100) {
          return `Branch office ${i + 1}: Name must be less than 100 characters`;
        }
      } else if (name === 'work_process_steps') {
        if (item.description && item.description.length > 500) {
          return `Work process step ${i + 1}: Description must be less than 500 characters`;
        }
      } else if (name === 'statement_of_work') {
        if (!item.title || !item.title.trim()) {
          return `Statement of work item ${i + 1}: Title is required`;
        }
        if (item.title.trim().length > 100) {
          return `Statement of work item ${i + 1}: Title must be less than 100 characters`;
        }
        if (!item.description || !item.description.trim()) {
          return `Statement of work item ${i + 1}: Description is required`;
        }
        if (item.description.length > 2000) {
          return `Statement of work item ${i + 1}: Description must be less than 2000 characters`;
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

    const basicFields = ['company_name', 'tagline', 'email', 'phone', 'website', 'sales_head_name', 'sales_head_title', 'mission', 'vision', 'bank_name', 'bank_account_number', 'bank_branch', 'bank_ifsc', 'swift_code', 'upi_id', 'footer_tagline'];
    basicFields.forEach(field => {
      const error = validateField(field, profile[field as keyof CompanyProfile]);
      if (error) newErrors[field] = error;
    });

    const arrayFields = ['core_values', 'services', 'bni_clients', 'regional_clients', 'international_clients', 'branch_offices', 'work_process_steps', 'statement_of_work'];
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
            showDescription={false}
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
            label="BNI Members"
            items={profile.bni_clients || []}
            onChange={(val) => handleInputChange('bni_clients', val)}
            placeholder="e.g. Shree Cement"
            showLogo={true}
            fieldType="BNI Member Name"
            error={errors.bni_clients && (touched.has('bni_clients') || submitAttempted) ? errors.bni_clients : undefined}
          />
          <ArrayField
            label="Regional Partners"
            items={profile.regional_clients || []}
            onChange={(val) => handleInputChange('regional_clients', val)}
            placeholder="e.g. Regional Client Name"
            showLogo={true}
            fieldType="Regional Partner Name"
            error={errors.regional_clients && (touched.has('regional_clients') || submitAttempted) ? errors.regional_clients : undefined}
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

        {/* Statement of Work & Contract Terms */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Statement of Work &amp; Contract Terms
            </h2>
          </div>
          <KeyValueArrayField
            label="Statement of Work Items"
            items={profile.statement_of_work || []}
            onChange={(val) => handleInputChange('statement_of_work', val)}
            placeholder="e.g. Project Scope"
            showLogo={false}
            showDescription={true}
            requireDescription={true}
            fieldType="statement of work item"
            error={errors.statement_of_work && (touched.has('statement_of_work') || submitAttempted) ? errors.statement_of_work : undefined}
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
          <BranchOfficeArrayField
            label="Branch Offices"
            items={profile.branch_offices || []}
            onChange={(val) => handleInputChange('branch_offices', val)}
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
              upload={companyProfileApi.uploadQrCode}
              size="lg"
              helpText="Upload a QR code for quick payments (PNG/JPG)"
            />
            {errors.qr_code && (touched.has('qr_code') || submitAttempted) && (
              <p className="text-xs text-rose-600 font-medium mt-1">{errors.qr_code}</p>
            )}
          </div>
        </Card>

        {/* Quote Sign Off / Footer */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-sm" id="field-footer_tagline">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Quote Sign Off & Footer
            </h2>
          </div>

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

