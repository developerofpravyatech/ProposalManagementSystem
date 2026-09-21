// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../frontend/src/components/common/Button';
import { Input, Textarea } from '../frontend/src/components/common/Input';
import { IconSelector } from '../frontend/src/components/common/IconSelector';
import { companyProfileApi } from '../frontend/src/api/companyProfileApi';
import { ImageUploadButton } from '../frontend/src/pages/CompanySettingsPage';

export interface KeyValueItem {
  title: string;
  description?: string;
  logo?: string;
}

export function KeyValueArrayField({
  label,
  items = [],
  onChange,
  placeholder = 'Enter title...',
  showLogo = false,
  error,
  fieldType = 'item'
}: {
  label: string;
  items?: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
  placeholder?: string;
  showLogo?: boolean;
  error?: string;
  fieldType?: string;
}) {
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
    const hasEmptyItem = items.some(item => !item.title || !item.title.trim());

    if (hasEmptyItem) {
      setLocalError('Please fill the details in added box first');
      return;
    }

    if (titleValue.trim()) {
      const newItem: KeyValueItem = { title: titleValue.trim() };
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

  const updateItem = (index: number, field: keyof KeyValueItem, value: any) => {
    const newItems = [...items];
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
        <Input
          placeholder={placeholder}
          value={titleValue}
          onChange={(e) => { setTitleValue(e.target.value); setLocalError(''); }}
          className="sm:col-span-2"
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
            const isLast = idx === items.length - 1;
            return (
              <div key={idx} ref={isLast ? errorRef : null} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="min-w-0 w-full">
                      <div className="flex items-start justify-between gap-2 w-full">
                        <Input
                          value={item.title}
                          onChange={(e) => updateItem(idx, 'title', e.target.value)}
                          placeholder="Title"
                          className="flex-1 min-w-0"
                          error={localError && !item.title?.trim() ? 'Title is required' : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 flex-shrink-0 mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        placeholder="Short description (1-2 lines)"
                        rows={2}
                        className="mt-2 text-sm"
                        error={localError && !item.description?.trim() ? 'Description is required' : undefined}
                      />
                    </div>
                  </div>
                  {showLogo && (
                    <ImageUploadButton
                      currentLogo={item.logo || ''}
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
      {localError && items.length === 0 && (
        <p className="text-xs text-rose-600 font-medium">{localError}</p>
      )}
    </div>
  );
}

export interface WorkProcessItem {
  icon?: string;
  title: string;
  description?: string;
}

export function WorkProcessField({
  label,
  items = [],
  onChange,
  error
}: {
  label: string;
  items?: WorkProcessItem[];
  onChange: (items: WorkProcessItem[]) => void;
  error?: string;
}) {
  const [localError, setLocalError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [localError]);

  const addItem = () => {
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

  const updateItem = (index: number, field: keyof WorkProcessItem, value: any) => {
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
            <div ref={idx === items.length - 1 ? errorRef : null} key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
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
                    placeholder={`Step ${idx + 1} title`}
                    error={localError && !item.title?.trim() ? 'Title is required' : undefined}
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
                error={localError && !item.description?.trim() ? 'Description is required' : undefined}
              />
            </div>
          ))}
        </div>
      )}
      {localError && items.length === 0 && (
        <p className="text-xs text-rose-600 font-medium">{localError}</p>
      )}
      {error && !localError && items.length === 0 && (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      )}
    </div>
  );
}

export type ArrayItemType = string | { name: string; logo?: string };

export function ArrayField({
  label,
  items = [],
  onChange,
  placeholder = 'Enter item...',
  showLogo = false,
  error,
  fieldType = 'item'
}: {
  label: string;
  items?: ArrayItemType[];
  onChange: (items: ArrayItemType[]) => void;
  placeholder?: string;
  showLogo?: boolean;
  error?: string;
  fieldType?: string;
}) {
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
    const currentItem = newItems[index];

    if (typeof currentItem === 'string') {
      newItems[index] = { name: currentItem, [field]: value };
    } else {
      newItems[index] = { ...currentItem, [field]: value };
    }
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
            return (
              <div key={idx} ref={isLast ? errorRef : null} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
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
                            error={localError && !String(itemObj.name || item)?.trim() ? 'Name is required' : undefined}
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
      {localError && items.length === 0 && (
        <p className="text-xs text-rose-600 font-medium">{localError}</p>
      )}
      {error && !localError && items.length === 0 && (
        <p className="text-xs text-rose-600 font-medium">{error}</p>

      )}
    </div>
  );
}
