import { AppLayout } from "@/components/Layout";
import { useLatestWorkoutPlan, useGeneratePlan } from "@/hooks/use-plans";
import { PlanCard } from "@/components/PlanCard";
import { Loader2 } from "lucide-react";

export default function WorkoutPlan() {
  const { data: plan, isLoading } = useLatestWorkoutPlan();
  const { mutate: generate, isPending: isGenerating } = useGeneratePlan();

  const handleGenerate = () => {
    generate({ type: "workout" });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Parse the plan data if it exists. Assuming it's a JSON array of days.
  const planItems = plan?.planData ? (plan.planData as any).days || [] : [];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display">Your Workout Plan</h1>
        <p className="text-muted-foreground">Tailored exercises based on your goals and equipment.</p>
      </div>

      <PlanCard 
        title="Weekly Routine"
        subtitle={plan ? "Active Plan" : undefined}
        type="workout"
        items={planItems}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </AppLayout>
  );
}
