"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  Sparkles,
  Trophy,
  Clock,
  Mic,
  MessageSquare,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Award,
  Play,
  CheckCircle2,
} from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5" /> CEFR B2 Upper-Intermediate
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to speak with confidence today, Alex?
          </h1>
          <p className="text-sm sm:text-base text-blue-100 font-medium">
            Your daily target is 25 minutes. Complete 1 pronunciation drill and 1 conversation turn to keep your 14-day streak alive!
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-blue-600 font-extrabold text-sm shadow-md hover:bg-blue-50 hover:scale-102 transition-all"
            >
              <Mic className="h-4 w-4" />
              <span>Start Pronunciation Drill</span>
            </Link>

            <Link
              href="/speaking-partner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-700/60 hover:bg-blue-700/80 border border-white/20 text-white font-extrabold text-sm backdrop-blur-md transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>AI Roleplay Partner</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Gamification Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="h-5 w-5 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">14</span>
            <span className="text-xs font-bold text-muted-foreground">days streak</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">Top 5% of active learners</p>
        </div>

        <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total XP</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">3,750</span>
            <span className="text-xs font-bold text-muted-foreground">XP</span>
          </div>
          <p className="text-[11px] text-blue-600 font-semibold">+250 XP earned this week</p>
        </div>

        <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Pronunciation Avg</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">88%</span>
            <span className="text-xs font-bold text-muted-foreground">Native score</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">+6% since last assessment</p>
        </div>

        <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Due for SRS Review</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">12</span>
            <span className="text-xs font-bold text-muted-foreground">flashcards</span>
          </div>
          <Link href="/vocabulary" className="text-[11px] text-purple-600 font-semibold hover:underline block">
            Review now (SM-2) &rarr;
          </Link>
        </div>
      </div>

      {/* Featured Courses / Learning Path */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-foreground">Enrolled Courses & Drills</h2>
            <p className="text-xs text-muted-foreground">Curated to advance your CEFR B2 level to C1</p>
          </div>
          <Link href="/learning-path" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>View All Courses</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {MOCK_COURSES.slice(0, 2).map((course) => (
            <div
              key={course.id}
              className="group rounded-3xl border bg-card p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-16 w-16 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground uppercase">
                    {course.category} • CEFR {course.targetLevel}
                  </span>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {course.totalMinutes} mins total
                </span>
                <Link
                  href="/practice"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-primary hover:text-white text-foreground font-bold text-xs transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Continue</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
