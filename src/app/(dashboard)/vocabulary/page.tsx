import FlashcardSRS from "@/components/vocabulary/FlashcardSRS";

export default function VocabularyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Spaced Repetition Flashcards (SM-2)</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Supercharge your active English vocabulary with algorithmically optimized review intervals and pronunciation guides.
        </p>
      </div>

      <FlashcardSRS />
    </div>
  );
}
