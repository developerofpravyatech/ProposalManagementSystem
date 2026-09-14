import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  Download,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  FileText,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { proposalApi } from '../api/proposalApi';
import { useToast } from '../context/ToastContext';
import { ProposalTracking, TrackingEvent } from '../types';

function getDeviceIcon(device: string) {
  const d = device.toLowerCase();
  if (d.includes('mobile') || d.includes('iphone') || d.includes('android')) return Smartphone;
  if (d.includes('tablet') || d.includes('ipad')) return Tablet;
  return Monitor;
}

function getBrowserIcon(browser: string) {
  const b = browser.toLowerCase();
  if (b.includes('chrome')) return Globe;
  if (b.includes('safari') && !b.includes('ios')) return Globe;
  if (b.includes('firefox')) return Globe;
  if (b.includes('edge')) return Globe;
  return Monitor;
}

function DeviceBadge({ device }: { device: string }) {
  const Icon = getDeviceIcon(device);
  const colors: Record<string, string> = {
    Desktop: 'bg-slate-100 text-slate-700 border-slate-200',
    Mobile: 'bg-blue-100 text-blue-700 border-blue-200',
    Tablet: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colors[device] || colors.Desktop}`}>
      <Icon className="w-3 h-3" />
      {device}
    </span>
  );
}

export function ProposalTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [tracking, setTracking] = useState<ProposalTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const loadTracking = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await proposalApi.getProposalViews(Number(id));
      setTracking(data);
    } catch (err) {
      setError(err.message || 'Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracking();
  }, [id]);

  const filteredViews = tracking?.views.filter(v => {
    if (filterAction === 'all') return true;
    if (filterAction === 'views') return v.action !== 'PDF Downloaded' && v.action !== 'Quotation Accepted';
    if (filterAction === 'downloads') return v.action === 'PDF Downloaded';
    if (filterAction === 'accepted') return v.action === 'Quotation Accepted';
    return true;
  }) || [];

  const filteredDownloads = tracking?.downloads || [];

  const uniqueIps = tracking ? [...new Set(tracking.views.map(v => v.ip_address))] : [];

  const exportCSV = () => {
    if (!tracking) return;
    const headers = 'Date/Time,IP Address,City,Device,Browser,Action\n';
    const rows = tracking.views.map(v => {
      const date = new Date(v.viewed_at).toLocaleString();
      return `${date},${v.ip_address || 'N/A'},${v.city || 'N/A'},${v.device_type || 'N/A'},${v.browser || 'N/A'},${v.action}`;
    }).join('\n');
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracking-${tracking?.total_views || 0}-events.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Tracking data exported as CSV', 'success');
  };

  const copyPublicLink = () => {
    if (!id) return;
    const url = `${window.location.origin}/p/${tracking?.views[0]?.proposal_id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-slate-600 font-bold">Loading tracking data...</div>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500">{error || 'No tracking data found'}</p>
          <Button variant="secondary" onClick={() => navigate('/admin/proposals')}>
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              Proposal Engagement Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              View all interactions, device details, and engagement timeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" icon={RefreshCw} onClick={loadTracking}>
            Refresh
          </Button>
          <Button size="sm" variant="primary" icon={FileText} onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Eye className="w-4 h-4" /> Total Views
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{tracking.total_views}</div>
        </Card>
        <Card className="p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-4 h-4" /> Unique Devices
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{tracking.unique_devices}</div>
        </Card>
        <Card className="p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" /> First Opened
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {tracking.first_opened_at ? new Date(tracking.first_opened_at).toLocaleString() : 'Not yet opened'}
          </div>
        </Card>
        <Card className="p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Last Opened
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {tracking.last_opened_at ? new Date(tracking.last_opened_at).toLocaleString() : 'Not yet opened'}
          </div>
        </Card>
        <Card className="p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Download className="w-4 h-4" /> PDF Downloads
          </div>
          <div className="text-3xl font-black text-emerald-600 font-mono">{filteredDownloads.length}</div>
        </Card>
      </div>

      {/* Unique IP Addresses */}
      {uniqueIps.length > 0 && (
        <Card className="p-5 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 font-display mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Unique IP Addresses ({uniqueIps.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {uniqueIps.map(ip => (
              <code key={ip} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
                {ip}
              </code>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter:</span>
        </div>
        {[
          { key: 'all', label: 'All Events' },
          { key: 'views', label: 'Page Views' },
          { key: 'downloads', label: 'Downloads' },
          { key: 'accepted', label: 'Accepted' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => { setFilterAction(f.key); setExpandedEvent(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterAction === f.key
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filteredViews.length} events shown</span>
      </div>

      {/* Events Timeline */}
      <Card className="p-0 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-black text-slate-900 font-display">Event Timeline</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredViews.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Eye className="w-10 h-10 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-bold">No events match this filter</p>
            </div>
          ) : (
            filteredViews.map((event) => {
              const isExpanded = expandedEvent === event.id;
              const deviceIcon = getDeviceIcon(event.device_type);
              const browserIcon = getBrowserIcon(event.browser);

              return (
                <div key={event.id} className="hover:bg-slate-50/50 transition-colors">
                  <div
                    className="flex items-center gap-4 px-6 py-4 cursor-pointer"
                    onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                  >
                    {/* Timeline dot */}
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        event.action === 'PDF Downloaded' ? 'bg-emerald-500' :
                        event.action === 'Quotation Accepted' ? 'bg-blue-500' :
                        'bg-brand-500'
                      }`} />
                    </div>

                    {/* Date/Time */}
                    <div className="flex-shrink-0 w-48">
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(event.viewed_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {new Date(event.viewed_at).toLocaleTimeString('en-US', {
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Action Badge */}
                    <div className="flex-shrink-0">
                      {event.action === 'PDF Downloaded' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Download className="w-3 h-3" /> Downloaded
                        </span>
                      ) : event.action === 'Quotation Accepted' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Check className="w-3 h-3" /> Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          <Eye className="w-3 h-3" /> Viewed
                        </span>
                      )}
                    </div>

                    {/* Device & Browser */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                      <DeviceBadge device={event.device_type} />
                      <span className="text-xs text-slate-500">{event.browser}</span>
                    </div>

                    {/* IP Address */}
                    <div className="hidden lg:block flex-shrink-0">
                      <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                        {event.ip_address || 'N/A'}
                      </code>
                    </div>

                    {/* City */}
                    {event.city && (
                      <div className="hidden xl:block flex-shrink-0">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.city}
                        </span>
                      </div>
                    )}

                    {/* Expand icon */}
                    <div className="ml-auto flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-6 pb-4 ml-6 border-l-2 border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Device</span>
                          <div className="flex items-center gap-2 mt-1">
                            {deviceIcon && React.createElement(deviceIcon, { className: 'w-4 h-4 text-slate-600' })}
                            <span className="text-sm font-semibold text-slate-900">{event.device_type || 'Unknown'}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Browser</span>
                          <div className="flex items-center gap-2 mt-1">
                            {browserIcon && React.createElement(browserIcon, { className: 'w-4 h-4 text-slate-600' })}
                            <span className="text-sm font-semibold text-slate-900">{event.browser || 'Unknown'}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">IP Address</span>
                          <p className="text-sm font-mono font-semibold text-slate-900 mt-1">{event.ip_address || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Location</span>
                          <p className="text-sm font-semibold text-slate-900 mt-1">{event.city || 'Unknown'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2 lg:col-span-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">User Agent</span>
                          <p className="text-xs text-slate-600 font-mono mt-1 break-all">{event.user_agent || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Download Events Timeline (separate section) */}
      {filteredDownloads.length > 0 && (
        <Card className="p-5 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 font-display mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" /> Download Events ({filteredDownloads.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {filteredDownloads.map((dl) => (
              <div key={`dl-${dl.id}`} className="py-3 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <div className="flex-shrink-0 w-48">
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(dl.viewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    {new Date(dl.viewed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <DeviceBadge device={dl.device_type} />
                <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                  {dl.ip_address || 'N/A'}
                </code>
                <span className="text-xs text-slate-500">{dl.browser}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
