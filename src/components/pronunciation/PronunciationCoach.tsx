"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Mic,
  Square,
  Volume2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  PlusCircle,
  Layers,
  Search,
  Gauge,
  BookOpen,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { MOCK_PRONUNCIATION_DRILLS, PronunciationDrill } from "@/lib/mock-data";
import { getScoreColor } from "@/lib/utils";
import { speakNaturalEnglish, playNeuralVoice, stopAllSpeech } from "@/lib/speech-voice";

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

const CATEGORIES = [
  { id: "ALL", label: "Tất cả chủ đề", icon: Layers },
  { id: "DAILY", label: "Giao tiếp hàng ngày", icon: BookOpen },
  { id: "TRAVEL", label: "Du lịch & Sân bay", icon: BookOpen },
  { id: "BUSINESS", label: "Kinh doanh & Đàm phán", icon: BookOpen },
  { id: "TECH", label: "Công nghệ & AI", icon: Sparkles },
  { id: "INTERVIEW", label: "Phỏng vấn xin việc", icon: BookOpen },
  { id: "IELTS_TOEIC", label: "IELTS & TOEIC Speaking", icon: Sparkles },
  { id: "PHONETICS", label: "Luyện âm khó & Líu lưỡi", icon: Headphones },
];

const LEVELS = ["ALL", "A1", "A2", "B1", "B2", "C1", "C2"];

export default function PronunciationCoach() {
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Custom sentence input mode
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customSentence, setCustomSentence] = useState<string>("");
  const [customDrill, setCustomDrill] = useState<PronunciationDrill | null>(null);

  // Playback speed
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);

  // Filtered drills
  const filteredDrills = useMemo(() => {
    return MOCK_PRONUNCIATION_DRILLS.filter((drill) => {
      const matchLevel = selectedLevel === "ALL" || drill.level === selectedLevel;
      const matchCat = selectedCategory === "ALL" || drill.category === selectedCategory;
      const matchSearch =
        !searchKeyword ||
        drill.sentence.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        drill.meaning.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchLevel && matchCat && matchSearch;
    });
  }, [selectedLevel, selectedCategory, searchKeyword]);

  const [drillIndex, setDrillIndex] = useState(0);

  // Active drill: either custom or from filtered list
  const currentDrill: PronunciationDrill =
    customDrill ||
    (filteredDrills.length > 0
      ? filteredDrills[Math.min(drillIndex, filteredDrills.length - 1)]
      : MOCK_PRONUNCIATION_DRILLS[0]);

  const [isRecording, setIsRecording] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordScore | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);
  const [autoStopOnSilence, setAutoStopOnSilence] = useState<boolean>(true);
  const [silenceSecondsLeft, setSilenceSecondsLeft] = useState<number>(1.5);
  const [showSentencePicker, setShowSentencePicker] = useState<boolean>(false);

  const isListeningRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const liveTranscriptRef = useRef<string>("");
  const hasSpokenRef = useRef<boolean>(false);
  const lastSoundTimestampRef = useRef<number>(0);
  const vadIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const userAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Play target reference audio via High-Definition Neural Voice
  const playNativeSample = (text: string, speedOverride?: number) => {
    playNeuralVoice(text, {
      rate: speedOverride || playbackSpeed,
      pitch: 1.02,
    });
  };

  // Play user recorded audio with 100% reliable fallback (HTML5 + Web Audio API)
  const playUserRecordedVoice = async () => {
    if (!recordedAudioUrl && !recordedAudioBlob) return;

    if (isPlayingUserAudio) {
      if (userAudioElementRef.current) {
        try {
          userAudioElementRef.current.pause();
          userAudioElementRef.current.currentTime = 0;
        } catch {}
      }
      setIsPlayingUserAudio(false);
      return;
    }

    setIsPlayingUserAudio(true);

    try {
      const audio = new Audio(recordedAudioUrl!);
      userAudioElementRef.current = audio;
      audio.volume = 1.0;

      audio.onended = () => {
        setIsPlayingUserAudio(false);
      };

      audio.onerror = async () => {
        console.warn("HTML5 audio playback error, falling back to Web Audio API...");
        await playViaWebAudio(recordedAudioBlob!);
      };

      await audio.play();
    } catch (err) {
      console.warn("Direct audio play exception, falling back to Web Audio API:", err);
      await playViaWebAudio(recordedAudioBlob!);
    }
  };

  const playViaWebAudio = async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => {
        setIsPlayingUserAudio(false);
        try {
          ctx.close();
        } catch {}
      };
      source.start(0);
    } catch (webAudioErr) {
      console.error("Web Audio API decode fallback failed:", webAudioErr);
      setIsPlayingUserAudio(false);
    }
  };

  const startRecording = async () => {
    try {
      setAssessment(null);
      setSelectedWord(null);
      setXpGained(null);
      setLiveTranscript("");
      liveTranscriptRef.current = "";
      hasSpokenRef.current = false;
      isListeningRef.current = true;
      lastSoundTimestampRef.current = Date.now();
      setRecordedAudioUrl(null);
      setAudioLevel(0);
      setIsSpeakingNow(false);
      setSilenceSecondsLeft(2.0);
      audioChunksRef.current = [];

      // 1. Initialize Web Speech Recognition with resilient keep-alive
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = "en-US";
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.maxAlternatives = 3;

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
            // Non-fatal errors like 'no-speech' should not abort recording
          };

          recognition.onend = () => {
            // Auto-restart if user is still actively recording
            if (isListeningRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (recErr) {
          console.warn("SpeechRecognition init exception:", recErr);
        }
      }

      // 2. Capture audio stream with MediaRecorder and dynamic MIME support
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = "audio/webm;codecs=opus";
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported) {
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "";
        }
      }

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualMime = mediaRecorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        setRecordedAudioBlob(audioBlob);

        // Revoke previous URL if any
        if (recordedAudioUrl) {
          try {
            URL.revokeObjectURL(recordedAudioUrl);
          } catch {}
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        await submitRecording(audioBlob, liveTranscriptRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };

      // 3. AudioContext VAD (Voice Activity Detection) with sensitive baseline
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

          const isVoicePresent = avg > 2.5; // lowered sensitive threshold for laptop/phone mics
          setIsSpeakingNow(isVoicePresent);

          if (isVoicePresent) {
            hasSpokenRef.current = true;
            lastSoundTimestampRef.current = Date.now();
            setSilenceSecondsLeft(2.0);
          } else if (hasSpokenRef.current && autoStopOnSilence) {
            const silentMs = Date.now() - lastSoundTimestampRef.current;
            const remaining = Math.max(0, (2000 - silentMs) / 1000);
            setSilenceSecondsLeft(parseFloat(remaining.toFixed(1)));

            // If user has spoken, and silence lasts >= 2.0s, auto-stop!
            if (silentMs >= 2000) {
              console.log("VAD: Natural speech pause detected for 2.0s, auto-stopping recording...");
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
    isListeningRef.current = false;
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
      try {
        mediaRecorderRef.current.requestData();
      } catch {}
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

      const rawTranscript = (finalTranscript || liveTranscriptRef.current || "").trim();
      const userDidSpeak = hasSpokenRef.current || rawTranscript.length > 0 || (blob ? blob.size > 100 : false);

      formData.append("referenceText", currentDrill.sentence);
      formData.append("targetIpa", currentDrill.ipa);
      formData.append("spokenTranscript", rawTranscript);
      formData.append("hasSpoken", String(userDidSpeak));
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

  const resetState = () => {
    setAssessment(null);
    setSelectedWord(null);
    setRecordedAudioUrl(null);
    setXpGained(null);
    setLiveTranscript("");
    liveTranscriptRef.current = "";
  };

  const nextSentence = () => {
    if (customDrill) {
      setCustomDrill(null);
    }
    if (filteredDrills.length > 0) {
      setDrillIndex((prev) => (prev + 1) % filteredDrills.length);
    }
    resetState();
  };

  const prevSentence = () => {
    if (customDrill) {
      setCustomDrill(null);
    }
    if (filteredDrills.length > 0) {
      setDrillIndex((prev) => (prev - 1 + filteredDrills.length) % filteredDrills.length);
    }
    resetState();
  };

  const selectDrill = (idx: number) => {
    setCustomDrill(null);
    setDrillIndex(idx);
    setShowSentencePicker(false);
    resetState();
  };

  const handleApplyCustomSentence = () => {
    if (!customSentence.trim()) return;
    const newDrill: PronunciationDrill = {
      id: "custom-" + Date.now(),
      sentence: customSentence.trim(),
      ipa: "/kəˈstəm ˈsɛntəns moʊd/",
      meaning: "Câu tự chọn của bạn",
      level: "B2",
      category: "DAILY",
      tips: "Luyện phát âm câu theo nhu cầu cá nhân. Chú ý ngữ điệu, nối âm và trọng âm câu.",
    };
    setCustomDrill(newDrill);
    setIsCustomMode(false);
    resetState();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Category Tabs & Filters */}
      <div className="space-y-3">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id && !customDrill;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setDrillIndex(0);
                  setCustomDrill(null);
                  resetState();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Level Filters & Search Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground mr-1">CEFR:</span>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setDrillIndex(0);
                  setCustomDrill(null);
                  resetState();
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  selectedLevel === lvl
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSentencePicker(!showSentencePicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-secondary/50 text-xs font-bold text-foreground hover:bg-secondary"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Kho câu ({filteredDrills.length})</span>
            </button>

            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isCustomMode || customDrill
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-secondary/50 hover:bg-secondary text-foreground"
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Tự nhập câu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sentence Quick Picker Modal / Dropdown */}
      {showSentencePicker && (
        <div className="p-4 rounded-3xl border bg-card shadow-lg space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Chọn câu để luyện ({filteredDrills.length} câu phù hợp)
            </span>
            <button
              onClick={() => setShowSentencePicker(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-bold"
            >
              Đóng
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {filteredDrills.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => selectDrill(idx)}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-start justify-between gap-3 ${
                  drillIndex === idx && !customDrill
                    ? "bg-primary/10 border-primary text-foreground font-bold"
                    : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-secondary font-mono text-[10px] font-bold text-primary">
                      {d.level}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">{d.category}</span>
                  </div>
                  <p className="font-semibold text-foreground text-sm leading-snug">{d.sentence}</p>
                  <p className="text-muted-foreground italic text-[11px] mt-0.5">{d.meaning}</p>
                </div>
                <ChevronRight className="h-4 w-4 mt-1 opacity-50 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sentence Input Drawer */}
      {isCustomMode && (
        <div className="p-5 rounded-3xl border bg-indigo-500/5 border-indigo-500/20 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Tự nhập bất kỳ câu tiếng Anh nào bạn muốn luyện tập
            </span>
            <button
              onClick={() => setIsCustomMode(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-bold"
            >
              Hủy
            </button>
          </div>
          <textarea
            rows={2}
            value={customSentence}
            onChange={(e) => setCustomSentence(e.target.value)}
            placeholder="Ví dụ: 'I'm thrilled to introduce our innovative product to international partners.'"
            className="w-full rounded-2xl bg-background border p-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Hệ thống sẽ đối chiếu âm tiết và chấm điểm giọng phát âm theo đúng câu bạn nhập.
            </span>
            <button
              onClick={handleApplyCustomSentence}
              disabled={!customSentence.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              Bắt đầu luyện câu này
            </button>
          </div>
        </div>
      )}

      {/* Exercise Card */}
      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
              {currentDrill.level} {customDrill ? "Custom Drill" : currentDrill.category}
            </span>
            {!customDrill && (
              <span className="text-xs text-muted-foreground font-medium">
                Câu {drillIndex + 1} / {filteredDrills.length}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Speed selector */}
            <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border text-[11px] font-bold">
              <span className="text-muted-foreground px-1">Tốc độ:</span>
              {[0.75, 0.9, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded-lg transition-all ${
                    playbackSpeed === spd
                      ? "bg-primary text-primary-foreground font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Auto-Stop on silence toggle */}
            <button
              onClick={() => setAutoStopOnSilence(!autoStopOnSilence)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                autoStopOnSilence
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-secondary text-muted-foreground"
              }`}
              title="Tự động dừng ghi âm sau 1.5s im lặng"
            >
              <Clock className="h-3 w-3" />
              <span>Tự ngắt: {autoStopOnSilence ? "BẬT" : "TẮT"}</span>
            </button>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevSentence}
                disabled={filteredDrills.length <= 1}
                className="h-8 w-8 rounded-xl border bg-secondary/50 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                title="Câu trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSentence}
                disabled={filteredDrills.length <= 1}
                className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground px-3 h-8 rounded-xl border bg-secondary/50 hover:bg-secondary"
                title="Câu tiếp theo"
              >
                <span>Tiếp</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
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
              title={`Nghe giọng đọc bản xứ chuẩn (Tốc độ ${playbackSpeed}x)`}
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
            <div className="p-4 sm:p-5 rounded-2xl bg-secondary/50 border space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-primary" />
                  Nghe lại bản thu âm của bạn:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playNativeSample(currentDrill.sentence)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Nghe giọng mẫu ({playbackSpeed}x)
                  </button>
                </div>
              </div>

              {/* Dedicated 1-Click Universal Playback Controller */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={playUserRecordedVoice}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                    isPlayingUserAudio
                      ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"
                  }`}
                >
                  {isPlayingUserAudio ? (
                    <>
                      <Square className="h-3.5 w-3.5 fill-white" />
                      <span>Đang phát lại... (Bấm để dừng)</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Phát lại giọng thu âm của bạn (1-Click)</span>
                    </>
                  )}
                </button>

                {isPlayingUserAudio && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    Đang phát audio...
                  </span>
                )}
              </div>

              <audio
                src={recordedAudioUrl}
                controls
                preload="auto"
                className="w-full h-10 rounded-xl"
                onPlay={() => setIsPlayingUserAudio(true)}
                onPause={() => setIsPlayingUserAudio(false)}
                onEnded={() => setIsPlayingUserAudio(false)}
              />

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
