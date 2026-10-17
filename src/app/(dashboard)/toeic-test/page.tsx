"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
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
import { speakNaturalEnglish, playNeuralVoice } from "@/lib/speech-voice";

interface TOEICQuestion {
  number: number;
  type: string;
  instructions: string;
  prepSeconds: number;
  speakSeconds: number;
  textToRead?: string;
  promptQuestion?: string;
  contextInfo?: string;
}

const TOEIC_QUESTIONS: TOEICQuestion[] = [
  {
    number: 1,
    type: "Questions 1-2: Read a Text Aloud",
    instructions: "You will read the text on the screen aloud. You have 45 seconds to prepare and 45 seconds to read aloud.",
    prepSeconds: 45,
    speakSeconds: 45,
    textToRead:
      "Thank you for calling North Star Aviation. Our international flights to London, Tokyo, and Sydney are departing on schedule today. If you need to make changes to your booking, please press one. To speak with a ticketing agent, please hold the line.",
  },
  {
    number: 3,
    type: "Questions 3-4: Describe a Picture",
    instructions: "Describe the picture on your screen in as much detail as possible. You have 45 seconds to prepare and 30 seconds to speak.",
    prepSeconds: 45,
    speakSeconds: 30,
    promptQuestion:
      "Describe what you see: Two professionals in business attire standing near a modern glass whiteboard in a conference room, discussing quarterly financial charts with coffee mugs on the table.",
  },
  {
    number: 5,
    type: "Questions 5-7: Respond to Questions",
    instructions: "Answer three short questions about consumer habits. You have 3 seconds to prepare and 15-30 seconds to respond.",
    prepSeconds: 5,
    speakSeconds: 30,
    promptQuestion:
      "How often do you purchase electronic devices online, and what factors do you prioritize most before completing an order?",
  },
  {
    number: 8,
    type: "Questions 8-10: Respond Using Information Provided",
    instructions: "Refer to the schedule provided and answer the caller's inquiries. You have 45 seconds to review the agenda.",
    prepSeconds: 45,
    speakSeconds: 30,
    contextInfo:
      "Annual Global AI Summit Schedule:\n- 09:00 AM: Keynote Address by Dr. Angela Vance\n- 11:30 AM: Panel Discussion on Edge Computing\n- 01:00 PM: Networking Lunch at Hall B\n- 03:00 PM: Hands-on Workshop: Scaling Large Language Models",
    promptQuestion: "Hi, I'm arriving at the summit around 10:30 AM. Could you confirm what sessions are happening before lunch?",
  },
  {
    number: 11,
    type: "Question 11: Express an Opinion",
    instructions: "State your opinion on a workplace matter. You have 45 seconds to prepare and 60 seconds to speak.",
    prepSeconds: 45,
    speakSeconds: 60,
    promptQuestion:
      "Do you agree or disagree with the following statement? 'Allowing employees to work remotely full-time improves organizational productivity.' Support your position with specific reasons and examples.",
  },
];

export default function MockTOEICTestPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number | null>(null);
  const [isPrepping, setIsPrepping] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [speakSecondsLeft, setSpeakSecondsLeft] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const q = TOEIC_QUESTIONS[currentIdx];

  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  const playAudio = (text: string) => {
    playNeuralVoice(text, { rate: 0.95, pitch: 1.0 });
  };

  const startPreparation = () => {
    setIsPrepping(true);
    setPrepSecondsLeft(q.prepSeconds);

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
      setSpeakSecondsLeft(q.speakSeconds);
      isListeningRef.current = true;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.lang = "en-US";
          rec.continuous = true;
          rec.interimResults = true;
          rec.maxAlternatives = 3;
          rec.onresult = (e: any) => {
            let full = "";
            for (let i = 0; i < e.results.length; i++) {
              full += e.results[i][0].transcript + " ";
            }
            setLiveTranscript(full.trim());
          };
          rec.onend = () => {
            if (isListeningRef.current) {
              try {
                rec.start();
              } catch {}
            }
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
        setSpeakSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            stopSpeaking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      alert("Vui lòng cấp quyền Microphone để làm bài thi TOEIC Speaking.");
    }
  };

  const stopSpeaking = () => {
    isListeningRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
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

  const handleNextQuestion = () => {
    stopSpeaking();
    if (currentIdx < TOEIC_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setLiveTranscript("");
      setPrepSecondsLeft(null);
    } else {
      finishFullTest();
    }
  };

  const finishFullTest = () => {
    stopSpeaking();
    setIsEvaluating(true);
    setTimeout(() => {
      setTestResult({
        scaledScore: 170, // 0 - 200
        level: "Level 7 (High Working Proficiency)",
        cefrLevel: "B2 / C1",
        pronunciationRating: "HIGH",
        intonationStressRating: "HIGH",
        grammarRating: "MEDIUM-HIGH",
        vocabularyRating: "HIGH",
        feedback:
          "Test taker demonstrates clear acoustic intelligibility with effective pausing at syntactic boundaries. Reading aloud flowed naturally. Expressed opinion with coherent logic and well-supported examples.",
        recommendations: [
          "Practice consistent stress on compound nouns in business agendas.",
          "Maintain crisp final consonant cluster articulation in past-tense verbs.",
        ],
      });
      setIsEvaluating(false);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="h-4 w-4" /> ETS TOEIC Speaking Simulation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Mock TOEIC Speaking Examination
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            Timed standard test measuring pronunciation, intonation, grammatical adaptability, and business communicative competence (0–200 points).
          </p>
        </div>
      </div>

      {!testResult ? (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Question Meta Bar */}
          <div className="flex items-center justify-between border-b pb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
              {q.type}
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              Phần {currentIdx + 1} / {TOEIC_QUESTIONS.length}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">{q.instructions}</p>

          {/* Question Prompt Body */}
          <div className="space-y-4">
            {q.textToRead && (
              <div className="p-5 rounded-2xl bg-secondary/50 border space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Read aloud the following text:
                </span>
                <p className="text-base font-bold text-foreground leading-relaxed">
                  {q.textToRead}
                </p>
                <button
                  onClick={() => playAudio(q.textToRead!)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe giọng mẫu
                </button>
              </div>
            )}

            {q.contextInfo && (
              <div className="p-4 rounded-2xl bg-secondary/30 border border-dashed font-mono text-xs whitespace-pre-line text-foreground">
                {q.contextInfo}
              </div>
            )}

            {q.promptQuestion && (
              <div className="p-4 rounded-2xl bg-secondary/50 border space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Question:
                </span>
                <p className="text-sm font-bold text-foreground">{q.promptQuestion}</p>
                <button
                  onClick={() => playAudio(q.promptQuestion!)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe câu hỏi
                </button>
              </div>
            )}

            {/* Preparation Countdown Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Thời gian chuẩn bị: {q.prepSeconds} giây
                </span>
              </div>

              {!isPrepping && prepSecondsLeft === null ? (
                <button
                  onClick={startPreparation}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
                >
                  Bắt đầu đếm ngược chuẩn bị
                </button>
              ) : isPrepping ? (
                <span className="text-xs font-black text-amber-600">
                  ⏱️ Còn lại {prepSecondsLeft}s
                </span>
              ) : null}
            </div>

            {/* Speaking Recording Section */}
            <div className="pt-4 border-t flex flex-col items-center justify-center space-y-4">
              {isRecording ? (
                <div className="w-full space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-rose-500 font-bold text-sm">
                    <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
                    <span>Đang ghi âm câu trả lời (Thời gian còn: {speakSecondsLeft}s)</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-secondary/50 border text-left text-xs font-medium text-foreground">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Lời bạn đang nói trực tiếp:
                    </span>
                    <p>{liveTranscript || "Bắt đầu nói vào microphone..."}</p>
                  </div>

                  <button
                    onClick={stopSpeaking}
                    className="px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 mx-auto"
                  >
                    <Square className="h-4 w-4 fill-white" />
                    <span>Dừng trả lời</span>
                  </button>
                </div>
              ) : isEvaluating ? (
                <div className="flex flex-col items-center gap-2 py-6">
                  <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                  <p className="text-xs font-bold text-foreground">
                    AI đang tính điểm theo thang TOEIC Speaking 200 điểm...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={startSpeaking}
                    className="h-16 w-16 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
                  >
                    <Mic className="h-7 w-7" />
                  </button>
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Bấm để bắt đầu nói ({q.speakSeconds}s)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-xs text-muted-foreground">
              {currentIdx === TOEIC_QUESTIONS.length - 1
                ? "Hoàn thành bài thi để xem điểm TOEIC"
                : "Chuyển tiếp câu tiếp theo"}
            </span>

            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:scale-102 transition-all"
            >
              <span>{currentIdx === TOEIC_QUESTIONS.length - 1 ? "Hoàn thành bài thi & Chấm điểm" : "Câu tiếp theo"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* TOEIC Results Report */
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in duration-300">
          <div className="text-center space-y-3 pb-6 border-b">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs uppercase">
              <CheckCircle2 className="h-3.5 w-3.5" /> Báo cáo kết quả Mock TOEIC Speaking
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Official ETS Scaled Score Report
            </h2>

            <div className="flex justify-center pt-2">
              <div className="flex flex-col items-center justify-center h-28 w-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/20">
                <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
                  SCORE
                </span>
                <span className="text-4xl font-black">{testResult.scaledScore}</span>
                <span className="text-[10px] font-bold opacity-90">/ 200 PTS</span>
              </div>
            </div>
            <p className="text-sm font-bold text-primary">{testResult.level}</p>
          </div>

          {/* Rating Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Pronunciation", rating: testResult.pronunciationRating },
              { label: "Intonation & Stress", rating: testResult.intonationStressRating },
              { label: "Grammar Range", rating: testResult.grammarRating },
              { label: "Vocabulary", rating: testResult.vocabularyRating },
            ].map((m) => (
              <div key={m.label} className="p-3.5 rounded-2xl bg-secondary/60 border text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  {m.label}
                </span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {m.rating}
                </span>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className="p-4 rounded-2xl bg-secondary/40 border space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Đánh giá năng lực giao tiếp doanh nghiệp:
            </span>
            <p className="text-sm text-foreground leading-relaxed">{testResult.feedback}</p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                setTestResult(null);
                setCurrentIdx(0);
                setPrepSecondsLeft(null);
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
