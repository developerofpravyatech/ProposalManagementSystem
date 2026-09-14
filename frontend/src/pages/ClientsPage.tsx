import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Mail, 
  Phone, 
  Building2, 
  RefreshCw,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { clientApi } from '../api/clientApi';
import { useToast } from '../context/ToastContext';

export function ClientsPage() {
  const { addToast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [deletingClient, setDeletingClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    phone: '',
    email: '',
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientApi.getClients(0, 100, search || undefined);
      const clientsList = Array.isArray(data) ? data : (data.data || data.clients || []);
      setClients(clientsList);
    } catch (err) {
      console.error('Failed to load clients:', err);
      addToast('Failed to load clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const openAddModal = () => {
    setEditingClient(null);
    setFormData({ client_name: '', company_name: '', phone: '', email: '' });
    setShowAddModal(true);
  };

  const openEditModal = (client: any) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name || '',
      company_name: client.company_name || '',
      phone: client.phone || '',
      email: client.email || '',
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name.trim()) {
      addToast('Client name is required', 'error');
      return;
    }

    try {
      if (editingClient) {
        await clientApi.updateClient(editingClient.id, formData);
        addToast('Client updated successfully', 'success');
      } else {
        await clientApi.createClient(formData);
        addToast('Client added successfully', 'success');
      }
      setShowAddModal(false);
      fetchClients();
    } catch (err) {
      addToast(err.message || 'Failed to save client', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingClient) return;
    try {
      await clientApi.deleteClient(deletingClient.id);
      addToast('Client deleted', 'success');
      setDeletingClient(null);
      fetchClients();
    } catch (err) {
      addToast(err.message || 'Failed to delete client', 'error');
    }
  };

  const filteredClients = clients.filter((client) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (client.client_name || '').toLowerCase().includes(q) ||
      (client.company_name || '').toLowerCase().includes(q) ||
      (client.email || '').toLowerCase().includes(q) ||
      (client.phone || '').includes(q)
    );
  });

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Client Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Manage client companies and contact information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={Plus} onClick={openAddModal}>
            Add Client
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, company, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 shadow-sm"
        />
      </div>

      {/* Clients Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-sm font-bold">No clients found</p>
            <p className="text-xs mt-1">{search ? 'Try adjusting your search' : 'Click "Add Client" to get started'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Added</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs border border-brand-200">
                          {(client.client_name || 'N/A').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{client.client_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{client.company_name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {client.email ? (
                        <a href={`mailto:${client.email}`} className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {client.email}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{client.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {client.created_at ? new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(client)}
                          className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingClient(client)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        subtitle={editingClient ? 'Update client information' : 'Enter client contact details'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Client Name"
            placeholder="e.g. Sarah Jenkins"
            required
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
          />
          <Input
            label="Company Name"
            placeholder="e.g. Acme Global Solutions"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          />
          <Input
            label="Phone"
            placeholder="e.g. +919876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="e.g. sarah@acmeglobal.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={editingClient ? Edit : Plus}>
              {editingClient ? 'Update Client' : 'Add Client'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        title="Delete Client"
        subtitle="This action cannot be undone"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm text-rose-800">
              <p className="font-bold">Are you sure?</p>
              <p className="text-rose-700 mt-1">
                Delete <strong>{deletingClient?.client_name}</strong>? This will permanently remove the client and all associated data.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeletingClient(null)}>Cancel</Button>
            <Button variant="danger" icon={Trash2} onClick={handleDelete}>
              Delete Client
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
