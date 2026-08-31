import React from 'react';
import { Menu, Plus, Activity, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

export function Header({ onMenuClick, title, subtitle }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
            {title || 'Dashboard'}
          </h2>
          {subtitle && <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* System Pulse */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Real-Time Tracker Active
        </div>

        <Button
          size="sm"
          icon={Plus}
          onClick={() => navigate('/admin/proposals/create')}
        >
          <span className="hidden sm:inline">New</span> Proposal
        </Button>
      </div>
    </header>
  );
}
