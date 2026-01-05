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
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  PenTool,
  Calendar,
  Building2,
  Shield,
} from 'lucide-react';

interface Agreement {
  id: string;
  agreement_number: string;
  title: string;
  client_name: string;
  type: 'nda' | 'sales' | 'service' | 'partnership' | 'supply';
  status: 'draft' | 'pending_signature' | 'signed' | 'expired' | 'terminated';
  start_date: string;
  end_date: string;
  value: number;
  created_at: string;
  terms: string[];
  signatory_client: string;
  signatory_company: string;
  signed_date: string | null;
}

const mockAgreements: Agreement[] = [
  {
    id: '1',
    agreement_number: 'AGR-2024-0001',
    title: 'Annual Supply Agreement',
    client_name: 'Textile Traders Pvt Ltd',
    type: 'supply',
    status: 'signed',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    value: 5000000,
    created_at: '2023-12-15',
    terms: [
      'Minimum order quantity: 100 units per month',
      'Payment terms: Net 30 days',
      'Quality standards as per ASTM specifications',
      'Delivery within 15 working days of confirmed order',
    ],
    signatory_client: 'Rajesh Sharma',
    signatory_company: 'Amit Verma',
    signed_date: '2023-12-20',
  },
  {
    id: '2',
    agreement_number: 'AGR-2024-0002',
    title: 'Non-Disclosure Agreement',
    client_name: 'Fashion Hub Exports',
    type: 'nda',
    status: 'signed',
    start_date: '2024-01-01',
    end_date: '2026-12-31',
    value: 0,
    created_at: '2024-01-05',
    terms: [
      'Confidentiality period: 3 years',
      'Covers all design and pricing information',
      'No disclosure to third parties',
      'Return of confidential materials upon termination',
    ],
    signatory_client: 'Priya Patel',
    signatory_company: 'Amit Verma',
    signed_date: '2024-01-08',
  },
  {
    id: '3',
    agreement_number: 'AGR-2024-0003',
    title: 'Exclusive Distribution Agreement',
    client_name: 'Saree Emporium',
    type: 'partnership',
    status: 'pending_signature',
    start_date: '2024-02-01',
    end_date: '2025-01-31',
    value: 2500000,
    created_at: '2024-01-10',
    terms: [
      'Exclusive distribution rights in UP & Bihar',
      'Minimum purchase commitment: ₹25L annually',
      'Marketing support provided',
      'Territory protection guaranteed',
    ],
    signatory_client: 'Pending',
    signatory_company: 'Amit Verma',
    signed_date: null,
  },
  {
    id: '4',
    agreement_number: 'AGR-2024-0004',
    title: 'Service Level Agreement',
    client_name: 'Modern Fabrics LLC',
    type: 'service',
    status: 'signed',
    start_date: '2024-01-15',
    end_date: '2025-01-14',
    value: 1000000,
    created_at: '2024-01-12',
    terms: [
      'Response time: 24 hours for inquiries',
      'Quality guarantee: 99% defect-free',
      'Free replacements for defective items',
      'Quarterly business reviews',
    ],
    signatory_client: 'Sarah Johnson',
    signatory_company: 'Amit Verma',
    signed_date: '2024-01-14',
  },
  {
    id: '5',
    agreement_number: 'AGR-2024-0005',
    title: 'Sales Agreement - Bridal Collection',
    client_name: 'Ethnic Wear House',
    type: 'sales',
    status: 'draft',
    start_date: '2024-02-01',
    end_date: '2024-07-31',
    value: 800000,
    created_at: '2024-01-14',
    terms: [
      'Custom bridal collection - 50 pieces',
      'Design approval required before production',
      '50% advance payment',
      'Balance before delivery',
    ],
    signatory_client: 'Pending',
    signatory_company: 'Pending',
    signed_date: null,
  },
];

const typeConfig = {
  nda: { label: 'NDA', color: 'bg-purple-500/20 text-purple-400' },
  sales: { label: 'Sales', color: 'bg-primary/20 text-primary' },
  service: { label: 'Service', color: 'bg-accent/20 text-accent' },
  partnership: { label: 'Partnership', color: 'bg-secondary/20 text-secondary' },
  supply: { label: 'Supply', color: 'bg-warning/20 text-warning' },
};

const statusConfig = {
  draft: { color: 'bg-muted text-muted-foreground', icon: Edit },
  pending_signature: { color: 'bg-warning/20 text-warning', icon: PenTool },
  signed: { color: 'bg-accent/20 text-accent', icon: CheckCircle },
  expired: { color: 'bg-destructive/20 text-destructive', icon: AlertCircle },
  terminated: { color: 'bg-muted text-muted-foreground', icon: Clock },
};

const Agreements = () => {
  const [agreements, setAgreements] = useState<Agreement[]>(mockAgreements);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = 
      agreement.agreement_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || agreement.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSendForSignature = (id: string) => {
    setAgreements(agreements.map(a => a.id === id ? { ...a, status: 'pending_signature' } : a));
    toast.success('Agreement sent for digital signature');
  };

  const activeAgreements = agreements.filter(a => a.status === 'signed').length;
  const pendingSignatures = agreements.filter(a => a.status === 'pending_signature').length;
  const totalValue = agreements.filter(a => a.status === 'signed').reduce((sum, a) => sum + a.value, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide">
              <span className="gradient-text">AGREEMENTS & T&C</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage client agreements, contracts, and terms
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={14} />
                New Agreement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Agreement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Agreement Title</Label>
                  <Input placeholder="e.g., Annual Supply Agreement" />
                </div>
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
                    <Label>Agreement Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                        <SelectItem value="sales">Sales Agreement</SelectItem>
                        <SelectItem value="service">Service Agreement</SelectItem>
                        <SelectItem value="partnership">Partnership Agreement</SelectItem>
                        <SelectItem value="supply">Supply Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Agreement Value (₹)</Label>
                  <Input type="number" placeholder="0 for NDA" />
                </div>
                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <Textarea placeholder="Enter key terms, one per line..." rows={5} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Signatory</Label>
                    <Input placeholder="Name of client representative" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Signatory</Label>
                    <Input placeholder="Name of company representative" />
                  </div>
                </div>
                <Button className="w-full">Create Agreement</Button>
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
                <p className="text-2xl font-bold">{agreements.length}</p>
                <p className="text-xs text-muted-foreground">Total Agreements</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeAgreements}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <PenTool size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingSignatures}</p>
                <p className="text-xs text-muted-foreground">Pending Signature</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Shield size={16} className="text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(totalValue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Contract Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search agreements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="nda">NDA</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="supply">Supply</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_signature">Pending</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agreements Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agreement #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgreements.map((agreement) => {
                const StatusIcon = statusConfig[agreement.status].icon;
                return (
                  <TableRow key={agreement.id}>
                    <TableCell className="font-mono font-medium">{agreement.agreement_number}</TableCell>
                    <TableCell>{agreement.title}</TableCell>
                    <TableCell>{agreement.client_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeConfig[agreement.type].color}`}>
                        {typeConfig[agreement.type].label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{agreement.start_date}</p>
                        <p className="text-muted-foreground">to {agreement.end_date}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {agreement.value > 0 ? `₹${(agreement.value / 100000).toFixed(1)}L` : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig[agreement.status].color}`}>
                        <StatusIcon size={12} />
                        {agreement.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedAgreement(agreement); setIsViewDialogOpen(true); }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download size={14} />
                        </Button>
                        {agreement.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendForSignature(agreement.id)}
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

        {/* View Agreement Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agreement Details</DialogTitle>
            </DialogHeader>
            {selectedAgreement && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{selectedAgreement.title}</h3>
                    <p className="font-mono text-muted-foreground">{selectedAgreement.agreement_number}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium ${statusConfig[selectedAgreement.status].color}`}>
                    {selectedAgreement.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Client</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 size={14} className="text-primary" />
                        <span className="font-medium">{selectedAgreement.client_name}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Agreement Type</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${typeConfig[selectedAgreement.type].color}`}>
                        {typeConfig[selectedAgreement.type].label}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Agreement Period</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={14} className="text-primary" />
                        <span>{selectedAgreement.start_date} to {selectedAgreement.end_date}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contract Value</p>
                      <p className="font-bold text-lg">
                        {selectedAgreement.value > 0 ? `₹${selectedAgreement.value.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText size={14} className="text-primary" />
                    Terms & Conditions
                  </h4>
                  <ul className="space-y-2">
                    {selectedAgreement.terms.map((term, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="text-accent mt-0.5 shrink-0" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Client Signatory</p>
                    <p className="font-medium">{selectedAgreement.signatory_client}</p>
                    {selectedAgreement.signed_date && (
                      <p className="text-xs text-muted-foreground">Signed: {selectedAgreement.signed_date}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Company Signatory</p>
                    <p className="font-medium">{selectedAgreement.signatory_company}</p>
                    {selectedAgreement.signed_date && (
                      <p className="text-xs text-muted-foreground">Signed: {selectedAgreement.signed_date}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2">
                    <Download size={14} />
                    Download PDF
                  </Button>
                  {selectedAgreement.status === 'draft' && (
                    <Button variant="outline" className="flex-1 gap-2" onClick={() => handleSendForSignature(selectedAgreement.id)}>
                      <PenTool size={14} />
                      Request Signature
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 gap-2">
                    <Edit size={14} />
                    Edit
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

export default Agreements;
