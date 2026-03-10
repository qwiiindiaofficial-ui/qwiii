import { useState } from 'react';
import { Users, TrendingUp, Star, ShoppingCart, Plus, Search, Phone, Mail, CreditCard, CreditCard as Edit2, Trash2, Eye, Filter, Download, TriangleAlert as AlertTriangle, IndianRupee, X, CircleCheck as CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';
import { toast } from '@/hooks/use-toast';
import { useBuyers, CreateBuyerInput } from '@/hooks/useBuyers';

const tiers = ['All', 'Premium', 'Regular', 'Bulk', 'New'];

const tierColor: Record<string, string> = {
  Premium: 'bg-warning/20 text-warning',
  Regular: 'bg-primary/20 text-primary',
  Bulk: 'bg-accent/20 text-accent',
  New: 'bg-secondary/20 text-secondary',
};

const statusColor: Record<string, string> = {
  active: 'bg-accent/20 text-accent',
  warning: 'bg-warning/20 text-warning',
  inactive: 'bg-muted text-muted-foreground',
};

const emptyForm: CreateBuyerInput = {
  name: '',
  contact_person: '',
  phone: '',
  email: '',
  tier: 'Regular',
  credit_limit: 0,
  notes: '',
};

const Buyers = () => {
  const { buyers, loading, stats, segmentData, createBuyer, updateBuyer, deleteBuyer } = useBuyers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<typeof buyers[0] | null>(null);
  const [form, setForm] = useState<CreateBuyerInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = buyers.filter(b => {
    if (selectedTier !== 'All' && b.tier !== selectedTier) return false;
    const q = searchQuery.toLowerCase();
    return b.name.toLowerCase().includes(q) || (b.contact_person || '').toLowerCase().includes(q) || (b.email || '').toLowerCase().includes(q);
  });

  const handleSave = async () => {
    if (!form.name) { toast({ title: 'Name required', variant: 'destructive' }); return; }
    setSaving(true);
    const result = await createBuyer(form);
    setSaving(false);
    if (result) { setShowAddModal(false); setForm(emptyForm); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete buyer "${name}"?`)) return;
    await deleteBuyer(id);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">BUYER MANAGEMENT</h1>
            <p className="page-subtitle">B2B relationships • Credit management • Order history</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              <Plus size={16} />
              Add Buyer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Buyers" value={<AnimatedCounter value={stats.total} duration={1500} />} icon={<Users size={16} />} />
          <MetricCard title="Active" value={<AnimatedCounter value={stats.active} duration={1500} />} icon={<CheckCircle2 size={16} />} subtitle="buyers" />
          <MetricCard title="Premium" value={<AnimatedCounter value={stats.premium} duration={1500} />} icon={<Star size={16} />} subtitle="tier" />
          <MetricCard title="Outstanding" value={`₹${(stats.totalOutstanding / 100000).toFixed(1)}L`} icon={<IndianRupee size={16} />} subtitle="receivable" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card">
              <div className="p-4 border-b border-border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search buyers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {tiers.map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedTier(t)}
                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                          selectedTier === t ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Loading buyers...</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <Users size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No buyers yet</p>
                  <button onClick={() => setShowAddModal(true)} className="mt-2 text-xs text-primary hover:underline">Add first buyer</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Buyer</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Tier</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Orders</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Total Value</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Outstanding</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(buyer => (
                        <tr key={buyer.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">{buyer.name}</p>
                              {buyer.contact_person && (
                                <p className="text-xs text-muted-foreground">{buyer.contact_person}</p>
                              )}
                              {buyer.phone && (
                                <p className="text-xs text-muted-foreground">{buyer.phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${tierColor[buyer.tier] || tierColor.Regular}`}>
                              {buyer.tier}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-foreground">{buyer.total_orders}</td>
                          <td className="p-3 text-sm font-medium text-foreground">
                            ₹{(buyer.total_value / 100000).toFixed(1)}L
                          </td>
                          <td className="p-3">
                            {buyer.outstanding_amount > 0 ? (
                              <span className="text-sm font-medium text-warning flex items-center gap-1">
                                <AlertTriangle size={12} />
                                ₹{buyer.outstanding_amount.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-sm text-accent">Clear</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusColor[buyer.status] || statusColor.active}`}>
                              {buyer.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 rounded hover:bg-muted" onClick={() => setSelectedBuyer(buyer)} title="View">
                                <Eye size={14} className="text-muted-foreground" />
                              </button>
                              {buyer.email && (
                                <a href={`mailto:${buyer.email}`} className="p-1.5 rounded hover:bg-muted" title="Email">
                                  <Mail size={14} className="text-muted-foreground" />
                                </a>
                              )}
                              {buyer.phone && (
                                <a href={`tel:${buyer.phone}`} className="p-1.5 rounded hover:bg-muted" title="Call">
                                  <Phone size={14} className="text-muted-foreground" />
                                </a>
                              )}
                              <button onClick={() => handleDelete(buyer.id, buyer.name)} className="p-1.5 rounded hover:bg-destructive/10">
                                <Trash2 size={14} className="text-destructive" />
                              </button>
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

          <div className="space-y-4">
            <BarChartCard
              data={segmentData.length > 0 ? segmentData : [{ name: 'No data', value: 0 }]}
              title="Buyer Segments"
              subtitle="Distribution by tier"
              height={200}
            />
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Business</span>
                  <span className="font-medium">₹{(stats.totalValue / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className="font-medium text-warning">₹{(stats.totalOutstanding / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-medium text-accent">{stats.active}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Add Buyer</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Business Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sharma Textiles"
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Contact Person</label>
                    <input
                      type="text"
                      value={form.contact_person}
                      onChange={e => setForm({ ...form, contact_person: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tier</label>
                    <select
                      value={form.tier}
                      onChange={e => setForm({ ...form, tier: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                      {['New', 'Regular', 'Bulk', 'Premium'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={form.credit_limit || ''}
                    onChange={e => setForm({ ...form, credit_limit: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Add Buyer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedBuyer && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{selectedBuyer.name}</h2>
                <button onClick={() => setSelectedBuyer(null)} className="p-2 rounded hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Contact', value: selectedBuyer.contact_person || '-' },
                  { label: 'Tier', value: selectedBuyer.tier },
                  { label: 'Phone', value: selectedBuyer.phone || '-' },
                  { label: 'Email', value: selectedBuyer.email || '-' },
                  { label: 'Total Orders', value: selectedBuyer.total_orders.toString() },
                  { label: 'Total Value', value: `₹${selectedBuyer.total_value.toLocaleString()}` },
                  { label: 'Credit Limit', value: `₹${selectedBuyer.credit_limit.toLocaleString()}` },
                  { label: 'Outstanding', value: `₹${selectedBuyer.outstanding_amount.toLocaleString()}` },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              {selectedBuyer.notes && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="text-sm text-foreground mt-1">{selectedBuyer.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Buyers;
