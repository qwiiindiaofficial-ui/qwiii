import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface DigitalSignature {
  id: string;
  user_id: string;
  document_name: string;
  document_type: string;
  document_number: string;
  client_name: string;
  client_email: string | null;
  signatory_name: string;
  status: string;
  sent_at: string | null;
  signed_at: string | null;
  expires_at: string | null;
  signature_link: string | null;
  ip_address: string | null;
  agreement_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSignatureInput {
  document_name: string;
  document_type: string;
  document_number: string;
  client_name: string;
  client_email?: string;
  signatory_name: string;
  expires_at?: string;
  agreement_id?: string;
}

export function useDigitalSignatures() {
  const { user } = useAuth();
  const [signatures, setSignatures] = useState<DigitalSignature[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSignatures = async () => {
    if (!user) { setSignatures([]); setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('digital_signatures')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSignatures(data as DigitalSignature[]);
    } catch (err: any) {
      toast({ title: 'Error loading signatures', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createSignatureRequest = async (input: CreateSignatureInput): Promise<DigitalSignature | null> => {
    if (!user) return null;
    try {
      const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      const signatureLink = `${window.location.origin}/sign/${token}`;

      const { data, error } = await supabase
        .from('digital_signatures')
        .insert({
          ...input,
          user_id: user.id,
          signature_link: signatureLink,
          sent_at: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();
      if (error) throw error;
      setSignatures(prev => [data as DigitalSignature, ...prev]);
      toast({ title: 'Signature request created', description: `Request sent for ${input.document_name}` });
      return data as DigitalSignature;
    } catch (err: any) {
      toast({ title: 'Error creating request', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const updateStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (status === 'signed') {
        updates.signed_at = new Date().toISOString().split('T')[0];
      }
      const { error } = await supabase
        .from('digital_signatures')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      setSignatures(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      toast({ title: 'Status updated' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error updating status', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  const resendRequest = async (id: string): Promise<boolean> => {
    try {
      const expires = new Date();
      expires.setDate(expires.getDate() + 10);
      const { error } = await supabase
        .from('digital_signatures')
        .update({
          status: 'pending',
          sent_at: new Date().toISOString().split('T')[0],
          expires_at: expires.toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
      setSignatures(prev => prev.map(s =>
        s.id === id ? { ...s, status: 'pending', sent_at: new Date().toISOString().split('T')[0] } : s
      ));
      toast({ title: 'Request resent' });
      return true;
    } catch (err: any) {
      toast({ title: 'Error resending request', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => { fetchSignatures(); }, [user]);

  const stats = {
    total: signatures.length,
    signed: signatures.filter(s => s.status === 'signed').length,
    pending: signatures.filter(s => s.status === 'pending' || s.status === 'viewed').length,
    signRate: signatures.length > 0
      ? Math.round((signatures.filter(s => s.status === 'signed').length / signatures.length) * 100)
      : 0,
  };

  return { signatures, loading, stats, fetchSignatures, createSignatureRequest, updateStatus, resendRequest };
}
