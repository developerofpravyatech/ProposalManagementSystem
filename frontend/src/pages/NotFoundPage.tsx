import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900 mesh-bg">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl text-center space-y-4 border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto border border-brand-200">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 font-display">404</h1>
        <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          The page or proposal document you requested does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            icon={Home}
            onClick={() => navigate('/admin/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

