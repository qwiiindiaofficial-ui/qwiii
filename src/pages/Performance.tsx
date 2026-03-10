import { useState, useEffect, useCallback } from 'react';
import { Gauge, TrendingUp, Target, Zap, RefreshCw, ArrowUpRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import ProgressRing from '@/components/charts/ProgressRing';
import LineChartCard from '@/components/charts/LineChartCard';
import BarChartCard from '@/components/charts/BarChartCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, format } from 'date-fns';

interface PerformanceData {
  invoicePayRate: number;
  leadConversionRate: number;
  quoteAcceptRate: number;
  productionEfficiency: number;
  weeklyTrend: { name: string; invoices: number; leads: number; quotes: number }[];
  topLeadSources: { name: string; value: number }[];
  kpiSummary: { label: string; value: string; target: string; pct: number; status: 'good' | 'warning' | 'critical' }[];
  recentActivity: { label: string; value: number; change: number }[];
}

const Performance = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const [invoicesRes, leadsRes, quotesRes, productionRes] = await Promise.all([
        supabase.from('invoices').select('id, status, total, created_at').gte('created_at', subDays(new Date(), 90).toISOString()),
        supabase.from('leads').select('id, status, source, created_at').gte('created_at', subDays(new Date(), 90).toISOString()),
        supabase.from('quotations').select('id, status, total, created_at').gte('created_at', subDays(new Date(), 90).toISOString()),
        supabase.from('production_batches').select('id, status, quantity, completed, created_at').gte('created_at', subDays(new Date(), 90).toISOString()),
      ]);

      const invoices = invoicesRes.data || [];
      const leads = leadsRes.data || [];
      const quotes = quotesRes.data || [];
      const batches = productionRes.data || [];

      const paidInvoices = invoices.filter(i => i.status === 'paid').length;
      const totalInvoices = invoices.length;
      const invoicePayRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;

      const convertedLeads = leads.filter(l => l.status === 'converted').length;
      const leadConversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;

      const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length;
      const quoteAcceptRate = quotes.length > 0 ? (acceptedQuotes / quotes.length) * 100 : 0;

      const totalProduced = batches.reduce((s, b) => s + b.completed, 0);
      const totalPlanned = batches.reduce((s, b) => s + b.quantity, 0);
      const productionEfficiency = totalPlanned > 0 ? (totalProduced / totalPlanned) * 100 : 0;

      const weeklyTrend: { name: string; invoices: number; leads: number; quotes: number }[] = [];
      for (let w = 5; w >= 0; w--) {
        const weekStart = subDays(new Date(), w * 7 + 7);
        const weekEnd = subDays(new Date(), w * 7);
        const label = format(weekStart, 'MMM d');
        weeklyTrend.push({
          name: label,
          invoices: invoices.filter(i => new Date(i.created_at) >= weekStart && new Date(i.created_at) < weekEnd).length,
          leads: leads.filter(l => new Date(l.created_at) >= weekStart && new Date(l.created_at) < weekEnd).length,
          quotes: quotes.filter(q => new Date(q.created_at) >= weekStart && new Date(q.created_at) < weekEnd).length,
        });
      }

      const sourceMap: Record<string, number> = {};
      leads.forEach(l => {
        const src = l.source || 'Unknown';
        sourceMap[src] = (sourceMap[src] || 0) + 1;
      });
      const topLeadSources = Object.entries(sourceMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      const kpiSummary = [
        {
          label: 'Invoice Collection Rate',
          value: `${invoicePayRate.toFixed(1)}%`,
          target: '80%',
          pct: Math.min(100, invoicePayRate),
          status: (invoicePayRate >= 80 ? 'good' : invoicePayRate >= 50 ? 'warning' : 'critical') as 'good' | 'warning' | 'critical',
        },
        {
          label: 'Lead Conversion',
          value: `${leadConversionRate.toFixed(1)}%`,
          target: '20%',
          pct: Math.min(100, (leadConversionRate / 20) * 100),
          status: (leadConversionRate >= 20 ? 'good' : leadConversionRate >= 10 ? 'warning' : 'critical') as 'good' | 'warning' | 'critical',
        },
        {
          label: 'Quote Acceptance',
          value: `${quoteAcceptRate.toFixed(1)}%`,
          target: '30%',
          pct: Math.min(100, (quoteAcceptRate / 30) * 100),
          status: (quoteAcceptRate >= 30 ? 'good' : quoteAcceptRate >= 15 ? 'warning' : 'critical') as 'good' | 'warning' | 'critical',
        },
        {
          label: 'Production Efficiency',
          value: `${productionEfficiency.toFixed(1)}%`,
          target: '90%',
          pct: Math.min(100, productionEfficiency),
          status: (productionEfficiency >= 90 ? 'good' : productionEfficiency >= 70 ? 'warning' : 'critical') as 'good' | 'warning' | 'critical',
        },
      ];

      const last30 = subDays(new Date(), 30).toISOString();
      const prev30start = subDays(new Date(), 60).toISOString();
      const recentActivity = [
        {
          label: 'New Leads',
          value: leads.filter(l => l.created_at >= last30).length,
          change: leads.filter(l => l.created_at >= last30).length - leads.filter(l => l.created_at >= prev30start && l.created_at < last30).length,
        },
        {
          label: 'Invoices Created',
          value: invoices.filter(i => i.created_at >= last30).length,
          change: invoices.filter(i => i.created_at >= last30).length - invoices.filter(i => i.created_at >= prev30start && i.created_at < last30).length,
        },
        {
          label: 'Quotes Sent',
          value: quotes.filter(q => q.created_at >= last30).length,
          change: quotes.filter(q => q.created_at >= last30).length - quotes.filter(q => q.created_at >= prev30start && q.created_at < last30).length,
        },
        {
          label: 'Batches Completed',
          value: batches.filter(b => b.status === 'completed' && b.created_at >= last30).length,
          change: 0,
        },
      ];

      setData({ invoicePayRate, leadConversionRate, quoteAcceptRate, productionEfficiency, weeklyTrend, topLeadSources, kpiSummary, recentActivity });
    } catch (err) {
      console.error('Performance fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const overallScore = data
    ? Math.round((data.invoicePayRate * 0.3 + data.leadConversionRate * 5 * 0.3 + data.quoteAcceptRate * 3.33 * 0.2 + data.productionEfficiency * 0.2))
    : 0;

  const statusColor = {
    good: 'text-accent',
    warning: 'text-warning',
    critical: 'text-destructive',
  };
  const statusBg = {
    good: 'bg-accent/10 border-accent/30',
    warning: 'bg-warning/10 border-warning/30',
    critical: 'bg-destructive/10 border-destructive/30',
  };
  const statusIcon = {
    good: <CheckCircle2 size={14} />,
    warning: <AlertTriangle size={14} />,
    critical: <AlertTriangle size={14} />,
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="page-header mb-0">
            <h1 className="page-title">PERFORMANCE METRICS</h1>
            <p className="page-subtitle">KPI tracking • Goal achievement • 90-day trends</p>
          </div>
          <button onClick={fetch} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Overall Score"
                value={`${Math.min(100, overallScore)}`}
                subtitle="composite KPI"
                icon={<Gauge size={16} />}
              />
              <MetricCard
                title="Collection Rate"
                value={`${(data?.invoicePayRate || 0).toFixed(1)}%`}
                icon={<Target size={16} />}
                subtitle="invoices paid"
              />
              <MetricCard
                title="Lead Conv."
                value={`${(data?.leadConversionRate || 0).toFixed(1)}%`}
                icon={<TrendingUp size={16} />}
                subtitle="leads converted"
              />
              <MetricCard
                title="Production Eff."
                value={`${(data?.productionEfficiency || 0).toFixed(1)}%`}
                icon={<Zap size={16} />}
                subtitle="output vs target"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="section-title">
                  <Gauge size={14} className="text-primary" />
                  KPI Overview
                </h3>
                <div className="flex justify-around mt-6">
                  <div className="text-center">
                    <ProgressRing value={Math.round(data?.invoicePayRate || 0)} label={`${Math.round(data?.invoicePayRate || 0)}%`} sublabel="Collection" />
                    <p className="text-xs text-muted-foreground mt-2">Target: 80%</p>
                  </div>
                  <div className="text-center">
                    <ProgressRing value={Math.min(100, Math.round((data?.leadConversionRate || 0) * 5))} label={`${(data?.leadConversionRate || 0).toFixed(0)}%`} sublabel="Lead Conv." color="hsl(var(--chart-2))" />
                    <p className="text-xs text-muted-foreground mt-2">Target: 20%</p>
                  </div>
                  <div className="text-center">
                    <ProgressRing value={Math.min(100, Math.round(data?.productionEfficiency || 0))} label={`${Math.round(data?.productionEfficiency || 0)}%`} sublabel="Production" color="hsl(var(--accent))" />
                    <p className="text-xs text-muted-foreground mt-2">Target: 90%</p>
                  </div>
                </div>
              </div>

              <LineChartCard
                data={data?.weeklyTrend || []}
                lines={[
                  { key: 'invoices', color: 'hsl(var(--chart-1))', name: 'Invoices' },
                  { key: 'leads', color: 'hsl(var(--chart-2))', name: 'Leads' },
                  { key: 'quotes', color: 'hsl(var(--accent))', name: 'Quotes' },
                ]}
                title="6-Week Activity Trend"
                height={220}
                showLegend
              />
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title">
                <Target size={14} className="text-primary" />
                KPI Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {(data?.kpiSummary || []).map((kpi, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${statusBg[kpi.status]}`}>
                    <div className={`flex items-center gap-2 mb-2 ${statusColor[kpi.status]}`}>
                      {statusIcon[kpi.status]}
                      <span className="text-xs font-medium">{kpi.label}</span>
                    </div>
                    <p className={`text-2xl font-bold ${statusColor[kpi.status]}`}>{kpi.value}</p>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${kpi.status === 'good' ? 'bg-accent' : kpi.status === 'warning' ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${kpi.pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Target: {kpi.target}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChartCard
                data={data?.topLeadSources?.length ? data.topLeadSources : [{ name: 'No data', value: 0 }]}
                title="Lead Sources (90 days)"
                subtitle="Where leads are coming from"
                height={240}
              />

              <div className="glass-card p-4">
                <h3 className="section-title">
                  <Clock size={14} className="text-primary" />
                  Last 30 Days vs Previous
                </h3>
                <div className="space-y-4 mt-4">
                  {(data?.recentActivity || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-foreground">{item.value}</span>
                        {item.change !== 0 && (
                          <span className={`flex items-center gap-0.5 text-xs font-medium ${item.change > 0 ? 'text-accent' : 'text-destructive'}`}>
                            <ArrowUpRight size={12} className={item.change < 0 ? 'rotate-180' : ''} />
                            {Math.abs(item.change)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Performance;
