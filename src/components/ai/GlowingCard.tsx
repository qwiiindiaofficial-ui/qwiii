import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'green' | 'pink';
  hoverable?: boolean;
}

const GlowingCard = ({
  children,
  className = '',
  glowColor = 'cyan',
  hoverable = true,
}: GlowingCardProps) => {
  const glowClasses = {
    cyan: 'hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3)] border-primary/30',
    purple: 'hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.3)] border-secondary/30',
    green: 'hover:shadow-[0_0_30px_hsl(var(--neon-green)/0.3)] border-accent/30',
    pink: 'hover:shadow-[0_0_30px_hsl(var(--neon-pink)/0.3)] border-neon-pink/30',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-card/50 backdrop-blur-xl',
        'border transition-all duration-300',
        hoverable && glowClasses[glowColor],
        hoverable && 'hover:scale-[1.02] hover:border-opacity-50',
        className
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-shimmer" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowingCard;
