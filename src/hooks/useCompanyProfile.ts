import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface CompanyProfile {
  id: string;
  user_id: string;
  company_name: string;
  display_name: string;
  logo_url: string;
  tagline: string;
  email: string;
  phone: string;
  website: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gst_number: string;
  pan_number: string;
  cin_number: string;
  bank_name: string;
  bank_account: string;
  bank_ifsc: string;
  bank_branch: string;
  invoice_prefix: string;
  quotation_prefix: string;
  agreement_prefix: string;
  currency: string;
  signature_url: string;
  terms_and_conditions: string;
  created_at: string;
  updated_at: string;
}

export type CompanyProfileInput = Omit<CompanyProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

const defaultProfile: CompanyProfileInput = {
  company_name: '',
  display_name: '',
  logo_url: '',
  tagline: '',
  email: '',
  phone: '',
  website: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  gst_number: '',
  pan_number: '',
  cin_number: '',
  bank_name: '',
  bank_account: '',
  bank_ifsc: '',
  bank_branch: '',
  invoice_prefix: 'INV',
  quotation_prefix: 'QT',
  agreement_prefix: 'AGR',
  currency: 'INR',
  signature_url: '',
  terms_and_conditions: '',
};

export function useCompanyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching company profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = async (input: CompanyProfileInput): Promise<boolean> => {
    if (!user) return false;
    setSaving(true);
    try {
      if (profile) {
        const { error } = await supabase
          .from('company_profiles')
          .update({ ...input, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('company_profiles')
          .insert({ ...input, user_id: user.id });
        if (error) throw error;
      }
      await fetchProfile();
      toast({ title: 'Profile saved', description: 'Company profile updated successfully' });
      return true;
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, saveProfile, fetchProfile, defaultProfile };
}
