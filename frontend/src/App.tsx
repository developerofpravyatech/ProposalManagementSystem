import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/admin/Sidebar';
import { Header } from './components/admin/Header';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProposalsPage } from './pages/ProposalsPage';
import { ClientsPage } from './pages/ClientsPage';
import { ProposalDetailPage } from './pages/ProposalDetailPage';
import { ProposalEditPage } from './pages/ProposalEditPage';
import { CreateProposalPage } from './pages/CreateProposalPage';
import { RenewalsPage } from './pages/RenewalsPage';
import { CompanySettingsPage } from './pages/CompanySettingsPage';
import { PublicProposalPage } from './pages/PublicProposalPage';
import { ProposalTrackingPage } from './pages/ProposalTrackingPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Admin Layout Wrapper
function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-bold">
        Loading admin console...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Real-time proposal activity & metrics' };
      case '/admin/proposals':
        return { title: 'Proposal Management', subtitle: 'View, share, track and edit company proposals' };
      case '/admin/proposals/create':
        return { title: 'Create Proposal', subtitle: 'Mode A (Company Profile) & Mode B (Quotation)' };
        case '/admin/renewals':
          return { title: 'Contract Renewals Pipeline', subtitle: 'Track approaching anniversaries & 1-click renew' };
        case '/admin/company-settings':
          return { title: 'Company Settings', subtitle: 'Configure company profile, values, services, and clients' };
      default:
        return { title: 'Admin Command Center', subtitle: 'PRAVYA TECH PMS' };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* Public Admin Auth */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="proposals" element={<ProposalsPage />} />
        <Route path="proposals/create" element={<CreateProposalPage />} />
        <Route path="proposals/:id" element={<ProposalDetailPage />} />
        <Route path="proposals/:id/edit" element={<ProposalEditPage />} />
        <Route path="proposals/:id/tracking" element={<ProposalTrackingPage />} />
        <Route path="renewals" element={<RenewalsPage />} />
        <Route path="company-settings" element={<CompanySettingsPage />} />
      </Route>

      {/* Public Client Token Viewer (/p/:token) */}
      <Route path="/p/:token" element={<PublicProposalPage />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

