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

const revenueData = [
  { name: 'Jan', value: 4200, value2: 3800 },
  { name: 'Feb', value: 4800, value2: 4200 },
  { name: 'Mar', value: 5200, value2: 4600 },
  { name: 'Apr', value: 4900, value2: 4400 },
  { name: 'May', value: 5800, value2: 5200 },
  { name: 'Jun', value: 6200, value2: 5600 },
  { name: 'Jul', value: 7100, value2: 6400 },
];

const productionData = [
  { name: 'Fabric A', value: 4500 },
  { name: 'Fabric B', value: 3200 },
  { name: 'Fabric C', value: 2800 },
  { name: 'Fabric D', value: 2100 },
  { name: 'Fabric E', value: 1800 },
];

const categoryData = [
  { name: 'Sarees', value: 35 },
  { name: 'Dress Material', value: 28 },
  { name: 'Lehengas', value: 20 },
  { name: 'Kurtas', value: 17 },
];

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
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
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

        {/* KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={<AnimatedCounter value={24500000} prefix="₹" duration={1500} />}
            change="+23.5%"
            changeType="positive"
            icon={<DollarSign size={16} />}
            subtitle="vs last month"
          />
          <MetricCard
            title="Active SKUs"
            value={<AnimatedCounter value={12847} duration={1500} />}
            change="+156"
            changeType="positive"
            icon={<Package size={16} />}
            subtitle="this week"
          />
          <MetricCard
            title="B2B Buyers"
            value={<AnimatedCounter value={384} duration={1500} />}
            change="+12"
            changeType="positive"
            icon={<Users size={16} />}
            subtitle="active"
          />
          <MetricCard
            title="AI Accuracy"
            value="94.2%"
            change="+2.1%"
            changeType="positive"
            icon={<Activity size={16} />}
            subtitle="forecast"
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - spans 2 columns */}
          <div className="lg:col-span-2">
            <AreaChartCard
              data={revenueData}
              title="Revenue Trend"
              subtitle="Actual vs Target (₹ in Lakhs)"
              color="hsl(185, 100%, 50%)"
              color2="hsl(265, 85%, 55%)"
              height={280}
            />
          </div>

          {/* Category Distribution */}
          <DonutChartCard
            data={categoryData}
            title="Sales by Category"
            subtitle="Current month distribution"
            centerValue="₹24.5L"
            centerLabel="Total"
            height={180}
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BarChartCard
            data={productionData}
            title="Top Products"
            subtitle="Units produced this month"
            height={200}
          />

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

          {/* AI Performance */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">AI Performance</h3>
            <div className="flex items-center justify-around">
              <ProgressRing
                value={94}
                size={100}
                strokeWidth={8}
                color="hsl(185, 100%, 50%)"
                label="94%"
                sublabel="Accuracy"
              />
              <ProgressRing
                value={87}
                size={100}
                strokeWidth={8}
                color="hsl(155, 100%, 45%)"
                label="87%"
                sublabel="Efficiency"
              />
            </div>
          </div>
        </div>

        {/* System Status & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
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
                  { label: 'Records', value: '2.4M' },
                  { label: 'Size', value: '12GB' },
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

          {/* Quick Actions */}
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
