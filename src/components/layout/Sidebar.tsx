"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mic,
  MessageSquare,
  BookOpen,
  Sparkles,
  GraduationCap,
  Award,
  Trophy,
  Compass,
  Crown,
  Settings,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Pronunciation Practice", icon: Mic, highlight: true },
  { href: "/speaking-partner", label: "AI Speaking Partner", icon: MessageSquare, badge: "Voice" },
  { href: "/vocabulary", label: "Vocabulary (SRS)", icon: BookOpen },
  { href: "/grammar-coach", label: "Grammar Coach", icon: Sparkles },
  { href: "/placement-test", label: "Placement Test", icon: GraduationCap },
  { href: "/learning-path", label: "Learning Roadmap", icon: Compass },
  { href: "/leaderboard", label: "Leaderboard & XP", icon: Trophy },
  { href: "/subscription", label: "Pricing & Plans", icon: Crown },
  { href: "/admin", label: "Admin Portal", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card/60 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Daily Learning
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-primary")} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Daily Goal Mini Card */}
      <div className="mt-auto pt-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">Daily Goal</span>
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">18 / 25 min</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[72%]" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> 7 mins to preserve your streak!
          </p>
        </div>
      </div>
    </aside>
  );
}
