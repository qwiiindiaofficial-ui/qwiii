import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProductionBatch {
  id: string;
  user_id: string;
  batch_number: string;
  product_name: string;
  quantity: number;
  completed: number;
  status: string;
  priority: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionMachine {
  id: string;
  user_id: string;
  machine_id: string;
  name: string;
  status: string;
  efficiency: number;
  current_batch_id: string | null;
  operator: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBatchInput {
  batch_number?: string;
  product_name: string;
  quantity: number;
  priority?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export function useProduction() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [machines, setMachines] = useState<ProductionMachine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!user) { setBatches([]); setMachines([]); setLoading(false); return; }
    try {
      setLoading(true);
      const [batchRes, machineRes] = await Promise.all([
        supabase.from('production_batches').select('*').order('created_at', { ascending: false }),
        supabase.from('production_machines').select('*').order('created_at', { ascending: true }),
      ]);
      if (batchRes.error) throw batchRes.error;
      if (machineRes.error) throw machineRes.error;
      setBatches(batchRes.data as ProductionBatch[]);
      setMachines(machineRes.data as ProductionMachine[]);
    } catch (err: any) {
      toast({ title: 'Error loading production data', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async (input: CreateBatchInput): Promise<ProductionBatch | null> => {
    if (!user) return null;
    try {
      const batchNumber = input.batch_number || `B-${Date.now().toString().slice(-6)}`;
      const { data, error } = await supabase
        .from('production_batches')
        .insert({ ...input, batch_number: batchNumber, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setBatches(prev => [data as ProductionBatch, ...prev]);
      toast({ title: 'Batch created', description: `Batch ${batchNumber} scheduled` });
      return data as ProductionBatch;
    } catch (err: any) {
      toast({ title: 'Error creating batch', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const updateBatch = async (id: string, updates: Partial<ProductionBatch>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('production_batches')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
      toast({ title: 'Batch updated' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error updating batch', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  const updateMachineStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('production_machines')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      toast({ title: 'Machine status updated' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error updating machine', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => { fetchAll(); }, [user]);

  const stats = {
    activeBatches: batches.filter(b => b.status === 'in_progress').length,
    scheduledBatches: batches.filter(b => b.status === 'scheduled').length,
    completedBatches: batches.filter(b => b.status === 'completed').length,
    runningMachines: machines.filter(m => m.status === 'running').length,
  };

  return { batches, machines, loading, stats, fetchAll, createBatch, updateBatch, updateMachineStatus };
}
