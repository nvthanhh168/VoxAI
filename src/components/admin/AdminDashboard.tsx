"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Activity,
  Search,
  MoreVertical,
  Plus,
  CheckCircle2,
  Cpu,
  Zap,
  ExternalLink,
  Crown,
  Database,
  Radio,
  Newspaper,
  Award,
  Mic,
} from "lucide-react";

const INITIAL_USERS = [
  { id: "u-1", name: "Super Administrator (You)", email: "admin@voxai.com", role: "ADMIN", cefr: "C2", xp: 99999, status: "Active (Full Access)" },
  { id: "u-2", name: "Alex Rivera", email: "demo@voxai.com", role: "USER", cefr: "B2", xp: 3750, status: "Active" },
  { id: "u-3", name: "Sarah Jenkins", email: "sarah@voxai.com", role: "USER", cefr: "C1", xp: 4820, status: "Active" },
  { id: "u-4", name: "Kenji Sato", email: "kenji@voxai.com", role: "STUDENT", cefr: "B2", xp: 4210, status: "Active" },
  { id: "u-5", name: "Prof. Robert Thorne", email: "thorne@cambridge.edu", role: "TEACHER", cefr: "C2", xp: 8900, status: "Active" },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [aiEngineStatus, setAiEngineStatus] = useState(true);
  const [azureTelemetryStatus, setAzureTelemetryStatus] = useState(true);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner with Super Admin Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-500/30">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-xs uppercase tracking-wider border border-indigo-500/30">
              <ShieldCheck className="h-4 w-4" /> Root Master Access • All Features Unlocked
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hệ Thống Quản Trị & Điều Hành VoxAI Super Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Tài khoản Admin mặc định có toàn quyền truy cập, kiểm duyệt nội dung, điều chỉnh cấu hình AI Speech và quản lý học viên.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Quyền Hạn</span>
              <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
                <Crown className="h-4 w-4" /> UNLIMITED VIP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to All Features as Super Admin */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Truy cập nhanh tất cả các module đặc quyền với tư cách Super Admin:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/practice"
            className="p-4 rounded-2xl border bg-card hover:border-primary/50 transition-all flex items-center gap-3 shadow-sm group"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-foreground block">50+ Pronunciation</span>
              <span className="text-[10px] text-muted-foreground">Mở khóa full kho câu</span>
            </div>
          </Link>

          <Link
            href="/news"
            className="p-4 rounded-2xl border bg-card hover:border-primary/50 transition-all flex items-center gap-3 shadow-sm group"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-foreground block">Đọc báo Công nghệ</span>
              <span className="text-[10px] text-muted-foreground">Tra từ & phát âm AI</span>
            </div>
          </Link>

          <Link
            href="/ielts-test"
            className="p-4 rounded-2xl border bg-card hover:border-primary/50 transition-all flex items-center gap-3 shadow-sm group"
          >
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-foreground block">Mock IELTS Speaking</span>
              <span className="text-[10px] text-muted-foreground">Parts 1-3 & Band 9</span>
            </div>
          </Link>

          <Link
            href="/learning-path"
            className="p-4 rounded-2xl border bg-card hover:border-primary/50 transition-all flex items-center gap-3 shadow-sm group"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-foreground block">Lộ trình 10 Modules</span>
              <span className="text-[10px] text-muted-foreground">IPA & Connected Speech</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Total Learners</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground">14,290</div>
          <p className="text-[11px] text-emerald-600 font-semibold">+18% this month</p>
        </div>

        <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">MRR / Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-foreground">$42,850</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Stripe Active Subscriptions</p>
        </div>

        <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Speech Assessments</span>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-foreground">348,120</div>
          <p className="text-[11px] text-blue-600 font-semibold">Azure + Whisper turns</p>
        </div>

        <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Average Pronunciation</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-foreground">84.2%</div>
          <p className="text-[11px] text-purple-600 font-semibold">Across all cohorts</p>
        </div>
      </div>

      {/* Live System Engine & Telemetry Status */}
      <div className="p-5 rounded-3xl border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <h2 className="text-base font-black text-foreground">Hạ Tầng AI Speech & Dịch Vụ Microservices</h2>
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Radio className="h-3 w-3 animate-pulse" /> All Systems Operational
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-secondary/40 border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Azure Speech Pronunciation</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">Độ trễ trung bình: 142ms • Phân tích âm vị IPA</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/40 border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Whisper Automatic STT</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">Model: whisper-large-v3-turbo • Độ chính xác 98.4%</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/40 border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">PostgreSQL Database</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">Prisma Client Pool • 100% Uptime</p>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-black text-foreground">Danh Sách Học Viên & Phân Quyền RBAC</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm học viên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all">
              <Plus className="h-4 w-4" />
              <span>Thêm Học Viên</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-secondary/30 text-muted-foreground font-bold uppercase">
              <tr>
                <th className="p-3">Học viên</th>
                <th className="p-3">Email</th>
                <th className="p-3">Vai trò</th>
                <th className="p-3">CEFR</th>
                <th className="p-3">XP Tích Lũy</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-bold text-foreground">{u.name}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                        u.role === "ADMIN"
                          ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold">{u.cefr}</td>
                  <td className="p-3 font-bold">{u.xp} XP</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
