import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  User, 
  Dumbbell, 
  Utensils, 
  Bot, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/workout-plan", label: "Workout Plan", icon: Dumbbell },
    { href: "/meal-plan", label: "Meal Plan", icon: Utensils },
    { href: "/aromi", label: "AROMI Coach", icon: Bot },
    { href: "/profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-border">
      <div className="p-6 border-b border-border/50">
        <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
          ArogyaMitra
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">AI Wellness Companion</p>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <h1 className="font-display text-xl font-bold text-primary">ArogyaMitra</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background p-4 animate-in slide-in-from-top-10">
          <Sidebar />
        </div>
      )}
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black">
      {/* Sidebar hidden on mobile */}
      <div className="hidden md:block w-64 h-full shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <MobileNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
