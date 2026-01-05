import { TrendingUp, BarChart3, Package, AlertTriangle, Brain, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AreaChartCard from '@/components/charts/AreaChartCard';
import BarChartCard from '@/components/charts/BarChartCard';
import LineChartCard from '@/components/charts/LineChartCard';
import MetricCard from '@/components/charts/MetricCard';
import ProgressRing from '@/components/charts/ProgressRing';
import AnimatedCounter from '@/components/ai/AnimatedCounter';

const forecastData = [
  { name: 'Week 1', value: 2400, value2: 2200 },
  { name: 'Week 2', value: 2800, value2: 2900 },
  { name: 'Week 3', value: 3200, value2: 3100 },
  { name: 'Week 4', value: 3600, value2: 3800 },
  { name: 'Week 5', value: 4100, value2: 4200 },
  { name: 'Week 6', value: 4500, value2: 4600 },
];

const skuData = [
  { name: 'SKU-2847', value: 1250 },
  { name: 'SKU-1923', value: 980 },
  { name: 'SKU-4521', value: 870 },
  { name: 'SKU-3847', value: 720 },
  { name: 'SKU-5123', value: 650 },
];

const productionData = [
  { name: 'Mon', planned: 450, actual: 420 },
  { name: 'Tue', planned: 480, actual: 510 },
  { name: 'Wed', planned: 520, actual: 490 },
  { name: 'Thu', planned: 490, actual: 530 },
  { name: 'Fri', planned: 510, actual: 480 },
  { name: 'Sat', planned: 300, actual: 320 },
];

const alerts = [
  { type: 'warning', title: 'Raw Material Low', desc: 'Silk inventory below threshold', time: '2h ago' },
  { type: 'info', title: 'Demand Spike Predicted', desc: 'SKU-2847 expected +40% next week', time: '4h ago' },
  { type: 'success', title: 'Forecast Updated', desc: 'AI model retrained successfully', time: '6h ago' },
];

const SalesForecast = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">SALES FORECAST</h1>
          <p className="page-subtitle">AI-powered demand prediction • 30-day rolling forecast</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Forecast Accuracy"
            value="94.2%"
            change="+2.1%"
            changeType="positive"
            icon={<Target size={16} />}
          />
          <MetricCard
            title="Predicted Demand"
            value={<AnimatedCounter value={28450} duration={1500} />}
            change="+18%"
            changeType="positive"
            icon={<TrendingUp size={16} />}
          />
          <MetricCard
            title="Stock Coverage"
            value="45 days"
            change="-3 days"
            changeType="negative"
            icon={<Package size={16} />}
          />
          <MetricCard
            title="At-Risk SKUs"
            value="12"
            change="+4"
            changeType="negative"
            icon={<AlertTriangle size={16} />}
          />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AreaChartCard
              data={forecastData}
              title="Demand Forecast vs Actual"
              subtitle="Units per week • Blue: Actual, Purple: Predicted"
              color="hsl(var(--chart-1))"
              color2="hsl(var(--chart-2))"
              height={300}
            />
          </div>

          <div className="glass-card p-4">
            <h3 className="section-title">
              <Brain size={14} className="text-primary" />
              AI Model Performance
            </h3>
            <div className="flex justify-around mt-4">
              <ProgressRing value={94} label="94%" sublabel="Accuracy" size={90} strokeWidth={6} />
              <ProgressRing value={87} label="87%" sublabel="Precision" size={90} strokeWidth={6} color="hsl(var(--chart-2))" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Training Data</span>
                <span className="text-foreground font-medium">52,847 orders</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-foreground font-medium">2 hours ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Retrain</span>
                <span className="text-foreground font-medium">In 6 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartCard
            data={skuData}
            title="Top Predicted SKUs"
            subtitle="Expected demand next 30 days"
            height={220}
          />

          <LineChartCard
            data={productionData}
            lines={[
              { key: 'planned', color: 'hsl(var(--chart-1))', name: 'Planned' },
              { key: 'actual', color: 'hsl(var(--accent))', name: 'Actual' },
            ]}
            title="Production Schedule"
            subtitle="Daily units this week"
            height={220}
            showLegend
          />
        </div>

        {/* Alerts */}
        <div className="glass-card p-4">
          <h3 className="section-title">
            <AlertTriangle size={14} className="text-warning" />
            Forecast Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  alert.type === 'warning' ? 'bg-warning' :
                  alert.type === 'success' ? 'bg-accent' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesForecast;
