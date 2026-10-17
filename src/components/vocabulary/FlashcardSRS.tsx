"use client";

import React, { useState, useMemo } from "react";
import {
  Volume2,
  Sparkles,
  RotateCw,
  Check,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  PlusCircle,
  X,
  BookOpen,
  Filter,
} from "lucide-react";
import { MOCK_VOCABULARY_CARDS, VocabCard } from "@/lib/mock-data";
import { speakNaturalEnglish } from "@/lib/speech-voice";

const CATEGORIES = [
  { id: "ALL", label: "Tất cả chủ đề" },
  { id: "BUSINESS", label: "Kinh doanh (Business)" },
  { id: "TECH", label: "Công nghệ & AI (Tech)" },
  { id: "IELTS", label: "Học thuật & IELTS Band 7+" },
  { id: "DAILY", label: "Đời sống hàng ngày (Daily)" },
];

export default function FlashcardSRS() {
  const [deck, setDeck] = useState<VocabCard[]>(MOCK_VOCABULARY_CARDS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [lastIntervalNotice, setLastIntervalNotice] = useState<string | null>(null);

  // Add new card modal state
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newIpa, setNewIpa] = useState("");
  const [newPartOfSpeech, setNewPartOfSpeech] = useState("noun");
  const [newDefinition, setNewDefinition] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newLevel, setNewLevel] = useState<"A1" | "A2" | "B1" | "B2" | "C1" | "C2">("B2");
  const [newCategory, setNewCategory] = useState<"BUSINESS" | "TECH" | "IELTS" | "DAILY">("BUSINESS");
  const [newExample, setNewExample] = useState("");

  const filteredCards = useMemo(() => {
    if (selectedCategory === "ALL") return deck;
    return deck.filter((c) => c.category === selectedCategory);
  }, [deck, selectedCategory]);

  const currentCard =
    filteredCards.length > 0
      ? filteredCards[Math.min(currentIndex, filteredCards.length - 1)]
      : MOCK_VOCABULARY_CARDS[0];

  const playPronunciation = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakNaturalEnglish(text, { rate: 0.88, pitch: 1.02 });
  };

  const handleSM2Review = async (qualityRating: number) => {
    // Quality: 0 (Again), 2 (Hard), 4 (Good), 5 (Easy)
    try {
      const res = await fetch("/api/vocab/srs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vocabId: currentCard.id,
          rating: qualityRating,
          userId: "demo-user",
        }),
      });
      const data = await res.json();
      const days = data.nextIntervalDays || (qualityRating >= 4 ? 6 : 1);
      setLastIntervalNotice(`Đã lên lịch ôn tập lại sau ${days} ngày (Thuật toán SM-2)`);
    } catch {
      setLastIntervalNotice("Đã lưu tiến độ thẻ với thuật toán SuperMemo SM-2");
    }

    setReviewCount((prev) => prev + 1);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
      setLastIntervalNotice(null);
    }, 400);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;

    const created: VocabCard = {
      id: "custom-v-" + Date.now(),
      word: newWord.trim(),
      ipa: newIpa.trim() || `/${newWord.toLowerCase()}/`,
      partOfSpeech: newPartOfSpeech,
      definition: newDefinition.trim() || newTranslation.trim(),
      translation: newTranslation.trim(),
      cefrLevel: newLevel,
      category: newCategory,
      exampleSentence: newExample.trim() || `Use '${newWord}' in your daily conversations.`,
      collocations: [`learn ${newWord}`, `practice ${newWord}`],
    };

    setDeck((prev) => [created, ...prev]);
    setIsAddingCard(false);
    setNewWord("");
    setNewIpa("");
    setNewDefinition("");
    setNewTranslation("");
    setNewExample("");
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Category Pills & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddingCard(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Thêm từ mới</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-black text-foreground">Hộp thẻ Flashcard Spaced Repetition</h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
          <span>
            Thẻ {currentIndex + 1} / {filteredCards.length}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-black">
            {reviewCount} Đã ôn hôm nay
          </span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="relative h-96 w-full cursor-pointer perspective-1000 select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative h-full w-full rounded-3xl transition-transform duration-500 transform-style-3d border shadow-lg ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 h-full w-full rounded-3xl bg-card p-8 flex flex-col justify-between backface-hidden border border-border">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-extrabold text-xs">
                CEFR {currentCard.cefrLevel} • {currentCard.category}
              </span>
              <button
                onClick={(e) => playPronunciation(e, currentCard.word)}
                className="h-10 w-10 rounded-2xl bg-secondary hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-foreground"
                title="Nghe phát âm chuẩn"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                {currentCard.word}
              </h3>
              <p className="text-lg font-mono text-muted-foreground">{currentCard.ipa}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                {currentCard.partOfSpeech}
              </p>
            </div>

            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                <RotateCw className="h-3.5 w-3.5" /> Chạm vào thẻ để xem nghĩa tiếng Việt & câu ví dụ
              </span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 h-full w-full rounded-3xl bg-secondary/80 p-8 flex flex-col justify-between backface-hidden rotate-y-180 border border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-xl font-black text-foreground">{currentCard.word}</span>
                  <span className="ml-2 text-xs font-mono text-muted-foreground">{currentCard.ipa}</span>
                </div>
                <button
                  onClick={(e) => playPronunciation(e, currentCard.exampleSentence)}
                  className="h-8 w-8 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  title="Nghe câu ví dụ"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">Nghĩa tiếng Việt</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {currentCard.translation}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">Định nghĩa tiếng Anh</span>
                <p className="text-xs font-medium text-foreground mt-0.5 leading-relaxed">
                  {currentCard.definition}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">Ví dụ trong ngữ cảnh</span>
                <p className="text-xs italic text-muted-foreground mt-0.5">
                  "{currentCard.exampleSentence}"
                </p>
              </div>
            </div>

            {/* Collocations */}
            {currentCard.collocations && currentCard.collocations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {currentCard.collocations.map((col, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-card text-foreground border border-border"
                  >
                    {col}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SM-2 Recall Grading Buttons (Visible when flipped) */}
      {isFlipped ? (
        <div className="space-y-2 animate-in fade-in duration-200">
          <p className="text-xs font-bold text-center text-muted-foreground uppercase tracking-wider">
            Bạn nhớ từ này ở mức độ nào? (Thuật toán SuperMemo SM-2)
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => handleSM2Review(0)}
              className="py-3 px-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white font-extrabold text-xs sm:text-sm border border-rose-500/20 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <span>Quên (Again)</span>
              <span className="text-[10px] opacity-75 font-normal">&lt; 10 phút</span>
            </button>

            <button
              onClick={() => handleSM2Review(2)}
              className="py-3 px-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white font-extrabold text-xs sm:text-sm border border-amber-500/20 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <span>Khó (Hard)</span>
              <span className="text-[10px] opacity-75 font-normal">1 ngày</span>
            </button>

            <button
              onClick={() => handleSM2Review(4)}
              className="py-3 px-2 rounded-2xl bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white font-extrabold text-xs sm:text-sm border border-blue-500/20 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <span>Tốt (Good)</span>
              <span className="text-[10px] opacity-75 font-normal">6 ngày</span>
            </button>

            <button
              onClick={() => handleSM2Review(5)}
              className="py-3 px-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white font-extrabold text-xs sm:text-sm border border-emerald-500/20 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <span>Dễ (Easy)</span>
              <span className="text-[10px] opacity-75 font-normal">14 ngày</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">
            Chạm vào thẻ để kiểm tra nghĩa và chọn mức độ ghi nhớ của bạn.
          </p>
        </div>
      )}

      {lastIntervalNotice && (
        <p className="text-xs font-bold text-emerald-600 text-center animate-fade-in">
          {lastIntervalNotice}
        </p>
      )}

      {/* Add New Word Modal */}
      {isAddingCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-foreground">Thêm thẻ từ vựng mới</h3>
              <button
                onClick={() => setIsAddingCard(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Từ vựng tiếng Anh *
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Ví dụ: serendipity"
                  className="w-full rounded-xl bg-secondary/50 border p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Phiên âm IPA</label>
                  <input
                    type="text"
                    value={newIpa}
                    onChange={(e) => setNewIpa(e.target.value)}
                    placeholder="/ˌsɛrənˈdɪpɪti/"
                    className="w-full rounded-xl bg-secondary/50 border p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Từ loại</label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full rounded-xl bg-secondary/50 border p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="noun">noun (danh từ)</option>
                    <option value="verb">verb (động từ)</option>
                    <option value="adjective">adjective (tính từ)</option>
                    <option value="adverb">adverb (trạng từ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  placeholder="Ví dụ: Sự may mắn tình cờ, duyên may"
                  className="w-full rounded-xl bg-secondary/50 border p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Câu ví dụ tiếng Anh
                </label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="Finding this book was sheer serendipity."
                  className="w-full rounded-xl bg-secondary/50 border p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Cấp độ CEFR</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full rounded-xl bg-secondary/50 border p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Chủ đề</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl bg-secondary/50 border p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="BUSINESS">Business</option>
                    <option value="TECH">Tech</option>
                    <option value="IELTS">IELTS</option>
                    <option value="DAILY">Daily</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCard(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-muted-foreground hover:bg-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90"
                >
                  Lưu vào bộ thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
