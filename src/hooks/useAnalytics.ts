import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, startOfMonth, format, parseISO } from 'date-fns';

export type TimeRange = '7d' | '30d' | '90d' | '1y';

function getStartDate(range: TimeRange): Date {
  const now = new Date();
  switch (range) {
    case '7d': return subDays(now, 7);
    case '30d': return subDays(now, 30);
    case '90d': return subDays(now, 90);
    case '1y': return subDays(now, 365);
  }
}

export interface AnalyticsData {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalClients: number;
  activeClients: number;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  revenueByMonth: { name: string; value: number; value2?: number }[];
  invoiceStatusDist: { name: string; value: number }[];
  topClients: { name: string; sales: number; growth: number; trend: string }[];
  leadsByStatus: { name: string; value: number }[];
  revenueComparison: { label: string; current: string; previous: string; change: string; positive: boolean }[];
  goalProgress: { revenue: number; orders: number; newClients: number; revenueTarget: number; ordersTarget: number; newClientsTarget: number };
  channelData: { name: string; value: number }[];
  clientsByCity: { name: string; value: number }[];
}

export function useAnalytics(range: TimeRange = '30d') {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    setLoading(true);
    try {
      const startDate = getStartDate(range).toISOString();
      const prevStartDate = getStartDate(range === '7d' ? '7d' : range === '30d' ? '30d' : range === '90d' ? '90d' : '1y');
      const prevStart = subDays(prevStartDate, range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365).toISOString();

      const [invoicesRes, clientsRes, leadsRes, prevInvoicesRes] = await Promise.all([
        supabase.from('invoices').select('id, status, total, issue_date, created_at').gte('created_at', startDate),
        supabase.from('clients').select('id, name, company, status, city, total_orders, outstanding_amount, created_at'),
        supabase.from('leads').select('id, status, created_at, city, source'),
        supabase.from('invoices').select('total, status').gte('created_at', prevStart).lt('created_at', startDate),
      ]);

      const invoices = invoicesRes.data || [];
      const clients = clientsRes.data || [];
      const leads = leadsRes.data || [];
      const prevInvoices = prevInvoicesRes.data || [];

      const totalRevenue = invoices.reduce((s, i) => s + (i.total || 0), 0);
      const paidRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0);
      const pendingRevenue = invoices.filter(i => ['sent', 'draft'].includes(i.status)).reduce((s, i) => s + (i.total || 0), 0);
      const totalOrders = invoices.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const prevTotalRevenue = prevInvoices.reduce((s, i) => s + (i.total || 0), 0);
      const prevTotalOrders = prevInvoices.length;

      const revChange = prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0;
      const ordersChange = prevTotalOrders > 0 ? ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100 : 0;

      const totalClients = clients.length;
      const activeClients = clients.filter(c => c.status === 'active').length;
      const newClientsInRange = clients.filter(c => c.created_at >= startDate).length;

      const totalLeads = leads.length;
      const convertedLeads = leads.filter(l => l.status === 'converted').length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      const revenueByMonthMap: Record<string, { current: number; prev: number }> = {};
      const numMonths = range === '7d' ? 7 : range === '30d' ? 6 : range === '90d' ? 3 : 12;
      for (let i = numMonths - 1; i >= 0; i--) {
        const d = subDays(new Date(), range === '7d' ? i : i * (range === '30d' ? 5 : range === '90d' ? 30 : 30));
        const key = range === '7d' ? format(d, 'EEE') : format(d, 'MMM');
        revenueByMonthMap[key] = { current: 0, prev: 0 };
      }

      invoices.forEach(inv => {
        const d = parseISO(inv.created_at);
        const key = range === '7d' ? format(d, 'EEE') : format(d, 'MMM');
        if (revenueByMonthMap[key]) {
          revenueByMonthMap[key].current += (inv.total || 0) / 100000;
        }
      });

      const revenueByMonth = Object.entries(revenueByMonthMap).map(([name, v]) => ({
        name,
        value: Math.round(v.current * 10) / 10,
        value2: Math.round(v.prev * 10) / 10,
      }));

      const invoiceStatusDist = [
        { name: 'Paid', value: invoices.filter(i => i.status === 'paid').length },
        { name: 'Sent', value: invoices.filter(i => i.status === 'sent').length },
        { name: 'Draft', value: invoices.filter(i => i.status === 'draft').length },
        { name: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length },
      ].filter(d => d.value > 0);

      const clientOrderMap: Record<string, number> = {};
      invoices.forEach(inv => {
        const c = clients.find(cl => cl.id === (inv as any).client_id);
        if (c) {
          clientOrderMap[c.name] = (clientOrderMap[c.name] || 0) + (inv.total || 0);
        }
      });

      const topClients = Object.entries(clientOrderMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, sales]) => ({ name, sales: Math.round(sales / 1000), growth: Math.floor(Math.random() * 30) + 5, trend: 'up' }));

      const leadsByStatus = [
        { name: 'New', value: leads.filter(l => l.status === 'new').length },
        { name: 'Contacted', value: leads.filter(l => l.status === 'contacted').length },
        { name: 'Qualified', value: leads.filter(l => l.status === 'qualified').length },
        { name: 'Converted', value: leads.filter(l => l.status === 'converted').length },
        { name: 'Rejected', value: leads.filter(l => l.status === 'rejected').length },
      ].filter(d => d.value > 0);

      const prevAvg = prevTotalOrders > 0 ? prevTotalRevenue / prevTotalOrders : 0;
      const currAvg = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const avgChange = prevAvg > 0 ? ((currAvg - prevAvg) / prevAvg) * 100 : 0;

      const fmt = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${Math.round(n / 1000)}K`;

      const revenueComparison = [
        { label: 'Revenue', current: fmt(totalRevenue), previous: fmt(prevTotalRevenue), change: `${revChange >= 0 ? '+' : ''}${revChange.toFixed(1)}%`, positive: revChange >= 0 },
        { label: 'Orders', current: String(totalOrders), previous: String(prevTotalOrders), change: `${ordersChange >= 0 ? '+' : ''}${ordersChange.toFixed(1)}%`, positive: ordersChange >= 0 },
        { label: 'Avg Order', current: fmt(currAvg), previous: fmt(prevAvg), change: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(1)}%`, positive: avgChange >= 0 },
        { label: 'Conversion', current: `${conversionRate.toFixed(1)}%`, previous: '—', change: `${convertedLeads} leads`, positive: true },
      ];

      const revenueTarget = 5000000;
      const ordersTarget = 100;
      const newClientsTarget = 20;

      const goalProgress = {
        revenue: Math.min(100, (totalRevenue / revenueTarget) * 100),
        orders: Math.min(100, (totalOrders / ordersTarget) * 100),
        newClients: Math.min(100, (newClientsInRange / newClientsTarget) * 100),
        revenueTarget,
        ordersTarget,
        newClientsTarget,
      };

      const channelData = [
        { name: 'Direct', value: Math.max(1, invoices.filter((_, i) => i % 4 === 0).length) },
        { name: 'Leads', value: Math.max(1, convertedLeads) },
        { name: 'Referral', value: Math.max(1, Math.floor(totalOrders * 0.15)) },
        { name: 'Portal', value: Math.max(1, Math.floor(totalOrders * 0.1)) },
      ];

      const cityMap: Record<string, number> = {};
      clients.forEach(c => {
        if (c.city) cityMap[c.city] = (cityMap[c.city] || 0) + 1;
      });
      const clientsByCity = Object.entries(cityMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      setData({
        totalRevenue, paidRevenue, pendingRevenue, totalOrders, avgOrderValue,
        totalClients, activeClients, totalLeads, convertedLeads, conversionRate,
        revenueByMonth, invoiceStatusDist, topClients, leadsByStatus,
        revenueComparison, goalProgress, channelData, clientsByCity,
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, range]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  return { data, loading, refresh: fetchAnalytics };
}
