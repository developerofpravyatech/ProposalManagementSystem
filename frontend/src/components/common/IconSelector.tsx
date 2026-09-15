import React, { useState } from 'react';
import {
  Sparkles, Target, Heart, Award, Gem, Star, Cpu, Code, Globe,
  Building2, Landmark, Users, Briefcase, FileText, MapPin, Home,
  BarChart3, Megaphone, LayoutDashboard, Zap, Settings, BookOpen,
  Clipboard, ScrollText, FileCheck, CheckCircle, Clock, Calendar,
  CreditCard, Wallet, Banknote, Receipt, Shield, UserCheck, Lightbulb,
  Layers, Send, Download, Paintbrush, Palette, Edit3, Bell, Info, Lock,
  HelpCircle, AlertCircle, X, Search
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export type IconName = keyof typeof iconRegistry;

export const iconRegistry: Record<string, React.ComponentType<any>> = {
  Sparkles, Target, Heart, Award, Gem, Star, Cpu, Code, Globe,
  Building2, Landmark, Users, Briefcase, FileText, MapPin, Home,
  BarChart3, Megaphone, LayoutDashboard, Zap, Settings, BookOpen,
  Clipboard, ScrollText, FileCheck, CheckCircle, Clock, Calendar,
  CreditCard, Wallet, Banknote, Receipt, Shield, UserCheck, Lightbulb,
  Layers, Send, Download, Paintbrush, Palette, Edit3, Bell, Info, Lock,
  HelpCircle, AlertCircle
};

const iconCategories: Record<string, string[]> = {
  'Business': ['Building2', 'Landmark', 'Briefcase', 'Users', 'FileText', 'Globe', 'MapPin', 'Home'],
  'Services': ['Cpu', 'Code', 'BarChart3', 'Megaphone', 'LayoutDashboard', 'Zap', 'Settings'],
  'Branding': ['Sparkles', 'Target', 'Heart', 'Award', 'Gem', 'Star', 'Lightbulb', 'Layers', 'Palette', 'Paintbrush'],
  'Documents': ['BookOpen', 'Clipboard', 'ScrollText', 'FileCheck', 'Edit3', 'Bell', 'Info', 'Lock', 'HelpCircle', 'AlertCircle'],
  'Payment': ['CreditCard', 'Wallet', 'Banknote', 'Receipt', 'Shield', 'UserCheck'],
  'Actions': ['Send', 'Download', 'Clock', 'Calendar', 'CheckCircle']
};

export function IconSelector({
  value,
  onChange,
  showLabel = true,
}: {
  value?: string;
  onChange: (iconName: string | undefined) => void;
  showLabel?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const IconComp = value && iconRegistry[value] ? iconRegistry[value] : FileText;

  const allIcons = Object.keys(iconRegistry);
  const filtered = search
    ? allIcons.filter(name => name.toLowerCase().includes(search.toLowerCase()))
    : allIcons;

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900 shrink-0"
        title="Select icon"
      >
        <IconComp className="w-4 h-4" />
      </button>

      {showLabel && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-xs text-slate-500 hover:text-brand-600 font-medium"
        >
          Edit Icon
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Icon"
        maxWidth="max-w-3xl"
        showClose={false}
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No icons found</p>
            ) : search ? (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                {filtered.map(name => {
                  const Comp = iconRegistry[name];
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelect(name)}
                      className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-brand-600 transition-colors flex items-center justify-center"
                      title={name}
                    >
                      <Comp className="w-5 h-5 text-slate-700" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(iconCategories).map(([category, icons]) => (
                  <div key={category}>
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{category}</h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                      {icons.map(name => {
                        const Comp = iconRegistry[name];
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => handleSelect(name)}
                            className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-brand-600 transition-colors flex items-center justify-center"
                            title={name}
                          >
                            <Comp className="w-5 h-5 text-slate-700" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">Current: <strong>{value || 'None'}</strong></span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={!value}>
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
