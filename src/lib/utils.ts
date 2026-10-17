import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (score >= 85) {
    return {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/30",
      label: "Native-like",
    };
  }
  if (score >= 65) {
    return {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      border: "border-amber-500/30",
      label: "Understandable",
    };
  }
  return {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/30",
    label: "Needs Improvement",
  };
}

export function getCefrColor(level: string): string {
  switch (level?.toUpperCase()) {
    case "A1":
    case "A2":
      return "bg-sky-500 text-white";
    case "B1":
    case "B2":
      return "bg-emerald-500 text-white";
    case "C1":
    case "C2":
      return "bg-purple-600 text-white";
    default:
      return "bg-slate-500 text-white";
  }
}
