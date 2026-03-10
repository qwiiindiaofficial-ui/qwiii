import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  user_id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorder_level: number;
  price: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryItemInput {
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorder_level: number;
  price: number;
  notes?: string;
}

export function useInventory() {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const computeStatus = (stock: number, reorderLevel: number): string => {
    if (stock === 0) return 'out_of_stock';
    if (stock <= reorderLevel) return 'low_stock';
    return 'in_stock';
  };

  const fetchItems = async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data as InventoryItem[]);
    } catch (err: any) {
      toast({ title: 'Error loading inventory', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (input: CreateInventoryItemInput): Promise<InventoryItem | null> => {
    if (!user) return null;
    try {
      const status = computeStatus(input.stock, input.reorder_level);
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({ ...input, user_id: user.id, status })
        .select()
        .single();
      if (error) throw error;
      setItems(prev => [data as InventoryItem, ...prev]);
      toast({ title: 'Item added', description: `${input.name} added to inventory` });
      return data as InventoryItem;
    } catch (err: any) {
      toast({ title: 'Error adding item', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const updateItem = async (id: string, updates: Partial<CreateInventoryItemInput>): Promise<boolean> => {
    try {
      const item = items.find(i => i.id === id);
      const newStock = updates.stock ?? item?.stock ?? 0;
      const newReorder = updates.reorder_level ?? item?.reorder_level ?? 10;
      const status = computeStatus(newStock, newReorder);

      const { error } = await supabase
        .from('inventory_items')
        .update({ ...updates, status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates, status, updated_at: new Date().toISOString() } : i));
      toast({ title: 'Item updated' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error updating item', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('inventory_items').delete().eq('id', id);
      if (error) throw error;
      setItems(prev => prev.filter(i => i.id !== id));
      toast({ title: 'Item deleted' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error deleting item', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => { fetchItems(); }, [user]);

  const stats = {
    total: items.length,
    inStock: items.filter(i => i.status === 'in_stock').length,
    lowStock: items.filter(i => i.status === 'low_stock').length,
    outOfStock: items.filter(i => i.status === 'out_of_stock').length,
  };

  return { items, loading, stats, fetchItems, createItem, updateItem, deleteItem };
}
