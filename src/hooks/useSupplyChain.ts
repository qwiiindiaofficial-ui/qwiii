import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface SupplyVendor {
  id: string;
  user_id: string;
  name: string;
  category: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  rating: number;
  total_orders: number;
  on_time_percent: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplyShipment {
  id: string;
  user_id: string;
  shipment_number: string;
  buyer_name: string;
  origin: string | null;
  destination: string | null;
  items_count: number;
  status: string;
  carrier: string | null;
  tracking_number: string | null;
  eta: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplyPurchaseOrder {
  id: string;
  user_id: string;
  vendor_id: string | null;
  vendor_name: string;
  material: string;
  quantity: string;
  estimated_value: number | null;
  urgency: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVendorInput {
  name: string;
  category: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  location?: string;
  rating?: number;
}

export interface CreateShipmentInput {
  buyer_name: string;
  origin?: string;
  destination?: string;
  items_count?: number;
  carrier?: string;
  tracking_number?: string;
  eta?: string;
  notes?: string;
}

export interface CreatePurchaseOrderInput {
  vendor_id?: string;
  vendor_name: string;
  material: string;
  quantity: string;
  estimated_value?: number;
  urgency?: string;
  notes?: string;
}

export function useSupplyChain() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<SupplyVendor[]>([]);
  const [shipments, setShipments] = useState<SupplyShipment[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<SupplyPurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!user) { setVendors([]); setShipments([]); setPurchaseOrders([]); setLoading(false); return; }
    try {
      setLoading(true);
      const [vendorRes, shipmentRes, poRes] = await Promise.all([
        supabase.from('supply_vendors').select('*').order('created_at', { ascending: false }),
        supabase.from('supply_shipments').select('*').order('created_at', { ascending: false }),
        supabase.from('supply_purchase_orders').select('*').order('created_at', { ascending: false }),
      ]);
      if (vendorRes.error) throw vendorRes.error;
      if (shipmentRes.error) throw shipmentRes.error;
      if (poRes.error) throw poRes.error;
      setVendors(vendorRes.data as SupplyVendor[]);
      setShipments(shipmentRes.data as SupplyShipment[]);
      setPurchaseOrders(poRes.data as SupplyPurchaseOrder[]);
    } catch (err: any) {
      toast({ title: 'Error loading supply chain data', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createVendor = async (input: CreateVendorInput): Promise<SupplyVendor | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('supply_vendors')
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setVendors(prev => [data as SupplyVendor, ...prev]);
      toast({ title: 'Vendor added', description: `${input.name} added` });
      return data as SupplyVendor;
    } catch (err: any) {
      toast({ title: 'Error adding vendor', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const createShipment = async (input: CreateShipmentInput): Promise<SupplyShipment | null> => {
    if (!user) return null;
    try {
      const shipmentNumber = `SHP-${Date.now().toString().slice(-6)}`;
      const { data, error } = await supabase
        .from('supply_shipments')
        .insert({ ...input, shipment_number: shipmentNumber, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setShipments(prev => [data as SupplyShipment, ...prev]);
      toast({ title: 'Shipment created', description: `${shipmentNumber} created` });
      return data as SupplyShipment;
    } catch (err: any) {
      toast({ title: 'Error creating shipment', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const createPurchaseOrder = async (input: CreatePurchaseOrderInput): Promise<SupplyPurchaseOrder | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('supply_purchase_orders')
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setPurchaseOrders(prev => [data as SupplyPurchaseOrder, ...prev]);
      toast({ title: 'Purchase order created', description: `Order placed with ${input.vendor_name}` });
      return data as SupplyPurchaseOrder;
    } catch (err: any) {
      toast({ title: 'Error creating purchase order', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const updateShipmentStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('supply_shipments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setShipments(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      toast({ title: 'Shipment status updated' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error updating shipment', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  const updatePurchaseOrderStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('supply_purchase_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setPurchaseOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast({ title: 'Order status updated' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error updating order', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => { fetchAll(); }, [user]);

  const stats = {
    activeShipments: shipments.filter(s => s.status === 'in_transit').length,
    totalVendors: vendors.length,
    pendingOrders: purchaseOrders.filter(o => o.status === 'pending').length,
  };

  return {
    vendors, shipments, purchaseOrders, loading, stats,
    fetchAll, createVendor, createShipment, createPurchaseOrder,
    updateShipmentStatus, updatePurchaseOrderStatus,
  };
}
