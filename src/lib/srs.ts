/**
 * SuperMemo SM-2 Spaced Repetition Algorithm Implementation
 * Quality score:
 * 5 - Perfect recall with no hesitation
 * 4 - Correct response after a hesitation
 * 3 - Correct response recalled with serious difficulty
 * 2 - Incorrect response; where the correct one seemed easy to recall
 * 1 - Incorrect response; the correct one remembered
 * 0 - Complete blackout
 */

export interface SRSItem {
  repetition: number;
  intervalDays: number;
  easeFactor: number;
}

export interface SRSResult {
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: Date;
}

export function calculateSM2(
  quality: number, // 0 to 5
  item: SRSItem
): SRSResult {
  // Clamp quality between 0 and 5
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let { repetition, intervalDays, easeFactor } = item;

  if (q >= 3) {
    // Correct response
    if (repetition === 0) {
      intervalDays = 1;
    } else if (repetition === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetition += 1;
  } else {
    // Incorrect response, reset interval
    repetition = 0;
    intervalDays = 1;
  }

  // Adjust Ease Factor using SM-2 formula:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setHours(nextReviewAt.getHours() + Math.round(intervalDays * 24));

  return {
    repetition,
    intervalDays,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    nextReviewAt,
  };
}
