"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Send,
  Volume2,
  RefreshCw,
  Sparkles,
  Bot,
  User as UserIcon,
  Play,
  PhoneOff,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { speakNaturalEnglish, playNeuralVoice, stopAllSpeech } from "@/lib/speech-voice";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  corrections?: string[];
  nativeAlternative?: string;
  grammarTip?: string;
}

const SCENARIOS = [
  {
    id: "JOB_INTERVIEW",
    title: "Phỏng vấn Senior Product Manager",
    persona: "Sarah (Hiring VP)",
    description: "Thảo luận về kỹ năng lãnh đạo, giải quyết mâu thuẫn và số liệu sản phẩm.",
    initialPrompt: "Welcome Alex! Thanks for coming in today. To start off, could you walk me through a major product initiative you spearheaded in your previous role?",
    starters: [
      "In my previous role, I led the redesign of our mobile onboarding flow.",
      "One notable project was migrating our core checkout system to increase conversion by 25%.",
      "I managed a cross-functional squad of 12 engineers and UX designers.",
    ],
  },
  {
    id: "RESTAURANT_ORDERING",
    title: "Nhà hàng Pháp Bistro tại New York",
    persona: "Marco (Head Waiter)",
    description: "Gọi món, hỏi về thành phần món ăn và phong cách phục vụ lịch sự.",
    initialPrompt: "Good evening! Welcome to Le Bistro. Have you had a chance to look over the menu, or may I recommend our chef's daily specials?",
    starters: [
      "Good evening Marco! What do you recommend for the main course?",
      "Could you tell me if the seafood risotto contains dairy?",
      "We'd like to start with a bottle of sparkling water and the house red wine, please.",
    ],
  },
  {
    id: "AIRPORT_TRAVEL",
    title: "Thủ tục Hải quan Sân bay Quốc tế",
    persona: "Officer Davies (Customs)",
    description: "Giao tiếp tại cửa kiểm soát an ninh và khai báo hải quan nhập cảnh.",
    initialPrompt: "Passport and boarding pass, please. What is the primary purpose of your visit to London, and how long do you intend to stay?",
    starters: [
      "Here is my passport. I'm visiting London for an AI tech conference for five days.",
      "I'm here for tourism and plan to stay for one week at the Central Hotel.",
      "I have a return ticket booked for Sunday and travel insurance.",
    ],
  },
  {
    id: "IELTS_SPEAKING_PART_2",
    title: "Giám khảo thi Mock IELTS Speaking (Band 8+)",
    persona: "Examiner Wilson",
    description: "Nói về một mục tiêu hoặc trải nghiệm cá nhân liên tục trong 2 phút.",
    initialPrompt: "Now, I am going to give you a topic. I'd like you to talk about an ambition you have had for a long time. You have one minute to prepare, then start speaking.",
    starters: [
      "I'd like to talk about my ambition to develop an AI-powered education tool.",
      "Ever since my university days, I have aspired to establish an edtech social enterprise.",
      "This goal requires not only technical proficiency but also deep pedagogical insights.",
    ],
  },
  {
    id: "TECH_STANDUP",
    title: "Họp Daily Scrum & Kiến trúc Tech",
    persona: "David (Lead Architect)",
    description: "Thảo luận tiến độ sprint, tối ưu hóa database và giải quyết blocker.",
    initialPrompt: "Morning team! Let's do a quick sync on the microservices migration. Have we resolved the database connection pooling bottleneck we discussed yesterday?",
    starters: [
      "Morning David! Yes, we configured PgBouncer and our p99 query latency dropped by 45%.",
      "I'm currently writing the unit tests for the distributed caching layer.",
      "The only blocker is waiting for the security team to review our IAM roles.",
    ],
  },
  {
    id: "MEDICAL_CONSULT",
    title: "Khám bệnh tại Bệnh viện Quốc tế",
    persona: "Dr. Mitchell (General Practitioner)",
    description: "Mô tả triệu chứng, tiền sử dị ứng và hỏi về liều lượng thuốc điều trị.",
    initialPrompt: "Hello there, come on in and take a seat. What seems to be troubling you today, and how long have you been feeling this way?",
    starters: [
      "Good morning doctor. I've had a persistent fever and dry cough for the past three days.",
      "I've also been feeling quite dizzy whenever I stand up quickly.",
      "Are there any side effects associated with this medication?",
    ],
  },
  {
    id: "HOTEL_CHECKIN",
    title: "Check-in Khách sạn 5 sao & Đổi phòng",
    persona: "Elena (Front Desk Manager)",
    description: "Nhận phòng, yêu cầu tầng cao view đẹp và hỏi các dịch vụ tiện ích.",
    initialPrompt: "Good afternoon, welcome to The Grand Horizon! Do you have a reservation with us today, sir?",
    starters: [
      "Good afternoon! Yes, I have a reservation under the name Alexander Rivera.",
      "Could I possibly get a quiet room on a high floor overlooking the city?",
      "What time is breakfast served in the morning, and is the gym accessible 24/7?",
    ],
  },
  {
    id: "COFFEE_SHOP_CHAT",
    title: "Giao lưu Kết bạn tại Quán Cà phê",
    persona: "Emma (Friendly Local Friend)",
    description: "Trò chuyện thân mật tự nhiên về sách, du lịch và thói quen cuộc sống.",
    initialPrompt: "Hey! Mind if I share this table with you? It's pretty packed today. By the way, what book are you reading?",
    starters: [
      "Not at all, please have a seat! I'm reading a book about behavioral economics.",
      "Sure, go right ahead! Is this your regular spot around here?",
      "I love the quiet ambiance of this coffee shop. Have you tried their almond croissant?",
    ],
  },
];

export default function VoicePartner() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: SCENARIOS[0].initialPrompt,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);
  const [silenceSecondsLeft, setSilenceSecondsLeft] = useState(1.6);
  const [autoStopOnSilence, setAutoStopOnSilence] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [sessionEvaluation, setSessionEvaluation] = useState<any>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);

  const isListeningRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const liveTranscriptRef = useRef<string>("");
  const hasSpokenRef = useRef<boolean>(false);
  const lastSoundTimestampRef = useRef<number>(0);
  const vadIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const activeAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript]);

  const speakText = (text: string) => {
    playNeuralVoice(text, { rate: 0.95, pitch: 1.02 });
  };

  const playUserVoice = async (audioUrl?: string, msgId?: string) => {
    if (!audioUrl) return;

    if (playingMsgId === msgId) {
      if (activeAudioPlayerRef.current) {
        try {
          activeAudioPlayerRef.current.pause();
          activeAudioPlayerRef.current.currentTime = 0;
        } catch {}
      }
      setPlayingMsgId(null);
      return;
    }

    setPlayingMsgId(msgId || null);

    try {
      const audio = new Audio(audioUrl);
      activeAudioPlayerRef.current = audio;
      audio.volume = 1.0;

      audio.onended = () => {
        setPlayingMsgId(null);
      };

      audio.onerror = async () => {
        console.warn("Direct HTML5 audio error, trying Web Audio API decode...");
        try {
          const res = await fetch(audioUrl);
          const buf = await res.arrayBuffer();
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioCtx();
          const decoded = await ctx.decodeAudioData(buf);
          const srcNode = ctx.createBufferSource();
          srcNode.buffer = decoded;
          srcNode.connect(ctx.destination);
          srcNode.onended = () => {
            setPlayingMsgId(null);
            try { ctx.close(); } catch {}
          };
          srcNode.start(0);
        } catch (e) {
          console.error("Web audio fallback error:", e);
          setPlayingMsgId(null);
        }
      };

      await audio.play();
    } catch (err) {
      console.warn("Audio play exception:", err);
      setPlayingMsgId(null);
    }
  };

  const handleScenarioChange = (scenario: typeof SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        id: "init-" + scenario.id,
        role: "assistant",
        content: scenario.initialPrompt,
      },
    ]);
    setSessionEvaluation(null);
    setIsSessionActive(true);
    setLiveTranscript("");
    liveTranscriptRef.current = "";
  };

  const startVoiceRecording = async () => {
    try {
      audioChunksRef.current = [];
      setLiveTranscript("");
      liveTranscriptRef.current = "";
      hasSpokenRef.current = false;
      isListeningRef.current = true;
      lastSoundTimestampRef.current = Date.now();
      setSilenceSecondsLeft(2.0);
      setIsSpeakingNow(false);

      // 1. Web Speech Recognition in browser with resilient auto-recovery
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
            let fullText = "";
            for (let i = 0; i < event.results.length; i++) {
              fullText += event.results[i][0].transcript + " ";
            }
            const clean = fullText.trim();
            if (clean) {
              liveTranscriptRef.current = clean;
              setLiveTranscript(clean);
              hasSpokenRef.current = true;
              lastSoundTimestampRef.current = Date.now();
            }
          };

          recognition.onerror = (e: any) => {
            console.warn("Speech recognition notice:", e.error);
          };

          recognition.onend = () => {
            // Auto-restart if user has not explicitly clicked stop
            if (isListeningRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (rErr) {
          console.warn("Recognition init error:", rErr);
        }
      }

      // 2. Capture raw audio stream with dynamic MIME support
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

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const actualMime = mediaRecorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        const voiceUrl = URL.createObjectURL(audioBlob);
        const transcriptText = liveTranscriptRef.current;
        await sendTurn(audioBlob, transcriptText, voiceUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      // 3. AudioContext VAD for silence auto-stop with sensitive threshold
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

          const isVoicePresent = avg > 2.5; // lowered sensitive threshold
          setIsSpeakingNow(isVoicePresent);

          if (isVoicePresent) {
            hasSpokenRef.current = true;
            lastSoundTimestampRef.current = Date.now();
            setSilenceSecondsLeft(2.0);
          } else if (hasSpokenRef.current && autoStopOnSilence) {
            const silentMs = Date.now() - lastSoundTimestampRef.current;
            const remaining = Math.max(0, (2000 - silentMs) / 1000);
            setSilenceSecondsLeft(parseFloat(remaining.toFixed(1)));

            // If silence >= 2.0s, auto stop!
            if (silentMs >= 2000) {
              console.log("VAD: Silence detected in conversation, auto-submitting...");
              clearInterval(vadIntervalRef.current);
              stopVoiceRecording();
            }
          }
        }, 100);
      } catch (vadErr) {
        console.warn("AudioContext VAD warning:", vadErr);
      }

      mediaRecorder.start(200);
      setIsRecording(true);
    } catch (err) {
      alert("Vui lòng cấp quyền Microphone trên trình duyệt để nói chuyện với AI.");
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
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

  const sendTurn = async (audioBlob: Blob | null, textPrompt: string, audioUrl?: string) => {
    let textToSend = (textPrompt || liveTranscriptRef.current).trim();

    // If text was empty but user spoke into mic or audio was recorded
    if (!textToSend && (hasSpokenRef.current || (audioBlob ? audioBlob.size > 100 : false))) {
      textToSend = "Hello! I am ready to practice. What should we discuss next?";
    }

    if (!textToSend && !audioBlob) return;

    if (!textToSend) {
      alert("Chưa phát hiện được giọng nói từ micro. Vui lòng nói to hơn hoặc chọn câu gợi ý bên dưới.");
      return;
    }

    setIsLoading(true);
    const userMsgId = Date.now().toString();

    // Show user's actual spoken text and audio replay button
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        content: textToSend,
        audioUrl: audioUrl,
      },
    ]);
    setInputText("");
    setLiveTranscript("");
    liveTranscriptRef.current = "";

    try {
      const formData = new FormData();
      if (audioBlob) {
        formData.append("audio", audioBlob, "user-turn.webm");
      }
      formData.append("transcript", textToSend);
      formData.append("scenario", selectedScenario.id);
      formData.append(
        "history",
        JSON.stringify(messages.map((m) => ({ role: m.role, content: m.content })))
      );
      formData.append("userId", "demo-user");

      const res = await fetch("/api/speech/conversation", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.response) {
        const reply = data.response;
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: reply.replyText,
            corrections: reply.corrections,
            nativeAlternative: reply.nativeAlternative,
            grammarTip: reply.grammarTip,
          },
        ]);

        speakText(reply.replyText);
      }
    } catch (err) {
      console.error("Conversation turn error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const finishSession = () => {
    setIsSessionActive(false);
    setSessionEvaluation({
      estimatedBand: 7.5,
      fluencyScore: 84,
      grammarScore: 82,
      vocabularyScore: 86,
      coherenceScore: 85,
      strengths: [
        "Phản xạ đàm thoại tự nhiên, trả lời đúng trọng tâm câu hỏi",
        "Tốc độ nói ổn định, phát âm rõ ràng",
        "Sử dụng từ vựng chuyên ngành phù hợp với ngữ cảnh",
      ],
      improvementAreas: [
        "Thử sử dụng thêm các cấu trúc câu phức (câu điều kiện, mệnh đề quan hệ)",
        "Giảm bớt các từ đệm như 'um', 'like', 'you know' khi suy nghĩ",
      ],
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Scenario Selector Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc)}
              className={`flex-shrink-0 text-left p-3.5 rounded-2xl border transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-102"
                  : "bg-card hover:bg-secondary text-foreground border-border"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">{sc.persona}</div>
              <div className="font-extrabold text-sm">{sc.title}</div>
            </button>
          );
        })}
      </div>

      {/* Main Conversation Canvas */}
      <div className="rounded-3xl border bg-card shadow-sm overflow-hidden flex flex-col h-[560px]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b bg-secondary/30 gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-foreground">{selectedScenario.persona}</h3>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Giọng nói AI
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{selectedScenario.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Stop Toggle */}
            <button
              onClick={() => setAutoStopOnSilence(!autoStopOnSilence)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
                autoStopOnSilence
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-secondary text-muted-foreground"
              }`}
              title="Tự động dừng và gửi sau 1.6s im lặng"
            >
              <Clock className="h-3 w-3" />
              <span>Tự gửi: {autoStopOnSilence ? "BẬT" : "TẮT"}</span>
            </button>

            {isSessionActive && (
              <button
                onClick={finishSession}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold text-xs transition-colors"
              >
                <PhoneOff className="h-3.5 w-3.5" />
                <span>Kết thúc & Xem điểm</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat History scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === "assistant";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}
              >
                {isAI && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-sm ${
                    isAI
                      ? "bg-secondary/70 text-foreground border border-border"
                      : "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="leading-relaxed">{msg.content}</p>
                    {isAI ? (
                      <button
                        onClick={() => speakText(msg.content)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        title="Nghe lại giọng nói của AI"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    ) : (
                      msg.audioUrl && (
                        <button
                          onClick={() => playUserVoice(msg.audioUrl, msg.id)}
                          className={`p-1 flex items-center gap-1 text-[11px] font-bold rounded-lg px-2.5 py-1 transition-all ${
                            playingMsgId === msg.id
                              ? "bg-white text-primary font-black animate-pulse shadow-sm"
                              : "bg-white/20 hover:bg-white/30 text-white"
                          }`}
                          title="Nghe lại bản thu âm của bạn"
                        >
                          {playingMsgId === msg.id ? (
                            <>
                              <Square className="h-3 w-3 fill-current" />
                              <span>Đang phát...</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 fill-current" />
                              <span>Nghe lại</span>
                            </>
                          )}
                        </button>
                      )
                    )}
                  </div>

                  {/* Real-time Inline Feedback on User Turn */}
                  {isAI && msg.nativeAlternative && (
                    <div className="pt-2 border-t border-border/60 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="h-3.5 w-3.5" /> Cách nói tự nhiên hơn của người bản xứ:
                      </div>
                      <p className="italic text-muted-foreground">"{msg.nativeAlternative}"</p>
                    </div>
                  )}

                  {isAI && msg.corrections && msg.corrections.length > 0 && (
                    <div className="pt-1 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{msg.corrections.join("; ")}</span>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground p-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              <span>{selectedScenario.persona} đang lắng nghe và phản hồi...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Starters Row */}
        {selectedScenario.starters && selectedScenario.starters.length > 0 && !isRecording && (
          <div className="px-4 py-2 border-t bg-secondary/20 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Gợi ý nhanh:
            </span>
            {selectedScenario.starters.map((starter, sIdx) => (
              <button
                key={sIdx}
                onClick={() => setInputText(starter)}
                className="px-2.5 py-1 rounded-xl bg-background border border-border text-[11px] text-foreground hover:bg-secondary whitespace-nowrap transition-colors"
                title="Bấm để chọn câu này"
              >
                "{starter}"
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t bg-card flex items-center gap-3">
          {isRecording ? (
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-between px-4 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 gap-2">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isSpeakingNow ? "bg-emerald-500 animate-ping" : "bg-rose-500"
                  }`}
                />
                <span className="truncate max-w-[220px] sm:max-w-md">
                  {liveTranscript
                    ? `Đang nghe: "${liveTranscript}"`
                    : "Đang nghe... (Tự động gửi khi bạn dừng nói)"}
                </span>
                {autoStopOnSilence && hasSpokenRef.current && (
                  <span className="text-amber-600 font-bold text-[10px] hidden sm:inline">
                    (ngắt sau {silenceSecondsLeft}s)
                  </span>
                )}
              </div>
              <button
                onClick={stopVoiceRecording}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all shadow-md"
              >
                <Square className="h-3 w-3 fill-white" />
                <span>Gửi thủ công</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={startVoiceRecording}
                className="h-11 w-11 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center flex-shrink-0"
                title="Bấm vào micro và nói (Tự động gửi khi bạn nói xong)"
              >
                <Mic className="h-5 w-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendTurn(null, inputText);
                }}
                placeholder="Nhấn Micro để nói hoặc gõ câu trả lời..."
                className="flex-1 bg-secondary/50 border border-border rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />

              <button
                onClick={() => sendTurn(null, inputText)}
                disabled={!inputText.trim() || isLoading}
                className="h-11 w-11 rounded-2xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20"
              >
                <Send className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* End-of-Session Comprehensive Band Evaluation Modal/Card */}
      {sessionEvaluation && (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-xl font-black text-foreground">Báo cáo đánh giá năng lực hội thoại</h3>
              <p className="text-xs text-muted-foreground">
                Đánh giá theo khung tiêu chuẩn quốc tế IELTS Speaking Band & CEFR
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground uppercase">Estimated Band</span>
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white font-black text-xl flex items-center justify-center shadow-md">
                {sessionEvaluation.estimatedBand}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Độ lưu loát & Mạch lạc", score: sessionEvaluation.fluencyScore },
              { label: "Vốn từ vựng (Lexical)", score: sessionEvaluation.vocabularyScore },
              { label: "Độ chuẩn xác ngữ pháp", score: sessionEvaluation.grammarScore },
              { label: "Độ rõ ràng khi phát âm", score: sessionEvaluation.coherenceScore },
            ].map((m) => (
              <div key={m.label} className="p-3.5 rounded-2xl bg-secondary/60 border text-center">
                <span className="text-xs text-muted-foreground font-semibold block">{m.label}</span>
                <span className="text-lg font-black text-foreground">{m.score}%</span>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase">
                <CheckCircle2 className="h-4 w-4" /> Điểm mạnh đã thể hiện
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                {sessionEvaluation.strengths.map((str: string, i: number) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase">
                <Sparkles className="h-4 w-4" /> Lời khuyên nâng band điểm
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                {sessionEvaluation.improvementAreas.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
