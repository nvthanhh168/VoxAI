import GrammarCoach from "@/components/grammar/GrammarCoach";

export default function GrammarCoachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">AI Grammar & Sentence Polish</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Detect grammar, tense, and preposition issues. Elevate your phrasing to native idiomatic expressions.
        </p>
      </div>

      <GrammarCoach />
    </div>
  );
}
