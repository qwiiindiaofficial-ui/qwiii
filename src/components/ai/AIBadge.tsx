import { Sparkles, Zap, Brain, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIBadgeProps {
  variant?: 'default' | 'powered' | 'smart' | 'processing';
  size?: 'sm' | 'md';
  className?: string;
}

const AIBadge = ({ variant = 'default', size = 'sm', className = '' }: AIBadgeProps) => {
  const variants = {
    default: {
      icon: Sparkles,
      text: 'AI Powered',
      classes: 'bg-primary/10 text-primary border-primary/30',
    },
    powered: {
      icon: Zap,
      text: 'AI Enhanced',
      classes: 'bg-accent/10 text-accent border-accent/30',
    },
    smart: {
      icon: Brain,
      text: 'Smart AI',
      classes: 'bg-secondary/10 text-secondary border-secondary/30',
    },
    processing: {
      icon: Cpu,
      text: 'AI Processing',
      classes: 'bg-neon-pink/10 text-neon-pink border-neon-pink/30',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
  };

  const { icon: Icon, text, classes } = variants[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        classes,
        sizeClasses[size],
        className
      )}
    >
      <Icon size={size === 'sm' ? 12 : 14} className="animate-pulse-slow" />
      {text}
    </span>
  );
};

export default AIBadge;
