"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Lock,
  Play,
  Volume2,
  Sparkles,
  Award,
  Layers,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Headphones,
  Info,
  Check,
  ChevronRight,
} from "lucide-react";

interface RoadmapModule {
  id: number;
  title: string;
  category: string;
  cefrLevel: string;
  description: string;
  phoneticRule: string;
  sampleSentence: string;
  ipa: string;
  vietnameseMeaning: string;
  xp: number;
  status: "COMPLETED" | "ACTIVE" | "LOCKED";
  score?: number;
}

const MASTER_MODULES: RoadmapModule[] = [
  {
    id: 1,
    title: "Nguyên âm dài - ngắn & Âm lướt Schwa /ə/",
    category: "Phonetics Foundation",
    cefrLevel: "A1 - A2",
    description: "Làm chủ sự phân biệt giữa nguyên âm căng (tense) và lỏng (lax) như /iː/ vs /ɪ/, và âm Schwa /ə/ xuất hiện trong 60% tiếng Anh giao tiếp.",
    phoneticRule: "Nguyên âm dài /iː/ căng khóe môi sang hai bên (sheep), khác biệt hoàn toàn với /ɪ/ thả lỏng hàm dưới (ship). Âm Schwa /ə/ luôn không mang trọng âm.",
    sampleSentence: "Please give me a little bit of information about this project.",
    ipa: "/pliːz ɡɪv miː ə ˈlɪtəl bɪt əv ˌɪnfərˈmeɪʃən əˈbaʊt ðɪs ˈprɒdʒɛkt/",
    vietnameseMeaning: "Làm ơn cho tôi một chút thông tin về dự án này.",
    xp: 120,
    status: "COMPLETED",
    score: 95,
  },
  {
    id: 2,
    title: "Tổ hợp phụ âm & Đuôi từ hiểm hóc (-s, -es, -ed)",
    category: "Consonants & Endings",
    cefrLevel: "A2 - B1",
    description: "Khắc phục triệt để lỗi nuốt âm cuối của người Việt. Quy tắc phát âm đuôi -s (/s/, /z/, /ɪz/) và -ed (/t/, /d/, /ɪd/).",
    phoneticRule: "Đuôi -ed phát âm là /t/ sau phụ âm vô thanh (worked, stopped), là /d/ sau phụ âm hữu thanh (lived, planned), và /ɪd/ sau âm /t/, /d/ (decided, wanted).",
    sampleSentence: "She watched the movie, stopped suddenly, and discussed the changes.",
    ipa: "/ʃiː wɒtʃt ðə ˈmuːvi, stɒpt ˈsʌdənli, ænd dɪˈskʌst ðə ˈtʃeɪndʒɪz/",
    vietnameseMeaning: "Cô ấy đã xem bộ phim, bất chợt dừng lại và thảo luận về các thay đổi.",
    xp: 150,
    status: "COMPLETED",
    score: 92,
  },
  {
    id: 3,
    title: "Nối âm tự nhiên (Connected Speech & Linking Glides)",
    category: "Fluid Speech",
    cefrLevel: "B1",
    description: "Kỹ thuật nối phụ âm sang nguyên âm và chèn âm lướt /w/ hoặc /j/ giữa hai nguyên âm để nói liền mạch như người bản xứ.",
    phoneticRule: "Phụ âm cuối từ trước nối thẳng sang nguyên âm đầu từ sau: 'hold on' ➔ /hoʊl-dɒn/. Hai nguyên âm nối nhau bằng glide: 'go out' ➔ /ɡoʊ-w-aʊt/, 'see it' ➔ /siː-j-ɪt/.",
    sampleSentence: "Could you hold on for a second while I check in at the front desk?",
    ipa: "/kʊd juː hoʊld ɒn fɔːr ə ˈsɛkənd waɪl aɪ tʃɛk ɪn æt ðə frʌnt dɛsk/",
    vietnameseMeaning: "Bạn có thể giữ máy một lát trong khi tôi làm thủ tục tại quầy lễ tân không?",
    xp: 180,
    status: "ACTIVE",
    score: 88,
  },
  {
    id: 4,
    title: "Bí mật âm Mỹ chuẩn (American Flap T & Glottal Stop)",
    category: "Accent Mastery",
    cefrLevel: "B1 - B2",
    description: "Làm chủ âm T vỗ (Flap T), âm chặn thanh quản (Glottal Stop) và hiện tượng nuốt T sau âm N tạo nên chất giọng Mỹ hiện đại.",
    phoneticRule: "Khi âm /t/ đứng giữa 2 nguyên âm không nhấn trọng âm, /t/ chuyển thành Flap T /t̬/ (water ➔ 'wah-der', city ➔ 'sih-di'). Khi đứng trước âm mũi /n/, /t/ thành Glottal Stop (button ➔ /ˈbʌʔn/).",
    sampleSentence: "The international community settled in a city center near the mountain.",
    ipa: "/ði ˌɪntərˈnæʃənəl kəˈmjuːnɪti ˈsɛt̬əld ɪn ə ˈsɪt̬i ˈsɛntər nɪr ðə ˈmaʊnʔn/",
    vietnameseMeaning: "Cộng đồng quốc tế đã định cư tại trung tâm thành phố gần ngọn núi.",
    xp: 220,
    status: "LOCKED",
  },
  {
    id: 5,
    title: "Nhịp điệu câu & Dạng rút gọn của từ chức năng (Weak Forms)",
    category: "Speech Rhythm",
    cefrLevel: "B2",
    description: "Tiếng Anh là ngôn ngữ có trọng âm (Stress-timed). Chỉ nhấn các từ chứa nội dung (Content Words) và đọc lướt các từ chức năng (Function Words).",
    phoneticRule: "Từ 'can' khi nói nhanh đọc là dạng yếu /kən/, chỉ đọc mạnh /kæn/ khi ở cuối câu hoặc mang nghĩa phủ định 'can't'. Tương tự với 'for' /fər/, 'to' /tə/, 'of' /əv/.",
    sampleSentence: "I can meet you at the cafe for a cup of coffee tomorrow morning.",
    ipa: "/aɪ kən miːt juː æt ðə kəˈfeɪ fər ə kʌp əv ˈkɔːfi təˈmɔːroʊ ˈmɔːrnɪŋ/",
    vietnameseMeaning: "Tôi có thể gặp bạn ở quán cà phê để uống một tách cà phê vào sáng mai.",
    xp: 250,
    status: "LOCKED",
  },
  {
    id: 6,
    title: "Ngữ điệu nâng cao & Chuyển tải sắc thái phản biện (Intonation)",
    category: "Advanced Discourse",
    cefrLevel: "B2 - C1",
    description: "Sử dụng ngữ điệu Fall-Rise khi muốn bày tỏ sự phân vân hoặc phản biện lịch sự trong môi trường chuyên nghiệp.",
    phoneticRule: "Ngữ điệu xuống (Falling) dùng cho khẳng định và câu hỏi Wh-. Ngữ điệu lên (Rising) cho câu hỏi Yes/No. Ngữ điệu xuống-lên (Fall-Rise) dùng khi đưa ra ý kiến bất đồng lịch sự.",
    sampleSentence: "I understand your perspective, however, we must evaluate the potential downside.",
    ipa: "/aɪ ˌʌndərˈstænd jɔːr pərˈspɛktɪv, haʊˈɛvər, wiː mʌst ɪˈvæljueɪt ðə pəˈtɛnʃəl ˈdaʊnˌsaɪd/",
    vietnameseMeaning: "Tôi hiểu góc nhìn của bạn, tuy nhiên, chúng ta phải đánh giá những rủi ro tiềm ẩn.",
    xp: 280,
    status: "LOCKED",
  },
  {
    id: 7,
    title: "Kỹ thuật phản xạ & Các từ đệm tự nhiên (Discourse Markers)",
    category: "Fluency Hacks",
    cefrLevel: "B2 - C1",
    description: "Tránh các khoảng lặng 'chết' trong giao tiếp bằng các từ nối tư duy tự nhiên: 'to be perfectly honest', 'as far as I'm concerned', 'speaking of which'.",
    phoneticRule: "Học viên bản xứ liên kết các discourse marker thành một cụm âm nhạc nhịp nhàng, tạo thời gian cho não bộ lên ý tưởng mà không bị vấp.",
    sampleSentence: "To be perfectly honest, that approach might require substantial architectural refactoring.",
    ipa: "/tuː biː ˈpɜːrfɪktli ˈɒnɪst, ðæt əˈproʊtʃ maɪt rɪˈkwaɪər səbˈstænʃəl ˌɑːrkɪˈtɛktʃərəl ˌriːˈstrʌktʃərɪŋ/",
    vietnameseMeaning: "Thành thật mà nói, cách tiếp cận đó có thể đòi hỏi tái cấu trúc kiến trúc đáng kể.",
    xp: 300,
    status: "LOCKED",
  },
  {
    id: 8,
    title: "Thuyết trình Công nghệ & Đàm phán Thương vụ (Executive Pitch)",
    category: "Professional English",
    cefrLevel: "C1",
    description: "Cách sử dụng trọng âm tương phản (Contrastive Stress) để nhấn mạnh số liệu, tăng sức thuyết phục trong các cuộc họp hội đồng quản trị.",
    phoneticRule: "Nhấn mạnh có chủ đích vào trợ động từ hoặc từ đối lập: 'We DID achieve the target, NOT in three months, but in TWO.'",
    sampleSentence: "Our proprietary algorithm reduces latency by forty percent while cutting cloud expenditure.",
    ipa: "/ˈaʊər prəˈpraɪətɛri ˈælɡəˌrɪðəm rɪˈdjuːsɪz ˈleɪtənsi baɪ ˈfɔːrti pərˈsɛnt waɪl ˈkʌtɪŋ klaʊd ɪkˈspɛndɪtʃər/",
    vietnameseMeaning: "Thuật toán độc quyền của chúng tôi giảm 40% độ trễ đồng thời cắt giảm chi phí hạ tầng đám mây.",
    xp: 350,
    status: "LOCKED",
  },
  {
    id: 9,
    title: "IELTS Speaking Band 8.5+ & Cấu trúc Ngữ pháp Đa tầng",
    category: "Exam Excellence",
    cefrLevel: "C1 - C2",
    description: "Làm chủ cấu trúc câu phức kết hợp mệnh đề phân từ, đảo ngữ và vốn từ vựng học thuật cao cấp cho Part 3.",
    phoneticRule: "Ngắt nghỉ đúng nhịp ở các ranh giới cú pháp (Syntactic Boundaries) để bài nói mạch lạc và duy trì sự trôi chảy tuyệt đối.",
    sampleSentence: "Having thoroughly scrutinized the empirical data, we concluded that rapid urbanization is irreversible.",
    ipa: "/ˈhævɪŋ ˈθɜːrəli ˈskruːtɪnaɪzd ði ɪmˈpɪrɪkəl ˈdeɪtə, wiː kənˈkluːdɪd ðæt ˈræpɪd ˌɜːrbənaɪˈzeɪʃən ɪz ˌɪrɪˈvɜːrsəbəl/",
    vietnameseMeaning: "Sau khi xem xét kỹ lưỡng dữ liệu thực nghiệm, chúng tôi kết luận rằng đô thị hóa nhanh là không thể đảo ngược.",
    xp: 400,
    status: "LOCKED",
  },
  {
    id: 10,
    title: "Phong thái Lãnh đạo Điều hành (Executive Rhetoric & Charisma)",
    category: "Mastery C2",
    cefrLevel: "C2 Mastery",
    description: "Kỹ năng làm chủ âm vực (pitch range), tốc độ (pacing) và khoảng dừng kịch tính (dramatic pause) của những nhà diễn thuyết hàng đầu thế giới.",
    phoneticRule: "Hạ tông giọng ở cuối câu để khẳng định uy quyền và sự chắc chắn (Authoritative downward intonation).",
    sampleSentence: "The fundamental imperative of true leadership is empowering collective human potential.",
    ipa: "/ðə ˌfʌndəˈmɛntəl ɪmˈpɛrətɪv əv truː ˈliːdərʃɪp ɪz ɪmˈpaʊərɪŋ kəˈlɛktɪv ˈhjuːmən pəˈtɛnʃəl/",
    vietnameseMeaning: "Mệnh lệnh căn bản của người lãnh đạo đích thực là trao quyền cho tiềm năng tập thể của con người.",
    xp: 500,
    status: "LOCKED",
  },
];

const IPA_SOUNDS = [
  // Short Vowels
  { symbol: "/ɪ/", label: "Short I", example: "ship, sit, busy", desc: "Thả lỏng khóe môi, mở nhẹ hàm dưới." },
  { symbol: "/e/", label: "Short E", example: "bed, tell, check", desc: "Độ mở miệng vừa phải, lưỡi ở vị trí trung tâm." },
  { symbol: "/æ/", label: "Trap A", example: "cat, black, apple", desc: "Mở rộng hàm dưới, hạ thấp lưỡi." },
  { symbol: "/ʌ/", label: "Short U", example: "cup, run, money", desc: "Âm ngắn, thư giãn trong vòm họng." },
  { symbol: "/ʊ/", label: "Short OO", example: "book, put, look", desc: "Môi hơi tròn nhẹ, thả lỏng." },
  { symbol: "/ɒ/", label: "Short O", example: "hot, rock, stop", desc: "Hạ hàm, môi tròn mở." },
  { symbol: "/ə/", label: "Schwa", example: "about, banana, computer", desc: "Âm phổ biến nhất tiếng Anh, hoàn toàn thả lỏng." },

  // Long Vowels
  { symbol: "/iː/", label: "Long EE", example: "sheep, meet, unique", desc: "Căng khóe miệng như đang mỉm cười." },
  { symbol: "/uː/", label: "Long OO", example: "blue, food, group", desc: "Chu tròn môi ra phía trước, giữ luồng hơi căng." },
  { symbol: "/ɔː/", label: "Long OR", example: "door, call, water", desc: "Tròn môi, đưa lưỡi lùi về phía sau." },
  { symbol: "/ɜː/", label: "Long ER", example: "bird, work, learn", desc: "Âm ngân dài, đầu lưỡi hơi cong nhẹ." },
  { symbol: "/ɑː/", label: "Long AH", example: "car, father, calm", desc: "Hạ tối đa hàm dưới, âm phát ra từ cuống họng." },

  // Difficult Consonants
  { symbol: "/θ/", label: "Voiceless TH", example: "think, bath, method", desc: "Đặt đầu lưỡi giữa hai hàm răng, đẩy luồng khí nhẹ." },
  { symbol: "/ð/", label: "Voiced TH", example: "this, brother, weather", desc: "Đặt lưỡi giữa hai răng, rung dây thanh quản." },
  { symbol: "/ʃ/", label: "SH Sound", example: "she, special, motion", desc: "Chu tròn môi, luồng hơi ma sát êm dịu." },
  { symbol: "/tʃ/", label: "CH Sound", example: "chair, catch, future", desc: "Bật mạnh luồng hơi từ đầu lưỡi chạm nướu trên." },
  { symbol: "/dʒ/", label: "J Sound", example: "job, bridge, general", desc: "Âm bật hữu thanh, rung mạnh thanh quản." },
  { symbol: "/ŋ/", label: "NG Sound", example: "sing, bank, English", desc: "Cuống lưỡi nâng chạm vòm mềm, hơi thoát qua mũi." },
];

export default function LearningPathPage() {
  const [activeTab, setActiveTab] = useState<"ROADMAP" | "IPA" | "CONNECTED_SPEECH">("ROADMAP");
  const [adminOverrideUnlocked, setAdminOverrideUnlocked] = useState(false);

  const playAudio = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/15">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> Comprehensive Phonetic & Spoken English Academy
            </div>

            {/* Admin Override Switch */}
            <button
              onClick={() => setAdminOverrideUnlocked(!adminOverrideUnlocked)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                adminOverrideUnlocked
                  ? "bg-emerald-400 text-emerald-950 font-black shadow-md"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
              title="Quyền Admin: Mở khóa ngay lập tức toàn bộ 10 Modules bài học"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Override: {adminOverrideUnlocked ? "ĐÃ MỞ KHÓA 100%" : "BẬT QUYỀN ADMIN"}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Lộ Trình Đào Tạo Phát Âm & Giao Tiếp Chuẩn Bản Xứ
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium max-w-2xl">
            Giáo trình chuyên sâu 10 chuyên đề Master từ A1 đến C2 Mastery, bao gồm giải phẫu khẩu hình IPA 44 âm, cơ chế nối âm (Linking), âm Mỹ (Flap T, Glottal Stop) và nhịp điệu diễn thuyết lãnh đạo.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("ROADMAP")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "ROADMAP"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Lộ trình 10 Chuyên đề Master</span>
        </button>

        <button
          onClick={() => setActiveTab("IPA")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "IPA"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Headphones className="h-4 w-4" />
          <span>Bảng ngữ âm IPA Quốc tế (44 âm)</span>
        </button>

        <button
          onClick={() => setActiveTab("CONNECTED_SPEECH")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "CONNECTED_SPEECH"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Quy tắc Nối âm & Giảm âm (Connected Speech)</span>
        </button>
      </div>

      {/* TAB 1: 10 MODULES CURRICULUM */}
      {activeTab === "ROADMAP" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Toàn bộ 10 Chuyên đề chuẩn Khung Tham Chiếu Châu Âu (CEFR)
            </span>
            {adminOverrideUnlocked && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Chế độ Admin: Toàn quyền truy cập mọi bài
              </span>
            )}
          </div>

          <div className="space-y-4">
            {MASTER_MODULES.map((module) => {
              const isUnlocked = adminOverrideUnlocked || module.status !== "LOCKED";
              const isDone = module.status === "COMPLETED";
              const isActive = module.status === "ACTIVE";

              return (
                <div
                  key={module.id}
                  className={`rounded-3xl border p-5 sm:p-6 transition-all space-y-4 ${
                    isUnlocked
                      ? isActive
                        ? "bg-card border-primary ring-2 ring-primary/20 shadow-lg"
                        : "bg-card hover:border-primary/40 shadow-sm"
                      : "bg-secondary/30 border-dashed opacity-60"
                  }`}
                >
                  {/* Top Bar of Module */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-black text-xs">
                        Module {module.id < 10 ? `0${module.id}` : module.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-secondary text-[11px] font-bold text-muted-foreground uppercase">
                        {module.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
                        {module.cefrLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDone && module.score && (
                        <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Đã hoàn thành ({module.score}%)
                        </span>
                      )}
                      <span className="text-xs font-bold text-amber-600">+{module.xp} XP</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-foreground">{module.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{module.description}</p>
                  </div>

                  {/* Phonetic Rule Box */}
                  <div className="p-3.5 rounded-2xl bg-secondary/50 border text-xs space-y-1">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" /> Quy tắc khẩu hình & ngữ âm:
                    </span>
                    <p className="text-foreground leading-relaxed">{module.phoneticRule}</p>
                  </div>

                  {/* Sample Drill & Interactive Practice */}
                  <div className="p-3.5 rounded-2xl bg-background border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{module.sampleSentence}</span>
                        <button
                          onClick={() => playAudio(module.sampleSentence)}
                          className="text-primary hover:text-primary/80 p-1 rounded-lg"
                          title="Nghe phát âm chuẩn"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{module.ipa}</p>
                      <p className="text-[11px] text-muted-foreground italic">"{module.vietnameseMeaning}"</p>
                    </div>

                    <Link
                      href="/practice"
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        isUnlocked
                          ? "bg-primary text-white shadow-md hover:bg-primary/90 hover:scale-102"
                          : "bg-secondary text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{isDone ? "Luyện tập lại" : "Vào luyện âm ngay"}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE 44 IPA CHART */}
      {activeTab === "IPA" && (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2 border-b pb-4">
            <h2 className="text-xl font-black text-foreground">Bản Đồ Ngữ Âm IPA Quốc Tế (Interactive 44 IPA Chart)</h2>
            <p className="text-xs text-muted-foreground">
              Bấm vào bất kỳ ký hiệu ngữ âm nào dưới đây để nghe chuẩn xác cách phát âm mẫu và xem hướng dẫn định vị lưỡi, môi, vòm họng.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {IPA_SOUNDS.map((item, idx) => (
              <div
                key={idx}
                className="group p-4 rounded-2xl border bg-secondary/30 hover:bg-secondary/70 transition-all flex flex-col justify-between space-y-2 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-primary group-hover:scale-110 transition-transform">
                    {item.symbol}
                  </span>
                  <button
                    onClick={() => playAudio(item.example)}
                    className="h-8 w-8 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <span className="text-xs font-bold text-foreground block">{item.label}</span>
                  <span className="text-[11px] text-muted-foreground italic font-mono block">
                    Ví dụ: {item.example}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground border-t pt-1.5 leading-relaxed">
                  💡 {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONNECTED SPEECH RULES */}
      {activeTab === "CONNECTED_SPEECH" && (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2 border-b pb-4">
            <h2 className="text-xl font-black text-foreground">
              Các Quy Tắc Nối Âm & Biến Âm (Connected Speech Secrets)
            </h2>
            <p className="text-xs text-muted-foreground">
              Người bản xứ không bao giờ phát âm từng từ rời rạc. Dưới đây là 5 quy luật cốt lõi tạo nên sự mượt mà và nhịp điệu tự nhiên.
            </p>
          </div>

          <div className="space-y-4">
            {/* Rule 1 */}
            <div className="p-4 rounded-2xl bg-secondary/40 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary uppercase">
                  1. Nối Phụ Âm sang Nguyên Âm (Consonant to Vowel Linking)
                </span>
                <button
                  onClick={() => playAudio("Hold on, take it easy, check in.")}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe ví dụ
                </button>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Khi một từ kết thúc bằng một phụ âm và từ tiếp theo bắt đầu bằng một nguyên âm, phụ âm đó sẽ chuyển sang làm phụ âm đầu của từ tiếp theo.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-card border">hold on ➔ /hoʊl-dɒn/</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border">take it easy ➔ /teɪ-kɪ-tiːzi/</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border">check in ➔ /tʃɛ-kɪn/</span>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="p-4 rounded-2xl bg-secondary/40 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary uppercase">
                  2. Chèn Âm Lướt /w/ và /j/ Giữa Hai Nguyên Âm (Intrusive Glides)
                </span>
                <button
                  onClick={() => playAudio("Go out, see it, do it.")}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe ví dụ
                </button>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Để tránh khoảng ngắt khó chịu giữa 2 nguyên âm liền kề: Sau âm tròn môi (/uː/, /oʊ/) chèn âm nhẹ /w/; sau âm căng môi (/iː/, /eɪ/, /aɪ/) chèn âm nhẹ /j/.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-card border">go out ➔ /ɡoʊ-w-aʊt/</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border">see it ➔ /siː-j-ɪt/</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border">do it ➔ /duː-w-ɪt/</span>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="p-4 rounded-2xl bg-secondary/40 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary uppercase">
                  3. Âm Vỗ Flap T trong Tiếng Anh - Mỹ
                </span>
                <button
                  onClick={() => playAudio("Water, better, computer, city.")}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe ví dụ
                </button>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Trong giọng Mỹ, khi âm /t/ hoặc /d/ đứng giữa 2 nguyên âm (và không mang trọng âm), đầu lưỡi chỉ vỗ nhẹ một lần vào nướu răng trên tạo thành âm Flap T giống âm /d/ nhẹ hoặc âm 'đ' tiếng Việt.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-card border">water ➔ /ˈwɑːt̬ər/ ("wah-der")</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border">better ➔ /ˈbɛt̬ər/ ("beh-der")</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border">city ➔ /ˈsɪt̬i/ ("sih-di")</span>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="p-4 rounded-2xl bg-secondary/40 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary uppercase">
                  4. Âm Chặn Thanh Quản Glottal Stop /ʔ/
                </span>
                <button
                  onClick={() => playAudio("Button, curtain, mountain, important.")}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Nghe ví dụ
                </button>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Khi âm /t/ đứng trước âm mũi /n/, người bản xứ không bật hơi /t/ mà đóng chặt thanh quản giữ hơi lại rồi chuyển thẳng sang âm mũi /n/.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-card border">button ➔ /ˈbʌʔn/</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border">mountain ➔ /ˈmaʊnʔn/</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border">important ➔ /ɪmˈpɔːrʔnt/</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
