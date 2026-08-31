import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 mesh-bg">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center space-y-4 border-white/10 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/15 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30 shadow-glow-brand">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white font-display">404</h1>
        <h2 className="text-lg font-bold text-white">Page Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested page or proposal token could not be found. Please verify the URL or return to the dashboard.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            icon={Home}
            onClick={() => navigate('/admin/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
