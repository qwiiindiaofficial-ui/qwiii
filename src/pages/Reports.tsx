import { useState } from 'react';
import { FileText, Download, Calendar, Settings, BarChart3, PieChart, TrendingUp, RefreshCw, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useLeads } from '@/hooks/useLeads';
import { useProduction } from '@/hooks/useProduction';
import { useQuotations } from '@/hooks/useQuotations';
import { exportToCSV, formatDate, formatCurrencyFull } from '@/lib/exportUtils';
import { toast } from '@/hooks/use-toast';
import { subDays, format } from 'date-fns';

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ReportType = 'invoices' | 'clients' | 'leads' | 'quotations' | 'production';

interface GenerateConfig {
  type: ReportType;
  range: DateRange;
  format: 'csv' | 'pdf';
}

const reportDefs = [
  { id: 'invoices' as ReportType, name: 'Invoice Report', icon: FileText, description: 'All invoices with status, amounts, GST' },
  { id: 'clients' as ReportType, name: 'Client Report', icon: PieChart, description: 'Client list, city, type, outstanding' },
  { id: 'leads' as ReportType, name: 'Lead Report', icon: TrendingUp, description: 'Leads with status, priority, city, source' },
  { id: 'quotations' as ReportType, name: 'Quotation Report', icon: BarChart3, description: 'Quotes with status, value, client' },
  { id: 'production' as ReportType, name: 'Production Report', icon: Settings, description: 'Batches with status, progress, priority' },
];

const filterByRange = <T extends { created_at?: string }>(items: T[], range: DateRange): T[] => {
  if (range === 'all') return items;
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  const cutoff = subDays(new Date(), days).toISOString();
  return items.filter(i => (i.created_at || '') >= cutoff);
};

const Reports = () => {
  const { invoices } = useInvoices();
  const { clients } = useClients();
  const { leads } = useLeads();
  const { quotations } = useQuotations();
  const { batches } = useProduction();

  const [config, setConfig] = useState<GenerateConfig>({ type: 'invoices', range: '30d', format: 'csv' });
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const countInRange = (arr: any[], range: DateRange) => filterByRange(arr, range).length;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      const range = config.range;

      if (config.type === 'invoices') {
        const data = filterByRange(invoices, range);
        if (config.format === 'csv') {
          exportToCSV(data, [
            { header: 'Invoice #', accessor: 'invoice_number' },
            { header: 'Client', accessor: i => (i as any).client?.name || '' },
            { header: 'Status', accessor: 'status' },
            { header: 'Issue Date', accessor: i => formatDate(i.issue_date) },
            { header: 'Due Date', accessor: i => formatDate(i.due_date) },
            { header: 'Subtotal', accessor: i => formatCurrencyFull(i.subtotal) },
            { header: 'GST', accessor: i => formatCurrencyFull((i.cgst || 0) + (i.sgst || 0) + (i.igst || 0)) },
            { header: 'Total', accessor: i => formatCurrencyFull(i.total) },
            { header: 'Payment Date', accessor: i => formatDate(i.payment_date) },
          ], `invoices_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        } else {
          toast({ title: "PDF export coming soon", description: "Use CSV format for now" });
        }
      } else if (config.type === 'clients') {
        const data = filterByRange(clients, range);
        exportToCSV(data, [
          { header: 'Name', accessor: 'name' },
          { header: 'Company', accessor: c => c.company || '' },
          { header: 'Email', accessor: c => c.email || '' },
          { header: 'Phone', accessor: c => c.phone || '' },
          { header: 'City', accessor: c => c.city || '' },
          { header: 'State', accessor: c => c.state || '' },
          { header: 'Status', accessor: 'status' },
          { header: 'Type', accessor: 'type' },
          { header: 'Total Orders', accessor: 'total_orders' },
          { header: 'Outstanding', accessor: c => formatCurrencyFull(c.outstanding_amount) },
          { header: 'GST #', accessor: c => c.gst_number || '' },
          { header: 'Created', accessor: c => formatDate(c.created_at) },
        ], `clients_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      } else if (config.type === 'leads') {
        const leadsData = filterByRange(leads || [], range);
        exportToCSV(leadsData, [
          { header: 'Company', accessor: 'company_name' },
          { header: 'Name', accessor: l => l.name || '' },
          { header: 'Phone', accessor: l => l.phone || '' },
          { header: 'City', accessor: l => l.city || '' },
          { header: 'State', accessor: l => l.state || '' },
          { header: 'Industry', accessor: l => l.industry || '' },
          { header: 'Status', accessor: l => l.status || '' },
          { header: 'Priority', accessor: l => l.priority || '' },
          { header: 'Score', accessor: l => String(l.score || '') },
          { header: 'Source', accessor: l => l.source || '' },
          { header: 'Est. Order Value', accessor: l => formatCurrencyFull(l.estimated_order_value || 0) },
          { header: 'Created', accessor: l => formatDate(l.created_at) },
        ], `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      } else if (config.type === 'quotations') {
        const data = filterByRange(quotations, range);
        exportToCSV(data, [
          { header: 'Quote #', accessor: 'quote_number' },
          { header: 'Client', accessor: q => (q as any).client?.name || '' },
          { header: 'Status', accessor: 'status' },
          { header: 'Valid Until', accessor: q => formatDate(q.valid_until) },
          { header: 'Subtotal', accessor: q => formatCurrencyFull(q.subtotal) },
          { header: 'Tax', accessor: q => formatCurrencyFull(q.tax) },
          { header: 'Discount', accessor: q => formatCurrencyFull(q.discount) },
          { header: 'Total', accessor: q => formatCurrencyFull(q.total) },
          { header: 'Created', accessor: q => formatDate(q.created_at) },
        ], `quotations_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      } else if (config.type === 'production') {
        const data = filterByRange(batches, range);
        exportToCSV(data, [
          { header: 'Batch #', accessor: 'batch_number' },
          { header: 'Product', accessor: 'product_name' },
          { header: 'Quantity', accessor: 'quantity' },
          { header: 'Completed', accessor: 'completed' },
          { header: 'Progress %', accessor: b => b.quantity > 0 ? `${Math.round((b.completed / b.quantity) * 100)}%` : '0%' },
          { header: 'Status', accessor: 'status' },
          { header: 'Priority', accessor: 'priority' },
          { header: 'Start Date', accessor: b => formatDate(b.start_date) },
          { header: 'End Date', accessor: b => formatDate(b.end_date) },
          { header: 'Created', accessor: b => formatDate(b.created_at) },
        ], `production_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      }

      const def = reportDefs.find(r => r.id === config.type);
      setLastGenerated(def?.name || '');
      toast({ title: "Report downloaded", description: `${def?.name} (${range}) downloaded as ${config.format.toUpperCase()}` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const totalInvoiceRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0);
  const fmtCurr = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${Math.round(n / 1000)}K`;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="page-header mb-0">
            <h1 className="page-title">REPORTS</h1>
            <p className="page-subtitle">Export real data • CSV downloads from live database</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Invoices" value={String(invoices.length)} icon={<FileText size={16} />} subtitle="all time" />
          <MetricCard title="Total Clients" value={String(clients.length)} icon={<PieChart size={16} />} subtitle="in database" />
          <MetricCard title="Total Leads" value={String(leads?.length || 0)} icon={<TrendingUp size={16} />} subtitle="generated" />
          <MetricCard title="Revenue Collected" value={fmtCurr(totalInvoiceRevenue)} icon={<Download size={16} />} subtitle="paid invoices" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 glass-card p-5 space-y-5">
            <h3 className="section-title">
              <Settings size={14} className="text-primary" />
              Report Builder
            </h3>

            <div>
              <label className="text-xs text-muted-foreground block mb-2">Report Type</label>
              <div className="space-y-2">
                {reportDefs.map(rd => (
                  <button
                    key={rd.id}
                    onClick={() => setConfig(c => ({ ...c, type: rd.id }))}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left border transition-all ${
                      config.type === rd.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40 bg-muted/20'
                    }`}
                  >
                    <rd.icon size={16} className={config.type === rd.id ? 'text-primary' : 'text-muted-foreground'} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">{rd.name}</p>
                      <p className="text-xs text-muted-foreground">{rd.description}</p>
                    </div>
                    {config.type === rd.id && <CheckCircle2 size={14} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-2">Date Range</label>
              <div className="grid grid-cols-3 gap-1">
                {(['7d', '30d', '90d', '1y', 'all'] as DateRange[]).map(r => (
                  <button
                    key={r}
                    onClick={() => setConfig(c => ({ ...c, range: r }))}
                    className={`py-1.5 text-xs rounded-md transition-all ${
                      config.range === r ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r === 'all' ? 'All' : r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-2">Format</label>
              <div className="flex gap-2">
                {(['csv', 'pdf'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setConfig(c => ({ ...c, format: f }))}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                      config.format === f ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              {config.format === 'pdf' && (
                <p className="text-xs text-warning mt-1">PDF export is in development. CSV is fully functional.</p>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {generating ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {generating ? 'Generating...' : 'Download Report'}
            </button>

            {lastGenerated && (
              <div className="flex items-center gap-2 text-xs text-accent">
                <CheckCircle2 size={12} />
                Last: {lastGenerated} downloaded
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-4">
              <h3 className="section-title mb-4">
                <FileText size={14} className="text-primary" />
                Data Summary
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    label: 'Invoices',
                    total: invoices.length,
                    inRange: countInRange(invoices, config.range),
                    breakdown: [
                      { label: 'Paid', count: invoices.filter(i => i.status === 'paid').length, color: 'bg-accent' },
                      { label: 'Sent', count: invoices.filter(i => i.status === 'sent').length, color: 'bg-primary' },
                      { label: 'Draft', count: invoices.filter(i => i.status === 'draft').length, color: 'bg-muted-foreground' },
                      { label: 'Overdue', count: invoices.filter(i => i.status === 'overdue').length, color: 'bg-destructive' },
                    ],
                  },
                  {
                    label: 'Clients',
                    total: clients.length,
                    inRange: countInRange(clients, config.range),
                    breakdown: [
                      { label: 'Active', count: clients.filter(c => c.status === 'active').length, color: 'bg-accent' },
                      { label: 'Inactive', count: clients.filter(c => c.status === 'inactive').length, color: 'bg-muted-foreground' },
                      { label: 'Pending', count: clients.filter(c => c.status === 'pending').length, color: 'bg-warning' },
                    ],
                  },
                  {
                    label: 'Leads',
                    total: leads?.length || 0,
                    inRange: countInRange(leads || [], config.range),
                    breakdown: [
                      { label: 'New', count: leads?.filter(l => l.status === 'new').length || 0, color: 'bg-primary' },
                      { label: 'Qualified', count: leads?.filter(l => l.status === 'qualified').length || 0, color: 'bg-accent' },
                      { label: 'Converted', count: leads?.filter(l => l.status === 'converted').length || 0, color: 'bg-green-500' },
                    ],
                  },
                  {
                    label: 'Quotations',
                    total: quotations.length,
                    inRange: countInRange(quotations, config.range),
                    breakdown: [
                      { label: 'Accepted', count: quotations.filter(q => q.status === 'accepted').length, color: 'bg-accent' },
                      { label: 'Sent', count: quotations.filter(q => q.status === 'sent').length, color: 'bg-primary' },
                      { label: 'Rejected', count: quotations.filter(q => q.status === 'rejected').length, color: 'bg-destructive' },
                    ],
                  },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{item.inRange} in range</span>
                        <span className="text-sm font-bold text-foreground">{item.total} total</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden bg-muted">
                      {item.breakdown.filter(b => b.count > 0).map((b, i) => (
                        <div
                          key={i}
                          className={`h-full ${b.color}`}
                          style={{ width: `${item.total > 0 ? (b.count / item.total) * 100 : 0}%` }}
                          title={`${b.label}: ${b.count}`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-3 mt-2">
                      {item.breakdown.map((b, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${b.color}`} />
                          <span className="text-xs text-muted-foreground">{b.label}: {b.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title mb-4">
                <Calendar size={14} className="text-primary" />
                Quick Export Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Paid Invoices (30d)', action: () => { const d = invoices.filter(i => i.status === 'paid' && (i.created_at || '') >= subDays(new Date(), 30).toISOString()); exportToCSV(d, [{ header: 'Invoice #', accessor: 'invoice_number' }, { header: 'Client', accessor: i => (i as any).client?.name || '' }, { header: 'Total', accessor: i => formatCurrencyFull(i.total) }, { header: 'Date', accessor: i => formatDate(i.payment_date) }], 'paid_invoices_30d.csv'); toast({ title: "Downloaded", description: `${d.length} paid invoices` }); } },
                  { label: 'Active Clients', action: () => { const d = clients.filter(c => c.status === 'active'); exportToCSV(d, [{ header: 'Name', accessor: 'name' }, { header: 'Company', accessor: c => c.company || '' }, { header: 'Email', accessor: c => c.email || '' }, { header: 'Phone', accessor: c => c.phone || '' }, { header: 'City', accessor: c => c.city || '' }], 'active_clients.csv'); toast({ title: "Downloaded", description: `${d.length} active clients` }); } },
                  { label: 'Hot Leads', action: () => { const d = (leads || []).filter(l => l.priority === 'hot'); exportToCSV(d, [{ header: 'Company', accessor: 'company_name' }, { header: 'Phone', accessor: l => l.phone || '' }, { header: 'City', accessor: l => l.city || '' }, { header: 'Score', accessor: l => String(l.score || '') }], 'hot_leads.csv'); toast({ title: "Downloaded", description: `${d.length} hot leads` }); } },
                  { label: 'Overdue Invoices', action: () => { const d = invoices.filter(i => i.status === 'overdue'); exportToCSV(d, [{ header: 'Invoice #', accessor: 'invoice_number' }, { header: 'Client', accessor: i => (i as any).client?.name || '' }, { header: 'Total', accessor: i => formatCurrencyFull(i.total) }, { header: 'Due Date', accessor: i => formatDate(i.due_date) }], 'overdue_invoices.csv'); toast({ title: "Downloaded", description: `${d.length} overdue invoices` }); } },
                ].map((shortcut, i) => (
                  <button
                    key={i}
                    onClick={shortcut.action}
                    className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/40 text-left transition-all group"
                  >
                    <Download size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium text-foreground">{shortcut.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
