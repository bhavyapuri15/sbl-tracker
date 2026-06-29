import { SBL } from "@/config/sbl"

/**
 * Epley (1985): weight × (1 + reps/30)
 * Most common formula; reasonable up to ~12 reps.
 */
export function epley(weight: number, reps: number): number {
  if (reps <= 1) return weight
  return weight * (1 + reps / 30)
}

/**
 * Brzycki (1993): weight × 36 / (37 − reps)
 * Slightly more conservative; good for lower rep ranges.
 */
export function brzycki(weight: number, reps: number): number {
  if (reps <= 1) return weight
  if (reps >= 37) return weight * 36  // avoid division by zero / overflow
  return weight * (36 / (37 - reps))
}

export function calculateE1RM(
  weight: number,
  reps: number,
  formula: "epley" | "brzycki" = SBL.e1rm.defaultFormula
): number {
  const raw = formula === "epley" ? epley(weight, reps) : brzycki(weight, reps)
  return Math.round(raw * 10) / 10
}

/** True if this set improves on the stored best e1RM. */
export function isNewPR(e1rm: number, currentBest: number | null): boolean {
  return currentBest === null || e1rm > currentBest
}

/** Flag low-confidence estimates (reps > maxReliableReps). */
export function isLowConfidence(reps: number): boolean {
  return reps > SBL.e1rm.maxReliableReps
}
