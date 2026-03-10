import { useState } from 'react';
import { PieChart, TrendingUp, BarChart3, Activity, Download, Layers, Target, Zap, RefreshCw, ArrowUpRight, ArrowDownRight, Users, FileText } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import AreaChartCard from '@/components/charts/AreaChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import BarChartCard from '@/components/charts/BarChartCard';
import ProgressRing from '@/components/charts/ProgressRing';
import { useAnalytics, TimeRange } from '@/hooks/useAnalytics';

const fmtCurrency = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n.toFixed(0)}`;
};

type ViewMode = 'overview' | 'products' | 'regions' | 'channels';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isComparing, setIsComparing] = useState(false);
  const { data, loading, refresh } = useAnalytics(timeRange);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">BUSINESS INTELLIGENCE</h1>
            <p className="page-subtitle">Live data insights • Real-time analytics</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-muted/50 rounded-lg p-1">
              {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    timeRange === range ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsComparing(!isComparing)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isComparing ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers size={14} />
              Compare
            </button>

            <button
              onClick={refresh}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'products', label: 'Clients', icon: Users },
            { id: 'regions', label: 'Invoices', icon: FileText },
            { id: 'channels', label: 'Leads', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as ViewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Revenue"
                value={fmtCurrency(data?.totalRevenue || 0)}
                change={data?.revenueComparison[0]?.change}
                changeType={data?.revenueComparison[0]?.positive ? 'positive' : 'negative'}
                icon={<TrendingUp size={16} />}
                subtitle="period total"
              />
              <MetricCard
                title="Invoices"
                value={String(data?.totalOrders || 0)}
                change={data?.revenueComparison[1]?.change}
                changeType={data?.revenueComparison[1]?.positive ? 'positive' : 'negative'}
                icon={<BarChart3 size={16} />}
                subtitle="this period"
              />
              <MetricCard
                title="Avg Invoice"
                value={fmtCurrency(data?.avgOrderValue || 0)}
                change={data?.revenueComparison[2]?.change}
                changeType={data?.revenueComparison[2]?.positive ? 'positive' : 'negative'}
                icon={<PieChart size={16} />}
                subtitle="per invoice"
              />
              <MetricCard
                title="Lead Conversion"
                value={`${(data?.conversionRate || 0).toFixed(1)}%`}
                icon={<Activity size={16} />}
                subtitle={`${data?.convertedLeads || 0} converted`}
              />
            </div>

            {isComparing && data?.revenueComparison && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {data.revenueComparison.map((item, i) => (
                  <div key={i} className="glass-card p-4">
                    <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xl font-bold text-foreground">{item.current}</p>
                        <p className="text-xs text-muted-foreground">vs {item.previous}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${item.positive ? 'text-accent' : 'text-destructive'}`}>
                        {item.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {item.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'overview' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AreaChartCard
                      data={data?.revenueByMonth || []}
                      title="Revenue Trend"
                      subtitle={`Revenue in Lakhs • ${timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : timeRange === '90d' ? 'Last quarter' : 'Last year'}`}
                      height={280}
                      color="hsl(var(--chart-1))"
                      color2={isComparing ? 'hsl(var(--chart-2))' : undefined}
                    />
                  </div>
                  <DonutChartCard
                    data={data?.invoiceStatusDist?.length ? data.invoiceStatusDist : [{ name: 'No data', value: 1 }]}
                    title="Invoice Status"
                    centerValue={fmtCurrency(data?.paidRevenue || 0)}
                    centerLabel="Collected"
                    height={180}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BarChartCard
                    data={data?.clientsByCity?.length ? data.clientsByCity : [{ name: 'No data', value: 0 }]}
                    title="Clients by City"
                    subtitle="Distribution of clients"
                    height={250}
                  />

                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="section-title mb-0">
                        <Zap size={14} className="text-primary" />
                        Top Clients by Revenue
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {(data?.topClients?.length ? data.topClients : []).map((client, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{client.name}</p>
                            <p className="text-xs text-muted-foreground">₹{client.sales}K revenue</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-accent">
                            <ArrowUpRight size={14} />
                            {client.growth}%
                          </div>
                        </div>
                      ))}
                      {!data?.topClients?.length && (
                        <p className="text-sm text-muted-foreground text-center py-4">No invoice data yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <DonutChartCard
                    data={data?.channelData?.length ? data.channelData : [{ name: 'No data', value: 1 }]}
                    title="Sales Channels"
                    centerValue={String(data?.totalOrders || 0)}
                    centerLabel="Total"
                    height={180}
                  />

                  <div className="lg:col-span-2 glass-card p-4">
                    <h3 className="section-title">
                      <Target size={14} className="text-primary" />
                      Goal Progress
                    </h3>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <div className="text-center">
                        <ProgressRing
                          value={Math.round(data?.goalProgress?.revenue || 0)}
                          label={`${Math.round(data?.goalProgress?.revenue || 0)}%`}
                          sublabel="Revenue"
                          size={100}
                          strokeWidth={8}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {fmtCurrency(data?.totalRevenue || 0)} / {fmtCurrency(data?.goalProgress?.revenueTarget || 5000000)}
                        </p>
                      </div>
                      <div className="text-center">
                        <ProgressRing
                          value={Math.round(data?.goalProgress?.orders || 0)}
                          label={`${Math.round(data?.goalProgress?.orders || 0)}%`}
                          sublabel="Invoices"
                          size={100}
                          strokeWidth={8}
                          color="hsl(var(--chart-2))"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {data?.totalOrders || 0} / {data?.goalProgress?.ordersTarget || 100}
                        </p>
                      </div>
                      <div className="text-center">
                        <ProgressRing
                          value={Math.round(data?.goalProgress?.newClients || 0)}
                          label={`${Math.round(data?.goalProgress?.newClients || 0)}%`}
                          sublabel="New Clients"
                          size={100}
                          strokeWidth={8}
                          color="hsl(var(--accent))"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          / {data?.goalProgress?.newClientsTarget || 20} target
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {viewMode === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-4">
                  <h3 className="section-title">
                    <Users size={14} className="text-primary" />
                    Client Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                      <p className="text-xs text-muted-foreground">Total Clients</p>
                      <p className="text-2xl font-bold text-foreground">{data?.totalClients || 0}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                      <p className="text-xs text-muted-foreground">Active Clients</p>
                      <p className="text-2xl font-bold text-foreground">{data?.activeClients || 0}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    {(data?.topClients || []).map((client, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground">₹{client.sales}K revenue</p>
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(100, (client.sales / ((data?.topClients[0]?.sales || 1))) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {!data?.topClients?.length && (
                      <p className="text-center text-sm text-muted-foreground py-8">No client revenue data yet</p>
                    )}
                  </div>
                </div>
                <BarChartCard
                  data={data?.clientsByCity?.length ? data.clientsByCity : [{ name: 'No data', value: 0 }]}
                  title="Clients by City"
                  subtitle="Geographic distribution"
                  height={320}
                />
              </div>
            )}

            {viewMode === 'regions' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonutChartCard
                  data={data?.invoiceStatusDist?.length ? data.invoiceStatusDist : [{ name: 'No data', value: 1 }]}
                  title="Invoice Status Distribution"
                  centerValue={String(data?.totalOrders || 0)}
                  centerLabel="Total"
                  height={220}
                />
                <div className="glass-card p-4">
                  <h3 className="section-title">
                    <FileText size={14} className="text-primary" />
                    Invoice Summary
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/30">
                      <span className="text-sm font-medium">Collected (Paid)</span>
                      <span className="text-sm font-bold text-accent">{fmtCurrency(data?.paidRevenue || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/30">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm font-bold text-warning">{fmtCurrency(data?.pendingRevenue || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <span className="text-sm font-medium">Total Invoiced</span>
                      <span className="text-sm font-bold text-primary">{fmtCurrency(data?.totalRevenue || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                      <span className="text-sm font-medium">Average Invoice</span>
                      <span className="text-sm font-bold">{fmtCurrency(data?.avgOrderValue || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'channels' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonutChartCard
                  data={data?.leadsByStatus?.length ? data.leadsByStatus : [{ name: 'No data', value: 1 }]}
                  title="Leads by Status"
                  centerValue={String(data?.totalLeads || 0)}
                  centerLabel="Total Leads"
                  height={220}
                />
                <div className="glass-card p-4">
                  <h3 className="section-title">
                    <Target size={14} className="text-primary" />
                    Lead Funnel
                  </h3>
                  <div className="space-y-3 mt-4">
                    {(data?.leadsByStatus || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-20">{item.name}</span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${data?.totalLeads ? (item.value / data.totalLeads) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{item.value}</span>
                      </div>
                    ))}
                    {!data?.leadsByStatus?.length && (
                      <p className="text-center text-sm text-muted-foreground py-8">No lead data yet</p>
                    )}
                    <div className="pt-2 border-t border-border mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Conversion Rate</span>
                        <span className="font-bold text-accent">{(data?.conversionRate || 0).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
