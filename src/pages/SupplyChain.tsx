import { useState } from 'react';
import { Truck, MapPin, Clock, Package, Plus, Search, Building2, Phone, Star, AlertTriangle, CheckCircle2, XCircle, RefreshCw, FileText, ArrowRight, Navigation, Box } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import AreaChartCard from '@/components/charts/AreaChartCard';
import { toast } from '@/hooks/use-toast';

const deliveryData = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 48 },
  { name: 'Thu', value: 61 },
  { name: 'Fri', value: 55 },
];

const shipments = [
  { id: 'SHP-4521', buyer: 'Sharma Textiles', items: 50, status: 'in_transit', origin: 'Surat', destination: 'Delhi', eta: '2 days', carrier: 'BlueDart', tracking: 'BD123456789' },
  { id: 'SHP-4520', buyer: 'Delhi Emporium', items: 25, status: 'delivered', origin: 'Surat', destination: 'Delhi', eta: 'Delivered', carrier: 'DTDC', tracking: 'DT987654321' },
  { id: 'SHP-4519', buyer: 'Gujarat Traders', items: 100, status: 'processing', origin: 'Surat', destination: 'Ahmedabad', eta: '3 days', carrier: 'Pending', tracking: '-' },
  { id: 'SHP-4518', buyer: 'Royal Fabrics', items: 75, status: 'delayed', origin: 'Surat', destination: 'Mumbai', eta: '1 day delayed', carrier: 'Delhivery', tracking: 'DL456789123' },
];

const vendors = [
  { id: 'V001', name: 'Silk Masters Pvt Ltd', category: 'Raw Materials', rating: 4.8, orders: 245, onTime: 96, location: 'Varanasi', status: 'active' },
  { id: 'V002', name: 'Cotton Kings', category: 'Fabrics', rating: 4.5, orders: 189, onTime: 92, location: 'Ahmedabad', status: 'active' },
  { id: 'V003', name: 'Zari Works', category: 'Accessories', rating: 4.2, orders: 156, onTime: 88, location: 'Surat', status: 'active' },
  { id: 'V004', name: 'Dye House India', category: 'Chemicals', rating: 3.9, orders: 78, onTime: 85, location: 'Mumbai', status: 'warning' },
];

const pendingOrders = [
  { vendor: 'Silk Masters Pvt Ltd', material: 'Banarasi Silk - Red', quantity: '500 meters', value: '₹2.5L', urgency: 'high' },
  { vendor: 'Cotton Kings', material: 'Premium Cotton', quantity: '1000 meters', value: '₹80K', urgency: 'medium' },
  { vendor: 'Zari Works', material: 'Gold Zari Thread', quantity: '50 kg', value: '₹1.2L', urgency: 'low' },
];

type ViewTab = 'shipments' | 'vendors' | 'orders';
type ModalType = 'track' | 'order' | 'vendor' | null;

const SupplyChain = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('shipments');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedShipment, setSelectedShipment] = useState<typeof shipments[0] | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null);
  
  // Order form
  const [orderForm, setOrderForm] = useState({
    vendor: '',
    material: '',
    quantity: '',
    urgency: 'medium',
    notes: ''
  });

  const handlePlaceOrder = () => {
    toast({ title: "Order Placed", description: `Order placed with ${orderForm.vendor}` });
    setActiveModal(null);
    setOrderForm({ vendor: '', material: '', quantity: '', urgency: 'medium', notes: '' });
  };

  const handleRefreshTracking = (shipmentId: string) => {
    toast({ title: "Tracking Updated", description: `Latest status fetched for ${shipmentId}` });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">SUPPLY CHAIN</h1>
            <p className="page-subtitle">End-to-end logistics • Vendor management • Order tracking</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveModal('order')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              <Plus size={16} />
              Place Order
            </button>
            <button 
              onClick={() => setActiveModal('vendor')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"
            >
              <Building2 size={16} />
              Add Vendor
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Active Shipments" value="28" icon={<Truck size={16} />} subtitle="in transit" />
          <MetricCard title="On-Time Delivery" value="94%" change="+2%" changeType="positive" icon={<Clock size={16} />} />
          <MetricCard title="Active Vendors" value="42" icon={<Building2 size={16} />} subtitle="approved" />
          <MetricCard title="Pending Orders" value="₹4.5L" icon={<Package size={16} />} subtitle="3 orders" />
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit">
          {[
            { id: 'shipments', label: 'Shipments', icon: Truck },
            { id: 'vendors', label: 'Vendors', icon: Building2 },
            { id: 'orders', label: 'Pending Orders', icon: Package },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ViewTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on tab */}
        {activeTab === 'shipments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-card">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="section-title mb-0"><Truck size={14} className="text-primary" /> Active Shipments</h3>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search shipments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary w-48"
                    />
                  </div>
                </div>
                <div className="divide-y divide-border/50">
                  {shipments.map((shipment) => (
                    <div key={shipment.id} className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-medium text-foreground">{shipment.id}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              shipment.status === 'delivered' ? 'bg-accent/20 text-accent' :
                              shipment.status === 'in_transit' ? 'bg-primary/20 text-primary' :
                              shipment.status === 'delayed' ? 'bg-destructive/20 text-destructive' :
                              'bg-warning/20 text-warning'
                            }`}>
                              {shipment.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mt-1">{shipment.buyer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleRefreshTracking(shipment.id)}
                            className="p-1.5 rounded hover:bg-muted transition-colors"
                          >
                            <RefreshCw size={14} className="text-muted-foreground" />
                          </button>
                          <button 
                            onClick={() => { setSelectedShipment(shipment); setActiveModal('track'); }}
                            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                          >
                            Track
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {shipment.origin} → {shipment.destination}
                        </div>
                        <div className="flex items-center gap-1">
                          <Box size={12} />
                          {shipment.items} items
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          ETA: {shipment.eta}
                        </div>
                        <div>{shipment.carrier}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AreaChartCard 
                data={deliveryData} 
                title="Deliveries This Week" 
                subtitle="Completed shipments per day" 
                height={200} 
                color="hsl(var(--accent))" 
              />
              
              <div className="glass-card p-4">
                <h3 className="section-title"><AlertTriangle size={14} className="text-warning" /> Delivery Issues</h3>
                <div className="space-y-3 mt-4">
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle size={14} className="text-destructive" />
                      <span className="text-sm font-medium text-foreground">SHP-4518 Delayed</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Weather conditions in Mumbai</p>
                    <button className="mt-2 text-xs text-primary hover:underline">Contact Carrier</button>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={14} className="text-warning" />
                      <span className="text-sm font-medium text-foreground">Address Verification</span>
                    </div>
                    <p className="text-xs text-muted-foreground">SHP-4517 needs address update</p>
                    <button className="mt-2 text-xs text-primary hover:underline">Update Address</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="glass-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="section-title mb-0"><Building2 size={14} className="text-primary" /> Vendor Directory</h3>
                <div className="flex items-center gap-2">
                  {['All', 'Raw Materials', 'Fabrics', 'Accessories'].map((cat) => (
                    <button key={cat} className="px-3 py-1.5 text-xs rounded-full bg-muted/50 text-muted-foreground hover:text-foreground">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Vendor</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Category</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Rating</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Orders</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">On-Time %</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Location</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                            <Building2 size={18} className="text-secondary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{vendor.name}</p>
                            <p className="text-xs text-muted-foreground">{vendor.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">{vendor.category}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-warning fill-warning" />
                          <span className="text-sm font-medium">{vendor.rating}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{vendor.orders}</td>
                      <td className="p-3">
                        <span className={`text-sm font-medium ${vendor.onTime >= 90 ? 'text-accent' : vendor.onTime >= 85 ? 'text-warning' : 'text-destructive'}`}>
                          {vendor.onTime}%
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{vendor.location}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { setSelectedVendor(vendor); setActiveModal('order'); }}
                            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                          >
                            Order
                          </button>
                          <button className="p-1.5 rounded hover:bg-muted">
                            <Phone size={14} className="text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-muted">
                            <FileText size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0"><Package size={14} className="text-primary" /> Pending Purchase Orders</h3>
                <button 
                  onClick={() => setActiveModal('order')}
                  className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  New Order
                </button>
              </div>
              <div className="space-y-3">
                {pendingOrders.map((order, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${
                    order.urgency === 'high' ? 'bg-destructive/5 border-destructive/30' :
                    order.urgency === 'medium' ? 'bg-warning/5 border-warning/30' :
                    'bg-muted/30 border-border'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.material}</p>
                        <p className="text-xs text-muted-foreground">{order.vendor}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        order.urgency === 'high' ? 'bg-destructive/20 text-destructive' :
                        order.urgency === 'medium' ? 'bg-warning/20 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {order.urgency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{order.quantity}</span>
                      <span className="font-medium text-foreground">{order.value}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button className="flex-1 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">
                        Approve & Send
                      </button>
                      <button className="flex-1 py-1.5 text-xs border border-border rounded hover:bg-muted">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title"><FileText size={14} className="text-primary" /> Quick Order Form</h3>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground">Select Vendor</label>
                  <select className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                    <option>-- Select Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Material / Product</label>
                  <input
                    type="text"
                    placeholder="Enter material name"
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Quantity</label>
                    <input
                      type="text"
                      placeholder="e.g., 500 meters"
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Urgency</label>
                    <select className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Special instructions..."
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                  Create Purchase Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Track Shipment Modal */}
        {activeModal === 'track' && selectedShipment && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Track Shipment</h2>
                  <p className="text-sm text-muted-foreground">{selectedShipment.id}</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 rounded-lg hover:bg-muted">
                  <XCircle size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <MapPin size={20} className="text-primary mx-auto mb-1" />
                    <p className="font-medium">{selectedShipment.origin}</p>
                    <p className="text-xs text-muted-foreground">Origin</p>
                  </div>
                  <div className="flex-1 mx-4 border-t-2 border-dashed border-primary/50 relative">
                    <Truck size={20} className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/30" />
                  </div>
                  <div className="text-center">
                    <Navigation size={20} className="text-accent mx-auto mb-1" />
                    <p className="font-medium">{selectedShipment.destination}</p>
                    <p className="text-xs text-muted-foreground">Destination</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Tracking Timeline</h3>
                <div className="space-y-3">
                  {[
                    { status: 'Order Placed', time: '2 days ago', done: true },
                    { status: 'Picked Up', time: '1 day ago', done: true },
                    { status: 'In Transit', time: '6 hours ago', done: true },
                    { status: 'Out for Delivery', time: 'Expected today', done: false },
                    { status: 'Delivered', time: 'Pending', done: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.done ? 'bg-accent' : 'bg-muted border-2 border-border'
                      }`}>
                        {step.done && <CheckCircle2 size={14} className="text-accent-foreground" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${step.done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{step.status}</p>
                        <p className="text-xs text-muted-foreground">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-muted">
                  Contact Carrier
                </button>
                <button className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90">
                  Get Updates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SupplyChain;