"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Wand2,
  BookOpen,
  Copy,
  Check,
  Volume2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { COMMON_GRAMMAR_MISTAKES, CommonMistake } from "@/lib/mock-data";
import { speakNaturalEnglish } from "@/lib/speech-voice";

export default function GrammarCoach() {
  const [inputText, setInputText] = useState("I am agree with your proposal because he go to school everyday.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async (sentenceToAnalyze?: string) => {
    const text = sentenceToAnalyze || inputText;
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/grammar/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: text }),
      });
      const data = await res.json();
      if (data.data) {
        setResult(data.data);
      }
    } catch (e) {
      console.error("Grammar coach analysis error:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const speakText = (text: string) => {
    speakNaturalEnglish(text, { rate: 0.92, pitch: 1.02 });
  };

  const applyCommonMistake = (item: CommonMistake) => {
    setInputText(item.incorrect);
    handleAnalyze(item.incorrect);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quick Common Mistakes Selector */}
      <div className="p-4 rounded-3xl border bg-card space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-primary" /> Thư viện lỗi sai phổ biến của người Việt (Bấm thử ngay)
          </span>
          <span className="text-[11px] text-muted-foreground font-semibold">1-Click Test</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {COMMON_GRAMMAR_MISTAKES.map((item) => (
            <button
              key={item.id}
              onClick={() => applyCommonMistake(item)}
              className="px-3 py-1.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-xs font-medium text-foreground transition-all hover:scale-102 flex items-center gap-1.5 text-left"
              title={`${item.incorrect} ➔ ${item.correct}`}
            >
              <span className="text-rose-500 font-bold line-through">{item.incorrect}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-black text-foreground">AI Grammar & Native Rewrite Coach</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Nhập hoặc dán bất kỳ câu tiếng Anh nào để phát hiện lỗi ngữ pháp, nhận giải thích chi tiết và các cách diễn đạt tự nhiên chuẩn bản xứ.
        </p>

        <div className="space-y-3">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập câu tiếng Anh tại đây (ví dụ: 'I am agree with your opinion because...')"
            className="w-full rounded-2xl bg-secondary/50 border border-border p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none"
          />

          <div className="flex justify-end">
            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>AI đang phân tích & sửa câu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Chỉnh sửa & Nâng cấp câu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1">
              <span className="text-xs font-bold text-rose-500 uppercase">Câu gốc của bạn</span>
              <p className="text-sm font-medium text-foreground">{result.original}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Câu đã sửa ngữ pháp chuẩn
                </span>
                <button
                  onClick={() => speakText(result.corrected)}
                  className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 transition-colors"
                  title="Nghe phát âm chuẩn"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm font-bold text-foreground">{result.corrected}</p>
            </div>
          </div>

          {/* Grammar Explanations */}
          {result.analysis?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">Phân tích lỗi sai & Quy tắc ngữ pháp:</h4>
              <div className="space-y-2">
                {result.analysis.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-secondary/60 border text-xs space-y-1">
                    <span className="font-extrabold text-primary">{item.issue}</span>
                    <p className="text-muted-foreground">{item.explanation}</p>
                    <p className="font-semibold text-foreground pt-1">
                      💡 Khuyến nghị: <span className="text-emerald-600 font-bold">{item.suggestion}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Native idiomatic alternatives */}
          {result.nativeExpressions?.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Cách người bản xứ diễn đạt tự nhiên:
                </h4>
                <span className="text-xs font-bold text-primary">{result.cefrLevel || "B2 Native"}</span>
              </div>

              <div className="space-y-2">
                {result.nativeExpressions.map((expr: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(expr)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                        title="Nghe câu này"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-semibold text-foreground italic">"{expr}"</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(expr, idx)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      title="Sao chép câu này"
                    >
                      {copiedIndex === idx ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
