import PlacementWizard from "@/components/placement/PlacementWizard";

export default function PlacementTestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Official CEFR Placement Assessment</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Benchmark your English proficiency level from A1 to C2 with adaptive diagnostic testing and speech evaluation.
        </p>
      </div>

      <PlacementWizard />
    </div>
  );
}
