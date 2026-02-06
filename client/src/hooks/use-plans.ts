import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type GeneratePlanRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useLatestWorkoutPlan() {
  return useQuery({
    queryKey: [api.plans.getLatestWorkout.path],
    queryFn: async () => {
      const res = await fetch(api.plans.getLatestWorkout.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch workout plan");
      return api.plans.getLatestWorkout.responses[200].parse(await res.json());
    },
  });
}

export function useLatestMealPlan() {
  return useQuery({
    queryKey: [api.plans.getLatestMeal.path],
    queryFn: async () => {
      const res = await fetch(api.plans.getLatestMeal.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch meal plan");
      return api.plans.getLatestMeal.responses[200].parse(await res.json());
    },
  });
}

export function useGeneratePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GeneratePlanRequest) => {
      const res = await fetch(api.plans.generate.path, {
        method: api.plans.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to generate plan");
      }
      return api.plans.generate.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      if (data.type === "workout") {
        queryClient.invalidateQueries({ queryKey: [api.plans.getLatestWorkout.path] });
      } else {
        queryClient.invalidateQueries({ queryKey: [api.plans.getLatestMeal.path] });
      }
      toast({
        title: "Plan Generated",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
