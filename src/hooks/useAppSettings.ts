import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AppSettings {
  app_name: string;
  tagline: string;
  logo_url: string;
}

const defaultSettings: AppSettings = {
  app_name: 'QWII',
  tagline: 'OPTIMIZE VISION',
  logo_url: '',
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings',
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value');

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data && data.length > 0) {
        const settingsMap: Record<string, string> = {};
        data.forEach((row) => {
          settingsMap[row.key] = row.value || '';
        });

        setSettings({
          app_name: settingsMap['app_name'] || defaultSettings.app_name,
          tagline: settingsMap['tagline'] || defaultSettings.tagline,
          logo_url: settingsMap['logo_url'] || defaultSettings.logo_url,
        });
      }
    } catch (err) {
      console.error('Error in fetchSettings:', err);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refetch: fetchSettings };
};
