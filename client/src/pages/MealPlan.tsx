import { AppLayout } from "@/components/Layout";
import { useLatestMealPlan, useGeneratePlan } from "@/hooks/use-plans";
import { PlanCard } from "@/components/PlanCard";
import { Loader2 } from "lucide-react";

export default function MealPlan() {
  const { data: plan, isLoading } = useLatestMealPlan();
  const { mutate: generate, isPending: isGenerating } = useGeneratePlan();

  const handleGenerate = () => {
    generate({ type: "nutrition" });
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
        <h1 className="text-3xl font-bold font-display">Your Nutrition Plan</h1>
        <p className="text-muted-foreground">Healthy, delicious meals aligned with your dietary preferences.</p>
      </div>

      <PlanCard 
        title="Weekly Menu"
        subtitle={plan ? "Active Plan" : undefined}
        type="meal"
        items={planItems}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </AppLayout>
  );
}
