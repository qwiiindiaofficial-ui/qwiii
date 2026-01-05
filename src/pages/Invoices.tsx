import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Send,
  Printer,
  CheckCircle,
  Clock,
  AlertCircle,
  IndianRupee,
  Calendar,
  Building2,
} from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  order_number: string;
  client_name: string;
  client_gst: string;
  items: { description: string; quantity: number; rate: number; amount: number }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  payment_date: string | null;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoice_number: 'INV-2024-0001',
    order_number: 'ORD-2024-0001',
    client_name: 'Textile Traders Pvt Ltd',
    client_gst: '24AAACT1234A1Z5',
    items: [
      { description: 'Silk Saree - Royal Blue (50 pcs)', quantity: 50, rate: 2500, amount: 125000 },
      { description: 'Cotton Fabric - White (100 mtrs)', quantity: 100, rate: 450, amount: 45000 },
    ],
    subtotal: 170000,
    cgst: 15300,
    sgst: 15300,
    igst: 0,
    total: 200600,
    status: 'sent',
    issue_date: '2024-01-10',
    due_date: '2024-01-25',
    payment_date: null,
  },
  {
    id: '2',
    invoice_number: 'INV-2024-0002',
    order_number: 'ORD-2024-0002',
    client_name: 'Fashion Hub Exports',
    client_gst: '27AABCF5678B2Z8',
    items: [
      { description: 'Designer Lehenga Set (25 pcs)', quantity: 25, rate: 8500, amount: 212500 },
    ],
    subtotal: 212500,
    cgst: 0,
    sgst: 0,
    igst: 38250,
    total: 250750,
    status: 'paid',
    issue_date: '2024-01-12',
    due_date: '2024-01-27',
    payment_date: '2024-01-20',
  },
  {
    id: '3',
    invoice_number: 'INV-2024-0003',
    order_number: 'ORD-2024-0003',
    client_name: 'Saree Emporium',
    client_gst: '09AADCS9012C3Z1',
    items: [
      { description: 'Banarasi Saree - Gold (30 pcs)', quantity: 30, rate: 12000, amount: 360000 },
      { description: 'Banarasi Saree - Silver (20 pcs)', quantity: 20, rate: 11000, amount: 220000 },
    ],
    subtotal: 580000,
    cgst: 0,
    sgst: 0,
    igst: 104400,
    total: 684400,
    status: 'paid',
    issue_date: '2024-01-08',
    due_date: '2024-01-23',
    payment_date: '2024-01-18',
  },
  {
    id: '4',
    invoice_number: 'INV-2024-0004',
    order_number: 'ORD-2024-0005',
    client_name: 'Ethnic Wear House',
    client_gst: '08AABCE3456D4Z2',
    items: [
      { description: 'Bridal Lehenga - Red (5 pcs)', quantity: 5, rate: 45000, amount: 225000 },
    ],
    subtotal: 225000,
    cgst: 0,
    sgst: 0,
    igst: 40500,
    total: 265500,
    status: 'overdue',
    issue_date: '2023-12-15',
    due_date: '2023-12-30',
    payment_date: null,
  },
  {
    id: '5',
    invoice_number: 'INV-2024-0005',
    order_number: 'ORD-2024-0006',
    client_name: 'Royal Textiles',
    client_gst: '07AABRT7890E5Z3',
    items: [
      { description: 'Chanderi Saree - Cream (40 pcs)', quantity: 40, rate: 3500, amount: 140000 },
    ],
    subtotal: 140000,
    cgst: 12600,
    sgst: 12600,
    igst: 0,
    total: 165200,
    status: 'draft',
    issue_date: '2024-01-14',
    due_date: '2024-01-29',
    payment_date: null,
  },
];

const statusConfig = {
  draft: { color: 'bg-muted text-muted-foreground', icon: FileText },
  sent: { color: 'bg-primary/20 text-primary', icon: Send },
  paid: { color: 'bg-accent/20 text-accent', icon: CheckCircle },
  overdue: { color: 'bg-destructive/20 text-destructive', icon: AlertCircle },
  cancelled: { color: 'bg-muted text-muted-foreground', icon: Clock },
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendInvoice = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'sent' } : inv));
    toast.success('Invoice sent to client');
  };

  const handleMarkPaid = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { 
      ...inv, 
      status: 'paid', 
      payment_date: new Date().toISOString().split('T')[0] 
    } : inv));
    toast.success('Invoice marked as paid');
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled').reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide">
              <span className="gradient-text">INVOICES</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Generate and manage GST compliant invoices
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={14} />
            Create Invoice
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <IndianRupee size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(totalAmount / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Total Invoiced</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(paidAmount / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Received</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(pendingAmount / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle size={16} className="text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(overdueAmount / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoices Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const StatusIcon = statusConfig[invoice.status].icon;
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.client_name}</p>
                        <p className="text-xs text-muted-foreground">{invoice.client_gst}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{invoice.order_number}</TableCell>
                    <TableCell className="font-medium">₹{invoice.total.toLocaleString()}</TableCell>
                    <TableCell>{invoice.issue_date}</TableCell>
                    <TableCell>{invoice.due_date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig[invoice.status].color}`}>
                        <StatusIcon size={12} />
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedInvoice(invoice); setIsViewDialogOpen(true); }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download size={14} />
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendInvoice(invoice.id)}
                          >
                            <Send size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* View Invoice Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6 p-4 bg-background border rounded-lg">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">QWII</h2>
                    <p className="text-sm text-muted-foreground">OPTIMIZE VISION</p>
                    <p className="text-xs text-muted-foreground mt-2">GST: 24AAAAQ1234Q1Z5</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold">TAX INVOICE</h3>
                    <p className="font-mono text-lg">{selectedInvoice.invoice_number}</p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bill To:</p>
                    <p className="font-semibold">{selectedInvoice.client_name}</p>
                    <p className="text-sm">GSTIN: {selectedInvoice.client_gst}</p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issue Date:</span>
                        <span>{selectedInvoice.issue_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{selectedInvoice.due_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Ref:</span>
                        <span className="font-mono">{selectedInvoice.order_number}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.rate.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    {selectedInvoice.cgst > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CGST (9%)</span>
                          <span>₹{selectedInvoice.cgst.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">SGST (9%)</span>
                          <span>₹{selectedInvoice.sgst.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    {selectedInvoice.igst > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IGST (18%)</span>
                        <span>₹{selectedInvoice.igst.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{selectedInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1 gap-2">
                    <Download size={14} />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Printer size={14} />
                    Print
                  </Button>
                  {selectedInvoice.status !== 'paid' && (
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => handleMarkPaid(selectedInvoice.id)}
                    >
                      <CheckCircle size={14} />
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
