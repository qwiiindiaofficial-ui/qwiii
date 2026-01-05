import { useState } from 'react';
import { Users, TrendingUp, Star, ShoppingCart, Plus, Search, Phone, Mail, MessageSquare, CreditCard, FileText, Edit2, Trash2, Eye, Filter, Download, Send, Clock, CheckCircle2, AlertTriangle, IndianRupee } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';
import { toast } from '@/hooks/use-toast';

const buyerData = [
  { name: 'Premium', value: 45 },
  { name: 'Regular', value: 120 },
  { name: 'Bulk', value: 35 },
  { name: 'New', value: 28 },
];

const buyers = [
  { id: 'B001', name: 'Sharma Textiles', contact: 'Rajesh Sharma', phone: '+91 98765 43210', email: 'rajesh@sharmatextiles.com', orders: 156, value: 4850000, tier: 'Premium', creditLimit: 1000000, outstanding: 250000, lastOrder: '2 days ago', status: 'active' },
  { id: 'B002', name: 'Delhi Emporium', contact: 'Priya Gupta', phone: '+91 87654 32109', email: 'priya@delhiemporium.com', orders: 89, value: 3210000, tier: 'Premium', creditLimit: 800000, outstanding: 0, lastOrder: '1 week ago', status: 'active' },
  { id: 'B003', name: 'Gujarat Traders', contact: 'Amit Patel', phone: '+91 76543 21098', email: 'amit@gujarattraders.com', orders: 67, value: 2480000, tier: 'Regular', creditLimit: 500000, outstanding: 120000, lastOrder: '3 days ago', status: 'active' },
  { id: 'B004', name: 'Royal Fabrics', contact: 'Meera Singh', phone: '+91 65432 10987', email: 'meera@royalfabrics.com', orders: 45, value: 1890000, tier: 'Regular', creditLimit: 400000, outstanding: 380000, lastOrder: '2 weeks ago', status: 'warning' },
  { id: 'B005', name: 'Sunrise Retail', contact: 'Vikram Joshi', phone: '+91 54321 09876', email: 'vikram@sunriseretail.com', orders: 12, value: 450000, tier: 'New', creditLimit: 200000, outstanding: 0, lastOrder: '1 day ago', status: 'active' },
];

const communications = [
  { buyer: 'Sharma Textiles', type: 'call', message: 'Discussed Q1 order forecast', time: '2 hours ago', by: 'Sales Team' },
  { buyer: 'Delhi Emporium', type: 'email', message: 'Sent new catalogue PDF', time: '4 hours ago', by: 'Marketing' },
  { buyer: 'Gujarat Traders', type: 'whatsapp', message: 'Order confirmation sent', time: '1 day ago', by: 'Operations' },
];

type ViewMode = 'list' | 'cards';
type ModalType = 'add' | 'edit' | 'message' | 'credit' | null;

const Buyers = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<typeof buyers[0] | null>(null);
  
  // Form states
  const [newBuyer, setNewBuyer] = useState({ name: '', contact: '', phone: '', email: '', creditLimit: '' });
  const [messageForm, setMessageForm] = useState({ type: 'whatsapp', message: '' });
  const [creditForm, setCreditForm] = useState({ newLimit: '', reason: '' });

  const filteredBuyers = buyers.filter(b => 
    (selectedTier === 'All' || b.tier === selectedTier) &&
    (b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.contact.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddBuyer = () => {
    toast({ title: "Buyer Added", description: `${newBuyer.name} has been added to the system.` });
    setActiveModal(null);
    setNewBuyer({ name: '', contact: '', phone: '', email: '', creditLimit: '' });
  };

  const handleSendMessage = () => {
    toast({ title: "Message Sent", description: `${messageForm.type} message sent to ${selectedBuyer?.name}` });
    setActiveModal(null);
    setMessageForm({ type: 'whatsapp', message: '' });
  };

  const handleUpdateCredit = () => {
    toast({ title: "Credit Updated", description: `Credit limit updated to ₹${creditForm.newLimit} for ${selectedBuyer?.name}` });
    setActiveModal(null);
    setCreditForm({ newLimit: '', reason: '' });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">BUYER MANAGEMENT</h1>
            <p className="page-subtitle">CRM • Relationship tracking • Credit management</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveModal('add')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} />
              Add Buyer
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Buyers" value={<AnimatedCounter value={384} duration={1500} />} icon={<Users size={16} />} />
          <MetricCard title="Active" value="228" change="+12" changeType="positive" icon={<ShoppingCart size={16} />} />
          <MetricCard title="Avg LTV" value="₹4.2L" icon={<TrendingUp size={16} />} />
          <MetricCard title="NPS Score" value="72" icon={<Star size={16} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Buyer Segments Chart */}
          <BarChartCard data={buyerData} title="Buyer Segments" height={200} />
          
          {/* Quick Actions Panel */}
          <div className="glass-card p-4">
            <h3 className="section-title"><Star size={14} className="text-primary" /> Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => { setSelectedBuyer(buyers[0]); setActiveModal('message'); }}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 text-left transition-colors"
              >
                <MessageSquare size={20} className="text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">Bulk Message</p>
                <p className="text-xs text-muted-foreground">Send to all buyers</p>
              </button>
              <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 text-left transition-colors">
                <FileText size={20} className="text-secondary mb-2" />
                <p className="text-sm font-medium text-foreground">Send Catalogue</p>
                <p className="text-xs text-muted-foreground">Share new designs</p>
              </button>
              <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 text-left transition-colors">
                <CreditCard size={20} className="text-accent mb-2" />
                <p className="text-sm font-medium text-foreground">Payment Reminder</p>
                <p className="text-xs text-muted-foreground">12 pending</p>
              </button>
              <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 text-left transition-colors">
                <TrendingUp size={20} className="text-warning mb-2" />
                <p className="text-sm font-medium text-foreground">Credit Review</p>
                <p className="text-xs text-muted-foreground">5 need review</p>
              </button>
            </div>
          </div>

          {/* Recent Communications */}
          <div className="glass-card p-4">
            <h3 className="section-title"><MessageSquare size={14} className="text-primary" /> Recent Communications</h3>
            <div className="space-y-3 mt-4">
              {communications.map((comm, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    comm.type === 'call' ? 'bg-accent/20' : comm.type === 'email' ? 'bg-primary/20' : 'bg-secondary/20'
                  }`}>
                    {comm.type === 'call' ? <Phone size={14} className="text-accent" /> :
                     comm.type === 'email' ? <Mail size={14} className="text-primary" /> :
                     <MessageSquare size={14} className="text-secondary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{comm.buyer}</p>
                    <p className="text-xs text-muted-foreground">{comm.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{comm.time} • {comm.by}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-xs text-primary hover:underline">View All Communications</button>
            </div>
          </div>
        </div>

        {/* Buyer Table with Actions */}
        <div className="glass-card">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search buyers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              
              <div className="flex items-center gap-2">
                {['All', 'Premium', 'Regular', 'Bulk', 'New'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedTier === tier
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Buyer</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Contact</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Tier</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Orders</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Total Value</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Credit</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Outstanding</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                          {buyer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{buyer.name}</p>
                          <p className="text-xs text-muted-foreground">{buyer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-foreground">{buyer.contact}</p>
                      <p className="text-xs text-muted-foreground">{buyer.phone}</p>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        buyer.tier === 'Premium' ? 'bg-warning/20 text-warning' :
                        buyer.tier === 'Regular' ? 'bg-primary/20 text-primary' :
                        buyer.tier === 'Bulk' ? 'bg-secondary/20 text-secondary' :
                        'bg-accent/20 text-accent'
                      }`}>
                        {buyer.tier}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-medium text-foreground">{buyer.orders}</td>
                    <td className="p-3 text-sm font-medium text-accent">₹{(buyer.value / 100000).toFixed(1)}L</td>
                    <td className="p-3 text-sm text-foreground">₹{(buyer.creditLimit / 100000).toFixed(1)}L</td>
                    <td className="p-3">
                      <span className={`text-sm font-medium ${
                        buyer.outstanding > buyer.creditLimit * 0.8 ? 'text-destructive' :
                        buyer.outstanding > 0 ? 'text-warning' : 'text-accent'
                      }`}>
                        ₹{(buyer.outstanding / 100000).toFixed(1)}L
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => { setSelectedBuyer(buyer); setActiveModal('message'); }}
                          className="p-1.5 rounded hover:bg-muted transition-colors" title="Message"
                        >
                          <MessageSquare size={14} className="text-primary" />
                        </button>
                        <button 
                          onClick={() => { setSelectedBuyer(buyer); setActiveModal('credit'); }}
                          className="p-1.5 rounded hover:bg-muted transition-colors" title="Credit"
                        >
                          <CreditCard size={14} className="text-accent" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Call">
                          <Phone size={14} className="text-muted-foreground" />
                        </button>
                        <button 
                          onClick={() => { setSelectedBuyer(buyer); setActiveModal('edit'); }}
                          className="p-1.5 rounded hover:bg-muted transition-colors" title="Edit"
                        >
                          <Edit2 size={14} className="text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {activeModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-6 animate-scale-in">
              {activeModal === 'add' && (
                <>
                  <h2 className="text-lg font-bold text-foreground mb-4">Add New Buyer</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Business Name *</label>
                      <input
                        type="text"
                        value={newBuyer.name}
                        onChange={(e) => setNewBuyer({ ...newBuyer, name: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                        placeholder="Enter business name"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Contact Person *</label>
                      <input
                        type="text"
                        value={newBuyer.contact}
                        onChange={(e) => setNewBuyer({ ...newBuyer, contact: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Phone *</label>
                        <input
                          type="tel"
                          value={newBuyer.phone}
                          onChange={(e) => setNewBuyer({ ...newBuyer, phone: e.target.value })}
                          className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Email</label>
                        <input
                          type="email"
                          value={newBuyer.email}
                          onChange={(e) => setNewBuyer({ ...newBuyer, email: e.target.value })}
                          className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Initial Credit Limit (₹)</label>
                      <input
                        type="number"
                        value={newBuyer.creditLimit}
                        onChange={(e) => setNewBuyer({ ...newBuyer, creditLimit: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                        placeholder="100000"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
                    <button onClick={handleAddBuyer} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90">Add Buyer</button>
                  </div>
                </>
              )}

              {activeModal === 'message' && selectedBuyer && (
                <>
                  <h2 className="text-lg font-bold text-foreground mb-4">Send Message to {selectedBuyer.name}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Channel</label>
                      <div className="flex items-center gap-2 mt-2">
                        {['whatsapp', 'email', 'sms'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setMessageForm({ ...messageForm, type })}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                              messageForm.type === type
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Message Template</label>
                      <select className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                        <option>-- Select Template --</option>
                        <option>Order Confirmation</option>
                        <option>Payment Reminder</option>
                        <option>New Catalogue</option>
                        <option>Festival Greetings</option>
                        <option>Custom Message</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Message</label>
                      <textarea
                        value={messageForm.message}
                        onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                        rows={4}
                        className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                        placeholder="Type your message..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
                    <button onClick={handleSendMessage} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 flex items-center justify-center gap-2">
                      <Send size={16} />
                      Send
                    </button>
                  </div>
                </>
              )}

              {activeModal === 'credit' && selectedBuyer && (
                <>
                  <h2 className="text-lg font-bold text-foreground mb-4">Update Credit - {selectedBuyer.name}</h2>
                  <div className="p-4 rounded-lg bg-muted/30 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Current Limit</span>
                      <span className="text-sm font-medium text-foreground">₹{(selectedBuyer.creditLimit / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Outstanding</span>
                      <span className="text-sm font-medium text-warning">₹{(selectedBuyer.outstanding / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Available</span>
                      <span className="text-sm font-medium text-accent">₹{((selectedBuyer.creditLimit - selectedBuyer.outstanding) / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">New Credit Limit (₹)</label>
                      <input
                        type="number"
                        value={creditForm.newLimit}
                        onChange={(e) => setCreditForm({ ...creditForm, newLimit: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                        placeholder={selectedBuyer.creditLimit.toString()}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Reason for Change</label>
                      <select 
                        value={creditForm.reason}
                        onChange={(e) => setCreditForm({ ...creditForm, reason: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="">-- Select Reason --</option>
                        <option value="good_history">Good Payment History</option>
                        <option value="increased_orders">Increased Order Volume</option>
                        <option value="special_request">Special Request</option>
                        <option value="risk_reduction">Risk Reduction</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
                    <button onClick={handleUpdateCredit} className="flex-1 py-2 rounded-lg bg-accent text-accent-foreground text-sm hover:bg-accent/90">Update Credit</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Buyers;