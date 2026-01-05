import { Server, Database, Cpu, Wifi, HardDrive, Activity, CheckCircle2, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusCard from '@/components/charts/StatusCard';
import AreaChartCard from '@/components/charts/AreaChartCard';
import MetricCard from '@/components/charts/MetricCard';

const cpuData = Array.from({ length: 20 }, (_, i) => ({ name: `${i}`, value: 30 + Math.random() * 40 }));
const memoryData = Array.from({ length: 20 }, (_, i) => ({ name: `${i}`, value: 50 + Math.random() * 30 }));

const SystemStatus = () => (
  <DashboardLayout>
    <div className="p-6 space-y-6">
      <div className="page-header">
        <h1 className="page-title">SYSTEM STATUS</h1>
        <p className="page-subtitle">Real-time infrastructure monitoring • All systems operational</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Uptime" value="99.98%" change="+0.02%" changeType="positive" icon={<Clock size={16} />} />
        <MetricCard title="CPU Usage" value="45%" icon={<Cpu size={16} />} />
        <MetricCard title="Memory" value="68%" icon={<HardDrive size={16} />} />
        <MetricCard title="API Latency" value="42ms" change="-8ms" changeType="positive" icon={<Activity size={16} />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartCard data={cpuData} title="CPU Usage" subtitle="Last 20 minutes" height={200} color="hsl(var(--chart-1))" />
        <AreaChartCard data={memoryData} title="Memory Usage" subtitle="Last 20 minutes" height={200} color="hsl(var(--chart-2))" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="AI Engine" status="online" icon={<Cpu size={14} />} details={[{ label: 'Requests', value: '12K/hr' }]} />
        <StatusCard title="Database" status="online" icon={<Database size={14} />} details={[{ label: 'Connections', value: '48' }]} />
        <StatusCard title="API Gateway" status="online" icon={<Server size={14} />} details={[{ label: 'Uptime', value: '99.9%' }]} />
        <StatusCard title="CDN" status="online" icon={<Wifi size={14} />} details={[{ label: 'Cache Hit', value: '94%' }]} />
      </div>
    </div>
  </DashboardLayout>
);

export default SystemStatus;
