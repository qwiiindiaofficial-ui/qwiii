import { useState } from 'react';
import { PieChart, TrendingUp, BarChart3, Activity, Calendar, Download, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, Layers, Target, Zap } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import AreaChartCard from '@/components/charts/AreaChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import BarChartCard from '@/components/charts/BarChartCard';
import LineChartCard from '@/components/charts/LineChartCard';
import ProgressRing from '@/components/charts/ProgressRing';

const revenueData = [
  { name: 'Jan', value: 42, value2: 38 },
  { name: 'Feb', value: 48, value2: 45 },
  { name: 'Mar', value: 52, value2: 49 },
  { name: 'Apr', value: 49, value2: 51 },
  { name: 'May', value: 58, value2: 55 },
  { name: 'Jun', value: 62, value2: 58 },
];

const categoryData = [
  { name: 'Sarees', value: 35 },
  { name: 'Lehengas', value: 28 },
  { name: 'Kurtas', value: 22 },
  { name: 'Others', value: 15 },
];

const regionData = [
  { name: 'North', value: 4500 },
  { name: 'South', value: 3800 },
  { name: 'West', value: 3200 },
  { name: 'East', value: 2100 },
];

const channelData = [
  { name: 'Direct', value: 45 },
  { name: 'B2B Portal', value: 32 },
  { name: 'WhatsApp', value: 18 },
  { name: 'Referral', value: 5 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  name: `${i}:00`,
  orders: Math.floor(20 + Math.random() * 80),
  revenue: Math.floor(50000 + Math.random() * 150000),
}));

const topProducts = [
  { name: 'Banarasi Silk Saree', sales: 1250, growth: 23.5, trend: 'up' },
  { name: 'Designer Lehenga Set', sales: 980, growth: 18.2, trend: 'up' },
  { name: 'Cotton Kurta Collection', sales: 870, growth: -5.1, trend: 'down' },
  { name: 'Embroidered Suit', sales: 720, growth: 12.8, trend: 'up' },
  { name: 'Festive Dupatta', sales: 650, growth: 8.4, trend: 'up' },
];

const comparisons = [
  { label: 'Revenue', current: '₹2.45Cr', previous: '₹1.98Cr', change: '+23.7%', positive: true },
  { label: 'Orders', current: '1,847', previous: '1,562', change: '+18.2%', positive: true },
  { label: 'Avg Ticket', current: '₹48.5K', previous: '₹45.2K', change: '+7.3%', positive: true },
  { label: 'Returns', current: '2.1%', previous: '3.4%', change: '-38.2%', positive: true },
];

type TimeRange = '7d' | '30d' | '90d' | '1y';
type ViewMode = 'overview' | 'products' | 'regions' | 'channels';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isComparing, setIsComparing] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header with Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">BUSINESS INTELLIGENCE</h1>
            <p className="page-subtitle">Data-driven insights • Comprehensive analytics</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center bg-muted/50 rounded-lg p-1">
              {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    timeRange === range
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            {/* Compare Toggle */}
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isComparing
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers size={14} />
              Compare
            </button>
            
            {/* Export */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
              <Download size={14} />
              Export
            </button>
            
            {/* Refresh */}
            <button className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'products', label: 'Products', icon: BarChart3 },
            { id: 'regions', label: 'Regions', icon: PieChart },
            { id: 'channels', label: 'Channels', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as ViewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Revenue"
            value="₹2.45Cr"
            change="+23%"
            changeType="positive"
            icon={<TrendingUp size={16} />}
            subtitle="vs last period"
          />
          <MetricCard
            title="Orders"
            value="1,847"
            change="+18%"
            changeType="positive"
            icon={<BarChart3 size={16} />}
            subtitle="total orders"
          />
          <MetricCard
            title="Avg Order"
            value="₹48.5K"
            change="+8%"
            changeType="positive"
            icon={<PieChart size={16} />}
            subtitle="per transaction"
          />
          <MetricCard
            title="Conversion"
            value="24%"
            change="+4%"
            changeType="positive"
            icon={<Activity size={16} />}
            subtitle="inquiry to order"
          />
        </div>

        {/* Comparison Cards */}
        {isComparing && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisons.map((item, i) => (
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

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AreaChartCard
              data={revenueData}
              title="Revenue Trend"
              subtitle={`Monthly revenue • ${timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : timeRange === '90d' ? 'Last quarter' : 'Last year'}`}
              height={280}
              color="hsl(var(--chart-1))"
              color2={isComparing ? "hsl(var(--chart-2))" : undefined}
            />
          </div>
          <DonutChartCard
            data={categoryData}
            title="Sales by Category"
            centerValue="₹2.45Cr"
            centerLabel="Total"
            height={180}
          />
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartCard
            data={regionData}
            title="Regional Performance"
            subtitle="Sales by region (₹ in Thousands)"
            height={250}
          />
          
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0">
                <Zap size={14} className="text-primary" />
                Top Performing Products
              </h3>
              <button className="text-xs text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${product.trend === 'up' ? 'text-accent' : 'text-destructive'}`}>
                    {product.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div className="glass-card p-4">
          <h3 className="section-title">
            <Calendar size={14} className="text-primary" />
            Hourly Activity Heatmap
          </h3>
          <div className="grid grid-cols-12 gap-1 mt-4">
            {hourlyData.slice(0, 12).map((hour, i) => (
              <div key={i} className="text-center">
                <div
                  className="h-12 rounded-md mb-2 flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: `hsl(var(--primary) / ${0.2 + (hour.orders / 100) * 0.6})`,
                    color: hour.orders > 50 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))'
                  }}
                >
                  {hour.orders}
                </div>
                <span className="text-xs text-muted-foreground">{hour.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/20" />
              Low
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/50" />
              Medium
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/80" />
              High
            </div>
          </div>
        </div>

        {/* Channel & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DonutChartCard
            data={channelData}
            title="Sales by Channel"
            centerValue="1,847"
            centerLabel="Orders"
            height={180}
          />
          
          <div className="lg:col-span-2 glass-card p-4">
            <h3 className="section-title">
              <Target size={14} className="text-primary" />
              Goal Progress
            </h3>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <div className="text-center">
                <ProgressRing value={82} label="82%" sublabel="Revenue" size={100} strokeWidth={8} />
                <p className="text-xs text-muted-foreground mt-2">₹2.45Cr / ₹3Cr</p>
              </div>
              <div className="text-center">
                <ProgressRing value={74} label="74%" sublabel="Orders" size={100} strokeWidth={8} color="hsl(var(--chart-2))" />
                <p className="text-xs text-muted-foreground mt-2">1,847 / 2,500</p>
              </div>
              <div className="text-center">
                <ProgressRing value={91} label="91%" sublabel="New Buyers" size={100} strokeWidth={8} color="hsl(var(--accent))" />
                <p className="text-xs text-muted-foreground mt-2">45 / 50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;