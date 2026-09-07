import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../context/ToastContext';

export function ClientsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Client Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Manage client companies and contact information
          </p>
        </div>
        <Button variant="primary" icon={Users} onClick={() => addToast('Create client coming soon', 'info')}>
          Add Client
        </Button>
      </div>

      <Card className="p-8 text-center">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Client Management</h3>
        <p className="text-sm text-slate-500 mb-4">
          Client CRUD interface will be implemented here.
        </p>
        <Button variant="secondary" onClick={() => navigate('/admin/proposals')}>
          Back to Proposals
        </Button>
      </Card>
    </div>
  );
}
