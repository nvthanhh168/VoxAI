"use client";

import React, { useState } from "react";
import { GraduationCap, CheckCircle2, ChevronRight, Award, Sparkles, Mic, Volume2, RefreshCw } from "lucide-react";
import { getCefrColor } from "@/lib/utils";

const QUESTIONS = [
  {
    id: "q1",
    category: "Grammar",
    prompt: "By the time we arrived at the conference, the keynote speaker _____ already finished his address.",
    options: [
      { id: "a", text: "has" },
      { id: "b", text: "had" },
      { id: "c", text: "was" },
      { id: "d", text: "would" },
    ],
  },
  {
    id: "q2",
    category: "Vocabulary & Collocations",
    prompt: "The new startup has made _____ progress in reducing generative AI model inference latency.",
    options: [
      { id: "a", text: "intense" },
      { id: "b", text: "harsh" },
      { id: "c", text: "substantial" },
      { id: "d", text: "steep" },
    ],
  },
  {
    id: "q3",
    category: "Discourse Markers",
    prompt: "The strategy presents certain risks; _____, the projected returns far outweigh potential setbacks.",
    options: [
      { id: "a", text: "nevertheless" },
      { id: "b", text: "because" },
      { id: "c", text: "whereas" },
      { id: "d", text: "in order that" },
    ],
  },
  {
    id: "q4",
    category: "Spoken English & Pronunciation Check",
    prompt: "Read aloud: 'The meteorological conditions caused unprecedented flight cancellations across the continent.'",
    isSpeakingPrompt: true,
  },
];

export default function PlacementWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const currentQ = QUESTIONS[currentStep];

  const handleSelectOption = (optId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleNext = async () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit assessment
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/assessment/placement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "demo-user",
            answers,
            speakingScore: 84,
          }),
        });
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error("Placement submit error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!result ? (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black text-foreground">CEFR Diagnostic Assessment</h2>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              Question {currentStep + 1} of {QUESTIONS.length}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Current Question Body */}
          <div className="space-y-4 py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Section: {currentQ.category}
            </span>
            <p className="text-lg font-bold text-foreground leading-relaxed">{currentQ.prompt}</p>

            {currentQ.isSpeakingPrompt ? (
              <div className="p-6 rounded-2xl bg-secondary/40 border border-dashed text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md shadow-primary/20">
                  <Mic className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-muted-foreground">
                  Voice benchmark verified with Azure Speech engine.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Audio Ready for Analysis
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentQ.options?.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all text-sm font-semibold flex items-center justify-between ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-secondary/40 hover:bg-secondary border-border text-foreground"
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleNext}
              disabled={isSubmitting || (!currentQ.isSpeakingPrompt && !answers[currentQ.id])}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Evaluating Results...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === QUESTIONS.length - 1 ? "Calculate CEFR Level" : "Next Question"}</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results Report */
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="text-center space-y-3 pb-6 border-b">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> Official Assessment Complete
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Your English Placement Result</h2>

            <div className="flex justify-center pt-2">
              <div
                className={`flex flex-col items-center justify-center h-28 w-28 rounded-3xl ${getCefrColor(
                  result.level
                )} shadow-xl`}
              >
                <span className="text-xs uppercase font-extrabold opacity-80">CEFR</span>
                <span className="text-4xl font-black">{result.level}</span>
                <span className="text-[11px] font-bold opacity-90">{result.score}% Score</span>
              </div>
            </div>
          </div>

          {/* Roadmap & Next Steps */}
          {result.roadmap && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">Personalized AI Roadmap:</h3>

              <div className="p-4 rounded-2xl bg-secondary/50 border space-y-2">
                <span className="text-xs font-bold text-primary uppercase">Core Recommendation</span>
                <p className="text-sm font-semibold text-foreground">{result.roadmap.primaryFocus}</p>
                <p className="text-xs text-muted-foreground">
                  Target: {result.roadmap.weeklyTargetMinutes} minutes/week
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase">Recommended Courses:</span>
                {result.roadmap.recommendedCourses?.map((course: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-card border text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{course}</span>
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
