import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MarketOpportunity {
  id: string;
  user_id: string;
  type: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  estimated_impact: string | null;
  action_label: string | null;
  action_type: string | null;
  action_payload: Record<string, unknown> | null;
  timeline_days: number | null;
  status: "new" | "actioned" | "dismissed";
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useMarketOpportunities = () => {
  const queryClient = useQueryClient();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["market_opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_opportunities")
        .select("*")
        .neq("status", "dismissed")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MarketOpportunity[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "actioned" | "dismissed" }) => {
      const { error } = await supabase
        .from("market_opportunities")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["market_opportunities"] });
      if (status === "actioned") {
        toast.success("Opportunity marked as actioned!");
      } else {
        toast.success("Opportunity dismissed");
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to update opportunity: ${error.message}`);
    },
  });

  const generateOpportunitiesMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-market-opportunities`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to generate opportunities");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["market_opportunities"] });
      toast.success(`Generated ${data.count ?? 0} new opportunities!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate opportunities: ${error.message}`);
    },
  });

  const activeOpportunities = opportunities?.filter((o) => o.status === "new") ?? [];
  const actionedOpportunities = opportunities?.filter((o) => o.status === "actioned") ?? [];

  const highPriority = activeOpportunities.filter((o) => o.priority === "high");
  const mediumPriority = activeOpportunities.filter((o) => o.priority === "medium");
  const lowPriority = activeOpportunities.filter((o) => o.priority === "low");

  const sortedOpportunities = [...highPriority, ...mediumPriority, ...lowPriority];

  return {
    opportunities: sortedOpportunities,
    actionedOpportunities,
    allOpportunities: opportunities ?? [],
    isLoading,
    updateStatus: updateStatusMutation.mutate,
    generateOpportunities: generateOpportunitiesMutation.mutate,
    isGenerating: generateOpportunitiesMutation.isPending,
  };
};
