import { useState } from 'react';
import { TriangleAlert as AlertTriangle, Bell, CircleCheck as CheckCircle2, Circle as XCircle, Clock, Filter, Shield } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import { useAlerts } from '@/hooks/useAlerts';

const typeStyle: Record<string, string> = {
  error: 'bg-destructive/10 border-destructive/30',
  warning: 'bg-warning/10 border-warning/30',
  success: 'bg-accent/10 border-accent/30',
  info: 'bg-muted/30 border-border',
};

const dotStyle: Record<string, string> = {
  error: 'bg-destructive animate-pulse',
  warning: 'bg-warning',
  success: 'bg-accent',
  info: 'bg-primary',
};

const AlertsCenter = () => {
  const { activeAlerts, alerts, loading, stats, resolveAlert, resolveAll } = useAlerts();
  const [filter, setFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);

  const displayAlerts = showResolved ? alerts : activeAlerts;
  const filtered = filter === 'all' ? displayAlerts : displayAlerts.filter(a => a.type === filter);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">ALERTS CENTER</h1>
            <p className="page-subtitle">Real-time notifications • Smart priority sorting</p>
          </div>
          <div className="flex items-center gap-3">
            {activeAlerts.length > 0 && (
              <button
                onClick={resolveAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCircle2 size={16} />
                Resolve All
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Critical" value={stats.critical.toString()} icon={<XCircle size={16} />} />
          <MetricCard title="Warnings" value={stats.warnings.toString()} icon={<AlertTriangle size={16} />} />
          <MetricCard title="Info" value={stats.info.toString()} icon={<Bell size={16} />} />
          <MetricCard title="Resolved Today" value={stats.resolvedToday.toString()} icon={<CheckCircle2 size={16} />} />
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="section-title mb-0 flex items-center gap-2">
              <Bell size={14} className="text-primary" />
              {showResolved ? 'All Alerts' : 'Active Alerts'}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={12} className="text-muted-foreground" />
              {['all', 'error', 'warning', 'info', 'success'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1 text-xs rounded-full capitalize transition-all ${
                    filter === t ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => setShowResolved(v => !v)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  showResolved ? 'bg-accent text-accent-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {showResolved ? 'Show Active' : 'Show All'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading alerts...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Shield size={40} className="text-accent mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">All clear!</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activeAlerts.length === 0 ? 'No active alerts at this time' : 'No alerts match the current filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                    alert.resolved ? 'opacity-60 bg-muted/20 border-border' : typeStyle[alert.type] || typeStyle.info
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    alert.resolved ? 'bg-muted-foreground' : dotStyle[alert.type] || dotStyle.info
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    {alert.description && (
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    )}
                    {alert.source && (
                      <p className="text-xs text-muted-foreground mt-0.5">Source: {alert.source}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={10} />
                      {formatTime(alert.created_at)}
                    </span>
                    {!alert.resolved ? (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-2.5 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 text-xs bg-muted text-muted-foreground rounded">Resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AlertsCenter;
