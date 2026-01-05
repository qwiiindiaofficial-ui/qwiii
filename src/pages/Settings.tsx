import { Settings as SettingsIcon, Palette, Bell, Shield, User, Check } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTheme, themeConfig, ThemeVariant } from '@/contexts/ThemeContext';

const themePreview: Record<ThemeVariant, { bg: string; primary: string; accent: string }> = {
  midnight: { bg: 'bg-[#080810]', primary: 'bg-cyan-500', accent: 'bg-emerald-500' },
  cyberpunk: { bg: 'bg-[#0d0812]', primary: 'bg-pink-500', accent: 'bg-yellow-400' },
  aurora: { bg: 'bg-[#081210]', primary: 'bg-emerald-400', accent: 'bg-violet-500' },
  obsidian: { bg: 'bg-[#050505]', primary: 'bg-amber-500', accent: 'bg-amber-400' },
  hologram: { bg: 'bg-[#0a1020]', primary: 'bg-blue-400', accent: 'bg-cyan-400' },
  ember: { bg: 'bg-[#100805]', primary: 'bg-orange-500', accent: 'bg-yellow-500' },
  snowfall: { bg: 'bg-[#f8fafc]', primary: 'bg-sky-500', accent: 'bg-teal-500' },
  cotton: { bg: 'bg-[#faf8f5]', primary: 'bg-orange-400', accent: 'bg-emerald-500' },
  lavender: { bg: 'bg-[#f5f3f8]', primary: 'bg-purple-500', accent: 'bg-sky-500' },
  neumorphic: { bg: 'bg-[#e8ecef]', primary: 'bg-blue-600', accent: 'bg-green-500' },
  glassmorphic: { bg: 'bg-[#f0f5f8]', primary: 'bg-cyan-500', accent: 'bg-emerald-500' },
  sunset: { bg: 'bg-[#faf5f2]', primary: 'bg-rose-500', accent: 'bg-amber-400' },
};

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="page-header"><h1 className="page-title">SETTINGS</h1><p className="page-subtitle">System configuration • Personalization</p></div>
        
        {/* Theme Selection */}
        <div className="glass-card p-6">
          <h3 className="section-title"><Palette size={14} className="text-primary" /> Theme Selection</h3>
          <p className="text-sm text-muted-foreground mb-4">Choose your preferred visual theme</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(Object.keys(themeConfig) as ThemeVariant[]).map((key) => {
              const preview = themePreview[key];
              const config = themeConfig[key];
              const isActive = theme === key;
              return (
                <button key={key} onClick={() => setTheme(key)} className={`relative p-4 rounded-lg border-2 transition-all ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}>
                  {isActive && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check size={12} className="text-primary-foreground" /></div>}
                  <div className={`w-full aspect-video rounded-md ${preview.bg} mb-3 flex items-end justify-center pb-2 gap-1`}>
                    <div className={`w-3 h-6 rounded-sm ${preview.primary}`} />
                    <div className={`w-3 h-4 rounded-sm ${preview.accent}`} />
                    <div className={`w-3 h-5 rounded-sm ${preview.primary} opacity-60`} />
                  </div>
                  <p className="text-sm font-medium text-foreground">{config.name}</p>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Other Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="section-title"><Bell size={14} className="text-primary" /> Notifications</h3>
            <div className="space-y-3 mt-4">{['Email alerts', 'Push notifications', 'Weekly digest', 'Critical alerts only'].map((item, i) => <label key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50"><span className="text-sm text-foreground">{item}</span><input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 accent-primary" /></label>)}</div>
          </div>
          <div className="glass-card p-6">
            <h3 className="section-title"><Shield size={14} className="text-primary" /> Security</h3>
            <div className="space-y-3 mt-4">{['Two-factor authentication', 'Session timeout (30 min)', 'Login notifications', 'API access'].map((item, i) => <label key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50"><span className="text-sm text-foreground">{item}</span><input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 accent-primary" /></label>)}</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
