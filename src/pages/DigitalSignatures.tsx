import { useState } from 'react';
import { Signature as FileSignature, Clock, CircleCheck as CheckCircle2, Send, Plus, X, Copy, ExternalLink } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import { useDigitalSignatures, CreateSignatureInput, DigitalSignature } from '@/hooks/useDigitalSignatures';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  viewed: 'bg-blue-100 text-blue-700',
  signed: 'bg-green-100 text-green-700',
  expired: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-700',
};

export default function DigitalSignatures() {
  const { signatures, loading, stats, createSignatureRequest, updateStatus, resendRequest } = useDigitalSignatures();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSig, setSelectedSig] = useState<DigitalSignature | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateSignatureInput>({
    document_name: '',
    document_type: 'agreement',
    document_number: '',
    client_name: '',
    client_email: '',
    signatory_name: '',
    expires_at: '',
  });

  const filteredSigs = signatures.filter(s => {
    const matchSearch = s.document_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const copyLink = (sig: DigitalSignature) => {
    if (sig.signature_link) {
      navigator.clipboard.writeText(sig.signature_link);
      setCopiedId(sig.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createSignatureRequest(formData);
    if (result) {
      setShowAddModal(false);
      setFormData({ document_name: '', document_type: 'agreement', document_number: '', client_name: '', client_email: '', signatory_name: '', expires_at: '' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Digital Signatures</h1>
            <p className="page-subtitle">Send and track document signing requests</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Requests" value={stats.total} icon={<FileSignature className="w-5 h-5" />} trend={0} />
          <MetricCard title="Signed" value={stats.signed} icon={<CheckCircle2 className="w-5 h-5" />} trend={0} />
          <MetricCard title="Pending" value={stats.pending} icon={<Clock className="w-5 h-5" />} trend={0} />
          <MetricCard title="Sign Rate" value={`${stats.signRate}%`} icon={<Send className="w-5 h-5" />} trend={0} />
        </div>

        <div className="glass-card p-6">
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Search by document or client..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="viewed">Viewed</option>
              <option value="signed">Signed</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : filteredSigs.length === 0 ? (
            <div className="text-center py-12">
              <FileSignature className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No signature requests found</p>
              <button onClick={() => setShowAddModal(true)} className="mt-3 text-sm text-primary hover:underline">
                Create your first request
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Document</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Client</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Signatory</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Sent</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSigs.map(sig => (
                    <tr key={sig.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedSig(sig)}>
                      <td className="py-3 px-2">
                        <p className="font-medium">{sig.document_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{sig.document_number}</p>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground capitalize">{sig.document_type}</td>
                      <td className="py-3 px-2">
                        <p className="font-medium">{sig.client_name}</p>
                        {sig.client_email && <p className="text-xs text-muted-foreground">{sig.client_email}</p>}
                      </td>
                      <td className="py-3 px-2">{sig.signatory_name}</td>
                      <td className="py-3 px-2 text-muted-foreground">{sig.sent_at || '—'}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[sig.status] || statusColors.pending}`}>
                          {sig.status}
                        </span>
                      </td>
                      <td className="py-3 px-2" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {sig.signature_link && (
                            <button
                              onClick={() => copyLink(sig)}
                              className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                              title="Copy link"
                            >
                              {copiedId === sig.id ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          {sig.status !== 'signed' && (
                            <button
                              onClick={() => resendRequest(sig.id)}
                              className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                              title="Resend"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedSig && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSig(null)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Signature Request</h2>
              <button onClick={() => setSelectedSig(null)} className="p-1 hover:bg-muted rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Document</span>
                <span className="text-sm font-medium">{selectedSig.document_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm capitalize">{selectedSig.document_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Number</span>
                <span className="text-sm font-mono">{selectedSig.document_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Client</span>
                <span className="text-sm">{selectedSig.client_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Signatory</span>
                <span className="text-sm">{selectedSig.signatory_name}</span>
              </div>
              {selectedSig.sent_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sent</span>
                  <span className="text-sm">{selectedSig.sent_at}</span>
                </div>
              )}
              {selectedSig.signed_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Signed</span>
                  <span className="text-sm text-green-600">{selectedSig.signed_at}</span>
                </div>
              )}
              {selectedSig.expires_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expires</span>
                  <span className="text-sm">{selectedSig.expires_at}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedSig.status]}`}>
                  {selectedSig.status}
                </span>
              </div>
            </div>
            {selectedSig.signature_link && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Signature Link</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono flex-1 truncate">{selectedSig.signature_link}</p>
                  <button onClick={() => copyLink(selectedSig)} className="p-1 hover:bg-muted rounded">
                    {copiedId === selectedSig.id ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['pending', 'viewed', 'signed', 'expired', 'rejected'].map(s => (
                  <button
                    key={s}
                    onClick={() => { updateStatus(selectedSig.id, s); setSelectedSig(prev => prev ? { ...prev, status: s } : null); }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${selectedSig.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Signature Request</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Document Name *</label>
                <input type="text" required value={formData.document_name} onChange={e => setFormData(p => ({ ...p, document_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Service Agreement Q1 2026" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Document Type</label>
                  <select value={formData.document_type} onChange={e => setFormData(p => ({ ...p, document_type: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none">
                    <option value="agreement">Agreement</option>
                    <option value="invoice">Invoice</option>
                    <option value="quotation">Quotation</option>
                    <option value="contract">Contract</option>
                    <option value="nda">NDA</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Document # *</label>
                  <input type="text" required value={formData.document_number} onChange={e => setFormData(p => ({ ...p, document_number: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" placeholder="e.g. AGR-001" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Client Name *</label>
                <input type="text" required value={formData.client_name} onChange={e => setFormData(p => ({ ...p, client_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Client Email</label>
                <input type="email" value={formData.client_email} onChange={e => setFormData(p => ({ ...p, client_email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Signatory Name *</label>
                <input type="text" required value={formData.signatory_name} onChange={e => setFormData(p => ({ ...p, signatory_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Person who needs to sign" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Expiry Date</label>
                <input type="date" value={formData.expires_at} onChange={e => setFormData(p => ({ ...p, expires_at: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">Create Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
