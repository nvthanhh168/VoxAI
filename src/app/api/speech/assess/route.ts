import { NextRequest, NextResponse } from "next/server";
import { assessPronunciation } from "@/lib/azure-speech";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;
    const referenceText = (formData.get("referenceText") as string) || "";
    const targetIpa = (formData.get("targetIpa") as string) || undefined;
    const spokenTranscript = (formData.get("spokenTranscript") as string) || "";
    const userId = (formData.get("userId") as string) || "guest-user";
    const exerciseId = (formData.get("exerciseId") as string) || undefined;

    if (!referenceText) {
      return NextResponse.json(
        { error: "Reference text is required for pronunciation scoring." },
        { status: 400 }
      );
    }

    let audioBuffer = Buffer.alloc(0);
    if (audioFile) {
      const arrayBuffer = await audioFile.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
    }

    // Call Pronunciation Assessment Engine (Azure Speech SDK + Phoneme Analysis)
    const result = await assessPronunciation(audioBuffer, referenceText, targetIpa, spokenTranscript);

    // Save result to DB if user is registered
    if (userId && userId !== "guest-user") {
      try {
        await prisma.pronunciationResult.create({
          data: {
            userId,
            exerciseId,
            targetSentence: referenceText,
            transcribedText: referenceText,
            accuracyScore: result.accuracyScore,
            fluencyScore: result.fluencyScore,
            completenessScore: result.completenessScore,
            prosodyScore: result.prosodyScore,
            overallScore: result.overallScore,
            wordScores: result.words as any,
            aiCoachFeedback: result.aiFeedback,
            nativeAlternatives: result.nativeSuggestions as any,
          },
        });

        // Award XP and increment minutes
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: { increment: Math.max(10, Math.round(result.overallScore / 5)) },
            learningMinutesTotal: { increment: 2 },
          },
        });
      } catch (dbErr) {
        console.warn("Could not persist PronunciationResult:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      assessment: result,
      xpEarned: Math.max(10, Math.round(result.overallScore / 5)),
    });
  } catch (error: any) {
    console.error("Pronunciation assessment route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during speech assessment" },
      { status: 500 }
    );
  }
}
