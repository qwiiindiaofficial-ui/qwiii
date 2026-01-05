import { Bell, CheckCircle2, Clock, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';

const notifications = [
  { title: 'New order received', desc: 'Order #4892 from Sharma Textiles', time: '5 min ago', read: false },
  { title: 'Payment confirmed', desc: '₹2.4L received from Delhi Emporium', time: '1 hour ago', read: false },
  { title: 'Stock alert', desc: 'Silk inventory below threshold', time: '2 hours ago', read: true },
  { title: 'Report ready', desc: 'Monthly sales report generated', time: '4 hours ago', read: true },
];

const Notifications = () => (
  <DashboardLayout>
    <div className="p-6 space-y-6">
      <div className="page-header"><h1 className="page-title">NOTIFICATIONS</h1><p className="page-subtitle">Activity feed • Smart alerts</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Unread" value="8" icon={<Bell size={16} />} />
        <MetricCard title="Today" value="24" icon={<Clock size={16} />} />
        <MetricCard title="This Week" value="156" icon={<CheckCircle2 size={16} />} />
        <MetricCard title="Categories" value="6" icon={<Filter size={16} />} />
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4"><h3 className="section-title mb-0"><Bell size={14} className="text-primary" /> Recent</h3><button className="text-xs text-primary">Mark all read</button></div>
        <div className="space-y-2">{notifications.map((n, i) => <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${n.read ? 'bg-muted/20 border-border/50' : 'bg-primary/5 border-primary/20'}`}><div className={`w-2 h-2 rounded-full mt-1.5 ${n.read ? 'bg-muted-foreground' : 'bg-primary'}`} /><div className="flex-1"><p className="text-sm font-medium text-foreground">{n.title}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div><span className="text-xs text-muted-foreground">{n.time}</span></div>)}</div>
      </div>
    </div>
  </DashboardLayout>
);

export default Notifications;
