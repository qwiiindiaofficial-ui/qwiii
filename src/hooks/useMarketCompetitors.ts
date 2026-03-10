import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MarketCompetitor {
  id: string;
  user_id: string;
  name: string;
  market_share: number;
  strength: string;
  weakness: string;
  is_own_brand: boolean;
  created_at: string;
  updated_at: string;
}

export const useMarketCompetitors = () => {
  const queryClient = useQueryClient();

  const { data: competitors = [], isLoading } = useQuery({
    queryKey: ["market_competitors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_competitors")
        .select("*")
        .order("market_share", { ascending: false });
      if (error) throw error;
      return data as MarketCompetitor[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MarketCompetitor> }) => {
      const { error } = await supabase
        .from("market_competitors")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market_competitors"] });
      toast.success("Competitor updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const ownBrand = competitors.find((c) => c.is_own_brand) ?? null;
  const otherBrands = competitors.filter((c) => !c.is_own_brand);
  const totalCoveredShare = competitors.reduce((sum, c) => sum + c.market_share, 0);

  return {
    competitors,
    ownBrand,
    otherBrands,
    totalCoveredShare,
    isLoading,
    updateCompetitor: updateMutation.mutate,
  };
};
