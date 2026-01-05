import { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, BarChart3, Search, Filter, Plus, Download, RefreshCw, Edit2, Trash2, Eye, ArrowUpDown, CheckCircle2, XCircle, Bell, Settings } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';

const stockData = [
  { name: 'Silk', value: 2400 },
  { name: 'Cotton', value: 4200 },
  { name: 'Georgette', value: 1800 },
  { name: 'Chiffon', value: 1200 },
];

const categoryStock = [
  { name: 'In Stock', value: 65 },
  { name: 'Low Stock', value: 25 },
  { name: 'Out of Stock', value: 10 },
];

const inventoryItems = [
  { id: 'SKU-2847', name: 'Banarasi Silk Saree - Red', category: 'Sarees', stock: 245, reorder: 50, status: 'in_stock', price: 12500, lastUpdated: '2h ago' },
  { id: 'SKU-1923', name: 'Designer Lehenga Set', category: 'Lehengas', stock: 12, reorder: 20, status: 'low_stock', price: 28000, lastUpdated: '1h ago' },
  { id: 'SKU-4521', name: 'Cotton Kurta - Blue', category: 'Kurtas', stock: 0, reorder: 100, status: 'out_of_stock', price: 2500, lastUpdated: '30m ago' },
  { id: 'SKU-3847', name: 'Embroidered Dupatta', category: 'Accessories', stock: 456, reorder: 50, status: 'in_stock', price: 1800, lastUpdated: '4h ago' },
  { id: 'SKU-5123', name: 'Bridal Collection Set', category: 'Bridal', stock: 8, reorder: 15, status: 'low_stock', price: 85000, lastUpdated: '6h ago' },
  { id: 'SKU-6789', name: 'Festive Saree - Gold', category: 'Sarees', stock: 189, reorder: 40, status: 'in_stock', price: 8500, lastUpdated: '1d ago' },
];

const reorderAlerts = [
  { sku: 'SKU-4521', name: 'Cotton Kurta - Blue', required: 100, priority: 'critical' },
  { sku: 'SKU-1923', name: 'Designer Lehenga Set', required: 20, priority: 'high' },
  { sku: 'SKU-5123', name: 'Bridal Collection Set', required: 15, priority: 'medium' },
];

const categories = ['All', 'Sarees', 'Lehengas', 'Kurtas', 'Accessories', 'Bridal'];

type SortField = 'name' | 'stock' | 'price' | 'category';
type SortOrder = 'asc' | 'desc';

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showReorderModal, setShowReorderModal] = useState(false);

  const filteredItems = inventoryItems
    .filter(item => 
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.id.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(i => i.id));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">INVENTORY MANAGEMENT</h1>
            <p className="page-subtitle">Smart stock tracking • Automated reorder alerts</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={16} />
              Add Product
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total SKUs"
            value={<AnimatedCounter value={12847} duration={1500} />}
            icon={<Package size={16} />}
            subtitle="active products"
          />
          <MetricCard
            title="Low Stock"
            value="156"
            change="+12"
            changeType="negative"
            icon={<AlertTriangle size={16} />}
            subtitle="needs attention"
          />
          <MetricCard
            title="Out of Stock"
            value="89"
            change="-15"
            changeType="positive"
            icon={<TrendingDown size={16} />}
            subtitle="from last week"
          />
          <MetricCard
            title="Turnover Rate"
            value="4.2x"
            change="+0.3"
            changeType="positive"
            icon={<BarChart3 size={16} />}
            subtitle="monthly average"
          />
        </div>

        {/* Charts & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BarChartCard
            data={stockData}
            title="Raw Material Stock"
            subtitle="Units by fabric type"
            height={200}
          />
          <DonutChartCard
            data={categoryStock}
            title="Stock Health"
            centerValue="65%"
            centerLabel="Healthy"
            height={150}
          />
          
          {/* Reorder Alerts */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0">
                <Bell size={14} className="text-warning" />
                Reorder Alerts
              </h3>
              <button 
                onClick={() => setShowReorderModal(true)}
                className="text-xs text-primary hover:underline"
              >
                Reorder All
              </button>
            </div>
            <div className="space-y-2">
              {reorderAlerts.map((alert, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${
                  alert.priority === 'critical' ? 'bg-destructive/10 border-destructive/30' :
                  alert.priority === 'high' ? 'bg-warning/10 border-warning/30' :
                  'bg-muted/30 border-border'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    alert.priority === 'critical' ? 'bg-destructive animate-pulse' :
                    alert.priority === 'high' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.name}</p>
                    <p className="text-xs text-muted-foreground">{alert.sku} • Need {alert.required} units</p>
                  </div>
                  <button className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="glass-card">
          {/* Table Header with Search & Filters */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              {/* Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-foreground">
                  {selectedItems.length} item(s) selected
                </span>
                <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">
                  Bulk Update
                </button>
                <button className="px-3 py-1 text-xs bg-accent text-accent-foreground rounded hover:bg-accent/90">
                  Export Selected
                </button>
                <button className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90">
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-primary"
                    />
                  </th>
                  <th className="p-3 text-left">
                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                      Product <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="p-3 text-left">
                    <button onClick={() => toggleSort('category')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                      Category <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="p-3 text-left">
                    <button onClick={() => toggleSort('stock')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                      Stock <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="p-3 text-left">
                    <button onClick={() => toggleSort('price')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                      Price <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Updated</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-4 h-4 accent-primary"
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.id}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.stock}</p>
                        <p className="text-xs text-muted-foreground">Reorder: {item.reorder}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                        item.status === 'in_stock' ? 'bg-accent/20 text-accent' :
                        item.status === 'low_stock' ? 'bg-warning/20 text-warning' :
                        'bg-destructive/20 text-destructive'
                      }`}>
                        {item.status === 'in_stock' ? <CheckCircle2 size={10} /> :
                         item.status === 'low_stock' ? <AlertTriangle size={10} /> :
                         <XCircle size={10} />}
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-medium text-foreground">
                      ₹{item.price.toLocaleString()}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {item.lastUpdated}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded hover:bg-muted transition-colors" title="View">
                          <Eye size={14} className="text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Edit">
                          <Edit2 size={14} className="text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-destructive/10 transition-colors" title="Delete">
                          <Trash2 size={14} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {inventoryItems.length} items
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground">
                1
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground">
                2
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;