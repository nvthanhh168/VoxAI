import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, answers, speakingScore } = await req.json();

    // Standard CEFR rubric computation
    let correctCount = 0;
    const totalQuestions = answers ? Object.keys(answers).length : 5;

    // Check answers (mock key validation)
    const answerKey: Record<string, string> = {
      q1: "b", // grammar
      q2: "c", // vocabulary
      q3: "a", // listening
      q4: "d", // discourse marker
      q5: "b", // reading comprehension
    };

    if (answers) {
      Object.entries(answers).forEach(([qId, ans]) => {
        if (answerKey[qId] === ans) correctCount++;
      });
    }

    const testScoreRatio = correctCount / (totalQuestions || 1);
    const speechScore = speakingScore || 75;
    const combinedScore = Math.round(testScoreRatio * 50 + (speechScore / 100) * 50);

    let assessedLevel = "B1";
    if (combinedScore >= 88) assessedLevel = "C1";
    else if (combinedScore >= 74) assessedLevel = "B2";
    else if (combinedScore >= 58) assessedLevel = "B1";
    else if (combinedScore >= 42) assessedLevel = "A2";
    else assessedLevel = "A1";

    const roadmap = {
      primaryFocus: assessedLevel.startsWith("A") ? "Phonetics & Daily Foundations" : "Idiomatic Nuance & Spontaneous Fluency",
      weeklyTargetMinutes: 180,
      recommendedCourses: [
        "Everyday Conversational Mastery",
        assessedLevel === "B2" || assessedLevel === "C1" ? "IELTS Speaking Band 7.5+ Blueprint" : "Foundational Spoken Rhythm",
      ],
      strengths: speechScore > 75 ? ["Clear consonant articulation", "Good pace"] : ["Accurate grammar choice in written prompts"],
      areasForImprovement: [
        "Linking sounds between consonant and vowel endings",
        "Expanding range of formal connectives in discussions",
      ],
    };

    if (userId && userId !== "guest-user") {
      try {
        await prisma.placementTest.create({
          data: {
            userId,
            overallScore: combinedScore,
            assessedLevel: assessedLevel as any,
            pronunciationScore: speechScore,
            grammarScore: Math.round(testScoreRatio * 100),
            vocabularyScore: 80,
            listeningScore: 85,
            speakingScore: speechScore,
            detailedReport: roadmap as any,
            recommendedRoadmap: roadmap as any,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            cefrLevel: assessedLevel as any,
            xp: { increment: 100 },
          },
        });
      } catch (err) {
        console.warn("DB placement test save warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      score: combinedScore,
      level: assessedLevel,
      roadmap,
    });
  } catch (error: any) {
    console.error("Placement test route error:", error);
    return NextResponse.json(
      { error: error?.message || "Placement assessment failed" },
      { status: 500 }
    );
  }
}
