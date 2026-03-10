import { useState } from 'react';
import { Package, TriangleAlert as AlertTriangle, TrendingDown, Search, Plus, CreditCard as Edit2, Trash2, ArrowUpDown, CircleCheck as CheckCircle2, Circle as XCircle, Bell, X } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';
import { useInventory, CreateInventoryItemInput } from '@/hooks/useInventory';
import { toast } from '@/hooks/use-toast';

type SortField = 'name' | 'stock' | 'price' | 'category';
type SortOrder = 'asc' | 'desc';

const emptyForm: CreateInventoryItemInput = {
  sku: '',
  name: '',
  category: 'Sarees',
  stock: 0,
  reorder_level: 10,
  price: 0,
};

const Inventory = () => {
  const { items, loading, stats, createItem, updateItem, deleteItem } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<typeof items[0] | null>(null);
  const [form, setForm] = useState<CreateInventoryItemInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category))).filter(Boolean)];

  const filteredItems = items
    .filter(item =>
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const aVal = a[sortField as keyof typeof a] as string | number;
      const bVal = b[sortField as keyof typeof b] as string | number;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  const reorderAlerts = items.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').slice(0, 5);

  const stockData = Array.from(new Set(items.map(i => i.category))).slice(0, 5).map(cat => ({
    name: cat,
    value: items.filter(i => i.category === cat).reduce((s, i) => s + i.stock, 0),
  }));

  const categoryStock = [
    { name: 'In Stock', value: stats.inStock },
    { name: 'Low Stock', value: stats.lowStock },
    { name: 'Out of Stock', value: stats.outOfStock },
  ].filter(d => d.value > 0);

  const toggleSort = (field: SortField) => {
    if (sortField === field) { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }
    else { setSortField(field); setSortOrder('asc'); }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedItems(selectedItems.length === filteredItems.length ? [] : filteredItems.map(i => i.id));
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowAddModal(true);
  };

  const openEdit = (item: typeof items[0]) => {
    setEditItem(item);
    setForm({ sku: item.sku, name: item.name, category: item.category, stock: item.stock, reorder_level: item.reorder_level, price: item.price });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.sku) { toast({ title: 'Name and SKU required', variant: 'destructive' }); return; }
    setSaving(true);
    if (editItem) {
      await updateItem(editItem.id, form);
    } else {
      await createItem(form);
    }
    setSaving(false);
    setShowAddModal(false);
    setForm(emptyForm);
    setEditItem(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setSelectedItems(prev => prev.filter(i => i !== id));
    await deleteItem(id);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">INVENTORY MANAGEMENT</h1>
            <p className="page-subtitle">Smart stock tracking • Automated reorder alerts</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total SKUs" value={<AnimatedCounter value={stats.total} duration={1500} />} icon={<Package size={16} />} subtitle="active products" />
          <MetricCard title="In Stock" value={stats.inStock.toString()} changeType="positive" icon={<CheckCircle2 size={16} />} subtitle="healthy" />
          <MetricCard title="Low Stock" value={stats.lowStock.toString()} changeType="negative" icon={<AlertTriangle size={16} />} subtitle="needs attention" />
          <MetricCard title="Out of Stock" value={stats.outOfStock.toString()} icon={<TrendingDown size={16} />} subtitle="critical" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BarChartCard
            data={stockData.length > 0 ? stockData : [{ name: 'No data', value: 0 }]}
            title="Stock by Category"
            subtitle="Units by category"
            height={200}
          />
          <DonutChartCard
            data={categoryStock.length > 0 ? categoryStock : [{ name: 'No items', value: 1 }]}
            title="Stock Health"
            centerValue={stats.total > 0 ? `${Math.round((stats.inStock / stats.total) * 100)}%` : '0%'}
            centerLabel="Healthy"
            height={150}
          />
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0 flex items-center gap-2">
                <Bell size={14} className="text-warning" />
                Reorder Alerts
              </h3>
            </div>
            {reorderAlerts.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 size={24} className="text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">All stock levels healthy</p>
              </div>
            ) : (
              <div className="space-y-2">
                {reorderAlerts.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    item.status === 'out_of_stock' ? 'bg-destructive/10 border-destructive/30' : 'bg-warning/10 border-warning/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${item.status === 'out_of_stock' ? 'bg-destructive animate-pulse' : 'bg-warning'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku} • {item.stock} left</p>
                    </div>
                    <span className={`text-xs font-medium ${item.status === 'out_of_stock' ? 'text-destructive' : 'text-warning'}`}>
                      {item.status === 'out_of_stock' ? 'Critical' : 'Low'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="glass-card">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-foreground">{selectedItems.length} selected</span>
                <button className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                  onClick={async () => { for (const id of selectedItems) await deleteItem(id); setSelectedItems([]); }}>
                  Delete Selected
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading inventory...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{items.length === 0 ? 'No inventory items yet' : 'No items match your search'}</p>
              {items.length === 0 && <button onClick={openAdd} className="mt-2 text-xs text-primary hover:underline">Add first item</button>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-3 text-left">
                      <input type="checkbox" checked={selectedItems.length === filteredItems.length && filteredItems.length > 0} onChange={toggleSelectAll} className="w-4 h-4 accent-primary" />
                    </th>
                    <th className="p-3 text-left">
                      <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">Product <ArrowUpDown size={12} /></button>
                    </th>
                    <th className="p-3 text-left">
                      <button onClick={() => toggleSort('category')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">Category <ArrowUpDown size={12} /></button>
                    </th>
                    <th className="p-3 text-left">
                      <button onClick={() => toggleSort('stock')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">Stock <ArrowUpDown size={12} /></button>
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="p-3 text-left">
                      <button onClick={() => toggleSort('price')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">Price <ArrowUpDown size={12} /></button>
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelectItem(item.id)} className="w-4 h-4 accent-primary" />
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.sku}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">{item.category}</span>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.stock}</p>
                          <p className="text-xs text-muted-foreground">Reorder: {item.reorder_level}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                          item.status === 'in_stock' ? 'bg-accent/20 text-accent' :
                          item.status === 'low_stock' ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {item.status === 'in_stock' ? <CheckCircle2 size={10} /> : item.status === 'low_stock' ? <AlertTriangle size={10} /> : <XCircle size={10} />}
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-sm font-medium text-foreground">₹{item.price.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded hover:bg-muted transition-colors" onClick={() => openEdit(item)} title="Edit">
                            <Edit2 size={14} className="text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-destructive/10 transition-colors" onClick={() => handleDelete(item.id, item.name)} title="Delete">
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

          <div className="p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Showing {filteredItems.length} of {items.length} items</p>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{editItem ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">SKU *</label>
                    <input type="text" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. SKU-001" className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Category</label>
                    <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Sarees" className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Product Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Banarasi Silk Saree" className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Reorder At</label>
                    <input type="number" value={form.reorder_level} onChange={e => setForm({ ...form, reorder_level: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Price (₹)</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                    {saving ? 'Saving...' : editItem ? 'Update' : 'Add Item'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
