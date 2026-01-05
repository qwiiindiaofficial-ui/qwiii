import { AlertTriangle, Bell, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';

const alerts = [
  { type: 'error', title: 'Low Stock Alert', desc: 'Silk inventory below 500 units', time: '5 min ago' },
  { type: 'warning', title: 'Demand Spike', desc: 'SKU-2847 showing unusual demand pattern', time: '1 hour ago' },
  { type: 'info', title: 'Model Retrained', desc: 'Forecast AI updated with latest data', time: '2 hours ago' },
  { type: 'success', title: 'Order Completed', desc: 'Bulk order #4521 shipped successfully', time: '3 hours ago' },
  { type: 'warning', title: 'Payment Pending', desc: '3 invoices overdue for collection', time: '4 hours ago' },
];

const AlertsCenter = () => (
  <DashboardLayout>
    <div className="p-6 space-y-6">
      <div className="page-header">
        <h1 className="page-title">ALERTS CENTER</h1>
        <p className="page-subtitle">Real-time notifications • Smart priority sorting</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Critical" value="1" icon={<XCircle size={16} />} />
        <MetricCard title="Warnings" value="3" icon={<AlertTriangle size={16} />} />
        <MetricCard title="Info" value="12" icon={<Bell size={16} />} />
        <MetricCard title="Resolved Today" value="24" icon={<CheckCircle2 size={16} />} />
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title mb-0"><Bell size={14} className="text-primary" /> Recent Alerts</h3>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Filter size={12} /> Filter</button>
        </div>
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-lg border ${alert.type === 'error' ? 'bg-destructive/10 border-destructive/30' : alert.type === 'warning' ? 'bg-warning/10 border-warning/30' : alert.type === 'success' ? 'bg-accent/10 border-accent/30' : 'bg-muted/30 border-border'}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.type === 'error' ? 'bg-destructive' : alert.type === 'warning' ? 'bg-warning' : alert.type === 'success' ? 'bg-accent' : 'bg-primary'}`} />
              <div className="flex-1"><p className="text-sm font-medium text-foreground">{alert.title}</p><p className="text-xs text-muted-foreground">{alert.desc}</p></div>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} />{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AlertsCenter;
