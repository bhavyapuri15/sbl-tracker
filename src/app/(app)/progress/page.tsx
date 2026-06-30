import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProgressClient, type PRWithRanking } from "./ProgressClient"
import type { StrengthStandard, StrengthTier } from "@/types/domain"

export const metadata: Metadata = { title: "Progress" }

const TIER_ORDER = ["beginner", "novice", "intermediate", "advanced", "elite"] as const

function computeRanking(
  e1rm: number,
  slug: string,
  standards: StrengthStandard[],
  sex: "male" | "female",
  bwKg: number,
): { tier: StrengthTier; nextTier: StrengthTier | null; nextThreshold: number | null; pct: number } {
  const relevant = standards.filter(
    s => s.exercise_slug === slug && s.sex === sex && bwKg >= s.bw_lower_kg && bwKg < s.bw_upper_kg,
  )

  if (relevant.length === 0) return { tier: "unranked", nextTier: null, nextThreshold: null, pct: 0 }

  let currentIdx = -1
  for (let i = 0; i < TIER_ORDER.length; i++) {
    const std = relevant.find(s => s.tier === TIER_ORDER[i])
    if (std && e1rm >= std.min_e1rm_kg) currentIdx = i
  }

  const tier: StrengthTier = currentIdx >= 0 ? TIER_ORDER[currentIdx] : "unranked"
  const nextIdx = currentIdx + 1
  const nextTier: StrengthTier | null = nextIdx < TIER_ORDER.length ? TIER_ORDER[nextIdx] : null
  const nextStd = nextTier ? relevant.find(s => s.tier === nextTier) : null
  const nextThreshold = nextStd?.min_e1rm_kg ?? null

  let pct = 0
  if (nextThreshold !== null) {
    const base = currentIdx >= 0 ? (relevant.find(s => s.tier === TIER_ORDER[currentIdx])?.min_e1rm_kg ?? 0) : 0
    pct = nextThreshold > base ? ((e1rm - base) / (nextThreshold - base)) * 100 : 0
  } else {
    pct = 100
  }

  return { tier, nextTier, nextThreshold, pct: Math.max(0, Math.min(100, pct)) }
}

type RawPR = {
  exercise_id: string
  e1rm_kg: number
  weight_kg: number
  reps: number
  exercises: { id: string; name: string; slug: string; primary_muscles: string[] } | null
}

type RawWE = { id: string; exercise_id: string }
type RawWeekWE = { id: string; exercises: { primary_muscles: string[] } | null }

export default async function ProgressPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 90)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  // ── Parallel: profile, PRs, standards, latest body metric ───────────
  const [profileRes, prsRes, standardsRes, latestMetricRes] = await Promise.all([
    supabase.from("profiles").select("sex").eq("id", user.id).single(),
    supabase
      .from("personal_records")
      .select("exercise_id, e1rm_kg, weight_kg, reps, exercises(id, name, slug, primary_muscles)")
      .eq("user_id", user.id)
      .order("e1rm_kg", { ascending: false })
      .limit(8),
    supabase.from("strength_standards").select("*"),
    supabase
      .from("body_metrics")
      .select("weight_kg")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const sex = (profileRes.data?.sex ?? "male") as "male" | "female"
  const bwKg = latestMetricRes.data?.weight_kg ?? 80
  const rawPRs = (prsRes.data ?? []) as unknown as RawPR[]
  const standards = (standardsRes.data ?? []) as StrengthStandard[]

  // ── e1RM history: sessions → workout_exercises → sets ───────────────
  const { data: recentSessions } = await supabase
    .from("workout_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_template", false)
    .gte("started_at", cutoff.toISOString())
    .not("ended_at", "is", null)

  const sessionIds = (recentSessions ?? []).map((s: { id: string }) => s.id)
  let e1rmHistory: Array<{ date: string; e1rm: number; exerciseId: string }> = []

  if (sessionIds.length > 0) {
    const { data: rawWEs } = await supabase
      .from("workout_exercises")
      .select("id, exercise_id")
      .in("session_id", sessionIds)

    const wes = (rawWEs ?? []) as RawWE[]
    const weIds = wes.map(w => w.id)
    const weToEx = Object.fromEntries(wes.map(w => [w.id, w.exercise_id]))

    if (weIds.length > 0) {
      const { data: histSets } = await supabase
        .from("workout_sets")
        .select("workout_exercise_id, e1rm_kg, logged_at")
        .in("workout_exercise_id", weIds)
        .eq("set_type", "working")
        .not("e1rm_kg", "is", null)
        .order("logged_at", { ascending: true })

      e1rmHistory = (histSets ?? [])
        .filter((s: { e1rm_kg: number | null }) => s.e1rm_kg !== null)
        .map((s: { workout_exercise_id: string; e1rm_kg: number; logged_at: string }) => ({
          date: s.logged_at,
          e1rm: s.e1rm_kg,
          exerciseId: weToEx[s.workout_exercise_id] ?? "",
        }))
    }
  }

  // ── Weekly volume: sessions → workout_exercises → working sets ───────
  const { data: weekSessions } = await supabase
    .from("workout_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_template", false)
    .gte("started_at", weekAgo.toISOString())
    .not("ended_at", "is", null)

  const weekSessionIds = (weekSessions ?? []).map((s: { id: string }) => s.id)
  const weeklyVolume: Record<string, number> = {}

  if (weekSessionIds.length > 0) {
    const { data: rawWeekWEs } = await supabase
      .from("workout_exercises")
      .select("id, exercises(primary_muscles)")
      .in("session_id", weekSessionIds)

    const weekWEs = (rawWeekWEs ?? []) as unknown as RawWeekWE[]
    const weekWeIds = weekWEs.map(w => w.id)
    const weToMuscles = Object.fromEntries(weekWEs.map(w => [w.id, w.exercises?.primary_muscles ?? []]))

    if (weekWeIds.length > 0) {
      const { data: weekSets } = await supabase
        .from("workout_sets")
        .select("workout_exercise_id")
        .in("workout_exercise_id", weekWeIds)
        .eq("set_type", "working")

      for (const s of (weekSets ?? []) as Array<{ workout_exercise_id: string }>) {
        for (const m of (weToMuscles[s.workout_exercise_id] ?? [])) {
          weeklyVolume[m] = (weeklyVolume[m] ?? 0) + 1
        }
      }
    }
  }

  // ── Build ranked PR list ──────────────────────────────────────────────
  const rankings: PRWithRanking[] = rawPRs
    .filter(pr => pr.exercises !== null)
    .map(pr => {
      const ex = pr.exercises!
      const ranking = computeRanking(pr.e1rm_kg, ex.slug, standards, sex, bwKg)

      // Deduplicate history to best e1RM per calendar day
      const forEx = e1rmHistory.filter(h => h.exerciseId === ex.id)
      const byDay = new Map<string, number>()
      for (const h of forEx) {
        const day = h.date.split("T")[0]
        if (!byDay.has(day) || h.e1rm > byDay.get(day)!) byDay.set(day, h.e1rm)
      }
      const history = Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, e1rm]) => ({ date, e1rm }))

      return {
        exerciseId: ex.id,
        name: ex.name,
        slug: ex.slug,
        e1rm: pr.e1rm_kg,
        weightKg: pr.weight_kg,
        reps: pr.reps,
        tier: ranking.tier,
        nextTier: ranking.nextTier,
        nextThreshold: ranking.nextThreshold,
        pctToNext: ranking.pct,
        history,
      }
    })

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">Analytics</p>
        <h1 className="font-display text-4xl leading-none text-fg">STRENGTH<br />TRACKER.</h1>
        <p className="mt-2 text-sm text-fg-muted">e1RM rankings, weekly volume, and muscle analysis.</p>
      </div>
      <ProgressClient rankings={rankings} weeklyVolume={weeklyVolume} />
    </div>
  )
}
