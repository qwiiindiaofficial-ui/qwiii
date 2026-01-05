import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Send,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  IndianRupee,
} from 'lucide-react';

interface QuotationItem {
  product: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
}

interface Quotation {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  created_at: string;
  terms: string;
  notes: string;
}

const mockQuotations: Quotation[] = [
  {
    id: '1',
    quote_number: 'QT-2024-0001',
    client_name: 'Textile Traders Pvt Ltd',
    client_email: 'rajesh@textiletraders.com',
    items: [
      { product: 'Silk Saree Collection', description: 'Premium silk sarees in assorted colors', quantity: 100, unit_price: 2500, discount: 5, total: 237500 },
      { product: 'Cotton Fabric Roll', description: 'Pure cotton fabric - 50m rolls', quantity: 50, unit_price: 800, discount: 0, total: 40000 },
    ],
    subtotal: 277500,
    tax: 49950,
    discount: 13875,
    total: 313575,
    status: 'sent',
    valid_until: '2024-02-10',
    created_at: '2024-01-10',
    terms: 'Payment: 50% advance, 50% before delivery\nDelivery: Within 15 working days',
    notes: 'Special bulk order pricing applied',
  },
  {
    id: '2',
    quote_number: 'QT-2024-0002',
    client_name: 'Fashion Hub Exports',
    client_email: 'priya@fashionhub.com',
    items: [
      { product: 'Designer Lehenga Sets', description: 'Heavy embroidered lehengas with dupatta', quantity: 50, unit_price: 8500, discount: 10, total: 382500 },
    ],
    subtotal: 382500,
    tax: 68850,
    discount: 42500,
    total: 408850,
    status: 'accepted',
    valid_until: '2024-01-25',
    created_at: '2024-01-08',
    terms: 'FOB Mumbai\nPayment: Letter of Credit',
    notes: 'Export quality packaging required',
  },
  {
    id: '3',
    quote_number: 'QT-2024-0003',
    client_name: 'Royal Boutique',
    client_email: 'royal@boutique.com',
    items: [
      { product: 'Bridal Collection', description: 'Premium bridal wear with accessories', quantity: 10, unit_price: 45000, discount: 0, total: 450000 },
    ],
    subtotal: 450000,
    tax: 81000,
    discount: 0,
    total: 531000,
    status: 'draft',
    valid_until: '2024-02-15',
    created_at: '2024-01-14',
    terms: 'Custom designs - 3 revisions included\nDelivery: 30 working days',
    notes: 'Client requested custom embroidery patterns',
  },
  {
    id: '4',
    quote_number: 'QT-2024-0004',
    client_name: 'Saree Emporium',
    client_email: 'amit@sareeemporium.com',
    items: [
      { product: 'Banarasi Saree Premium', description: 'Handwoven Banarasi silk sarees', quantity: 30, unit_price: 12000, discount: 8, total: 331200 },
    ],
    subtotal: 331200,
    tax: 59616,
    discount: 28800,
    total: 362016,
    status: 'rejected',
    valid_until: '2024-01-20',
    created_at: '2024-01-05',
    terms: 'Standard terms apply',
    notes: 'Client found cheaper alternative - consider price revision',
  },
  {
    id: '5',
    quote_number: 'QT-2024-0005',
    client_name: 'Trendy Fashions',
    client_email: 'info@trendyfashions.com',
    items: [
      { product: 'Summer Collection', description: 'Light cotton kurtas and palazzos', quantity: 200, unit_price: 1200, discount: 15, total: 204000 },
    ],
    subtotal: 204000,
    tax: 36720,
    discount: 36000,
    total: 204720,
    status: 'expired',
    valid_until: '2024-01-01',
    created_at: '2023-12-15',
    terms: 'Standard terms apply',
    notes: 'Quote expired - follow up with client',
  },
];

const statusConfig = {
  draft: { color: 'bg-muted text-muted-foreground', icon: FileText },
  sent: { color: 'bg-primary/20 text-primary', icon: Send },
  accepted: { color: 'bg-accent/20 text-accent', icon: CheckCircle },
  rejected: { color: 'bg-destructive/20 text-destructive', icon: XCircle },
  expired: { color: 'bg-warning/20 text-warning', icon: Clock },
};

const Quotations = () => {
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredQuotations = quotations.filter(quote => {
    const matchesSearch = 
      quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendQuote = (id: string) => {
    setQuotations(quotations.map(q => q.id === id ? { ...q, status: 'sent' } : q));
    toast.success('Quotation sent to client');
  };

  const handleDuplicate = (quote: Quotation) => {
    const newQuote = {
      ...quote,
      id: crypto.randomUUID(),
      quote_number: `QT-2024-${String(quotations.length + 1).padStart(4, '0')}`,
      status: 'draft' as const,
      created_at: new Date().toISOString().split('T')[0],
    };
    setQuotations([newQuote, ...quotations]);
    toast.success('Quotation duplicated');
  };

  const handleConvertToOrder = (quote: Quotation) => {
    toast.success(`Converting ${quote.quote_number} to order...`);
  };

  const totalQuoted = quotations.reduce((sum, q) => sum + q.total, 0);
  const acceptedValue = quotations.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0);
  const conversionRate = quotations.length > 0 ? 
    ((quotations.filter(q => q.status === 'accepted').length / quotations.length) * 100).toFixed(0) : 0;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide">
              <span className="gradient-text">QUOTATIONS</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage price quotations for clients
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={14} />
                New Quotation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Quotation</DialogTitle>
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
                    <Label>Valid Until</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Add Items</h4>
                  <div className="grid grid-cols-5 gap-2">
                    <Input placeholder="Product" className="col-span-2" />
                    <Input type="number" placeholder="Qty" />
                    <Input type="number" placeholder="Rate" />
                    <Button variant="outline">Add</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Add products to this quotation</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Terms & Conditions</Label>
                    <Textarea placeholder="Payment terms, delivery conditions..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea placeholder="Internal notes..." rows={3} />
                  </div>
                </div>

                <Button className="w-full">Create Quotation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quotations.length}</p>
                <p className="text-xs text-muted-foreground">Total Quotes</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <IndianRupee size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(totalQuoted / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Total Quoted</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <CheckCircle size={16} className="text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(acceptedValue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Accepted Value</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search quotations..."
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
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quotations Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quote) => {
                const StatusIcon = statusConfig[quote.status].icon;
                return (
                  <TableRow key={quote.id}>
                    <TableCell className="font-mono font-medium">{quote.quote_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{quote.client_name}</p>
                        <p className="text-xs text-muted-foreground">{quote.client_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{quote.items.length} items</TableCell>
                    <TableCell className="font-medium">₹{quote.total.toLocaleString()}</TableCell>
                    <TableCell>{quote.created_at}</TableCell>
                    <TableCell>{quote.valid_until}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig[quote.status].color}`}>
                        <StatusIcon size={12} />
                        {quote.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedQuote(quote); setIsViewDialogOpen(true); }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicate(quote)}
                        >
                          <Copy size={14} />
                        </Button>
                        {quote.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendQuote(quote.id)}
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

        {/* View Quote Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quotation Details</DialogTitle>
            </DialogHeader>
            {selectedQuote && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold font-mono">{selectedQuote.quote_number}</h3>
                    <p className="text-muted-foreground">{selectedQuote.client_name}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium ${statusConfig[selectedQuote.status].color}`}>
                    {selectedQuote.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{selectedQuote.created_at}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid Until</p>
                    <p className="font-medium">{selectedQuote.valid_until}</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Disc %</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuote.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.unit_price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.discount}%</TableCell>
                        <TableCell className="text-right font-medium">₹{item.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{selectedQuote.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (18%)</span>
                      <span>₹{selectedQuote.tax.toLocaleString()}</span>
                    </div>
                    {selectedQuote.discount > 0 && (
                      <div className="flex justify-between text-accent">
                        <span>Discount</span>
                        <span>-₹{selectedQuote.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{selectedQuote.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedQuote.terms && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Terms & Conditions</p>
                    <p className="text-sm whitespace-pre-line">{selectedQuote.terms}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedQuote.status === 'accepted' && (
                    <Button className="flex-1 gap-2" onClick={() => handleConvertToOrder(selectedQuote)}>
                      <CheckCircle size={14} />
                      Convert to Order
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download size={14} />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Send size={14} />
                    Send to Client
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

export default Quotations;
