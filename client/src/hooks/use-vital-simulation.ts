import { useState, useEffect } from "react";

export interface VitalReadings {
  bpm: number;
  systolic: number;
  diastolic: number;
  timestamp: Date;
}

export interface VitalAlert {
  type: "warning" | "danger" | "normal";
  message: string;
}

export function useVitalSimulation() {
  const [readings, setReadings] = useState<VitalReadings>({
    bpm: 72,
    systolic: 120,
    diastolic: 80,
    timestamp: new Date(),
  });

  const [alert, setAlert] = useState<VitalAlert | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setReadings((prev) => {
        // Simulate BPM (normal 60-100)
        const bpmVariation = Math.floor(Math.random() * 5) - 2;
        const newBpm = Math.max(50, Math.min(180, prev.bpm + bpmVariation));

        // Simulate BP (normal 120/80)
        const systolicVar = Math.floor(Math.random() * 3) - 1;
        const diastolicVar = Math.floor(Math.random() * 2) - 1;
        const newSystolic = Math.max(90, Math.min(160, prev.systolic + systolicVar));
        const newDiastolic = Math.max(60, Math.min(100, prev.diastolic + diastolicVar));

        return {
          bpm: newBpm,
          systolic: newSystolic,
          diastolic: newDiastolic,
          timestamp: new Date(),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (readings.bpm > 110) {
      setAlert({ type: "warning", message: "High Heart Rate Detected" });
    } else if (readings.bpm < 55) {
      setAlert({ type: "warning", message: "Low Heart Rate Detected" });
    } else if (readings.systolic > 140 || readings.diastolic > 90) {
      setAlert({ type: "danger", message: "High Blood Pressure Alert" });
    } else {
      setAlert(null);
    }
  }, [readings]);

  return { readings, alert };
}
