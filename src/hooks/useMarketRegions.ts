import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MarketRegion {
  id: string;
  user_id: string;
  name: string;
  cities: string[];
  revenue: number;
  buyers: number;
  growth: number;
  potential: "high" | "medium" | "low";
  market_share: number;
  created_at: string;
  updated_at: string;
}

export const useMarketRegions = () => {
  const queryClient = useQueryClient();

  const { data: regions = [], isLoading } = useQuery({
    queryKey: ["market_regions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_regions")
        .select("*")
        .order("revenue", { ascending: false });
      if (error) throw error;
      return data as MarketRegion[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MarketRegion> }) => {
      const { error } = await supabase
        .from("market_regions")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market_regions"] });
      toast.success("Region updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const totalRevenue = regions.reduce((sum, r) => sum + r.revenue, 0);
  const topRegion = regions[0] ?? null;
  const chartData = regions.map((r) => ({ name: r.name.replace(" India", "").replace(" Markets", ""), value: Math.round(r.revenue / 1000) }));
  const channelData = [
    { name: "Retail", value: 45 },
    { name: "Wholesale", value: 35 },
    { name: "Online", value: 15 },
    { name: "Export", value: 5 },
  ];

  return {
    regions,
    isLoading,
    totalRevenue,
    topRegion,
    chartData,
    channelData,
    updateRegion: updateMutation.mutate,
  };
};
