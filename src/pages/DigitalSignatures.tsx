import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  PenTool,
  Search,
  Filter,
  Eye,
  Download,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Mail,
  User,
  Calendar,
  Shield,
  Link2,
  Copy,
  RefreshCw,
} from 'lucide-react';

interface SignatureRequest {
  id: string;
  document_name: string;
  document_type: 'quotation' | 'invoice' | 'agreement' | 'order';
  document_number: string;
  client_name: string;
  client_email: string;
  signatory_name: string;
  status: 'pending' | 'viewed' | 'signed' | 'declined' | 'expired';
  sent_at: string;
  signed_at: string | null;
  expires_at: string;
  signature_link: string;
  ip_address: string | null;
}

const mockSignatures: SignatureRequest[] = [
  {
    id: '1',
    document_name: 'Annual Supply Agreement',
    document_type: 'agreement',
    document_number: 'AGR-2024-0001',
    client_name: 'Textile Traders Pvt Ltd',
    client_email: 'rajesh@textiletraders.com',
    signatory_name: 'Rajesh Sharma',
    status: 'signed',
    sent_at: '2023-12-15',
    signed_at: '2023-12-20',
    expires_at: '2023-12-25',
    signature_link: 'https://sign.qwii.com/abc123',
    ip_address: '103.21.58.92',
  },
  {
    id: '2',
    document_name: 'Exclusive Distribution Agreement',
    document_type: 'agreement',
    document_number: 'AGR-2024-0003',
    client_name: 'Saree Emporium',
    client_email: 'amit@sareeemporium.com',
    signatory_name: 'Amit Kumar',
    status: 'pending',
    sent_at: '2024-01-10',
    signed_at: null,
    expires_at: '2024-01-25',
    signature_link: 'https://sign.qwii.com/def456',
    ip_address: null,
  },
  {
    id: '3',
    document_name: 'Quotation - Designer Lehengas',
    document_type: 'quotation',
    document_number: 'QT-2024-0002',
    client_name: 'Fashion Hub Exports',
    client_email: 'priya@fashionhub.com',
    signatory_name: 'Priya Patel',
    status: 'signed',
    sent_at: '2024-01-08',
    signed_at: '2024-01-09',
    expires_at: '2024-01-18',
    signature_link: 'https://sign.qwii.com/ghi789',
    ip_address: '49.36.128.45',
  },
  {
    id: '4',
    document_name: 'Invoice Payment Confirmation',
    document_type: 'invoice',
    document_number: 'INV-2024-0001',
    client_name: 'Modern Fabrics LLC',
    client_email: 'sarah@modernfabrics.com',
    signatory_name: 'Sarah Johnson',
    status: 'viewed',
    sent_at: '2024-01-12',
    signed_at: null,
    expires_at: '2024-01-22',
    signature_link: 'https://sign.qwii.com/jkl012',
    ip_address: null,
  },
  {
    id: '5',
    document_name: 'Purchase Order Confirmation',
    document_type: 'order',
    document_number: 'ORD-2024-0005',
    client_name: 'Ethnic Wear House',
    client_email: 'sunita@ethnicwear.com',
    signatory_name: 'Sunita Devi',
    status: 'declined',
    sent_at: '2024-01-05',
    signed_at: null,
    expires_at: '2024-01-15',
    signature_link: 'https://sign.qwii.com/mno345',
    ip_address: null,
  },
  {
    id: '6',
    document_name: 'NDA - Design Partnership',
    document_type: 'agreement',
    document_number: 'AGR-2024-0002',
    client_name: 'Creative Designs Co',
    client_email: 'info@creativedesigns.com',
    signatory_name: 'Vikram Singh',
    status: 'expired',
    sent_at: '2023-12-01',
    signed_at: null,
    expires_at: '2023-12-15',
    signature_link: 'https://sign.qwii.com/pqr678',
    ip_address: null,
  },
];

const statusConfig = {
  pending: { color: 'bg-warning/20 text-warning', icon: Clock, label: 'Pending' },
  viewed: { color: 'bg-primary/20 text-primary', icon: Eye, label: 'Viewed' },
  signed: { color: 'bg-accent/20 text-accent', icon: CheckCircle, label: 'Signed' },
  declined: { color: 'bg-destructive/20 text-destructive', icon: XCircle, label: 'Declined' },
  expired: { color: 'bg-muted text-muted-foreground', icon: Clock, label: 'Expired' },
};

const docTypeConfig = {
  quotation: 'Quotation',
  invoice: 'Invoice',
  agreement: 'Agreement',
  order: 'Order',
};

const DigitalSignatures = () => {
  const [signatures, setSignatures] = useState<SignatureRequest[]>(mockSignatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSignature, setSelectedSignature] = useState<SignatureRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredSignatures = signatures.filter(sig => {
    const matchesSearch = 
      sig.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.document_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sig.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleResendRequest = (id: string) => {
    toast.success('Signature request resent');
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Signature link copied');
  };

  const totalRequests = signatures.length;
  const signedCount = signatures.filter(s => s.status === 'signed').length;
  const pendingCount = signatures.filter(s => s.status === 'pending' || s.status === 'viewed').length;
  const signRate = ((signedCount / totalRequests) * 100).toFixed(0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide">
              <span className="gradient-text">DIGITAL SIGNATURES</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and manage e-signature requests for documents
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 glass-card">
            <Shield size={14} className="text-accent" />
            <span className="text-xs font-mono text-accent">SECURE SIGNING</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <PenTool size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRequests}</p>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{signedCount}</p>
                <p className="text-xs text-muted-foreground">Signed</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <FileText size={16} className="text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{signRate}%</p>
                <p className="text-xs text-muted-foreground">Sign Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search signature requests..."
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
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Signatures Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Signatory</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSignatures.map((sig) => {
                const StatusIcon = statusConfig[sig.status].icon;
                return (
                  <TableRow key={sig.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sig.document_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {sig.document_number} • {docTypeConfig[sig.document_type]}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sig.client_name}</p>
                        <p className="text-xs text-muted-foreground">{sig.client_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-muted-foreground" />
                        {sig.signatory_name}
                      </div>
                    </TableCell>
                    <TableCell>{sig.sent_at}</TableCell>
                    <TableCell>
                      <span className={sig.status === 'expired' ? 'text-destructive' : ''}>
                        {sig.expires_at}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig[sig.status].color}`}>
                        <StatusIcon size={12} />
                        {statusConfig[sig.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedSignature(sig); setIsViewDialogOpen(true); }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(sig.signature_link)}
                        >
                          <Copy size={14} />
                        </Button>
                        {(sig.status === 'pending' || sig.status === 'expired') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResendRequest(sig.id)}
                          >
                            <RefreshCw size={14} />
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

        {/* View Signature Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Signature Request Details</DialogTitle>
            </DialogHeader>
            {selectedSignature && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{selectedSignature.document_name}</h3>
                    <p className="font-mono text-muted-foreground">{selectedSignature.document_number}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium ${statusConfig[selectedSignature.status].color}`}>
                    {statusConfig[selectedSignature.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Client</p>
                      <p className="font-medium">{selectedSignature.client_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-muted-foreground" />
                        <span>{selectedSignature.client_email}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Signatory</p>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-muted-foreground" />
                        <span className="font-medium">{selectedSignature.signatory_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Sent Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>{selectedSignature.sent_at}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expires</p>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span>{selectedSignature.expires_at}</span>
                      </div>
                    </div>
                    {selectedSignature.signed_at && (
                      <div>
                        <p className="text-xs text-muted-foreground">Signed</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-accent" />
                          <span className="text-accent font-medium">{selectedSignature.signed_at}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Signature Link</p>
                  <div className="flex items-center gap-2">
                    <Link2 size={14} className="text-primary" />
                    <code className="text-sm flex-1 truncate">{selectedSignature.signature_link}</code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyLink(selectedSignature.signature_link)}
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>

                {selectedSignature.ip_address && (
                  <div className="p-3 border rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Signing Details</p>
                    <p className="text-sm">IP Address: <span className="font-mono">{selectedSignature.ip_address}</span></p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2">
                    <Download size={14} />
                    Download Signed Document
                  </Button>
                  {(selectedSignature.status === 'pending' || selectedSignature.status === 'expired') && (
                    <Button variant="outline" className="flex-1 gap-2" onClick={() => handleResendRequest(selectedSignature.id)}>
                      <RefreshCw size={14} />
                      Resend Request
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

export default DigitalSignatures;
