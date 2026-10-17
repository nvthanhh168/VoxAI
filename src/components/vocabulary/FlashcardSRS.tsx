"use client";

import React, { useState } from "react";
import {
  Volume2,
  Sparkles,
  RotateCw,
  Check,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface VocabCard {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  definition: string;
  translation: string;
  cefrLevel: string;
  exampleSentence: string;
  collocations: string[];
}

const SAMPLE_CARDS: VocabCard[] = [
  {
    id: "v1",
    word: "articulate",
    ipa: "/ɑːrˈtɪkjələt/",
    partOfSpeech: "adjective / verb",
    definition: "Having or showing the ability to speak fluently and coherently.",
    translation: "Có khả năng ăn nói lưu loát, diễn đạt rõ ràng gãy gọn",
    cefrLevel: "B2",
    exampleSentence: "She was praised for her articulate presentation to the board of directors.",
    collocations: ["highly articulate", "articulate an argument", "articulate vision"],
  },
  {
    id: "v2",
    word: "flabbergasted",
    ipa: "/ˈflæbərɡæstɪd/",
    partOfSpeech: "adjective",
    definition: "Extremely surprised or astonished.",
    translation: "Kinh ngạc, sửng sốt, há hốc mồm",
    cefrLevel: "C1",
    exampleSentence: "I was completely flabbergasted when they announced that we won first prize.",
    collocations: ["utterly flabbergasted", "leave someone flabbergasted"],
  },
  {
    id: "v3",
    word: "nuance",
    ipa: "/ˈnuːɑːns/",
    partOfSpeech: "noun",
    definition: "A subtle difference in or shade of meaning, expression, or sound.",
    translation: "Sắc thái tinh tế, khác biệt nhỏ nhưng quan trọng",
    cefrLevel: "B2",
    exampleSentence: "A skilled translator preserves the subtle nuances of the original text.",
    collocations: ["subtle nuance", "cultural nuances", "linguistic nuance"],
  },
  {
    id: "v4",
    word: "perseverance",
    ipa: "/ˌpɜːrsəˈvɪrəns/",
    partOfSpeech: "noun",
    definition: "Persistence in doing something despite difficulty or delay in achieving success.",
    translation: "Sự kiên trì, bền bỉ đến cùng",
    cefrLevel: "B2",
    exampleSentence: "Through sheer perseverance, she mastered fluent pronunciation in 6 months.",
    collocations: ["sheer perseverance", "reward for perseverance"],
  },
];

export default function FlashcardSRS() {
  const [cards] = useState<VocabCard[]>(SAMPLE_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [lastIntervalNotice, setLastIntervalNotice] = useState<string | null>(null);

  const currentCard = cards[currentIndex];

  const playPronunciation = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    window.speechSynthesis.speak(utt);
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
      setLastIntervalNotice(`Scheduled for review in ${days} day${days > 1 ? "s" : ""}`);
    } catch {
      setLastIntervalNotice("Scheduled for review with SM-2 algorithm");
    }

    setReviewCount((prev) => prev + 1);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setLastIntervalNotice(null);
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-black text-foreground">Spaced Repetition Deck</h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-black">
            {reviewCount} Reviewed Today
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
                CEFR {currentCard.cefrLevel}
              </span>
              <button
                onClick={(e) => playPronunciation(e, currentCard.word)}
                className="h-10 w-10 rounded-2xl bg-secondary hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-foreground"
                title="Listen to pronunciation"
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
                <RotateCw className="h-3.5 w-3.5" /> Tap card to reveal definition & examples
              </span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 h-full w-full rounded-3xl bg-secondary/80 p-8 flex flex-col justify-between backface-hidden rotate-y-180 border border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-xl font-black text-foreground">{currentCard.word}</span>
                <span className="text-xs font-bold text-muted-foreground font-mono">{currentCard.ipa}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">English Meaning</span>
                <p className="text-sm font-semibold text-foreground mt-0.5 leading-relaxed">
                  {currentCard.definition}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">Vietnamese Translation</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {currentCard.translation}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">Example in Context</span>
                <p className="text-xs italic text-muted-foreground mt-0.5">
                  "{currentCard.exampleSentence}"
                </p>
              </div>
            </div>

            {/* Collocations */}
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
          </div>
        </div>
      </div>

      {/* SM-2 Recall Grading Buttons (Visible when flipped) */}
      {isFlipped ? (
        <div className="space-y-2 animate-in fade-in duration-200">
          <p className="text-xs font-bold text-center text-muted-foreground uppercase tracking-wider">
            How well did you recall this word? (SuperMemo SM-2)
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => handleSM2Review(0)}
              className="py-3 px-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white font-extrabold text-xs sm:text-sm border border-rose-500/20 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <span>Again</span>
              <span className="text-[10px] opacity-75 font-normal">&lt; 10 min</span>
            </button>

            <button
              onClick={() => handleSM2Review(2)}
              className="py-3 px-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white font-extrabold text-xs sm:text-sm border border-amber-500/20 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <span>Hard</span>
              <span className="text-[10px] opacity-75 font-normal">1 day</span>
            </button>

            <button
              onClick={() => handleSM2Review(4)}
              className="py-3 px-2 rounded-2xl bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white font-extrabold text-xs sm:text-sm border border-blue-500/20 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <span>Good</span>
              <span className="text-[10px] opacity-75 font-normal">6 days</span>
            </button>

            <button
              onClick={() => handleSM2Review(5)}
              className="py-3 px-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white font-extrabold text-xs sm:text-sm border border-emerald-500/20 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <span>Easy</span>
              <span className="text-[10px] opacity-75 font-normal">14 days</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">
            Tap the card to check definition and choose your recall difficulty.
          </p>
        </div>
      )}

      {lastIntervalNotice && (
        <p className="text-xs font-bold text-emerald-600 text-center animate-fade-in">
          {lastIntervalNotice}
        </p>
      )}
    </div>
  );
}
