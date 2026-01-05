import { Gauge, TrendingUp, Target, Zap } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import ProgressRing from '@/components/charts/ProgressRing';
import LineChartCard from '@/components/charts/LineChartCard';

const kpiData = [{ name: 'W1', efficiency: 92, quality: 94, delivery: 96 }, { name: 'W2', efficiency: 94, quality: 93, delivery: 97 }, { name: 'W3', efficiency: 91, quality: 95, delivery: 94 }, { name: 'W4', efficiency: 96, quality: 96, delivery: 98 }];

const Performance = () => (
  <DashboardLayout>
    <div className="p-6 space-y-6">
      <div className="page-header"><h1 className="page-title">PERFORMANCE METRICS</h1><p className="page-subtitle">KPI tracking • Goal achievement</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Overall Score" value="94.2" change="+2.1" changeType="positive" icon={<Gauge size={16} />} />
        <MetricCard title="Target Met" value="87%" icon={<Target size={16} />} />
        <MetricCard title="Efficiency" value="96%" change="+3%" changeType="positive" icon={<Zap size={16} />} />
        <MetricCard title="Growth" value="+24%" icon={<TrendingUp size={16} />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6"><h3 className="section-title"><Gauge size={14} className="text-primary" /> Key Metrics</h3><div className="flex justify-around mt-6"><ProgressRing value={94} label="94%" sublabel="Efficiency" /><ProgressRing value={96} label="96%" sublabel="Quality" color="hsl(var(--chart-2))" /><ProgressRing value={98} label="98%" sublabel="Delivery" color="hsl(var(--accent))" /></div></div>
        <LineChartCard data={kpiData} lines={[{ key: 'efficiency', color: 'hsl(var(--chart-1))', name: 'Efficiency' }, { key: 'quality', color: 'hsl(var(--chart-2))', name: 'Quality' }, { key: 'delivery', color: 'hsl(var(--accent))', name: 'Delivery' }]} title="Weekly KPI Trends" height={220} showLegend />
      </div>
    </div>
  </DashboardLayout>
);

export default Performance;
