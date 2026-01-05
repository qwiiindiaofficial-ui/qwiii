import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  DollarSign,
  FileText,
  Download,
  MoreVertical,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Client {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  gst_number: string;
  pan_number: string;
  credit_limit: number;
  outstanding: number;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  total_orders: number;
  last_order: string;
  created_at: string;
  notes: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    company_name: 'Textile Traders Pvt Ltd',
    contact_person: 'Rajesh Sharma',
    email: 'rajesh@textiletraders.com',
    phone: '+91 98765 43210',
    address: '123 Textile Market, Ring Road',
    city: 'Surat',
    country: 'India',
    gst_number: '24AAACT1234A1Z5',
    pan_number: 'AAACT1234A',
    credit_limit: 500000,
    outstanding: 125000,
    status: 'active',
    rating: 5,
    total_orders: 45,
    last_order: '2024-01-10',
    created_at: '2023-01-15',
    notes: 'Premium client, always pays on time',
  },
  {
    id: '2',
    company_name: 'Fashion Hub Exports',
    contact_person: 'Priya Patel',
    email: 'priya@fashionhub.com',
    phone: '+91 87654 32109',
    address: '456 Export Zone',
    city: 'Mumbai',
    country: 'India',
    gst_number: '27AABCF5678B2Z8',
    pan_number: 'AABCF5678B',
    credit_limit: 1000000,
    outstanding: 450000,
    status: 'active',
    rating: 4,
    total_orders: 78,
    last_order: '2024-01-12',
    created_at: '2022-06-20',
    notes: 'Large volume orders, export client',
  },
  {
    id: '3',
    company_name: 'Saree Emporium',
    contact_person: 'Amit Kumar',
    email: 'amit@sareeemporium.com',
    phone: '+91 76543 21098',
    address: '789 Silk Street',
    city: 'Varanasi',
    country: 'India',
    gst_number: '09AADCS9012C3Z1',
    pan_number: 'AADCS9012C',
    credit_limit: 300000,
    outstanding: 85000,
    status: 'active',
    rating: 5,
    total_orders: 32,
    last_order: '2024-01-08',
    created_at: '2023-03-10',
    notes: 'Specializes in traditional sarees',
  },
  {
    id: '4',
    company_name: 'Modern Fabrics LLC',
    contact_person: 'Sarah Johnson',
    email: 'sarah@modernfabrics.com',
    phone: '+1 555 0123',
    address: '100 Fashion Ave',
    city: 'New York',
    country: 'USA',
    gst_number: 'N/A',
    pan_number: 'N/A',
    credit_limit: 750000,
    outstanding: 0,
    status: 'active',
    rating: 4,
    total_orders: 15,
    last_order: '2024-01-05',
    created_at: '2023-08-01',
    notes: 'International client, USD payments',
  },
  {
    id: '5',
    company_name: 'Ethnic Wear House',
    contact_person: 'Sunita Devi',
    email: 'sunita@ethnicwear.com',
    phone: '+91 65432 10987',
    address: '321 Lehenga Lane',
    city: 'Jaipur',
    country: 'India',
    gst_number: '08AABCE3456D4Z2',
    pan_number: 'AABCE3456D',
    credit_limit: 200000,
    outstanding: 200000,
    status: 'pending',
    rating: 3,
    total_orders: 12,
    last_order: '2023-12-20',
    created_at: '2023-05-15',
    notes: 'Payment pending, follow up required',
  },
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [newClient, setNewClient] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'India',
    gst_number: '',
    pan_number: '',
    credit_limit: 0,
    notes: '',
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClient = () => {
    const client: Client = {
      id: crypto.randomUUID(),
      ...newClient,
      outstanding: 0,
      status: 'active',
      rating: 0,
      total_orders: 0,
      last_order: '-',
      created_at: new Date().toISOString().split('T')[0],
    };
    setClients([client, ...clients]);
    toast.success('Client added successfully');
    setIsAddDialogOpen(false);
    setNewClient({
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'India',
      gst_number: '',
      pan_number: '',
      credit_limit: 0,
      notes: '',
    });
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    toast.success('Client deleted');
  };

  const totalOutstanding = clients.reduce((sum, c) => sum + c.outstanding, 0);
  const activeClients = clients.filter(c => c.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide">
              <span className="gradient-text">CLIENT MANAGEMENT</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your business clients and their accounts
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={14} />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input
                      value={newClient.company_name}
                      onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
                      placeholder="ABC Textiles Pvt Ltd"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person *</Label>
                    <Input
                      value={newClient.contact_person}
                      onChange={(e) => setNewClient({ ...newClient, contact_person: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={newClient.city}
                      onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select value={newClient.country} onValueChange={(v) => setNewClient({ ...newClient, country: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="UAE">UAE</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GST Number</Label>
                    <Input
                      value={newClient.gst_number}
                      onChange={(e) => setNewClient({ ...newClient, gst_number: e.target.value })}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>PAN Number</Label>
                    <Input
                      value={newClient.pan_number}
                      onChange={(e) => setNewClient({ ...newClient, pan_number: e.target.value })}
                      placeholder="AAAAA0000A"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Credit Limit (₹)</Label>
                  <Input
                    type="number"
                    value={newClient.credit_limit}
                    onChange={(e) => setNewClient({ ...newClient, credit_limit: Number(e.target.value) })}
                    placeholder="500000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    placeholder="Any additional notes about this client..."
                  />
                </div>
                <Button onClick={handleAddClient} className="w-full">
                  Add Client
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-xs text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeClients}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <DollarSign size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(totalOutstanding / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Outstanding</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp size={16} className="text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clients.reduce((sum, c) => sum + c.total_orders, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download size={14} />
            Export
          </Button>
        </div>

        {/* Clients Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.company_name}</p>
                      <p className="text-xs text-muted-foreground">{client.total_orders} orders</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{client.contact_person}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail size={10} />
                        {client.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin size={12} className="text-muted-foreground" />
                      {client.city}, {client.country}
                    </div>
                  </TableCell>
                  <TableCell>₹{(client.credit_limit / 100000).toFixed(1)}L</TableCell>
                  <TableCell>
                    <span className={client.outstanding > client.credit_limit * 0.8 ? 'text-destructive' : ''}>
                      ₹{(client.outstanding / 1000).toFixed(0)}K
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < client.rating ? 'text-warning fill-warning' : 'text-muted'}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      client.status === 'active' ? 'bg-accent/20 text-accent' :
                      client.status === 'pending' ? 'bg-warning/20 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {client.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedClient(client); setIsViewDialogOpen(true); }}>
                          <FileText size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone size={14} className="mr-2" />
                          Call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail size={14} className="mr-2" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View Client Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Client Details</DialogTitle>
            </DialogHeader>
            {selectedClient && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedClient.company_name}</h3>
                    <p className="text-muted-foreground">{selectedClient.contact_person}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < selectedClient.rating ? 'text-warning fill-warning' : 'text-muted'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-muted-foreground" />
                      <span className="text-sm">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-muted-foreground" />
                      <span className="text-sm">{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span className="text-sm">{selectedClient.address}, {selectedClient.city}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">GST Number</p>
                      <p className="font-mono text-sm">{selectedClient.gst_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">PAN Number</p>
                      <p className="font-mono text-sm">{selectedClient.pan_number}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card p-3 text-center">
                    <p className="text-2xl font-bold text-primary">₹{(selectedClient.credit_limit / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">Credit Limit</p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <p className="text-2xl font-bold text-warning">₹{(selectedClient.outstanding / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <p className="text-2xl font-bold text-accent">{selectedClient.total_orders}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                </div>

                {selectedClient.notes && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{selectedClient.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2">
                    <FileText size={14} />
                    Create Quotation
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Mail size={14} />
                    Send Email
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

export default Clients;
