import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PlanCardProps {
  title: string;
  subtitle?: string;
  type: "workout" | "meal";
  items: any[]; // Assuming generic structure for now
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export function EmptyPlanState({ type, onGenerate, isGenerating }: Pick<PlanCardProps, "type" | "onGenerate" | "isGenerating">) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-border bg-slate-50/50 dark:bg-white/5">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        {type === "workout" ? (
          <PlayCircle className="w-8 h-8 text-primary" />
        ) : (
          <Calendar className="w-8 h-8 text-primary" />
        )}
      </div>
      <h3 className="text-lg font-bold mb-2 font-display">No {type} plan yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Your personal AI coach can generate a tailored {type} plan based on your profile and goals.
      </p>
      {onGenerate && (
        <Button onClick={onGenerate} disabled={isGenerating} size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
          {isGenerating ? "Generating..." : `Generate ${type === "workout" ? "Workout" : "Meal"} Plan`}
        </Button>
      )}
    </div>
  );
}

export function PlanCard({ title, subtitle, type, items, onGenerate, isGenerating }: PlanCardProps) {
  if (!items || items.length === 0) {
    return <EmptyPlanState type={type} onGenerate={onGenerate} isGenerating={isGenerating} />;
  }

  // Determine current day of week (0-6)
  const todayIndex = new Date().getDay(); 
  // Map JS Date day (0=Sun) to plan usually starting Mon or Sun. Assuming plan is array of 7 days.
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-secondary/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl">{title}</CardTitle>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider">
            7 Day Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {items.map((day, idx) => (
            <div 
              key={idx} 
              className={cn(
                "p-4 hover:bg-secondary/20 transition-colors flex gap-4 items-start group",
                idx === (todayIndex === 0 ? 6 : todayIndex - 1) ? "bg-primary/5 border-l-4 border-l-primary" : ""
              )}
            >
              <div className="w-12 shrink-0 pt-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  Day {idx + 1}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{day.focus || day.summary || "Rest Day"}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {day.exercises ? `${day.exercises.length} exercises` : day.meals ? `${day.meals.length} meals` : "Rest and recovery"}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
