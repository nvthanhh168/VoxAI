"use client";

import React, { useState, useRef } from "react";
import {
  Newspaper,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Layers,
  Search,
  BookmarkCheck,
  X,
  Gauge,
  Loader2,
} from "lucide-react";
import { TECH_ARTICLES, TECH_DICTIONARY, NewsArticle, WordDefinition } from "@/lib/news-data";
import { speakNaturalEnglish } from "@/lib/speech-voice";

export default function TechNewsReader() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle>(TECH_ARTICLES[0]);
  const [isPlayingFullArticle, setIsPlayingFullArticle] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState<number>(0.92);
  const [selectedWordData, setSelectedWordData] = useState<WordDefinition | null>(null);
  const [isLoadingWord, setIsLoadingWord] = useState(false);
  const [savedToSRS, setSavedToSRS] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Play pronunciation for an individual word using natural neural native voice
  const speakWord = (word: string) => {
    speakNaturalEnglish(word, { rate: 0.88, pitch: 1.02 });
  };

  // Full article narration with expressive natural voice
  const togglePlayArticle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingFullArticle) {
      window.speechSynthesis.cancel();
      setIsPlayingFullArticle(false);
      return;
    }

    const fullText = `${selectedArticle.title}. ${selectedArticle.paragraphs.join(" ")}`;
    speakNaturalEnglish(fullText, {
      rate: readingSpeed,
      pitch: 1.0,
      onEnd: () => setIsPlayingFullArticle(false),
      onError: () => setIsPlayingFullArticle(false),
    });
    setIsPlayingFullArticle(true);
  };

  // Click on any word in the article: instant lookup & translation
  const handleWordClick = async (rawWord: string) => {
    // Clean punctuation
    const clean = rawWord.toLowerCase().replace(/[^a-z0-9'-]/g, "").trim();
    if (!clean || clean.length < 2) return;

    // Check fast local dictionary first
    if (TECH_DICTIONARY[clean]) {
      setSelectedWordData(TECH_DICTIONARY[clean]);
      setSavedToSRS(false);
      speakWord(clean);
      return;
    }

    // Call translation & definition lookup API for any other word
    setIsLoadingWord(true);
    setSelectedWordData({
      word: clean,
      ipa: `/${clean}/`,
      partOfSpeech: "tra từ",
      vietnameseMeaning: "Đang tra nghĩa tiếng Việt...",
      englishDefinition: "Looking up contextual definition...",
      collocations: [],
      exampleInNews: "",
    });

    try {
      speakWord(clean);
      const res = await fetch("/api/dict/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: clean }),
      });
      const data = await res.json();
      if (data?.data) {
        setSelectedWordData(data.data);
      }
    } catch {
      setSelectedWordData({
        word: clean,
        ipa: `/${clean}/`,
        partOfSpeech: "từ vựng",
        vietnameseMeaning: `Nghĩa của từ: "${clean}"`,
        englishDefinition: `Vocabulary item in the article.`,
        collocations: [`learn ${clean}`],
        exampleInNews: "",
      });
    } finally {
      setIsLoadingWord(false);
      setSavedToSRS(false);
    }
  };

  const handleSaveToSRS = async () => {
    if (!selectedWordData) return;
    try {
      await fetch("/api/vocab/srs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vocabId: "news-" + selectedWordData.word,
          rating: 4,
          userId: "demo-user",
        }),
      });
      setSavedToSRS(true);
    } catch {
      setSavedToSRS(true);
    }
  };

  const filteredArticles = TECH_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl shadow-teal-500/15">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Newspaper className="h-4 w-4" /> AI Tech News & Interactive Reader
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Đọc Báo Công Nghệ Hàng Ngày & Tra Từ Tức Thì
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium">
            Cập nhật tin tức AI, chip bán dẫn, điện toán lượng tử. Chạm vào <strong>bất kỳ từ nào</strong> để dịch ra nghĩa tiếng Việt, nghe phát âm giọng người bản xứ và lưu vào Flashcard SRS.
          </p>
        </div>
      </div>

      {/* Article Selector & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {filteredArticles.map((art) => (
            <button
              key={art.id}
              onClick={() => {
                if (isPlayingFullArticle) {
                  window.speechSynthesis.cancel();
                  setIsPlayingFullArticle(false);
                }
                setSelectedArticle(art);
                setSelectedWordData(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedArticle.id === art.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {art.category}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm chủ đề bài báo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 pl-8 pr-3 py-1.5 rounded-xl bg-secondary/50 border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
          />
        </div>
      </div>

      {/* Main Article Container */}
      <div className="rounded-3xl border bg-card p-5 sm:p-8 space-y-6 shadow-sm">
        {/* Article Meta Header */}
        <div className="space-y-3 border-b pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                {selectedArticle.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                CEFR {selectedArticle.cefrLevel}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                ⏱️ {selectedArticle.readMinutes} phút đọc
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">
              {selectedArticle.publishedDate}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
            {selectedArticle.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            {selectedArticle.subtitle}
          </p>
          <p className="text-xs font-semibold text-primary">{selectedArticle.author}</p>
        </div>

        {/* Audio Player Bar */}
        <div className="p-4 rounded-2xl bg-secondary/50 border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayArticle}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                isPlayingFullArticle
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {isPlayingFullArticle ? (
                <>
                  <Pause className="h-4 w-4 fill-white" />
                  <span>Tạm dừng đọc</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Nghe AI phát thanh viên đọc toàn bài</span>
                </>
              )}
            </button>

            {isPlayingFullArticle && (
              <span className="text-xs font-bold text-emerald-600 animate-pulse flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Đang phát audio tiếng Anh biểu cảm...
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <span>Tốc độ:</span>
            {[0.85, 1.0, 1.2].map((spd) => (
              <button
                key={spd}
                onClick={() => setReadingSpeed(spd)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  readingSpeed === spd
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary hover:text-foreground"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Tip Banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Chạm/Click vào bất kỳ từ nào:</strong> Hệ thống sẽ dịch ngay nghĩa tiếng Việt, phát âm chuẩn và cho phép lưu vào bộ Flashcard.
          </span>
        </div>

        {/* Interactive Paragraphs with Clickable Word Tokens */}
        <div className="space-y-6 text-foreground text-base sm:text-lg leading-relaxed pt-2">
          {selectedArticle.paragraphs.map((para, pIdx) => {
            const words = para.split(" ");
            return (
              <p key={pIdx} className="leading-loose">
                {words.map((w, wIdx) => {
                  const cleanKey = w.toLowerCase().replace(/[^a-z0-9'-]/g, "").trim();
                  const isKeyTechWord = Boolean(TECH_DICTIONARY[cleanKey]);
                  const isCurrentlySelected = selectedWordData?.word === cleanKey;

                  return (
                    <span
                      key={wIdx}
                      onClick={() => handleWordClick(w)}
                      className={`inline-block px-1 py-0.5 mx-0.5 rounded-lg cursor-pointer transition-all duration-150 select-none ${
                        isCurrentlySelected
                          ? "bg-primary text-primary-foreground font-black shadow-sm ring-2 ring-primary/40 scale-105"
                          : isKeyTechWord
                          ? "font-semibold text-primary underline decoration-primary/40 decoration-2 underline-offset-4 hover:bg-primary/10 hover:text-primary"
                          : "hover:bg-secondary hover:text-foreground active:bg-primary/20"
                      }`}
                      title="Chạm vào để dịch nghĩa & nghe phát âm"
                    >
                      {w}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>
      </div>

      {/* Floating Word Inspector Card / Sheet (Mobile & Desktop Friendly) */}
      {selectedWordData && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto sm:w-[420px] z-50 p-5 rounded-3xl border bg-card/95 backdrop-blur-xl shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-5 duration-200 border-primary/30 max-h-[85vh] overflow-y-auto">
          <div className="flex items-start justify-between border-b pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-foreground capitalize">
                  {selectedWordData.word}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary uppercase text-muted-foreground">
                  {selectedWordData.partOfSpeech}
                </span>
                {isLoadingWord && <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />}
              </div>
              <p className="text-xs font-mono text-muted-foreground">{selectedWordData.ipa}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => speakWord(selectedWordData.word)}
                className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                title="Nghe phát âm từ này"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedWordData(null)}
                className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-secondary flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block mb-0.5">
                Nghĩa tiếng Việt
              </span>
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                {selectedWordData.vietnameseMeaning}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Định nghĩa tiếng Anh
              </span>
              <p className="text-foreground leading-relaxed">
                {selectedWordData.englishDefinition}
              </p>
            </div>

            {selectedWordData.collocations?.length > 0 && (
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Cụm từ thường gặp (Collocations)
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedWordData.collocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-secondary text-[11px] font-semibold text-foreground border border-border"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t flex items-center justify-between gap-2">
            <button
              onClick={handleSaveToSRS}
              disabled={savedToSRS}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                savedToSRS
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
              }`}
            >
              {savedToSRS ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Đã lưu vào Flashcard</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Lưu từ vào Flashcard SRS</span>
                </>
              )}
            </button>

            <button
              onClick={() => speakWord(selectedWordData.word)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 px-2 py-2"
            >
              <Volume2 className="h-3.5 w-3.5" /> Nghe lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
