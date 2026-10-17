"use client";

import React, { useState } from "react";
import { Users, BookOpen, TrendingUp, ShieldCheck, DollarSign, Activity, Search, MoreVertical, Plus } from "lucide-react";

const INITIAL_USERS = [
  { id: "u-1", name: "Alex Rivera", email: "alex@voxai.com", role: "USER", cefr: "B2", xp: 3750, status: "Active" },
  { id: "u-2", name: "Sarah Jenkins", email: "sarah@voxai.com", role: "USER", cefr: "C1", xp: 4820, status: "Active" },
  { id: "u-3", name: "Kenji Sato", email: "kenji@voxai.com", role: "STUDENT", cefr: "B2", xp: 4210, status: "Active" },
  { id: "u-4", name: "Prof. Robert Thorne", email: "thorne@cambridge.edu", role: "TEACHER", cefr: "C2", xp: 8900, status: "Active" },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Admin & School Governance</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor active SaaS learners, manage course content, and inspect real-time AI speech telemetry.
        </p>
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

      {/* User Management Table */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-black text-foreground">Learner Directory & RBAC</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search user or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-secondary/30 text-muted-foreground font-bold uppercase">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">CEFR</th>
                <th className="p-3">XP Earned</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-bold text-foreground">{u.name}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-extrabold text-[10px]">
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
