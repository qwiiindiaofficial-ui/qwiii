import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PlanRegistration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name?: string;
  plan_name: string;
  billing_cycle: string;
  plan_price: number;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const usePlanRegistrations = () => {
  const queryClient = useQueryClient();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["plan_registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plan_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PlanRegistration[];
    },
  });

  const updateRegistrationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PlanRegistration> }) => {
      const { data, error } = await supabase
        .from("plan_registrations")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan_registrations"] });
      toast.success("Registration updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update registration: ${error.message}`);
    },
  });

  const deleteRegistrationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("plan_registrations")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan_registrations"] });
      toast.success("Registration deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete registration: ${error.message}`);
    },
  });

  return {
    registrations,
    isLoading,
    updateRegistration: updateRegistrationMutation.mutate,
    deleteRegistration: deleteRegistrationMutation.mutate,
  };
};
