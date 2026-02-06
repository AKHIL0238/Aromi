import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVitalSimulation } from "@/hooks/use-vital-simulation";
import { Activity, Heart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export function VitalMonitor() {
  const { readings, alert } = useVitalSimulation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className={cn("h-4 w-4", readings.bpm > 100 ? "text-destructive animate-pulse" : "text-primary")} />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{readings.bpm} <span className="text-sm font-normal text-muted-foreground">BPM</span></div>
            <p className="text-xs text-muted-foreground mt-1">Real-time simulation</p>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
            <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {readings.systolic}/{readings.diastolic} 
              <span className="text-sm font-normal text-muted-foreground ml-1">mmHg</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Normal: 120/80</p>
          </CardContent>
        </Card>
      </div>

      {alert && (
        <Alert variant={alert.type === "danger" ? "destructive" : "default"} className="animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="capitalize">{alert.type} Alert</AlertTitle>
          <AlertDescription>
            {alert.message} - Please consult a professional if symptoms persist.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
