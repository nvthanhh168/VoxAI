import { NextRequest, NextResponse } from "next/server";
import { calculateSM2 } from "@/lib/srs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { cardId, vocabId, rating, userId } = await req.json();

    if (rating === undefined || rating < 0 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 0 and 5." }, { status: 400 });
    }

    let existingCard = null;

    if (cardId) {
      existingCard = await prisma.flashcard.findUnique({
        where: { id: cardId },
      });
    } else if (userId && vocabId) {
      existingCard = await prisma.flashcard.findUnique({
        where: { userId_vocabId: { userId, vocabId } },
      });
    }

    const currentItem = {
      repetition: existingCard?.repetition ?? 0,
      intervalDays: existingCard?.intervalDays ?? 1,
      easeFactor: existingCard?.easeFactor ?? 2.5,
    };

    const srsResult = calculateSM2(rating, currentItem);

    if (existingCard) {
      const updated = await prisma.flashcard.update({
        where: { id: existingCard.id },
        data: {
          repetition: srsResult.repetition,
          intervalDays: srsResult.intervalDays,
          easeFactor: srsResult.easeFactor,
          nextReviewAt: srsResult.nextReviewAt,
          lastReviewedAt: new Date(),
          consecutiveGood: rating >= 4 ? { increment: 1 } : 0,
        },
      });

      return NextResponse.json({
        success: true,
        flashcard: updated,
        nextIntervalDays: srsResult.intervalDays,
      });
    }

    return NextResponse.json({
      success: true,
      simulated: srsResult,
    });
  } catch (error: any) {
    console.error("SRS endpoint error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process spaced repetition review" },
      { status: 500 }
    );
  }
}
