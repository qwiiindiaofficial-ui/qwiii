import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays } from 'date-fns';

export interface PipelineStage {
  name: string;
  value: number;
}

export interface DealItem {
  name: string;
  value: string;
  stage: string;
  status: 'hot' | 'active' | 'new';
}

export interface AutomationStat {
  title: string;
  desc: string;
  count: number;
}

export interface B2BAgentData {
  pipelineData: PipelineStage[];
  dealStages: PipelineStage[];
  recentDeals: DealItem[];
  metrics: {
    pipelineValue: number;
    activeDeals: number;
    conversionRate: number;
    totalLeads: number;
    qualifiedLeads: number;
    wonDeals: number;
  };
  automationStats: AutomationStat[];
}

const fmtValue = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

export function useB2BAgent() {
  const { user } = useAuth();
  const [data, setData] = useState<B2BAgentData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

      const [leadsRes, quotationsRes, invoicesRes] = await Promise.all([
        supabase.from('leads').select('id, company_name, status, priority, estimated_order_value, created_at, score').order('created_at', { ascending: false }),
        supabase.from('quotations').select('id, client_id, status, total, created_at, client:clients(name, company)').order('created_at', { ascending: false }).limit(100),
        supabase.from('invoices').select('id, status, total, created_at').gte('created_at', thirtyDaysAgo),
      ]);

      const leads = leadsRes.data || [];
      const quotations = quotationsRes.data || [];
      const invoices = invoicesRes.data || [];

      const newLeads = leads.filter(l => l.status === 'new').length;
      const contactedLeads = leads.filter(l => l.status === 'contacted').length;
      const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
      const convertedLeads = leads.filter(l => l.status === 'converted').length;

      const draftQuotes = quotations.filter(q => q.status === 'draft').length;
      const sentQuotes = quotations.filter(q => q.status === 'sent').length;
      const acceptedQuotes = quotations.filter(q => q.status === 'accepted').length;

      const pipelineData: PipelineStage[] = [
        { name: 'New Leads', value: newLeads + contactedLeads },
        { name: 'Qualified', value: qualifiedLeads },
        { name: 'Quoted', value: draftQuotes + sentQuotes },
        { name: 'Negotiating', value: Math.round((draftQuotes + sentQuotes) * 0.4) },
        { name: 'Closed', value: acceptedQuotes + convertedLeads },
      ];

      const dealStages: PipelineStage[] = [
        { name: 'New Leads', value: newLeads },
        { name: 'In Progress', value: contactedLeads + qualifiedLeads },
        { name: 'Won', value: convertedLeads + acceptedQuotes },
        { name: 'Lost', value: leads.filter(l => l.status === 'rejected').length },
      ];

      const recentDeals: DealItem[] = [
        ...quotations.filter(q => q.status === 'sent' || q.status === 'accepted').slice(0, 5).map(q => ({
          name: (q as any).client?.company || (q as any).client?.name || 'Client',
          value: fmtValue(q.total || 0),
          stage: q.status === 'accepted' ? 'Accepted' : 'Sent',
          status: (q.status === 'accepted' ? 'hot' : 'active') as 'hot' | 'active' | 'new',
        })),
        ...leads.filter(l => l.status === 'qualified' || l.priority === 'hot').slice(0, 3).map(l => ({
          name: l.company_name,
          value: fmtValue(l.estimated_order_value || 0),
          stage: l.status === 'qualified' ? 'Qualified' : 'New Lead',
          status: (l.priority === 'hot' ? 'hot' : l.status === 'new' ? 'new' : 'active') as 'hot' | 'active' | 'new',
        })),
      ].slice(0, 7);

      const totalPipelineValue = quotations.filter(q => q.status !== 'rejected').reduce((s, q) => s + (q.total || 0), 0)
        + leads.filter(l => l.status !== 'rejected').reduce((s, l) => s + (l.estimated_order_value || 0), 0);

      const activeDeals = sentQuotes + qualifiedLeads;
      const totalProcessed = leads.length;
      const conversionRate = totalProcessed > 0 ? ((convertedLeads + acceptedQuotes) / totalProcessed) * 100 : 0;

      const paidInvoices = invoices.filter(i => i.status === 'paid').length;
      const sentInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length;

      const automationStats: AutomationStat[] = [
        { title: 'Lead Scoring', desc: 'Automatically qualify & rank new leads', count: leads.length },
        { title: 'Auto Quotations', desc: 'Generate quotes based on buyer history', count: quotations.length },
        { title: 'Active Invoices', desc: 'Invoices sent to clients this month', count: sentInvoices },
        { title: 'Payments Received', desc: 'Paid invoices this month', count: paidInvoices },
      ];

      setData({
        pipelineData,
        dealStages,
        recentDeals,
        metrics: {
          pipelineValue: totalPipelineValue,
          activeDeals,
          conversionRate,
          totalLeads: leads.length,
          qualifiedLeads,
          wonDeals: convertedLeads + acceptedQuotes,
        },
        automationStats,
      });
    } catch (err) {
      console.error('B2B Agent data error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, refresh: fetchData };
}
