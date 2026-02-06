import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Brain, Heart, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight">ArogyaMitra</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:flex font-medium">Features</Button>
          <Button variant="ghost" className="hidden md:flex font-medium">Pricing</Button>
          <a href="/api/login">
            <Button className="rounded-full px-6 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              Sign In
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-6 border border-border">
            AI-Powered Wellness 🤖
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-8 max-w-4xl mx-auto">
            Your Personal <span className="text-primary">AI Health Coach</span> for a Better You
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Personalized workout plans, nutrition advice, and 24/7 coaching powered by advanced AI. 
            Achieve your fitness goals with ArogyaMitra.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <a href="/api/login">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg bg-white/50 backdrop-blur-sm">
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {[
            {
              icon: Brain,
              title: "AI Coaching",
              desc: "Chat with AROMI, your intelligent health assistant available 24/7."
            },
            {
              icon: Zap,
              title: "Custom Workouts",
              desc: "Dynamic plans that adapt to your progress and available equipment."
            },
            {
              icon: Heart,
              title: "Smart Nutrition",
              desc: "Meal plans tailored to your dietary preferences and health goals."
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-left hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer Image placeholder (Optional nice touch) */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-black to-transparent z-20 pointer-events-none" />
      {/* Unsplash image of runner or healthy food could go here as background */}
    </div>
  );
}
