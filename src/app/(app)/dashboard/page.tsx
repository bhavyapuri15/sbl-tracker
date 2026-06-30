import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "./DashboardClient"
import { computeSuggestions } from "@/lib/suggestions"
import type { Goal } from "@/types/domain"
import type { Suggestion } from "@/types/domain"

export const metadata: Metadata = { title: "Dashboard" }

type PRDateRow = { e1rm_kg: number; achieved_at: string; exercises: { name: string } | null }
type WeekWE = { id: string; exercises: { primary_muscles: string[] } | null }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const now = new Date()
  const weekAgo  = new Date(now); weekAgo.setDate(now.getDate() - 7)
  const twoWeeks = new Date(now); twoWeeks.setDate(now.getDate() - 14)

  // ── Parallel tier-1 fetches ─────────────────────────────────────────
  const [
    { data: profile },
    { data: recentSessions },
    { data: rawPRs },
    { data: recentMetric },
    { data: weightMetrics },
    { data: weekSessions },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, goal, activity_level, sex")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("workout_sessions")
      .select("id, name, started_at, ended_at")
      .eq("user_id", user!.id)
      .eq("is_template", false)
      .not("ended_at", "is", null)
      .gte("started_at", weekAgo.toISOString())
      .order("started_at", { ascending: false }),
    supabase
      .from("personal_records")
      .select("e1rm_kg, achieved_at, exercises(name)")
      .eq("user_id", user!.id)
      .order("e1rm_kg", { ascending: false })
      .limit(5),
    supabase
      .from("body_metrics")
      .select("weight_kg, logged_at")
      .eq("user_id", user!.id)
      .not("weight_kg", "is", null)
      .order("logged_at", { ascending: false })
      .limit(1),
    supabase
      .from("body_metrics")
      .select("logged_at, weight_kg")
      .eq("user_id", user!.id)
      .gte("logged_at", twoWeeks.toISOString())
      .order("logged_at", { ascending: true }),
    supabase
      .from("workout_sessions")
      .select("id")
      .eq("user_id", user!.id)
      .eq("is_template", false)
      .gte("started_at", weekAgo.toISOString())
      .not("ended_at", "is", null),
  ])

  // ── Weekly volume (2 more queries) ───────────────────────────────────
  const weekSessionIds = (weekSessions ?? []).map((s: { id: string }) => s.id)
  let weeklyVolume: Record<string, number> = {}

  if (weekSessionIds.length > 0) {
    const { data: rawWeekWEs } = await supabase
      .from("workout_exercises")
      .select("id, exercises(primary_muscles)")
      .in("session_id", weekSessionIds)

    const weekWEs = (rawWeekWEs ?? []) as unknown as WeekWE[]
    const weekWeIds = weekWEs.map(w => w.id)
    const weToMuscles = Object.fromEntries(weekWEs.map(w => [w.id, w.exercises?.primary_muscles ?? []]))

    if (weekWeIds.length > 0) {
      const { data: weekSets } = await supabase
        .from("workout_sets")
        .select("workout_exercise_id")
        .in("workout_exercise_id", weekWeIds)
        .eq("set_type", "working")

      for (const s of (weekSets ?? []) as Array<{ workout_exercise_id: string }>) {
        for (const m of weToMuscles[s.workout_exercise_id] ?? []) {
          weeklyVolume[m] = (weeklyVolume[m] ?? 0) + 1
        }
      }
    }
  }

  // ── Compute suggestions ──────────────────────────────────────────────
  const prsWithDates = (rawPRs as unknown as PRDateRow[] | null ?? [])
    .filter(pr => pr.exercises !== null)
    .map(pr => ({ exerciseName: pr.exercises!.name, achievedAt: pr.achieved_at }))

  const suggestions: Suggestion[] = computeSuggestions({
    prs: prsWithDates,
    weeklyVolume,
    weightMetrics: weightMetrics ?? [],
    goal: (profile?.goal ?? null) as Goal | null,
  })

  // ── Dashboard summary values ─────────────────────────────────────────
  const firstName = profile?.display_name?.split(" ")[0] ?? "Athlete"
  const workoutsThisWeek = recentSessions?.length ?? 0

  const firstPR = (rawPRs as unknown as PRDateRow[] | null)?.[0]
  type PRRow = { e1rm_kg: number; exercises: { name: string } | null }
  const topPR = firstPR as PRRow | undefined
  const bestE1rm = topPR?.e1rm_kg ?? null
  const bestE1rmExercise = (topPR?.exercises as { name: string } | null)?.name ?? null

  const currentWeight = recentMetric?.[0]?.weight_kg ?? null

  return (
    <DashboardClient
      firstName={firstName}
      workoutsThisWeek={workoutsThisWeek}
      bestE1rm={bestE1rm}
      bestE1rmExercise={bestE1rmExercise}
      currentWeight={currentWeight}
      goal={(profile?.goal ?? null) as Goal | null}
      suggestions={suggestions}
    />
  )
}
