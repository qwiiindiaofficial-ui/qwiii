import { useState } from 'react';
import { Bell, CircleCheck as CheckCircle2, Trash2, MailOpen, Filter, Clock, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import { useNotifications } from '@/hooks/useNotifications';

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  success: { icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
  error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20' },
};

const Notifications = () => {
  const { notifications, loading, unreadCount, todayCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

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
            <h1 className="page-title">NOTIFICATIONS</h1>
            <p className="page-subtitle">System alerts • Activity updates</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MailOpen size={16} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Unread" value={unreadCount.toString()} icon={<Bell size={16} />} subtitle="notifications" />
          <MetricCard title="Today" value={todayCount.toString()} icon={<Clock size={16} />} subtitle="received" />
          <MetricCard title="Total" value={notifications.length.toString()} icon={<CheckCircle2 size={16} />} />
          <MetricCard title="Read" value={(notifications.length - unreadCount).toString()} icon={<MailOpen size={16} />} />
        </div>

        <div className="glass-card">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                {(['all', 'unread'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                      filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f}
                    {f === 'unread' && unreadCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={14} className="text-muted-foreground" />
                {['all', 'info', 'success', 'warning', 'error'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1 text-xs rounded-full capitalize transition-all ${
                      typeFilter === t ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading notifications...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Bell size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Activities and system events will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filtered.map((notif) => {
                const cfg = typeConfig[notif.type] || typeConfig.info;
                const Icon = cfg.icon;
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors ${!notif.read ? 'bg-primary/[0.02]' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${cfg.bg}`}>
                      <Icon size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-medium ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notif.title}
                            {!notif.read && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-primary inline-block align-middle" />}
                          </p>
                          {notif.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{notif.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {formatTime(notif.created_at)}
                          </span>
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              title="Mark as read"
                            >
                              <MailOpen size={12} className="text-muted-foreground" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={12} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
