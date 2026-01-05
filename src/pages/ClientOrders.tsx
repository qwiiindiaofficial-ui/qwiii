import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  RefreshCw,
  IndianRupee,
} from 'lucide-react';

interface OrderItem {
  product: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Order {
  id: string;
  order_number: string;
  client_name: string;
  client_id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid';
  order_date: string;
  delivery_date: string;
  notes: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    order_number: 'ORD-2024-0001',
    client_name: 'Textile Traders Pvt Ltd',
    client_id: '1',
    items: [
      { product: 'Silk Saree - Royal Blue', sku: 'SS-RB-001', quantity: 50, unit_price: 2500, total: 125000 },
      { product: 'Cotton Fabric - White', sku: 'CF-W-002', quantity: 100, unit_price: 450, total: 45000 },
    ],
    subtotal: 170000,
    tax: 30600,
    discount: 5000,
    total: 195600,
    status: 'processing',
    payment_status: 'partial',
    order_date: '2024-01-10',
    delivery_date: '2024-01-20',
    notes: 'Urgent delivery required',
  },
  {
    id: '2',
    order_number: 'ORD-2024-0002',
    client_name: 'Fashion Hub Exports',
    client_id: '2',
    items: [
      { product: 'Designer Lehenga Set', sku: 'DL-001', quantity: 25, unit_price: 8500, total: 212500 },
    ],
    subtotal: 212500,
    tax: 38250,
    discount: 10625,
    total: 240125,
    status: 'confirmed',
    payment_status: 'pending',
    order_date: '2024-01-12',
    delivery_date: '2024-01-25',
    notes: 'Export order - packaging must be export quality',
  },
  {
    id: '3',
    order_number: 'ORD-2024-0003',
    client_name: 'Saree Emporium',
    client_id: '3',
    items: [
      { product: 'Banarasi Saree - Gold', sku: 'BS-G-001', quantity: 30, unit_price: 12000, total: 360000 },
      { product: 'Banarasi Saree - Silver', sku: 'BS-S-001', quantity: 20, unit_price: 11000, total: 220000 },
    ],
    subtotal: 580000,
    tax: 104400,
    discount: 29000,
    total: 655400,
    status: 'shipped',
    payment_status: 'paid',
    order_date: '2024-01-08',
    delivery_date: '2024-01-15',
    notes: 'Premium packaging requested',
  },
  {
    id: '4',
    order_number: 'ORD-2024-0004',
    client_name: 'Modern Fabrics LLC',
    client_id: '4',
    items: [
      { product: 'Printed Fabric Roll - Floral', sku: 'PF-FL-001', quantity: 200, unit_price: 350, total: 70000 },
    ],
    subtotal: 70000,
    tax: 0,
    discount: 0,
    total: 70000,
    status: 'delivered',
    payment_status: 'paid',
    order_date: '2024-01-05',
    delivery_date: '2024-01-10',
    notes: 'International shipping - DDP terms',
  },
  {
    id: '5',
    order_number: 'ORD-2024-0005',
    client_name: 'Ethnic Wear House',
    client_id: '5',
    items: [
      { product: 'Bridal Lehenga - Red', sku: 'BL-R-001', quantity: 5, unit_price: 45000, total: 225000 },
    ],
    subtotal: 225000,
    tax: 40500,
    discount: 0,
    total: 265500,
    status: 'pending',
    payment_status: 'pending',
    order_date: '2024-01-14',
    delivery_date: '2024-02-01',
    notes: 'Custom embroidery work',
  },
];

const statusConfig = {
  pending: { icon: Clock, color: 'text-warning bg-warning/20' },
  confirmed: { icon: CheckCircle, color: 'text-accent bg-accent/20' },
  processing: { icon: RefreshCw, color: 'text-primary bg-primary/20' },
  shipped: { icon: Truck, color: 'text-secondary bg-secondary/20' },
  delivered: { icon: Package, color: 'text-accent bg-accent/20' },
  cancelled: { icon: XCircle, color: 'text-destructive bg-destructive/20' },
};

const ClientOrders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order status updated to ${newStatus}`);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide">
              <span className="gradient-text">CLIENT ORDERS</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and manage all client orders
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={14} />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Textile Traders Pvt Ltd</SelectItem>
                        <SelectItem value="2">Fashion Hub Exports</SelectItem>
                        <SelectItem value="3">Saree Emporium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Order Items</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Silk Saree - Royal Blue</SelectItem>
                        <SelectItem value="2">Cotton Fabric - White</SelectItem>
                        <SelectItem value="3">Designer Lehenga Set</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Qty" />
                    <Input type="number" placeholder="Unit Price" />
                    <Button variant="outline">Add</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Order Notes</Label>
                  <Input placeholder="Any special instructions..." />
                </div>

                <Button className="w-full">Create Order</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShoppingCart size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingOrders}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Truck size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{shippedOrders}</p>
                <p className="text-xs text-muted-foreground">Shipped/Delivered</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <IndianRupee size={16} className="text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter size={14} className="mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download size={14} />
            Export
          </Button>
        </div>

        {/* Orders Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.order_number}</TableCell>
                    <TableCell>{order.client_name}</TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="font-medium">₹{(order.total / 1000).toFixed(0)}K</TableCell>
                    <TableCell>{order.order_date}</TableCell>
                    <TableCell>{order.delivery_date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig[order.status].color}`}>
                        <StatusIcon size={12} />
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.payment_status === 'paid' ? 'bg-accent/20 text-accent' :
                        order.payment_status === 'partial' ? 'bg-warning/20 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {order.payment_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedOrder(order); setIsViewDialogOpen(true); }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold font-mono">{selectedOrder.order_number}</h3>
                    <p className="text-muted-foreground">{selectedOrder.client_name}</p>
                  </div>
                  <div className="text-right">
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(v) => updateOrderStatus(selectedOrder.id, v as Order['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-medium">{selectedOrder.order_date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Date</p>
                    <p className="font-medium">{selectedOrder.delivery_date}</p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product}</TableCell>
                          <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{item.unit_price.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">₹{item.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (18%)</span>
                      <span>₹{selectedOrder.tax.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-accent">
                        <span>Discount</span>
                        <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2">
                    <FileText size={14} />
                    Generate Invoice
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download size={14} />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ClientOrders;
