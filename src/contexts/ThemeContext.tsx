import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeVariant = 
  | 'midnight' 
  | 'cyberpunk' 
  | 'aurora' 
  | 'obsidian' 
  | 'hologram' 
  | 'ember'
  | 'snowfall'
  | 'cotton'
  | 'lavender'
  | 'neumorphic'
  | 'glassmorphic'
  | 'sunset';

interface ThemeContextType {
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeConfig: Record<ThemeVariant, { name: string; description: string; isLight?: boolean }> = {
  midnight: { name: 'Midnight', description: 'Deep space dark with cyan accents' },
  cyberpunk: { name: 'Cyberpunk', description: 'Neon pink and electric purple' },
  aurora: { name: 'Aurora', description: 'Northern lights with green hues' },
  obsidian: { name: 'Obsidian', description: 'Pure black with gold accents' },
  hologram: { name: 'Hologram', description: 'Translucent glass with blue glow' },
  ember: { name: 'Ember', description: 'Warm dark with orange fire' },
  snowfall: { name: 'Snowfall', description: 'Clean white with cool blue', isLight: true },
  cotton: { name: 'Cotton', description: 'Soft cream with warm accents', isLight: true },
  lavender: { name: 'Lavender', description: 'Light purple with pink touches', isLight: true },
  neumorphic: { name: 'Neumorphic', description: 'Soft shadows 3D style', isLight: true },
  glassmorphic: { name: 'Glassmorphic', description: 'Frosted glass with blur', isLight: true },
  sunset: { name: 'Sunset', description: 'Warm gradient coral theme', isLight: true },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeVariant>(() => {
    const saved = localStorage.getItem('nexus-theme');
    return (saved as ThemeVariant) || 'midnight';
  });

  useEffect(() => {
    localStorage.setItem('nexus-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
