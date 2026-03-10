import { useState } from 'react';
import { Truck, Package, Building2, FileText, Plus, X, Star, Search } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import {
  useSupplyChain,
  CreateVendorInput,
  CreateShipmentInput,
  CreatePurchaseOrderInput,
} from '@/hooks/useSupplyChain';

type TabType = 'shipments' | 'vendors' | 'orders';

const shipmentStatusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  in_transit: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  delayed: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
};

const orderStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  ordered: 'bg-blue-100 text-blue-700',
  received: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const urgencyColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

type ModalType = 'vendor' | 'shipment' | 'order' | null;

export default function SupplyChain() {
  const { vendors, shipments, purchaseOrders, loading, stats, createVendor, createShipment, createPurchaseOrder, updateShipmentStatus, updatePurchaseOrderStatus } = useSupplyChain();
  const [activeTab, setActiveTab] = useState<TabType>('shipments');
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [vendorForm, setVendorForm] = useState<CreateVendorInput>({ name: '', category: '' });
  const [shipmentForm, setShipmentForm] = useState<CreateShipmentInput>({ buyer_name: '' });
  const [orderForm, setOrderForm] = useState<CreatePurchaseOrderInput>({ vendor_name: '', material: '', quantity: '' });

  const filteredShipments = shipments.filter(s =>
    s.shipment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.buyer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = purchaseOrders.filter(o =>
    o.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createVendor(vendorForm);
    if (result) { setShowModal(null); setVendorForm({ name: '', category: '' }); }
  };

  const handleShipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createShipment(shipmentForm);
    if (result) { setShowModal(null); setShipmentForm({ buyer_name: '' }); }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createPurchaseOrder(orderForm);
    if (result) { setShowModal(null); setOrderForm({ vendor_name: '', material: '', quantity: '' }); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Supply Chain</h1>
            <p className="page-subtitle">Manage vendors, shipments, and purchase orders</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal('shipment')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Shipment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Active Shipments" value={stats.activeShipments} icon={<Truck className="w-5 h-5" />} trend={0} />
          <MetricCard title="Total Vendors" value={stats.totalVendors} icon={<Building2 className="w-5 h-5" />} trend={0} />
          <MetricCard title="Pending Orders" value={stats.pendingOrders} icon={<FileText className="w-5 h-5" />} trend={0} />
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {(['shipments', 'vendors', 'orders'] as TabType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {tab} ({tab === 'shipments' ? shipments.length : tab === 'vendors' ? vendors.length : purchaseOrders.length})
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-48"
                />
              </div>
              {activeTab === 'vendors' && (
                <button onClick={() => setShowModal('vendor')} className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add Vendor
                </button>
              )}
              {activeTab === 'orders' && (
                <button onClick={() => setShowModal('order')} className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  New Order
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : (
            <>
              {activeTab === 'shipments' && (
                filteredShipments.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No shipments found</p>
                    <button onClick={() => setShowModal('shipment')} className="mt-3 text-sm text-primary hover:underline">Create your first shipment</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Shipment #</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Buyer</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Route</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Items</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">ETA</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredShipments.map(s => (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-2 font-mono text-xs">{s.shipment_number}</td>
                            <td className="py-3 px-2 font-medium">{s.buyer_name}</td>
                            <td className="py-3 px-2 text-muted-foreground text-xs">
                              {s.origin || '—'} → {s.destination || '—'}
                            </td>
                            <td className="py-3 px-2">{s.items_count}</td>
                            <td className="py-3 px-2 text-muted-foreground">{s.eta || '—'}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${shipmentStatusColors[s.status] || shipmentStatusColors.pending}`}>
                                {s.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <select
                                value={s.status}
                                onChange={e => updateShipmentStatus(s.id, e.target.value)}
                                className="text-xs px-2 py-1 border border-border rounded bg-background focus:outline-none"
                              >
                                <option value="pending">Pending</option>
                                <option value="in_transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="delayed">Delayed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {activeTab === 'vendors' && (
                filteredVendors.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No vendors found</p>
                    <button onClick={() => setShowModal('vendor')} className="mt-3 text-sm text-primary hover:underline">Add your first vendor</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVendors.map(v => (
                      <div key={v.id} className="p-4 border border-border rounded-lg hover:border-primary/40 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{v.name}</p>
                            <p className="text-xs text-muted-foreground">{v.category}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium">{v.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        {v.location && <p className="text-xs text-muted-foreground mb-2">{v.location}</p>}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{v.total_orders} orders</span>
                          <span>{v.on_time_percent}% on-time</span>
                          <span className={v.status === 'active' ? 'text-green-600' : 'text-red-500'}>{v.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'orders' && (
                filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No purchase orders found</p>
                    <button onClick={() => setShowModal('order')} className="mt-3 text-sm text-primary hover:underline">Create your first order</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Vendor</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Material</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Qty</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Value</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Urgency</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(o => (
                          <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-2 font-medium">{o.vendor_name}</td>
                            <td className="py-3 px-2">{o.material}</td>
                            <td className="py-3 px-2">{o.quantity}</td>
                            <td className="py-3 px-2">{o.estimated_value ? `$${o.estimated_value.toLocaleString()}` : '—'}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyColors[o.urgency] || urgencyColors.normal}`}>
                                {o.urgency}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderStatusColors[o.status] || orderStatusColors.pending}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <select
                                value={o.status}
                                onChange={e => updatePurchaseOrderStatus(o.id, e.target.value)}
                                className="text-xs px-2 py-1 border border-border rounded bg-background focus:outline-none"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="ordered">Ordered</option>
                                <option value="received">Received</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      {showModal === 'vendor' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Vendor</h2>
              <button onClick={() => setShowModal(null)} className="p-1 hover:bg-muted rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleVendorSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Vendor Name *</label>
                <input type="text" required value={vendorForm.name} onChange={e => setVendorForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Category *</label>
                <input type="text" required value={vendorForm.category} onChange={e => setVendorForm(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Raw Materials" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Contact Person</label>
                  <input type="text" value={vendorForm.contact_person || ''} onChange={e => setVendorForm(p => ({ ...p, contact_person: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Phone</label>
                  <input type="text" value={vendorForm.phone || ''} onChange={e => setVendorForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Location</label>
                <input type="text" value={vendorForm.location || ''} onChange={e => setVendorForm(p => ({ ...p, location: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">Add Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'shipment' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Shipment</h2>
              <button onClick={() => setShowModal(null)} className="p-1 hover:bg-muted rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleShipmentSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Buyer Name *</label>
                <input type="text" required value={shipmentForm.buyer_name} onChange={e => setShipmentForm(p => ({ ...p, buyer_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Origin</label>
                  <input type="text" value={shipmentForm.origin || ''} onChange={e => setShipmentForm(p => ({ ...p, origin: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Destination</label>
                  <input type="text" value={shipmentForm.destination || ''} onChange={e => setShipmentForm(p => ({ ...p, destination: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Items Count</label>
                  <input type="number" min={1} value={shipmentForm.items_count || ''} onChange={e => setShipmentForm(p => ({ ...p, items_count: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">ETA</label>
                  <input type="date" value={shipmentForm.eta || ''} onChange={e => setShipmentForm(p => ({ ...p, eta: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Carrier</label>
                <input type="text" value={shipmentForm.carrier || ''} onChange={e => setShipmentForm(p => ({ ...p, carrier: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">Create Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'order' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Purchase Order</h2>
              <button onClick={() => setShowModal(null)} className="p-1 hover:bg-muted rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Vendor Name *</label>
                <input type="text" required value={orderForm.vendor_name} onChange={e => setOrderForm(p => ({ ...p, vendor_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Material *</label>
                <input type="text" required value={orderForm.material} onChange={e => setOrderForm(p => ({ ...p, material: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Quantity *</label>
                  <input type="text" required value={orderForm.quantity} onChange={e => setOrderForm(p => ({ ...p, quantity: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" placeholder="e.g. 500 kg" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Estimated Value</label>
                  <input type="number" min={0} value={orderForm.estimated_value || ''} onChange={e => setOrderForm(p => ({ ...p, estimated_value: parseFloat(e.target.value) || undefined }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Urgency</label>
                <select value={orderForm.urgency || 'normal'} onChange={e => setOrderForm(p => ({ ...p, urgency: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
