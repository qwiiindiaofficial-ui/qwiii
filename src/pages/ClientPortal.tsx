import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@/lib/exportUtils';
import {
  FileText,
  IndianRupee,
  Package,
  FileSignature,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface ClientData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  gst_number: string | null;
}

const ClientPortal = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientData | null>(null);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortalData();
  }, [token]);

  const fetchPortalData = async () => {
    if (!token) {
      setError('Invalid portal link');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('client_portal_token', token)
        .maybeSingle();

      if (clientError) throw clientError;
      if (!clientData) {
        setError('Invalid or expired portal link');
        setLoading(false);
        return;
      }

      setClient(clientData);

      const [quotationsRes, invoicesRes, agreementsRes, ordersRes] = await Promise.all([
        supabase
          .from('quotations')
          .select('*, items:quotation_items(*)')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('invoices')
          .select('*, items:invoice_items(*)')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('agreements')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('client_orders')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false }),
      ]);

      setQuotations(quotationsRes.data || []);
      setInvoices(invoicesRes.data || []);
      setAgreements(agreementsRes.data || []);
      setOrders(ordersRes.data || []);

      setError(null);
    } catch (err: any) {
      console.error('Error fetching portal data:', err);
      setError('Failed to load portal data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      draft: { color: 'bg-muted text-muted-foreground', icon: FileText },
      sent: { color: 'bg-blue-500/20 text-blue-400', icon: Clock },
      accepted: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
      paid: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
      signed: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
      overdue: { color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
      rejected: { color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
      pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
      pending_signature: { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
      processing: { color: 'bg-blue-500/20 text-blue-400', icon: Clock },
      completed: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
      cancelled: { color: 'bg-muted text-muted-foreground', icon: AlertCircle },
    };

    const statusInfo = config[status] || config.draft;
    const Icon = statusInfo.icon;

    return (
      <Badge className={statusInfo.color}>
        <Icon size={12} className="mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Unable to access portal'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalQuoted = quotations.reduce((sum, q) => sum + q.total, 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="glass-card p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-wide mb-2">
                <span className="gradient-text">CLIENT PORTAL</span>
              </h1>
              <p className="text-muted-foreground">Welcome to your dedicated business portal</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={20} className="text-primary" />
                <span className="text-xl font-bold">{client.company || client.name}</span>
              </div>
              {client.gst_number && (
                <p className="text-sm text-muted-foreground">GST: {client.gst_number}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {client.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-muted-foreground" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            {(client.address || client.city) && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-muted-foreground" />
                <span>
                  {[client.address, client.city, client.state, client.country]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Quoted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                <span className="text-2xl font-bold">{formatCurrency(totalQuoted)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{quotations.length} quotations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IndianRupee className="text-blue-400" size={20} />
                <span className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{invoices.length} invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-2xl font-bold">{formatCurrency(totalPaid)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {invoices.filter(i => i.status === 'paid').length} paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-400" size={20} />
                <span className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Pending payment</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="quotations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quotations">Quotations ({quotations.length})</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="agreements">Agreements ({agreements.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="quotations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  Your Quotations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quotations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No quotations yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quote #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Valid Until</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotations.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-mono font-medium">{quote.quote_number}</TableCell>
                          <TableCell>{formatDate(quote.created_at)}</TableCell>
                          <TableCell>{formatDate(quote.valid_until)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(quote.total)}</TableCell>
                          <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee size={20} />
                  Your Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No invoices yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono font-medium">{invoice.invoice_number}</TableCell>
                          <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                          <TableCell>{formatDate(invoice.due_date)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package size={20} />
                  Your Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono font-medium">{order.order_number}</TableCell>
                          <TableCell>{formatDate(order.order_date)}</TableCell>
                          <TableCell>{formatDate(order.delivery_date)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(order.total_amount)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agreements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature size={20} />
                  Your Agreements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agreements.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No agreements yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agreement #</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agreements.map((agreement) => (
                        <TableRow key={agreement.id}>
                          <TableCell className="font-mono font-medium">{agreement.agreement_number}</TableCell>
                          <TableCell>{agreement.title}</TableCell>
                          <TableCell>{formatDate(agreement.start_date)}</TableCell>
                          <TableCell>{formatDate(agreement.end_date)}</TableCell>
                          <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground pt-6 border-t">
          <p>© {new Date().getFullYear()} QWII - Optimize Vision. All rights reserved.</p>
          <p className="mt-1">This is your private portal. Please keep the link secure.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
