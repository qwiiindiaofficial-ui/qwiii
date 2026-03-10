import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Buyer {
  id: string;
  user_id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  tier: string;
  total_orders: number;
  total_value: number;
  credit_limit: number;
  outstanding_amount: number;
  status: string;
  notes: string | null;
  last_order_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBuyerInput {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  tier?: string;
  credit_limit?: number;
  notes?: string;
}

export function useBuyers() {
  const { user } = useAuth();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuyers = async () => {
    if (!user) { setBuyers([]); setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBuyers(data as Buyer[]);
    } catch (err: any) {
      toast({ title: 'Error loading buyers', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createBuyer = async (input: CreateBuyerInput): Promise<Buyer | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('buyers')
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setBuyers(prev => [data as Buyer, ...prev]);
      toast({ title: 'Buyer added', description: `${input.name} added` });
      return data as Buyer;
    } catch (err: any) {
      toast({ title: 'Error adding buyer', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const updateBuyer = async (id: string, updates: Partial<CreateBuyerInput & { credit_limit: number; outstanding_amount: number }>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('buyers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setBuyers(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
      toast({ title: 'Buyer updated' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error updating buyer', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  const deleteBuyer = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('buyers').delete().eq('id', id);
      if (error) throw error;
      setBuyers(prev => prev.filter(b => b.id !== id));
      toast({ title: 'Buyer deleted' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error deleting buyer', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => { fetchBuyers(); }, [user]);

  const stats = {
    total: buyers.length,
    active: buyers.filter(b => b.status === 'active').length,
    premium: buyers.filter(b => b.tier === 'Premium').length,
    totalValue: buyers.reduce((sum, b) => sum + b.total_value, 0),
    totalOutstanding: buyers.reduce((sum, b) => sum + b.outstanding_amount, 0),
  };

  const segmentData = [
    { name: 'Premium', value: buyers.filter(b => b.tier === 'Premium').length },
    { name: 'Regular', value: buyers.filter(b => b.tier === 'Regular').length },
    { name: 'Bulk', value: buyers.filter(b => b.tier === 'Bulk').length },
    { name: 'New', value: buyers.filter(b => b.tier === 'New').length },
  ].filter(s => s.value > 0);

  return { buyers, loading, stats, segmentData, fetchBuyers, createBuyer, updateBuyer, deleteBuyer };
}
