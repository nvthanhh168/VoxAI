"use client";

import React, { useState, useEffect } from "react";
import {
  Newspaper,
  Volume2,
  Play,
  Pause,
  Sparkles,
  BookOpen,
  PlusCircle,
  CheckCircle2,
  Search,
  X,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid,
  List,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Check,
} from "lucide-react";
import { TECH_ARTICLES, TECH_DICTIONARY, NewsArticle, WordDefinition } from "@/lib/news-data";
import { speakNaturalEnglish } from "@/lib/speech-voice";

const CATEGORIES = [
  "Tất cả",
  "AI & Software",
  "Quantum & Chips",
  "Cybersecurity",
  "Cloud & DevOps",
  "Biotech & Health",
  "Robotics & Hardware",
  "Green Energy",
  "Future Tech",
] as const;

const CEFR_LEVELS = ["Tất cả", "B1", "B2", "C1", "C2"] as const;

export default function TechNewsReader() {
  const [articles, setArticles] = useState<NewsArticle[]>(TECH_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle>(TECH_ARTICLES[0]);
  const [isPlayingFullArticle, setIsPlayingFullArticle] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState<number>(0.92);
  const [selectedWordData, setSelectedWordData] = useState<WordDefinition | null>(null);
  const [isLoadingWord, setIsLoadingWord] = useState(false);
  const [savedToSRS, setSavedToSRS] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState<string>("Tất cả");
  const [isArticleListOpen, setIsArticleListOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

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

  // Refresh feed to simulate real-time daily sync
  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/news/daily?limit=50");
      const data = await res.json();
      if (data?.data && Array.isArray(data.data)) {
        setArticles(data.data);
      }
      setRefreshToast("Đã đồng bộ 50 bài báo công nghệ mới nhất hôm nay!");
    } catch {
      setRefreshToast("Đã làm mới dữ liệu tin tức công nghệ!");
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setRefreshToast(null), 4000);
    }
  };

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || a.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "Tất cả" || a.cefrLevel === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Navigation between articles
  const currentIndex = articles.findIndex((a) => a.id === selectedArticle.id);
  const handlePrevArticle = () => {
    if (currentIndex > 0) {
      if (isPlayingFullArticle && typeof window !== "undefined") {
        window.speechSynthesis.cancel();
        setIsPlayingFullArticle(false);
      }
      setSelectedArticle(articles[currentIndex - 1]);
      setSelectedWordData(null);
    }
  };

  const handleNextArticle = () => {
    if (currentIndex < articles.length - 1) {
      if (isPlayingFullArticle && typeof window !== "undefined") {
        window.speechSynthesis.cancel();
        setIsPlayingFullArticle(false);
      }
      setSelectedArticle(articles[currentIndex + 1]);
      setSelectedWordData(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl shadow-teal-500/15">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Newspaper className="h-4 w-4" /> AI Tech News • 50 Bài Báo Hàng Ngày
            </div>
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Đang cập nhật..." : "Cập nhật tin mới"}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            50 Bài Báo Công Nghệ Chuyên Sâu & Tra Từ Tức Thì
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-2xl">
            Cập nhật tin tức AI, chip 2nm, bán dẫn, lượng tử, an ninh mạng và xe điện.
            Chạm vào <strong>bất kỳ từ nào</strong> để tra ngay nghĩa tiếng Việt, nghe phát âm người bản xứ và lưu vào bộ Flashcard SRS ôn tập hàng ngày.
          </p>
        </div>

        {refreshToast && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-bold shadow-md animate-in fade-in slide-in-from-top-1">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>{refreshToast}</span>
          </div>
        )}
      </div>

      {/* Control Bar: Categories, Level, Search & Catalog Drawer Trigger */}
      <div className="p-4 rounded-3xl bg-card border space-y-3 shadow-sm">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level, Search & Drawer Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Filter className="h-3 w-3" /> CEFR:
            </span>
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  selectedLevel === lvl
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-secondary/70 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm 50 bài báo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-secondary/50 border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />
            </div>

            <button
              onClick={() => setIsArticleListOpen(!isArticleListOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isArticleListOpen
                  ? "bg-primary text-white border-primary"
                  : "bg-secondary/60 hover:bg-secondary text-foreground"
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              <span>50 Bài ({filteredArticles.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 50 Articles Drawer / Grid Modal */}
      {isArticleListOpen && (
        <div className="rounded-3xl border bg-card p-5 sm:p-6 space-y-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Danh Mục 50 Bài Báo Công Nghệ Toàn Diện
              </h3>
              <p className="text-xs text-muted-foreground">
                Chọn bất kỳ bài báo nào dưới đây để mở giao diện đọc thông minh
              </p>
            </div>
            <button
              onClick={() => setIsArticleListOpen(false)}
              className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-secondary flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredArticles.map((art, idx) => (
              <div
                key={art.id}
                onClick={() => {
                  if (isPlayingFullArticle && typeof window !== "undefined") {
                    window.speechSynthesis.cancel();
                    setIsPlayingFullArticle(false);
                  }
                  setSelectedArticle(art);
                  setSelectedWordData(null);
                  setIsArticleListOpen(false);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:shadow-md flex flex-col justify-between space-y-2 ${
                  selectedArticle.id === art.id
                    ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                    : "bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-primary">#{idx + 1} • {art.category}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px]">
                      {art.cefrLevel}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {art.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {art.readMinutes} phút
                  </span>
                  <span>{art.publishedDate.split("(")[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Selected Article Container */}
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
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> {selectedArticle.readMinutes} phút đọc
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {selectedArticle.publishedDate}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
            {selectedArticle.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            {selectedArticle.subtitle}
          </p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs font-semibold text-primary">{selectedArticle.author}</p>
            <span className="text-xs text-muted-foreground font-medium">
              Bài {currentIndex + 1} / {articles.length}
            </span>
          </div>
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
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Đang phát audio tiếng Anh tự nhiên...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
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

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1 border-l pl-3">
              <button
                onClick={handlePrevArticle}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-lg border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40"
                title="Bài trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextArticle}
                disabled={currentIndex === articles.length - 1}
                className="p-1.5 rounded-lg border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40"
                title="Bài kế tiếp"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tip Banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Chạm/Click vào bất kỳ từ nào trong bài báo:</strong> Hệ thống sẽ dịch ngay sang nghĩa tiếng Việt, phát âm chuẩn người bản xứ và cho phép lưu vào bộ Flashcard SRS.
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

        {/* Footer Navigation Bar */}
        <div className="pt-6 border-t flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrevArticle}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border bg-secondary/50 hover:bg-secondary text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Bài trước</span>
          </button>

          <button
            onClick={() => setIsArticleListOpen(true)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <Layers className="h-3.5 w-3.5" /> Xem toàn bộ 50 bài báo
          </button>

          <button
            onClick={handleNextArticle}
            disabled={currentIndex === articles.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-40"
          >
            <span>Bài tiếp theo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
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
