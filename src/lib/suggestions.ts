import { SBL } from "@/config/sbl"
import { suggestCalorieAdjustment } from "@/lib/nutrition"
import type { Suggestion, SuggestionKind, MuscleGroup, Goal } from "@/types/domain"

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")
}

// ── Stall / deload detection ──────────────────────────────────────────

export function detectStalls(
  prs: Array<{ exerciseName: string; achievedAt: string }>,
): Suggestion[] {
  const now = Date.now()
  const suggestions: Suggestion[] = []

  for (const pr of prs) {
    const days = Math.floor((now - new Date(pr.achievedAt).getTime()) / 86_400_000)

    if (days >= SBL.deload.sessionsSinceLastPR * 7 && days < 84) {
      // ≥6 weeks stalled but < 12 weeks → deload signal
      suggestions.push({
        kind: "deload",
        message: `No new ${pr.exerciseName} PR in ${Math.floor(days / 7)} weeks. A structured deload can reset fatigue and unlock new gains.`,
      })
    } else if (days >= SBL.progressiveOverload.stallSessions * 5 && days < SBL.deload.sessionsSinceLastPR * 7) {
      // 15–42 days stalled → nudge to add load
      suggestions.push({
        kind: "add_weight",
        message: `${pr.exerciseName} e1RM has been flat for ${days} days. Consider adding 2.5 kg or squeezing an extra rep next session.`,
      })
    }
  }

  return suggestions.slice(0, 2)
}

// ── Volume analysis ───────────────────────────────────────────────────

export function detectVolumeIssues(
  weeklyVolume: Record<string, number>,
): Suggestion[] {
  const warnings: Suggestion[] = []
  const lagging: Suggestion[] = []

  for (const [muscle, lm] of Object.entries(SBL.volumeLandmarks)) {
    const sets = weeklyVolume[muscle] ?? 0

    if (sets > lm.mrv) {
      warnings.push({
        kind: "volume_warning" as SuggestionKind,
        muscle: muscle as MuscleGroup,
        message: `${cap(muscle)} is at ${sets} sets/week, above MRV of ${lm.mrv}. Scale back to avoid accumulated fatigue.`,
      })
    } else if (sets > 0 && sets < lm.mev) {
      lagging.push({
        kind: "lagging_muscle" as SuggestionKind,
        muscle: muscle as MuscleGroup,
        message: `${cap(muscle)} sits at only ${sets} sets/week (MEV ${lm.mev}). Add a direct exercise to drive growth.`,
      })
    }
  }

  // MRV violations take priority over lagging muscles
  return [...warnings.slice(0, 2), ...lagging.slice(0, 2)]
}

// ── Weight-trend calorie suggestion ──────────────────────────────────

export function computeWeightSlope(
  metrics: Array<{ logged_at: string; weight_kg: number | null }>,
): number | null {
  const pts = metrics
    .filter(m => m.weight_kg !== null)
    .map(m => ({
      x: new Date(m.logged_at).getTime() / 86_400_000,
      y: m.weight_kg as number,
    }))
    .sort((a, b) => a.x - b.x)

  if (pts.length < 3) return null

  const n = pts.length
  const sx  = pts.reduce((s, p) => s + p.x, 0)
  const sy  = pts.reduce((s, p) => s + p.y, 0)
  const sxy = pts.reduce((s, p) => s + p.x * p.y, 0)
  const sxx = pts.reduce((s, p) => s + p.x * p.x, 0)
  const denom = n * sxx - sx * sx
  if (denom === 0) return null

  return ((n * sxy - sx * sy) / denom) * 7 // kg/week
}

export function detectCalorieAdjustment(
  slopeKgPerWeek: number | null,
  goal: Goal | null,
): Suggestion | null {
  if (slopeKgPerWeek === null || !goal) return null
  const delta = suggestCalorieAdjustment(slopeKgPerWeek, goal)
  if (delta === null) return null

  const dir = delta > 0 ? "more" : "fewer"
  const trend =
    slopeKgPerWeek >= 0
      ? `+${slopeKgPerWeek.toFixed(2)} kg/wk`
      : `${slopeKgPerWeek.toFixed(2)} kg/wk`

  return {
    kind: "calorie_adjust",
    delta,
    message: `Weight trend is ${trend}. Eating ${Math.abs(delta)} kcal ${dir} per day will keep you on track for your ${goal} goal.`,
  }
}

// ── Aggregate ─────────────────────────────────────────────────────────

export function computeSuggestions({
  prs,
  weeklyVolume,
  weightMetrics,
  goal,
}: {
  prs: Array<{ exerciseName: string; achievedAt: string }>
  weeklyVolume: Record<string, number>
  weightMetrics: Array<{ logged_at: string; weight_kg: number | null }>
  goal: Goal | null
}): Suggestion[] {
  const slope = computeWeightSlope(weightMetrics)
  const calorieSuggestion = detectCalorieAdjustment(slope, goal)

  return [
    ...detectStalls(prs),
    ...detectVolumeIssues(weeklyVolume),
    ...(calorieSuggestion ? [calorieSuggestion] : []),
  ].slice(0, 5)
}
