"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Volume2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle,
  AlertTriangle,
  Flame,
  Award,
} from "lucide-react";
import { MOCK_PRONUNCIATION_DRILLS } from "@/lib/mock-data";
import { getScoreColor } from "@/lib/utils";

interface WordScore {
  word: string;
  accuracyScore: number;
  errorType: "None" | "Mispronunciation" | "Omission" | "Insertion";
  phonemes: { phoneme: string; accuracyScore: number }[];
}

interface AssessmentData {
  overallScore: number;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  words: WordScore[];
  aiFeedback: string;
  nativeSuggestions: string[];
}

export default function PronunciationCoach() {
  const [drillIndex, setDrillIndex] = useState(0);
  const currentDrill = MOCK_PRONUNCIATION_DRILLS[drillIndex];

  const [isRecording, setIsRecording] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordScore | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [xpGained, setXpGained] = useState<number | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Play target reference audio via SpeechSynthesis
  const playNativeSample = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      setAssessment(null);
      setSelectedWord(null);
      setXpGained(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        await submitRecording(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access denied or not available, generating demo assessment:", err);
      // If user has no mic connected or in headless preview, simulate recording flow smoothly
      setIsRecording(true);
      setTimeout(async () => {
        setIsRecording(false);
        await submitRecording(null);
      }, 2500);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const submitRecording = async (blob: Blob | null) => {
    setIsAssessing(true);
    try {
      const formData = new FormData();
      if (blob) {
        formData.append("audio", blob, "user-recording.wav");
      }
      formData.append("referenceText", currentDrill.sentence);
      formData.append("targetIpa", currentDrill.ipa);
      formData.append("userId", "demo-user");

      const response = await fetch("/api/speech/assess", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.assessment) {
        setAssessment(data.assessment);
        setXpGained(data.xpEarned || 20);
        if (data.assessment.words?.length > 0) {
          setSelectedWord(data.assessment.words[0]);
        }
      }
    } catch (err) {
      console.error("Assessment error:", err);
    } finally {
      setIsAssessing(false);
    }
  };

  const nextSentence = () => {
    setDrillIndex((prev) => (prev + 1) % MOCK_PRONUNCIATION_DRILLS.length);
    setAssessment(null);
    setSelectedWord(null);
    setRecordedAudioUrl(null);
    setXpGained(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exercise Card */}
      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
              {currentDrill.level} Pronunciation Drill
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Sentence {drillIndex + 1} of {MOCK_PRONUNCIATION_DRILLS.length}
            </span>
          </div>

          <button
            onClick={nextSentence}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border bg-secondary/50"
          >
            <span>Next Drill</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Target Sentence Display */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
              {currentDrill.sentence}
            </h2>
            <button
              onClick={() => playNativeSample(currentDrill.sentence)}
              className="flex-shrink-0 h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
              title="Listen to native speaker"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm font-mono text-muted-foreground/80">{currentDrill.ipa}</p>
          <p className="text-sm text-muted-foreground italic">"{currentDrill.meaning}"</p>
        </div>

        {/* Phonetics Tip Box */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold">Coach Pro Tip: </span>
            <span>{currentDrill.tips}</span>
          </div>
        </div>

        {/* Recording Visualizer and Action Bar */}
        <div className="mt-8 flex flex-col items-center justify-center py-6 border-t border-border">
          {isRecording ? (
            <div className="flex flex-col items-center gap-4">
              {/* Sound waves animation */}
              <div className="flex items-center gap-1.5 h-12">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bar) => (
                  <div
                    key={bar}
                    className="w-1.5 bg-rose-500 rounded-full wave-bar"
                    style={{
                      height: `${20 + (bar % 3) * 15}px`,
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-rose-500 animate-pulse">
                Listening to your pronunciation... Speak now!
              </p>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition-all hover:scale-105"
              >
                <Square className="h-4 w-4 fill-white" />
                <span>Finish Recording</span>
              </button>
            </div>
          ) : isAssessing ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-sm font-bold text-foreground">
                Azure AI analyzing phonemes & prosody...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={startRecording}
                className="relative group flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                <div className="absolute inset-0 rounded-3xl bg-blue-500 opacity-20 group-hover:animate-ping" />
                <Mic className="h-8 w-8" />
              </button>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Tap microphone to practice
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Report & Phoneme Heatmap */}
      {assessment && (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">Speech Diagnostics</h3>
                {xpGained && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-extrabold text-xs">
                    <Sparkles className="h-3.5 w-3.5" /> +{xpGained} XP
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Azure Cognitive Pronunciation & Phoneme Assessment
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-muted-foreground uppercase block">
                  Overall Score
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {getScoreColor(assessment.overallScore).label}
                </span>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white text-2xl font-black shadow-md shadow-emerald-500/20">
                {assessment.overallScore}%
              </div>
            </div>
          </div>

          {/* Sub-Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Accuracy", score: assessment.accuracyScore },
              { label: "Fluency", score: assessment.fluencyScore },
              { label: "Completeness", score: assessment.completenessScore },
              { label: "Prosody / Rhythm", score: assessment.prosodyScore },
            ].map((metric) => (
              <div key={metric.label} className="p-3.5 rounded-2xl bg-secondary/60 border border-border/50 text-center">
                <span className="text-xs text-muted-foreground font-semibold block mb-1">
                  {metric.label}
                </span>
                <span className="text-lg font-black text-foreground">{metric.score}%</span>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Word Heatmap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">
                Word-by-Word Heatmap (Click word for phoneme breakdown):
              </h4>
              <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> ≥85% (Accurate)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> 60-84% (Fair)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> &lt;60% (Review)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-secondary/30 border border-dashed">
              {assessment.words.map((w, idx) => {
                const color = getScoreColor(w.accuracyScore);
                const isSelected = selectedWord?.word === w.word;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedWord(w)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold border transition-all ${
                      color.bg
                    } ${color.text} ${color.border} ${
                      isSelected ? "ring-2 ring-primary scale-105 shadow-sm" : "hover:scale-102"
                    }`}
                  >
                    <span>{w.word}</span>
                    <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                      {w.accuracyScore}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phoneme Diagnostics Panel for Selected Word */}
          {selectedWord && (
            <div className="p-4 rounded-2xl bg-secondary/60 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Phoneme Breakdown for: <span className="text-primary font-mono">"{selectedWord.word}"</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  Status: {selectedWord.errorType}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedWord.phonemes.map((ph, pIdx) => {
                  const pColor = getScoreColor(ph.accuracyScore);
                  return (
                    <div
                      key={pIdx}
                      className={`flex flex-col items-center px-3 py-1.5 rounded-xl border ${pColor.bg} ${pColor.border}`}
                    >
                      <span className={`text-sm font-mono font-black ${pColor.text}`}>
                        /{ph.phoneme}/
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {ph.accuracyScore}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Feedback & Native Expressions */}
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="h-4 w-4" />
              <span>VoxAI Feedback & Recommendation</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{assessment.aiFeedback}</p>
            {assessment.nativeSuggestions?.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                {assessment.nativeSuggestions.map((sug, sIdx) => (
                  <li key={sIdx}>{sug}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
