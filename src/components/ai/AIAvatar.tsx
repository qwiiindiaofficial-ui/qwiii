import { Bot, Sparkles } from 'lucide-react';

interface AIAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  showPulse?: boolean;
  className?: string;
}

const AIAvatar = ({ 
  size = 'md', 
  isActive = true, 
  showPulse = true,
  className = '' 
}: AIAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <div className={`relative ${className}`}>
      {/* Outer glow ring */}
      {showPulse && isActive && (
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-primary/20 animate-ping`} />
      )}
      
      {/* Main avatar container */}
      <div
        className={`
          relative ${sizeClasses[size]} rounded-full
          bg-gradient-to-br from-primary/20 to-secondary/20
          border border-primary/50
          flex items-center justify-center
          ${isActive ? 'neon-glow' : ''}
          animate-float
        `}
      >
        {/* Inner gradient */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-card to-background" />
        
        {/* Bot icon */}
        <Bot 
          size={iconSizes[size]} 
          className="relative z-10 text-primary"
        />
        
        {/* Sparkle indicator */}
        {isActive && (
          <Sparkles 
            size={iconSizes[size] / 2} 
            className="absolute -top-1 -right-1 text-accent animate-pulse-slow"
          />
        )}
      </div>

      {/* Status indicator */}
      {isActive && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent border-2 border-background ai-status" />
      )}
    </div>
  );
};

export default AIAvatar;
