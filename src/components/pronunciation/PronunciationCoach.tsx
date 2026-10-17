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
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
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
  spokenTextDetected?: string;
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
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);
  const [autoStopOnSilence, setAutoStopOnSilence] = useState<boolean>(true);
  const [silenceSecondsLeft, setSilenceSecondsLeft] = useState<number>(1.5);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const liveTranscriptRef = useRef<string>("");
  const hasSpokenRef = useRef<boolean>(false);
  const lastSoundTimestampRef = useRef<number>(0);
  const vadIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play target reference audio via SpeechSynthesis
  const playNativeSample = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      setAssessment(null);
      setSelectedWord(null);
      setXpGained(null);
      setLiveTranscript("");
      liveTranscriptRef.current = "";
      hasSpokenRef.current = false;
      lastSoundTimestampRef.current = Date.now();
      setRecordedAudioUrl(null);
      setAudioLevel(0);
      setIsSpeakingNow(false);
      setSilenceSecondsLeft(1.5);
      audioChunksRef.current = [];

      // 1. Initialize Web Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = "en-US";
          recognition.continuous = true;
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            let fullTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
              fullTranscript += event.results[i][0].transcript + " ";
            }
            const clean = fullTranscript.trim();
            if (clean) {
              liveTranscriptRef.current = clean;
              setLiveTranscript(clean);
              hasSpokenRef.current = true;
              lastSoundTimestampRef.current = Date.now();
            }
          };

          recognition.onerror = (e: any) => {
            console.warn("SpeechRecognition notice:", e.error);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (recErr) {
          console.warn("SpeechRecognition init exception:", recErr);
        }
      }

      // 2. Capture audio stream with MediaRecorder
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        await submitRecording(audioBlob, liveTranscriptRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };

      // 3. AudioContext VAD (Voice Activity Detection) for silence auto-stop
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        vadIntervalRef.current = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round(avg * 2.2)));

          const isVoicePresent = avg > 8; // threshold for voice
          setIsSpeakingNow(isVoicePresent);

          if (isVoicePresent) {
            hasSpokenRef.current = true;
            lastSoundTimestampRef.current = Date.now();
            setSilenceSecondsLeft(1.5);
          } else if (hasSpokenRef.current && autoStopOnSilence) {
            const silentMs = Date.now() - lastSoundTimestampRef.current;
            const remaining = Math.max(0, (1500 - silentMs) / 1000);
            setSilenceSecondsLeft(parseFloat(remaining.toFixed(1)));

            // If user has spoken, and silence lasts >= 1.5s, auto-stop!
            if (silentMs >= 1500) {
              console.log("VAD: Silence detected for 1.5s, auto-stopping recording...");
              clearInterval(vadIntervalRef.current);
              stopRecording();
            }
          }
        }, 100);
      } catch (vadErr) {
        console.warn("AudioContext VAD warning:", vadErr);
      }

      mediaRecorder.start(200);
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access failed:", err);
      alert("Vui lòng cấp quyền Microphone trên trình duyệt để ghi âm giọng nói.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
    }

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

  const submitRecording = async (blob: Blob | null, finalTranscript: string) => {
    setIsAssessing(true);
    try {
      const formData = new FormData();
      if (blob) {
        formData.append("audio", blob, "user-recording.webm");
      }
      formData.append("referenceText", currentDrill.sentence);
      formData.append("targetIpa", currentDrill.ipa);
      formData.append("spokenTranscript", finalTranscript || liveTranscriptRef.current);
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
    setLiveTranscript("");
    liveTranscriptRef.current = "";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exercise Card */}
      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
              {currentDrill.level} Pronunciation Drill
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Bài {drillIndex + 1} / {MOCK_PRONUNCIATION_DRILLS.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-Stop on silence toggle */}
            <button
              onClick={() => setAutoStopOnSilence(!autoStopOnSilence)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                autoStopOnSilence
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-secondary text-muted-foreground"
              }`}
              title="Tự động dừng ghi âm sau 1.5s im lặng"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Tự ngắt khi im lặng: {autoStopOnSilence ? "BẬT" : "TẮT"}</span>
            </button>

            <button
              onClick={nextSentence}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-xl border bg-secondary/50"
            >
              <span>Câu tiếp</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Target Sentence Display */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
              {currentDrill.sentence}
            </h2>
            <button
              onClick={() => playNativeSample(currentDrill.sentence)}
              className="flex-shrink-0 h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
              title="Nghe phát âm chuẩn của người bản xứ"
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
            <span className="font-bold">Mẹo huấn luyện viên: </span>
            <span>{currentDrill.tips}</span>
          </div>
        </div>

        {/* Recording Visualizer and Action Bar */}
        <div className="mt-8 flex flex-col items-center justify-center py-6 border-t border-border">
          {isRecording ? (
            <div className="flex flex-col items-center gap-4 w-full max-w-lg text-center">
              {/* Voice level & Sound wave visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-12 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((bar) => {
                  const barHeight = Math.max(6, Math.min(45, (audioLevel / 100) * 45 + (bar % 3) * 6));
                  return (
                    <div
                      key={bar}
                      className={`w-2 rounded-full transition-all duration-75 ${
                        isSpeakingNow ? "bg-emerald-500" : "bg-rose-500/60"
                      }`}
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>

              {/* Status banner with silence countdown */}
              <div className="p-4 w-full rounded-2xl bg-secondary/70 border border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isSpeakingNow ? "bg-emerald-500 animate-ping" : "bg-amber-500"
                      }`}
                    />
                    <span className={isSpeakingNow ? "text-emerald-600" : "text-amber-600"}>
                      {isSpeakingNow ? "Đang thu nhận giọng nói..." : "Đang chờ bạn phát âm..."}
                    </span>
                  </div>

                  {autoStopOnSilence && hasSpokenRef.current && (
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold text-[11px]">
                      ⏱️ Im lặng {silenceSecondsLeft}s nữa sẽ tự ngắt
                    </span>
                  )}
                </div>

                <div className="text-left bg-background/80 p-3 rounded-xl border border-border/60">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Văn bản nhận diện trực tiếp:
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {liveTranscript || (
                      <span className="text-muted-foreground italic font-normal">
                        Bắt đầu đọc câu tiếng Anh ở trên...
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition-all hover:scale-105"
              >
                <Square className="h-4 w-4 fill-white" />
                <span>Dừng & Nộp bài thủ công</span>
              </button>
            </div>
          ) : isAssessing ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <RefreshCw className="h-9 w-9 text-blue-500 animate-spin" />
              <p className="text-sm font-bold text-foreground">
                AI đang đối chiếu giọng nói và chấm điểm từng âm tiết...
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
                Bấm vào Micro để phát âm (Tự động nộp khi đọc xong)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Report & Student Audio Playback */}
      {assessment && (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">Kết quả đánh giá phát âm thực tế</h3>
                {xpGained && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-extrabold text-xs">
                    <Sparkles className="h-3.5 w-3.5" /> +{xpGained} XP
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Đánh giá chuẩn xác theo đúng lời bạn vừa thu âm
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-muted-foreground uppercase block">
                  Điểm tổng quát
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {getScoreColor(assessment.overallScore).label}
                </span>
              </div>
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white text-2xl font-black shadow-md ${
                  assessment.overallScore >= 80
                    ? "bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20"
                    : assessment.overallScore >= 60
                    ? "bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/20"
                    : "bg-gradient-to-tr from-rose-500 to-red-400 shadow-rose-500/20"
                }`}
              >
                {assessment.overallScore}%
              </div>
            </div>
          </div>

          {/* Student Audio Playback & Voice Comparison */}
          {recordedAudioUrl && (
            <div className="p-4 rounded-2xl bg-secondary/50 border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary fill-primary" />
                  Nghe lại bản thu âm của bạn:
                </span>
                <button
                  onClick={() => playNativeSample(currentDrill.sentence)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe giọng mẫu bản xứ
                </button>
              </div>

              <audio src={recordedAudioUrl} controls className="w-full h-10 rounded-xl" />

              <div className="text-xs text-muted-foreground pt-1 flex items-start gap-1">
                <span className="font-bold text-foreground">Hệ thống nhận diện được:</span>
                <span className="italic text-foreground font-semibold">
                  "{assessment.spokenTextDetected || "(Không nhận diện được từ nào)"}"
                </span>
              </div>
            </div>
          )}

          {/* Sub-Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Độ chính xác (Accuracy)", score: assessment.accuracyScore },
              { label: "Độ lưu loát (Fluency)", score: assessment.fluencyScore },
              { label: "Độ hoàn thiện (Completeness)", score: assessment.completenessScore },
              { label: "Ngữ điệu (Prosody)", score: assessment.prosodyScore },
            ].map((metric) => (
              <div key={metric.label} className="p-3.5 rounded-2xl bg-secondary/60 border border-border/50 text-center">
                <span className="text-xs text-muted-foreground font-semibold block mb-1">
                  {metric.label}
                </span>
                <span className="text-lg font-black text-foreground">{metric.score}%</span>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      metric.score >= 80 ? "bg-emerald-500" : metric.score >= 60 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Word Heatmap */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-foreground">
                Sơ đồ nhiệt từng từ (Bấm vào từ để xem phân tích âm tiết):
              </h4>
              <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> ≥85% (Chuẩn)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> 55-84% (Cần sửa)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Bỏ sót / Sai
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
                      {w.errorType === "Omission" ? "bỏ sót" : `${w.accuracyScore}%`}
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
                  Chi tiết âm tiết của từ: <span className="text-primary font-mono">"{selectedWord.word}"</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  Trạng thái: {selectedWord.errorType === "Omission" ? "Chưa phát âm từ này" : selectedWord.errorType === "Mispronunciation" ? "Phát âm chưa chuẩn" : "Phát âm chính xác"}
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
              <span>Nhận xét chi tiết từ VoxAI</span>
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
