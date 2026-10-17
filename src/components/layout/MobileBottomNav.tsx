"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mic,
  MessageSquare,
  Newspaper,
  Menu,
  X,
  Award,
  GraduationCap,
  BookOpen,
  Sparkles,
  Compass,
  Trophy,
  Crown,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MORE_NAV_ITEMS = [
  { href: "/ielts-test", label: "Mock IELTS Speaking", icon: Award, badge: "Band 9", desc: "Thi thử 3 phần tiêu chuẩn IDP/BC" },
  { href: "/toeic-test", label: "Mock TOEIC Speaking", icon: GraduationCap, badge: "200 Pts", desc: "Thi thử 11 câu chuẩn ETS" },
  { href: "/vocabulary", label: "Từ vựng Flashcard (SRS)", icon: BookOpen, desc: "Lặp lại ngắt quãng SuperMemo" },
  { href: "/grammar-coach", label: "Grammar Coach & Sửa lỗi", icon: Sparkles, desc: "Sửa lỗi ngữ pháp & câu bản xứ" },
  { href: "/learning-path", label: "Lộ trình 10 Chuyên đề IPA", icon: Compass, desc: "Học viện ngữ âm và nối âm" },
  { href: "/placement-test", label: "Kiểm tra trình độ CEFR", icon: GraduationCap, desc: "Đo lường năng lực A1 - C2" },
  { href: "/leaderboard", label: "Bảng xếp hạng & XP", icon: Trophy, desc: "Đua top học viên tích cực" },
  { href: "/subscription", label: "Bảng giá & Gói cước", icon: Crown, desc: "Nâng cấp tài khoản VIP" },
  { href: "/admin", label: "Cổng Quản trị Super Admin", icon: ShieldCheck, badge: "Master", desc: "Toàn quyền điều hành hệ thống" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const MAIN_TABS = [
    { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/practice", label: "Phát âm", icon: Mic },
    { href: "/speaking-partner", label: "Hội thoại", icon: MessageSquare },
    { href: "/news", label: "Đọc báo", icon: Newspaper },
  ];

  return (
    <>
      {/* Fixed Bottom Bar on Mobile Devices */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border px-2 py-1 shadow-lg">
        <div className="flex items-center justify-around">
          {MAIN_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all text-[10px] font-bold",
                  isActive
                    ? "text-primary font-black"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-1 rounded-xl transition-all",
                    isActive ? "bg-primary/10 scale-110" : ""
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span>{tab.label}</span>
              </Link>
            );
          })}

          {/* More Menu Drawer Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all text-[10px] font-bold text-muted-foreground hover:text-foreground"
          >
            <div className="p-1 rounded-xl">
              <Menu className="h-5 w-5" />
            </div>
            <span>Menu khác</span>
          </button>
        </div>
      </nav>

      {/* Full Daily Learning Drawer on Mobile */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-card border-t rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-black text-foreground">Menu Daily Learning</h3>
                <p className="text-xs text-muted-foreground">Tất cả khóa học & tính năng trên điện thoại</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {MORE_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-2xl border transition-all text-xs font-semibold",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-secondary/40 hover:bg-secondary border-border text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center",
                          isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 font-extrabold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-[11px]",
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
