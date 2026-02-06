import { AppLayout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useLatestWorkoutPlan, useLatestMealPlan } from "@/hooks/use-plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, TrendingUp, Calendar, ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { VitalMonitor } from "@/components/VitalMonitor";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: workout, isLoading: workoutLoading } = useLatestWorkoutPlan();
  const { data: meal, isLoading: mealLoading } = useLatestMealPlan();

  if (profileLoading || workoutLoading || mealLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  // If no profile, prompt to create one
  if (!profile) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold font-display mb-4">Welcome, {user?.firstName || "Friend"}!</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Let's get started by setting up your fitness profile. This helps our AI create the perfect plan for you.
          </p>
          <Link href="/profile">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
              Create My Profile <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const stats = [
    { label: "Current Goal", value: profile.goals.replace("_", " "), icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Activity Level", value: profile.activityLevel.replace("_", " "), icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Daily Time", value: `${profile.availability} mins`, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
          </div>
          <div className="flex gap-3">
            <Link href="/aromi">
              <Button variant="outline" className="gap-2">Chat with AROMI</Button>
            </Link>
            <Link href="/workout-plan">
              <Button className="gap-2 shadow-md shadow-primary/20">View Workouts</Button>
            </Link>
          </div>
        </div>

        {/* Vital Monitor Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">Live Vital Signs</h2>
          </div>
          <VitalMonitor />
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-xl font-bold capitalize font-display">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity / Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display">Current Workout Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {workout ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="font-semibold mb-1">Active Plan</p>
                    <p className="text-sm text-muted-foreground">Generated on {new Date(workout.createdAt!).toLocaleDateString()}</p>
                  </div>
                  <Link href="/workout-plan">
                    <Button variant="ghost" className="w-full justify-between group">
                      View Full Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active workout plan</p>
                  <Link href="/workout-plan">
                    <Button>Generate Plan</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display">Nutrition Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {meal ? (
                <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="font-semibold mb-1">Active Meal Plan</p>
                    <p className="text-sm text-muted-foreground">Dietary Prefs: {profile.dietaryPreferences || "None"}</p>
                  </div>
                   <Link href="/meal-plan">
                    <Button variant="ghost" className="w-full justify-between group">
                      View Full Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active meal plan</p>
                   <Link href="/meal-plan">
                    <Button>Generate Plan</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
