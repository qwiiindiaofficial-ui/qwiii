import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import AreaChartCard from '@/components/charts/AreaChartCard';

const liveData = Array.from({ length: 30 }, (_, i) => ({ name: `${i}s`, value: 100 + Math.random() * 50 }));

const RealTimeData = () => (
  <DashboardLayout>
    <div className="p-6 space-y-6">
      <div className="page-header"><h1 className="page-title">REAL-TIME DATA</h1><p className="page-subtitle">Live streaming • Instant updates</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Events/sec" value="847" icon={<Zap size={16} />} />
        <MetricCard title="Latency" value="12ms" icon={<Clock size={16} />} />
        <MetricCard title="Active Streams" value="24" icon={<Activity size={16} />} />
        <MetricCard title="Data Rate" value="1.2 GB/h" icon={<TrendingUp size={16} />} />
      </div>
      <AreaChartCard data={liveData} title="Live Event Stream" subtitle="Events per second" height={350} color="hsl(var(--accent))" />
    </div>
  </DashboardLayout>
);

export default RealTimeData;
