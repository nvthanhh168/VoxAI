"use client";

import Link from "next/link";
import { Mic, Flame, Sparkles, BookOpen, Crown, User, ShieldCheck } from "lucide-react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    xp?: number;
    streak?: number;
    cefrLevel?: string;
    role?: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const xp = user?.xp ?? 1450;
  const streak = user?.streak ?? 14;
  const cefr = user?.cefrLevel ?? "B2";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              VoxAI
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Speak Pro
            </span>
          </div>
        </Link>

        {/* User Quick Stats bar */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streak} days</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>{xp} XP</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500 text-white font-extrabold text-xs">
            <span>CEFR {cefr}</span>
          </div>

          <Link
            href="/subscription"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-sm hover:brightness-105 transition-all"
          >
            <Crown className="h-3.5 w-3.5 fill-white" />
            <span className="hidden sm:inline">Upgrade</span>
          </Link>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary border border-border text-foreground hover:bg-muted transition-colors"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
