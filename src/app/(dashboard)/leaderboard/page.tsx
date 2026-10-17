import { Trophy, Flame, Sparkles, Award } from "lucide-react";
import { MOCK_LEADERBOARD } from "@/lib/mock-data";

export default function LeaderboardPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Global Fluency Leaderboard</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Compete with learners worldwide, earn XP through pronunciation drills, and claim the Diamond League trophy.
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Rank & Learner</span>
          <span>XP & Streak</span>
        </div>

        <div className="space-y-2">
          {MOCK_LEADERBOARD.map((item) => {
            const isMe = item.name.includes("You");

            return (
              <div
                key={item.rank}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isMe
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-secondary/40 border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center font-black text-sm">
                    {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}
                  </div>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-extrabold text-sm text-foreground flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
                        {item.level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Flame className="h-4 w-4 fill-amber-500" />
                    <span>{item.streak}d</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>{item.xp} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
