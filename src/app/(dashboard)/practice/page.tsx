import PronunciationCoach from "@/components/pronunciation/PronunciationCoach";

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">AI Pronunciation Assessment</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Speak the target sentence into your microphone to receive instant phoneme accuracy diagnostics, prosody analysis, and AI coaching.
        </p>
      </div>

      <PronunciationCoach />
    </div>
  );
}
