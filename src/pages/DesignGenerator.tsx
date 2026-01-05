import { Palette, Layers, Sparkles, Image } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NeuralNetwork from '@/components/ai/NeuralNetwork';
import TypingAnimation from '@/components/ai/TypingAnimation';
import GlowingCard from '@/components/ai/GlowingCard';
import AIBadge from '@/components/ai/AIBadge';
import AIAvatar from '@/components/ai/AIAvatar';

const DesignGenerator = () => {
  return (
    <DashboardLayout>
      <div className="relative min-h-full">
        <NeuralNetwork className="opacity-20" nodeCount={30} />
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <AIBadge variant="processing" size="md" />
              <h1 className="text-3xl font-bold gradient-text">Design Generator</h1>
              <div className="text-muted-foreground max-w-xl">
                <TypingAnimation text="AI trained on your 10,000+ past designs to generate new patterns matching your brand DNA." speed={25} delay={300} />
              </div>
            </div>
            <AIAvatar size="md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Layers, title: 'Style Transfer', desc: 'Apply your signature styles to new concepts', stat: '200+ styles' },
              { icon: Palette, title: 'Color Palettes', desc: 'AI-curated colors matching your brand', stat: '50+ palettes' },
              { icon: Sparkles, title: 'Festival Collections', desc: 'Seasonal & occasion-based designs', stat: 'Auto-generated' },
            ].map((item, i) => (
              <GlowingCard key={i} className="p-5" glowColor="purple">
                <item.icon className="w-8 h-8 text-secondary mb-3" />
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                <p className="text-lg font-bold text-accent">{item.stat}</p>
              </GlowingCard>
            ))}
          </div>

          <GlowingCard className="p-8 text-center" glowColor="cyan">
            <Image className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse-slow" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Design Studio Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Your private AI trained exclusively on your fabric types, embroidery styles, and color preferences.</p>
          </GlowingCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignGenerator;
