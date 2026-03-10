import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CrossSellRec {
  clientId: string;
  clientName: string;
  company: string;
  boughtProducts: string[];
  suggestedProducts: string[];
  reason: string;
  estimatedValue: number;
  lastOrderDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RepeatOrderRec {
  clientId: string;
  clientName: string;
  company: string;
  product: string;
  lastOrderDate: string;
  avgFrequencyDays: number;
  daysSinceLast: number;
  overdueBy: number;
  estimatedValue: number;
}

export interface RecommendationStats {
  totalCrossSell: number;
  totalRepeatOrder: number;
  estimatedRevenuePotential: number;
  highPriorityCount: number;
}

function buildCrossSellRules(product: string): string[] {
  const lower = product.toLowerCase();
  if (lower.includes('saree') || lower.includes('sari')) return ['Dupatta', 'Blouse Fabric', 'Border Lace'];
  if (lower.includes('kurta') || lower.includes('kurti')) return ['Palazzo', 'Dupatta', 'Cotton Fabric'];
  if (lower.includes('lehenga')) return ['Dupatta', 'Blouse Fabric', 'Embroidery Thread'];
  if (lower.includes('shirt')) return ['Trouser Fabric', 'Belt', 'Buttons'];
  if (lower.includes('pant') || lower.includes('trouser')) return ['Shirt Fabric', 'Belt'];
  if (lower.includes('fabric') || lower.includes('cloth')) return ['Thread', 'Buttons', 'Zipper', 'Lining'];
  if (lower.includes('sticker') || lower.includes('label')) return ['Packaging Material', 'Printing Ink', 'Adhesive'];
  if (lower.includes('print')) return ['Paper Roll', 'Ink Cartridge', 'Lamination Film'];
  return ['Accessories', 'Complementary Item', 'Related Product'];
}

export function useRecommendations() {
  const { user } = useAuth();
  const [crossSell, setCrossSell] = useState<CrossSellRec[]>([]);
  const [repeatOrders, setRepeatOrders] = useState<RepeatOrderRec[]>([]);
  const [stats, setStats] = useState<RecommendationStats>({ totalCrossSell: 0, totalRepeatOrder: 0, estimatedRevenuePotential: 0, highPriorityCount: 0 });
  const [loading, setLoading] = useState(true);

  const buildRecommendations = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const [invoicesRes, clientsRes] = await Promise.all([
        supabase.from('invoices').select(`
          id, client_id, total, created_at, status,
          items:invoice_items(description, quantity, rate, amount)
        `).order('created_at', { ascending: false }).limit(500),
        supabase.from('clients').select('id, name, company, status').eq('status', 'active'),
      ]);

      const invoices = invoicesRes.data || [];
      const clients = clientsRes.data || [];

      const clientInvoiceMap: Record<string, { products: string[]; dates: string[]; values: number[] }> = {};

      invoices.forEach(inv => {
        if (!inv.client_id) return;
        if (!clientInvoiceMap[inv.client_id]) {
          clientInvoiceMap[inv.client_id] = { products: [], dates: [], values: [] };
        }
        const entry = clientInvoiceMap[inv.client_id];
        entry.dates.push(inv.created_at);
        entry.values.push(inv.total || 0);
        const items = (inv as any).items || [];
        items.forEach((item: any) => {
          if (item.description) entry.products.push(item.description);
        });
      });

      const crossSellRecs: CrossSellRec[] = [];
      const repeatOrderRecs: RepeatOrderRec[] = [];

      clients.forEach(client => {
        const data = clientInvoiceMap[client.id];
        if (!data || data.products.length === 0) return;

        const uniqueProducts = [...new Set(data.products)];
        const suggestedSet = new Set<string>();
        uniqueProducts.forEach(p => {
          buildCrossSellRules(p).forEach(s => {
            const alreadyBought = uniqueProducts.some(up => up.toLowerCase().includes(s.toLowerCase()));
            if (!alreadyBought) suggestedSet.add(s);
          });
        });

        const suggested = [...suggestedSet].slice(0, 3);
        if (suggested.length > 0) {
          const avgValue = data.values.reduce((s, v) => s + v, 0) / data.values.length;
          const daysSince = data.dates.length > 0
            ? Math.floor((Date.now() - new Date(data.dates[0]).getTime()) / (1000 * 60 * 60 * 24))
            : 999;

          crossSellRecs.push({
            clientId: client.id,
            clientName: client.name,
            company: client.company || client.name,
            boughtProducts: uniqueProducts.slice(0, 3),
            suggestedProducts: suggested,
            reason: `Based on ${uniqueProducts.length} product${uniqueProducts.length > 1 ? 's' : ''} purchased`,
            estimatedValue: Math.round(avgValue * 0.4),
            lastOrderDate: data.dates[0] || '',
            priority: daysSince < 30 ? 'high' : daysSince < 90 ? 'medium' : 'low',
          });
        }

        if (data.dates.length >= 2) {
          const sortedDates = [...data.dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          const intervals: number[] = [];
          for (let i = 0; i < sortedDates.length - 1; i++) {
            const diff = Math.floor((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i + 1]).getTime()) / (1000 * 60 * 60 * 24));
            if (diff > 0) intervals.push(diff);
          }

          if (intervals.length > 0) {
            const avgFreq = Math.round(intervals.reduce((s, v) => s + v, 0) / intervals.length);
            const daysSinceLast = Math.floor((Date.now() - new Date(sortedDates[0]).getTime()) / (1000 * 60 * 60 * 24));
            const overdueBy = daysSinceLast - avgFreq;

            if (overdueBy > -7) {
              const topProduct = uniqueProducts[0] || 'Previous Order Items';
              repeatOrderRecs.push({
                clientId: client.id,
                clientName: client.name,
                company: client.company || client.name,
                product: topProduct,
                lastOrderDate: sortedDates[0],
                avgFrequencyDays: avgFreq,
                daysSinceLast,
                overdueBy,
                estimatedValue: Math.round((data.values.reduce((s, v) => s + v, 0) / data.values.length)),
              });
            }
          }
        }
      });

      crossSellRecs.sort((a, b) => {
        const pri = { high: 0, medium: 1, low: 2 };
        return pri[a.priority] - pri[b.priority];
      });

      repeatOrderRecs.sort((a, b) => b.overdueBy - a.overdueBy);

      const totalPotential = [...crossSellRecs, ...repeatOrderRecs].reduce((s, r) => s + r.estimatedValue, 0);

      setCrossSell(crossSellRecs.slice(0, 20));
      setRepeatOrders(repeatOrderRecs.slice(0, 20));
      setStats({
        totalCrossSell: crossSellRecs.length,
        totalRepeatOrder: repeatOrderRecs.length,
        estimatedRevenuePotential: totalPotential,
        highPriorityCount: crossSellRecs.filter(r => r.priority === 'high').length + repeatOrderRecs.filter(r => r.overdueBy > 14).length,
      });
    } catch (err) {
      console.error('Recommendations error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { buildRecommendations(); }, [buildRecommendations]);

  return { crossSell, repeatOrders, stats, loading, refresh: buildRecommendations };
}
