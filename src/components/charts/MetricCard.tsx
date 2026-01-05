import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
}

const MetricCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  subtitle,
  className,
}: MetricCardProps) => {
  return (
    <div
      className={cn(
        'glass-card p-4 relative overflow-hidden group hover:border-primary/30 transition-all duration-300',
        className
      )}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>

        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>

        <div className="flex items-center gap-2">
          {change && (
            <span
              className={cn(
                'text-xs font-medium',
                changeType === 'positive' && 'text-accent',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
