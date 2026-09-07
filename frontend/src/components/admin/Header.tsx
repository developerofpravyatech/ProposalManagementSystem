import React from 'react';
import { Menu, Plus, Activity, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

export function Header({ onMenuClick, title, subtitle }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-display">
            {title || 'Dashboard'}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* System Pulse */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          Real-Time Tracker Active
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/admin/proposals/create')}
        >
          <span className="hidden sm:inline">New</span> Proposal
        </Button>
      </div>
    </header>
  );
}

