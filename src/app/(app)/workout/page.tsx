import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Dumbbell, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Workout" }

function formatDuration(startedAt: string, endedAt: string | null) {
  if (!endedAt) return "In progress"
  const ms = new Date(endedAt).getTime() - new Date(startedAt).getTime()
  const m = Math.round(ms / 60000)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return "Today"
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

type SessionExercise = {
  id: string
  exercise_id: string
  exercises: { name: string } | null
  workout_sets: { id: string; set_type: string }[]
}

type SessionRow = {
  id: string
  name: string | null
  started_at: string
  ended_at: string | null
  notes: string | null
  workout_exercises: SessionExercise[]
}

export default async function WorkoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch last 30 sessions with exercise + set counts
  const { data: rawSessions } = await supabase
    .from("workout_sessions")
    .select(`
      id, name, started_at, ended_at, notes,
      workout_exercises(
        id,
        exercise_id,
        exercises(name),
        workout_sets(id, set_type)
      )
    `)
    .eq("user_id", user.id)
    .eq("is_template", false)
    .order("started_at", { ascending: false })
    .limit(30)

  const sessions = (rawSessions ?? []) as unknown as SessionRow[]

  const hasActive = sessions.some((s) => !s.ended_at)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Workout</h1>
          <p className="mt-1 text-sm text-fg-muted">Log and track your training sessions</p>
        </div>
        <Link href="/workout/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </Link>
      </div>

      {/* Active session banner */}
      {hasActive && (
        <Link
          href={`/workout/${sessions.find((s) => !s.ended_at)!.id}`}
          className="block"
        >
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand/10 border border-brand/25 text-brand">
            <div className="h-2.5 w-2.5 rounded-full bg-brand animate-pulse shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Active session in progress</p>
              <p className="text-xs opacity-70">
                {sessions.find((s) => !s.ended_at)!.name ?? "Unnamed workout"}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </div>
        </Link>
      )}

      {/* Session list */}
      {sessions.filter((s) => s.ended_at).length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wide">History</h2>
          <div className="space-y-2">
            {sessions
              .filter((s) => s.ended_at)
              .map((session) => {
                const exerciseNames = (session.workout_exercises ?? [])
                  .map((we) => (we.exercises as unknown as { name: string } | null)?.name)
                  .filter(Boolean)
                  .slice(0, 3) as string[]

                const workingSets = (session.workout_exercises ?? []).reduce(
                  (acc, we) =>
                    acc + (we.workout_sets ?? []).filter((s) => s.set_type === "working").length,
                  0
                )

                return (
                  <Link key={session.id} href={`/workout/${session.id}`}>
                    <Card className="hover:bg-card-hover transition-colors">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-elevated flex items-center justify-center shrink-0">
                          <Dumbbell className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-fg truncate">
                              {session.name ?? "Workout"}
                            </p>
                            <span className="text-xs text-fg-muted shrink-0">
                              {formatDate(session.started_at)}
                            </span>
                          </div>
                          <p className="text-xs text-fg-muted mt-0.5 truncate">
                            {exerciseNames.length > 0
                              ? exerciseNames.join(", ") +
                                ((session.workout_exercises?.length ?? 0) > 3
                                  ? ` +${(session.workout_exercises?.length ?? 0) - 3} more`
                                  : "")
                              : "No exercises"}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1 text-xs text-fg-muted">
                              <Clock className="h-3 w-3" />
                              {formatDuration(session.started_at, session.ended_at)}
                            </div>
                            {workingSets > 0 && (
                              <span className="text-xs text-fg-muted">
                                {workingSets} set{workingSets !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-fg-muted/40 shrink-0 mt-0.5" />
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
          </div>
        </div>
      ) : !hasActive ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
            <Dumbbell className="h-8 w-8 text-fg-muted" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-base font-semibold text-fg">No workouts yet</p>
            <p className="mt-1 text-sm text-fg-muted max-w-xs">
              Start your first session to begin tracking sets, reps, and strength progress.
            </p>
          </div>
          <Link href="/workout/new">
            <Button>
              <Plus className="h-4 w-4" />
              Start first workout
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  )
}
