"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, RefreshCw, Wand2, BookOpen, Copy, Check } from "lucide-react";

export default function GrammarCoach() {
  const [inputText, setInputText] = useState("I am agree with your proposal because he go to school everyday.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/grammar/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: inputText }),
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-black text-foreground">AI Grammar & Native Rewrite Coach</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Type or paste any spoken or written English draft to detect grammatical slips and unlock natural native expressions.
        </p>

        <div className="space-y-3">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your sentence here (e.g. 'I am agree with him because...')"
            className="w-full rounded-2xl bg-secondary/50 border border-border p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Refine & Polish Sentence</span>
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
              <span className="text-xs font-bold text-rose-500 uppercase">Original Draft</span>
              <p className="text-sm font-medium text-foreground">{result.original}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Grammatically Corrected
              </span>
              <p className="text-sm font-bold text-foreground">{result.corrected}</p>
            </div>
          </div>

          {/* Grammar Explanations */}
          {result.analysis?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">Rule Breakdown & Explanations:</h4>
              <div className="space-y-2">
                {result.analysis.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-secondary/60 border text-xs space-y-1">
                    <span className="font-extrabold text-primary">{item.issue}</span>
                    <p className="text-muted-foreground">{item.explanation}</p>
                    <p className="font-semibold text-foreground pt-1">
                      💡 Recommended: <span className="text-emerald-600 font-bold">{item.suggestion}</span>
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
                  <Sparkles className="h-4 w-4 text-amber-500" /> How a Native Speaker Would Say It:
                </h4>
                <span className="text-xs font-bold text-primary">{result.cefrLevel || "B2 Native"}</span>
              </div>

              <div className="space-y-2">
                {result.nativeExpressions.map((expr: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border hover:bg-secondary/70 transition-colors"
                  >
                    <span className="text-sm font-semibold text-foreground italic">"{expr}"</span>
                    <button
                      onClick={() => copyToClipboard(expr, idx)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy expression"
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
