import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  status: 'online' | 'warning' | 'error' | 'offline';
  description?: string;
  icon?: ReactNode;
  details?: { label: string; value: string }[];
  className?: string;
}

const StatusCard = ({
  title,
  status,
  description,
  icon,
  details,
  className,
}: StatusCardProps) => {
  const statusConfig = {
    online: {
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/30',
      dot: 'status-online',
      label: 'Operational',
    },
    warning: {
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      dot: 'status-warning',
      label: 'Warning',
    },
    error: {
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      dot: 'status-error',
      label: 'Error',
    },
    offline: {
      color: 'text-muted-foreground',
      bg: 'bg-muted/50',
      border: 'border-border',
      dot: 'bg-muted-foreground w-2 h-2 rounded-full',
      label: 'Offline',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'glass-card p-4 border',
        config.border,
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn('p-1.5 rounded-md', config.bg, config.color)}>
              {icon}
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-foreground">{title}</h4>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-medium', config.color)}>
            {config.label}
          </span>
          <div className={config.dot} />
        </div>
      </div>

      {details && details.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
          {details.map((detail) => (
            <div key={detail.label}>
              <p className="text-xs text-muted-foreground">{detail.label}</p>
              <p className="text-sm font-medium text-foreground">{detail.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusCard;
