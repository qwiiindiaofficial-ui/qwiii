import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MarketExpansionTarget {
  id: string;
  user_id: string;
  city: string;
  state: string;
  population: string;
  monthly_potential: string;
  competition_level: string;
  priority: "high" | "medium" | "low";
  strategy: string;
  budget: number;
  timeline: string;
  notes: string;
  status: "planned" | "active" | "completed";
  created_at: string;
  updated_at: string;
}

export type NewExpansionTarget = Omit<MarketExpansionTarget, "id" | "user_id" | "created_at" | "updated_at">;

export const useMarketExpansion = () => {
  const queryClient = useQueryClient();

  const { data: targets = [], isLoading } = useQuery({
    queryKey: ["market_expansion_targets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_expansion_targets")
        .select("*")
        .order("priority", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MarketExpansionTarget[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newTarget: NewExpansionTarget) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("market_expansion_targets")
        .insert({ ...newTarget, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market_expansion_targets"] });
      toast.success("Expansion plan created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MarketExpansionTarget> }) => {
      const { error } = await supabase
        .from("market_expansion_targets")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market_expansion_targets"] });
      toast.success("Expansion target updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const highPriority = targets.filter((t) => t.priority === "high");
  const mediumPriority = targets.filter((t) => t.priority === "medium");
  const lowPriority = targets.filter((t) => t.priority === "low");
  const sortedTargets = [...highPriority, ...mediumPriority, ...lowPriority];

  return {
    targets: sortedTargets,
    isLoading,
    addTarget: addMutation.mutate,
    isAdding: addMutation.isPending,
    updateTarget: updateMutation.mutate,
  };
};
