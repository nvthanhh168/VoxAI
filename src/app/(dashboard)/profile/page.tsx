"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Crown,
  Flame,
  Sparkles,
  Volume2,
  Settings,
  LogOut,
  CheckCircle2,
  Compass,
  Award,
  Globe,
  Sliders,
  Play,
  RotateCcw,
} from "lucide-react";
import { speakNaturalEnglish } from "@/lib/speech-voice";

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Super Administrator");
  const [userEmail, setUserEmail] = useState("admin@voxai.com");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(25);
  const [voiceRate, setVoiceRate] = useState(0.92);
  const [isSaved, setIsSaved] = useState(false);

  const testVoice = () => {
    speakNaturalEnglish(
      "Hello! This is your native AI voice assistant for VoxAI. Your English pronunciation and conversation sessions will sound expressive and natural.",
      { rate: voiceRate, pitch: 1.02 }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSignOut = () => {
    router.push("/login");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/25">
                <User className="h-10 w-10" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center" title="Online">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-foreground">{userName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs border border-indigo-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" /> SUPER ADMIN
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-xs border border-amber-500/20">
                  <Crown className="h-3.5 w-3.5" /> LIFETIME VIP
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{userEmail}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center sm:justify-start gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Toàn quyền truy cập 100% tất cả module & tính năng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" /> Bảng Điều Khiển Admin
            </Link>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-xl border bg-secondary/50 hover:bg-rose-500/10 hover:text-rose-600 text-muted-foreground text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-secondary/40 border space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase">Trình độ CEFR</span>
              <Award className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">C2</p>
            <span className="text-[10px] text-muted-foreground font-medium">Native Fluency</span>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/40 border space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase">Chuỗi học tập</span>
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-500">14 Ngày</p>
            <span className="text-[10px] text-muted-foreground font-medium">Bảo lưu Streak 🔥</span>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/40 border space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase">Điểm tích lũy</span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">99,999</p>
            <span className="text-[10px] text-muted-foreground font-medium">Diamond League #1</span>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/40 border space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase">Mục tiêu ngày</span>
              <Compass className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-foreground">18 / 25</p>
            <span className="text-[10px] text-muted-foreground font-medium">Phút luyện nói</span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b pb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-black text-foreground">Cấu Hình Tài Khoản & Giọng Nói AI</h2>
        </div>

        {isSaved && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Đã lưu thành công các cài đặt của bạn!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Họ và tên</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Email tài khoản</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>

        {/* AI Voice Calibration */}
        <div className="p-4 rounded-2xl bg-secondary/30 border space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-primary" /> Tốc độ giọng đọc AI Native
              </span>
              <p className="text-[11px] text-muted-foreground">
                Điều chỉnh nhịp nói của AI trong Luyện phát âm, Hội thoại và Đọc báo ({voiceRate}x)
              </p>
            </div>
            <button
              type="button"
              onClick={testVoice}
              className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm"
            >
              <Play className="h-3.5 w-3.5 fill-white" /> Nghe thử giọng AI
            </button>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={voiceRate}
              onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
              className="flex-1 accent-primary cursor-pointer"
            />
            <span className="text-xs font-mono font-bold w-12 text-right">{voiceRate}x</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </form>
    </div>
  );
}
