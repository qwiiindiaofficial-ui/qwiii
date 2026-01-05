import { Target, ShoppingBag, Repeat, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NeuralNetwork from '@/components/ai/NeuralNetwork';
import TypingAnimation from '@/components/ai/TypingAnimation';
import GlowingCard from '@/components/ai/GlowingCard';
import AIBadge from '@/components/ai/AIBadge';
import AIAvatar from '@/components/ai/AIAvatar';

const Recommendations = () => {
  return (
    <DashboardLayout>
      <div className="relative min-h-full">
        <NeuralNetwork className="opacity-20" nodeCount={30} />
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <AIBadge variant="powered" size="md" />
              <h1 className="text-3xl font-bold gradient-text">Product Recommendations</h1>
              <div className="text-muted-foreground max-w-xl">
                <TypingAnimation text="Smart B2B recommendations engine analyzing buyer patterns to maximize cross-sell opportunities." speed={25} delay={300} />
              </div>
            </div>
            <AIAvatar size="md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Repeat, title: 'Repeat Orders', desc: 'Suggest items buyers frequently reorder', stat: '+34% conversions' },
              { icon: ShoppingBag, title: 'Cross-Sell', desc: 'Shirt → Pant, Kurta → Dupatta matching', stat: '850+ matches' },
              { icon: TrendingUp, title: 'Buyer Patterns', desc: 'Seasonal & preference analysis', stat: '200+ profiles' },
            ].map((item, i) => (
              <GlowingCard key={i} className="p-5" glowColor="purple">
                <item.icon className="w-8 h-8 text-secondary mb-3" />
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                <p className="text-lg font-bold text-accent">{item.stat}</p>
              </GlowingCard>
            ))}
          </div>

          <GlowingCard className="p-8 text-center" glowColor="green">
            <Target className="w-16 h-16 text-secondary mx-auto mb-4 animate-pulse-slow" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Recommendation Engine Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">AI is learning from your order history to deliver personalized product suggestions for each B2B buyer.</p>
          </GlowingCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
