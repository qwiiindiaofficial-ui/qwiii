import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface QualityInspection {
  id: string;
  user_id: string;
  inspection_number: string;
  batch_id: string | null;
  batch_number: string;
  product_name: string;
  quantity: number;
  passed: number;
  failed: number;
  defect_type: string | null;
  result: string;
  priority: string;
  status: string;
  assignee: string | null;
  notes: string | null;
  inspected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInspectionInput {
  batch_number: string;
  product_name: string;
  quantity: number;
  priority?: string;
  assignee?: string;
  notes?: string;
}

export interface SubmitInspectionInput {
  passed: number;
  failed: number;
  defect_type?: string;
  result: 'passed' | 'rejected' | 'rework';
  notes?: string;
}

export function useQualityControl() {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInspections = async () => {
    if (!user) { setInspections([]); setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quality_inspections')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setInspections(data as QualityInspection[]);
    } catch (err: any) {
      toast({ title: 'Error loading inspections', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createInspection = async (input: CreateInspectionInput): Promise<QualityInspection | null> => {
    if (!user) return null;
    try {
      const inspectionNumber = `INS-${Date.now().toString().slice(-6)}`;
      const { data, error } = await supabase
        .from('quality_inspections')
        .insert({ ...input, inspection_number: inspectionNumber, user_id: user.id, status: 'pending', result: 'pending' })
        .select()
        .single();
      if (error) throw error;
      setInspections(prev => [data as QualityInspection, ...prev]);
      toast({ title: 'Inspection created', description: `${inspectionNumber} added to queue` });
      return data as QualityInspection;
    } catch (err: any) {
      toast({ title: 'Error creating inspection', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const submitInspection = async (id: string, input: SubmitInspectionInput): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('quality_inspections')
        .update({
          ...input,
          status: 'completed',
          inspected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
      setInspections(prev => prev.map(i =>
        i.id === id ? { ...i, ...input, status: 'completed', inspected_at: new Date().toISOString() } : i
      ));
      const msg = input.result === 'passed' ? 'Batch approved' : input.result === 'rejected' ? 'Batch rejected' : 'Sent for rework';
      toast({ title: msg });
      return true;
    } catch (err: any) {
      toast({ title: 'Error submitting inspection', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  const startInspection = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('quality_inspections')
        .update({ status: 'in_progress', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setInspections(prev => prev.map(i => i.id === id ? { ...i, status: 'in_progress' } : i));
      return true;
    } catch (err: any) {
      toast({ title: 'Error starting inspection', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => { fetchInspections(); }, [user]);

  const queue = inspections.filter(i => i.status === 'pending' || i.status === 'in_progress');
  const history = inspections.filter(i => i.status === 'completed');

  const stats = {
    pending: queue.length,
    completed: history.length,
    passRate: history.length > 0
      ? Math.round((history.filter(i => i.result === 'passed').length / history.length) * 100)
      : 0,
    totalInspected: history.reduce((sum, i) => sum + i.quantity, 0),
  };

  return { inspections, queue, history, loading, stats, fetchInspections, createInspection, submitInspection, startInspection };
}
