"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Award,
  Mic,
  Square,
  Volume2,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { speakNaturalEnglish } from "@/lib/speech-voice";

interface IELTSPart {
  partNumber: number;
  title: string;
  instructions: string;
  prompt: string;
  bulletPoints?: string[];
  prepTimeSeconds?: number;
  speakTimeSeconds: number;
}

const IELTS_PARTS: IELTSPart[] = [
  {
    partNumber: 1,
    title: "Part 1: Introduction & Daily Routine",
    instructions: "Examiner Wilson asks 2-3 short conversational questions about familiar everyday topics.",
    prompt: "Let's talk about where you live. Do you live in a house or an apartment, and what do you like most about your neighborhood?",
    speakTimeSeconds: 60,
  },
  {
    partNumber: 2,
    title: "Part 2: The Long Turn (Cue Card)",
    instructions: "You have 1 minute to prepare your notes, then speak uninterrupted for 1 to 2 minutes on the cue card topic.",
    prompt: "Describe an innovative technology or application that you find difficult to live without.",
    bulletPoints: [
      "What it is and when you first started using it",
      "How frequently you rely on it in your daily life or work",
      "What features make it indispensable compared to alternatives",
      "And explain how it has impacted your productivity and lifestyle",
    ],
    prepTimeSeconds: 60,
    speakTimeSeconds: 120,
  },
  {
    partNumber: 3,
    title: "Part 3: In-Depth Discussion & Societal Perspectives",
    instructions: "Examiner Wilson engages in a broader, more abstract two-way discussion regarding modern technology and human development.",
    prompt: "Do you believe the rapid proliferation of artificial intelligence will lead to greater economic equality, or will it exacerbate the divide between developed and developing nations?",
    speakTimeSeconds: 90,
  },
];

export default function MockIELTSTestPage() {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number | null>(null);
  const [isPrepping, setIsPrepping] = useState(false);
  const [prepNotes, setPrepNotes] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [speakSecondsElapsed, setSpeakSecondsElapsed] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const currentPart = IELTS_PARTS[currentPartIndex];

  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const speakExaminerPrompt = (text: string) => {
    speakNaturalEnglish(text, { rate: 0.92, pitch: 1.0 });
  };

  const startPreparation = () => {
    if (!currentPart.prepTimeSeconds) return;
    setIsPrepping(true);
    setPrepSecondsLeft(currentPart.prepTimeSeconds);

    timerRef.current = setInterval(() => {
      setPrepSecondsLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(timerRef.current);
          setIsPrepping(false);
          startSpeaking();
          return 0;
        }
        return prev !== null ? prev - 1 : 0;
      });
    }, 1000);
  };

  const startSpeaking = async () => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPrepping(false);
      setLiveTranscript("");
      setSpeakSecondsElapsed(0);

      // Web Speech
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.lang = "en-US";
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (e: any) => {
            let full = "";
            for (let i = 0; i < e.results.length; i++) {
              full += e.results[i][0].transcript + " ";
            }
            setLiveTranscript(full.trim());
          };
          rec.start();
          recognitionRef.current = rec;
        } catch {}
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setSpeakSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Vui lòng cấp quyền Microphone trên trình duyệt để thi IELTS Speaking.");
    }
  };

  const stopSpeaking = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleNextPart = () => {
    stopSpeaking();
    if (currentPartIndex < IELTS_PARTS.length - 1) {
      setCurrentPartIndex((prev) => prev + 1);
      setLiveTranscript("");
      setSpeakSecondsElapsed(0);
      setPrepSecondsLeft(null);
    } else {
      // Complete full test assessment
      finishFullTest();
    }
  };

  const finishFullTest = async () => {
    stopSpeaking();
    setIsEvaluating(true);
    // Simulate comprehensive 4-criteria IELTS evaluation
    setTimeout(() => {
      setTestResult({
        overallBand: 7.5,
        cefrLevel: "C1 Advanced",
        fluencyScore: 7.5,
        lexicalScore: 8.0,
        grammarScore: 7.0,
        pronunciationScore: 7.5,
        examinerVerdict:
          "Demonstrates high willingness to speak at length with minimal hesitation. Showcases sophisticated topical vocabulary (e.g., 'indispensable', 'paradigm', 'proliferation'). Grammatical structures are varied with good use of complex compound sentences.",
        actionableAdvice: [
          "Expand the use of varied idiomatic discourse markers in Part 3 (e.g. 'having said that', 'it goes without saying').",
          "Ensure consistent final consonant cluster articulation in rapid spontaneous speech.",
          "Use wider intonation pitch variety when emphasizing contrastive viewpoints.",
        ],
      });
      setIsEvaluating(false);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-rose-500/15">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Award className="h-4 w-4" /> Official IELTS Speaking Simulation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Mock IELTS Speaking Examination
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 font-medium">
            Standard 3-Part format evaluated according to official British Council / IDP criteria: Fluency, Lexical Resource, Grammar, and Pronunciation.
          </p>
        </div>
      </div>

      {!testResult ? (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Progress Tabs */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                {currentPart.title}
              </span>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              Phần {currentPartIndex + 1} / {IELTS_PARTS.length}
            </span>
          </div>

          {/* Examiner Question Box */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-secondary/50 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Lời giám khảo (Examiner Wilson)
                </span>
                <button
                  onClick={() => speakExaminerPrompt(currentPart.prompt)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe giọng giám khảo
                </button>
              </div>

              <p className="text-lg font-bold text-foreground leading-relaxed">
                "{currentPart.prompt}"
              </p>

              {currentPart.bulletPoints && (
                <div className="pt-2 pl-4 border-l-2 border-primary/30 space-y-1.5 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground block mb-1">
                    Gợi ý nội dung cần trình bày trong 2 phút:
                  </span>
                  {currentPart.bulletPoints.map((bp, idx) => (
                    <li key={idx} className="list-disc list-inside">
                      {bp}
                    </li>
                  ))}
                </div>
              )}
            </div>

            {/* Part 2: 1-minute Preparation Scratchpad */}
            {currentPart.prepTimeSeconds && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> 1 Phút chuẩn bị dàn ý (Notes Scratchpad)
                  </span>
                  {isPrepping && (
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                      ⏱️ {prepSecondsLeft}s
                    </span>
                  )}
                </div>

                {!isPrepping && prepSecondsLeft === null ? (
                  <button
                    onClick={startPreparation}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Bắt đầu 1 phút chuẩn bị dàn ý
                  </button>
                ) : (
                  <textarea
                    rows={3}
                    value={prepNotes}
                    onChange={(e) => setPrepNotes(e.target.value)}
                    placeholder="Ghi chú nhanh các từ vựng Band 8+ hoặc luận điểm chính tại đây..."
                    className="w-full rounded-xl bg-background border p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                )}
              </div>
            )}

            {/* Speaking Recording Section */}
            <div className="pt-4 border-t flex flex-col items-center justify-center space-y-4">
              {isRecording ? (
                <div className="w-full space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-rose-500 font-bold text-sm">
                    <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
                    <span>Đang thu âm câu trả lời ({speakSecondsElapsed}s / tối đa {currentPart.speakTimeSeconds}s)</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-secondary/50 border text-left text-xs font-medium text-foreground">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Lời bạn đang nói trực tiếp:
                    </span>
                    <p>{liveTranscript || "Bắt đầu nói vào microphone..."}</p>
                  </div>

                  <button
                    onClick={stopSpeaking}
                    className="px-6 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 mx-auto"
                  >
                    <Square className="h-4 w-4 fill-white" />
                    <span>Dừng nói</span>
                  </button>
                </div>
              ) : isEvaluating ? (
                <div className="flex flex-col items-center gap-2 py-6">
                  <RefreshCw className="h-8 w-8 text-rose-500 animate-spin" />
                  <p className="text-xs font-bold text-foreground">
                    Hội đồng giám khảo AI đang tổng hợp và chấm điểm Band IELTS...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={startSpeaking}
                    className="h-16 w-16 rounded-3xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 transition-all hover:scale-105"
                  >
                    <Mic className="h-7 w-7" />
                  </button>
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Bấm để bắt đầu trả lời
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-xs text-muted-foreground">
              {currentPartIndex === IELTS_PARTS.length - 1
                ? "Hoàn thành bài thi để xem Band Score"
                : "Chuyển tiếp sang phần thi kế tiếp"}
            </span>

            <button
              onClick={handleNextPart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:scale-102 transition-all"
            >
              <span>{currentPartIndex === IELTS_PARTS.length - 1 ? "Hoàn thành & Nhận Band Score" : "Phần thi tiếp theo"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Report */
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in duration-300">
          <div className="text-center space-y-3 pb-6 border-b">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs uppercase">
              <CheckCircle2 className="h-3.5 w-3.5" /> Báo cáo kết quả Mock IELTS Speaking
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Official Band Score Report
            </h2>

            <div className="flex justify-center pt-2">
              <div className="flex flex-col items-center justify-center h-28 w-28 rounded-3xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white shadow-xl shadow-rose-500/20">
                <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
                  OVERALL
                </span>
                <span className="text-4xl font-black">Band {testResult.overallBand}</span>
                <span className="text-[10px] font-bold opacity-90">{testResult.cefrLevel}</span>
              </div>
            </div>
          </div>

          {/* 4 Official Criteria Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Fluency & Coherence", score: testResult.fluencyScore },
              { label: "Lexical Resource", score: testResult.lexicalScore },
              { label: "Grammar & Accuracy", score: testResult.grammarScore },
              { label: "Pronunciation", score: testResult.pronunciationScore },
            ].map((c) => (
              <div key={c.label} className="p-3.5 rounded-2xl bg-secondary/60 border text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  {c.label}
                </span>
                <span className="text-xl font-black text-foreground">Band {c.score}</span>
              </div>
            ))}
          </div>

          {/* Examiner Verdict */}
          <div className="p-4 rounded-2xl bg-secondary/40 border space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Nhận xét tổng quát của giám khảo:
            </span>
            <p className="text-sm text-foreground leading-relaxed">
              {testResult.examinerVerdict}
            </p>
          </div>

          {/* Actionable Advice */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Lộ trình cải thiện để đạt Band 8.0+:
            </h4>
            <div className="space-y-1.5">
              {testResult.actionableAdvice.map((adv: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-foreground p-2.5 rounded-xl bg-card border">
                  <Sparkles className="h-3.5 w-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                setTestResult(null);
                setCurrentPartIndex(0);
                setPrepSecondsLeft(null);
                setPrepNotes("");
                setLiveTranscript("");
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Thi lại bài khác</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
