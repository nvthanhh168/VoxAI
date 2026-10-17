import Link from "next/link";
import { CheckCircle2, Lock, Play, Star, Sparkles, Award } from "lucide-react";

const ROADMAP_STEPS = [
  { id: 1, title: "Foundations of Vowel Length & Schwa /ə/", status: "COMPLETED", score: 94, xp: 120 },
  { id: 2, title: "Consonant Clusters & Word Endings (/θ/, /ð/, /d/)", status: "COMPLETED", score: 89, xp: 150 },
  { id: 3, title: "Connected Speech: Linking Consonants to Vowels", status: "ACTIVE", score: 0, xp: 200 },
  { id: 4, title: "Sentence Stress & Natural Content Word Rhythm", status: "LOCKED", score: 0, xp: 220 },
  { id: 5, title: "Intonation Patterns in Professional Discussions", status: "LOCKED", score: 0, xp: 250 },
  { id: 6, title: "IELTS Speaking Part 2 Long Turn Masterclass", status: "LOCKED", score: 0, xp: 300 },
];

export default function LearningPathPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Your Personalized Learning Roadmap</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Adaptive curriculum dynamically calibrated to bridge your current CEFR B2 level to C1 Fluency.
        </p>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-6 pl-8 space-y-8">
        {ROADMAP_STEPS.map((step) => {
          const isDone = step.status === "COMPLETED";
          const isActive = step.status === "ACTIVE";

          return (
            <div key={step.id} className="relative group">
              {/* Step indicator node on timeline */}
              <div
                className={`absolute -left-[45px] top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                    ? "bg-primary border-primary text-white animate-pulse"
                    : "bg-secondary border-border text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isActive ? (
                  <Play className="h-3.5 w-3.5 fill-white" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-5 rounded-3xl border transition-all ${
                  isActive
                    ? "bg-card border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                    : isDone
                    ? "bg-card/70 border-border"
                    : "bg-card/40 border-dashed border-border opacity-70"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        Module 0{step.id}
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                          {step.score}% Accuracy
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-primary">
                          In Progress
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-foreground">{step.title}</h3>
                  </div>

                  {isActive ? (
                    <Link
                      href="/practice"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:scale-102 transition-all"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Start Drill</span>
                    </Link>
                  ) : isDone ? (
                    <Link
                      href="/practice"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs"
                    >
                      <span>Review</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
