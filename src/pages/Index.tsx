import {
  TrendingUp,
  Target,
  MessageSquareText,
  Package,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Zap,
  Brain,
  Cpu,
  Server,
  Database,
  Shield,
  FileText,
  ShoppingCart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import AreaChartCard from '@/components/charts/AreaChartCard';
import BarChartCard from '@/components/charts/BarChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import LineChartCard from '@/components/charts/LineChartCard';
import ProgressRing from '@/components/charts/ProgressRing';
import StatusCard from '@/components/charts/StatusCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';
import { useClients } from '@/hooks/useClients';
import { useInvoices } from '@/hooks/useInvoices';
import { useClientOrders } from '@/hooks/useClientOrders';
import { useLeads } from '@/hooks/useLeads';

const forecastData = [
  { name: 'W1', actual: 2400, predicted: 2200 },
  { name: 'W2', actual: 2800, predicted: 2900 },
  { name: 'W3', actual: 3200, predicted: 3100 },
  { name: 'W4', actual: 3600, predicted: 3800 },
  { name: 'W5', actual: 0, predicted: 4200 },
  { name: 'W6', actual: 0, predicted: 4600 },
];

const quickLinks = [
  { title: 'Sales Forecast', icon: TrendingUp, href: '/sales-forecast', color: 'from-primary to-neon-blue' },
  { title: 'Recommendations', icon: Target, href: '/recommendations', color: 'from-secondary to-neon-pink' },
  { title: 'AI Chatbot', icon: MessageSquareText, href: '/chatbot', color: 'from-accent to-primary' },
  { title: 'B2B Agent', icon: Brain, href: '/b2b-agent', color: 'from-neon-orange to-warning' },
];

const Index = () => {
  const { clients, stats: clientStats } = useClients();
  const { invoices, stats: invoiceStats } = useInvoices();
  const { orders, stats: orderStats } = useClientOrders();
  const { leads } = useLeads();

  const totalRevenue = invoiceStats.paidAmount;
  const pendingRevenue = invoiceStats.pendingAmount;

  const revenueByMonth: Record<string, { actual: number; target: number }> = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  invoices.forEach(inv => {
    const month = months[new Date(inv.issue_date).getMonth()];
    if (!revenueByMonth[month]) revenueByMonth[month] = { actual: 0, target: 0 };
    revenueByMonth[month].actual += inv.total;
    revenueByMonth[month].target += inv.total * 1.1;
  });

  const revenueData = months
    .filter(m => revenueByMonth[m])
    .map(m => ({ name: m, value: Math.round(revenueByMonth[m].actual / 100000), value2: Math.round(revenueByMonth[m].target / 100000) }))
    .slice(-7);

  const orderStatusData = [
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
    { name: 'In Production', value: orders.filter(o => o.status === 'in_production').length },
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length },
    { name: 'Dispatched', value: orders.filter(o => o.status === 'dispatched').length },
  ].filter(d => d.value > 0);

  const categoryData = orderStatusData.length > 0 ? orderStatusData : [
    { name: 'No Orders', value: 1 },
  ];

  const activeLeads = leads.filter(l => l.status === 'new' || l.status === 'contacted' || l.status === 'qualified').length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide">
              <span className="gradient-text">COMMAND CENTER</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time manufacturing intelligence • Last updated: Just now
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 glass-card">
            <Cpu size={14} className="text-accent" />
            <span className="text-xs font-mono text-accent">AI MODELS ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Revenue (Paid)"
            value={<AnimatedCounter value={totalRevenue} prefix="₹" duration={1500} />}
            icon={<DollarSign size={16} />}
            subtitle={`₹${(pendingRevenue / 100000).toFixed(1)}L pending`}
          />
          <MetricCard
            title="Active Clients"
            value={<AnimatedCounter value={clientStats.active} duration={1500} />}
            change={`${clientStats.total} total`}
            changeType="positive"
            icon={<Users size={16} />}
            subtitle="registered"
          />
          <MetricCard
            title="Total Orders"
            value={<AnimatedCounter value={orderStats?.total ?? orders.length} duration={1500} />}
            icon={<ShoppingCart size={16} />}
            subtitle="all time"
          />
          <MetricCard
            title="Active Leads"
            value={<AnimatedCounter value={activeLeads} duration={1500} />}
            icon={<Activity size={16} />}
            subtitle={`${leads.length} total`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {revenueData.length > 0 ? (
              <AreaChartCard
                data={revenueData}
                title="Revenue Trend"
                subtitle="Monthly revenue (₹ in Lakhs)"
                color="hsl(185, 100%, 50%)"
                color2="hsl(265, 85%, 55%)"
                height={280}
              />
            ) : (
              <div className="glass-card h-[280px] flex items-center justify-center">
                <div className="text-center">
                  <FileText size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No invoice data yet</p>
                  <Link to="/invoices" className="text-xs text-primary hover:underline mt-1 block">Create invoices</Link>
                </div>
              </div>
            )}
          </div>

          <DonutChartCard
            data={categoryData}
            title="Order Status"
            subtitle="Distribution by status"
            centerValue={`${orders.length}`}
            centerLabel="Total"
            height={180}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users size={14} className="text-primary" />
              Client Overview
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Active', value: clientStats.active, color: 'bg-accent' },
                { label: 'Pending', value: clientStats.pending, color: 'bg-warning' },
                { label: 'Inactive', value: clientStats.inactive, color: 'bg-muted-foreground' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Outstanding</span>
                  <span className="text-sm font-medium text-warning">₹{(clientStats.totalOutstanding / 100000).toFixed(1)}L</span>
                </div>
              </div>
            </div>
          </div>

          <LineChartCard
            data={forecastData}
            lines={[
              { key: 'actual', color: 'hsl(185, 100%, 50%)', name: 'Actual' },
              { key: 'predicted', color: 'hsl(155, 100%, 45%)', name: 'AI Predicted' },
            ]}
            title="Demand Forecast"
            subtitle="6-week prediction"
            height={200}
            showLegend
          />

          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Invoice Summary</h3>
            <div className="flex items-center justify-around">
              <ProgressRing
                value={invoiceStats.total > 0 ? Math.round((invoiceStats.paid / invoiceStats.total) * 100) : 0}
                size={100}
                strokeWidth={8}
                color="hsl(185, 100%, 50%)"
                label={`${invoiceStats.total > 0 ? Math.round((invoiceStats.paid / invoiceStats.total) * 100) : 0}%`}
                sublabel="Paid"
              />
              <ProgressRing
                value={invoiceStats.total > 0 ? Math.round(((invoiceStats.sent + invoiceStats.overdue) / invoiceStats.total) * 100) : 0}
                size={100}
                strokeWidth={8}
                color="hsl(155, 100%, 45%)"
                label={`${invoiceStats.total > 0 ? Math.round(((invoiceStats.sent + invoiceStats.overdue) / invoiceStats.total) * 100) : 0}%`}
                sublabel="Pending"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Server size={14} className="text-primary" />
              System Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <StatusCard
                title="AI Engine"
                status="online"
                icon={<Brain size={14} />}
                details={[
                  { label: 'Uptime', value: '99.9%' },
                  { label: 'Latency', value: '45ms' },
                ]}
              />
              <StatusCard
                title="Database"
                status="online"
                icon={<Database size={14} />}
                details={[
                  { label: 'Records', value: `${invoiceStats.total + clientStats.total + orders.length}` },
                  { label: 'Status', value: 'Healthy' },
                ]}
              />
              <StatusCard
                title="API Gateway"
                status="online"
                icon={<Zap size={14} />}
                details={[
                  { label: 'Requests', value: '12K/hr' },
                  { label: 'Errors', value: '0.01%' },
                ]}
              />
              <StatusCard
                title="Security"
                status="online"
                icon={<Shield size={14} />}
                details={[
                  { label: 'Threats', value: '0' },
                  { label: 'Scans', value: '24/7' },
                ]}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Zap size={14} className="text-primary" />
              AI Modules
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.href}
                  className="glass-card p-4 group hover:border-primary/40 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <link.icon size={20} className="text-primary-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{link.title}</span>
                    <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
