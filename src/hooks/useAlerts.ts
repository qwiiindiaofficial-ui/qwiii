import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Alert {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string | null;
  resolved: boolean;
  resolved_at: string | null;
  source: string | null;
  created_at: string;
}

export interface CreateAlertInput {
  type: string;
  title: string;
  description?: string;
  source?: string;
}

export function useAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    if (!user) { setAlerts([]); setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      setAlerts(data as Alert[]);
    } catch (err: any) {
      toast({ title: 'Error loading alerts', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (input: CreateAlertInput): Promise<Alert | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setAlerts(prev => [data as Alert, ...prev]);
      return data as Alert;
    } catch (err: any) {
      console.error('Error creating alert', err);
      return null;
    }
  };

  const resolveAlert = async (id: string): Promise<void> => {
    try {
      await supabase
        .from('alerts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, resolved_at: new Date().toISOString() } : a));
      toast({ title: 'Alert resolved' });
    } catch (err: any) {
      console.error('Error resolving alert', err);
    }
  };

  const resolveAll = async (): Promise<void> => {
    if (!user) return;
    try {
      const now = new Date().toISOString();
      await supabase
        .from('alerts')
        .update({ resolved: true, resolved_at: now })
        .eq('user_id', user.id)
        .eq('resolved', false);
      setAlerts(prev => prev.map(a => ({ ...a, resolved: true, resolved_at: now })));
      toast({ title: 'All alerts resolved' });
    } catch (err: any) {
      console.error('Error resolving all alerts', err);
    }
  };

  useEffect(() => { fetchAlerts(); }, [user]);

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedToday = alerts.filter(a => {
    if (!a.resolved_at) return false;
    return new Date(a.resolved_at).toDateString() === new Date().toDateString();
  }).length;

  const stats = {
    critical: activeAlerts.filter(a => a.type === 'error').length,
    warnings: activeAlerts.filter(a => a.type === 'warning').length,
    info: activeAlerts.filter(a => a.type === 'info').length,
    resolvedToday,
  };

  return { alerts, activeAlerts, loading, stats, fetchAlerts, createAlert, resolveAlert, resolveAll };
}
