import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WorkoutLogger } from "./WorkoutLogger"
import type { Exercise, WorkoutSession } from "@/types/domain"

type RawSet = {
  id: string
  set_number: number
  weight_kg: number | null
  reps: number | null
  rir: number | null
  rpe: number | null
  set_type: string
  e1rm_kg: number | null
  is_pr: boolean
  logged_at: string
}

type RawWorkoutExercise = {
  id: string
  order_index: number
  notes: string | null
  exercise_id: string
  exercises: Exercise
  workout_sets: RawSet[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("workout_sessions")
    .select("name, started_at")
    .eq("id", id)
    .single()

  return {
    title: data?.name ?? "Active Workout",
  }
}

export default async function WorkoutSessionPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch session
  const { data: session } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!session) notFound()

  // Fetch exercises + sets for this session
  const { data: rawWorkoutExercises } = await supabase
    .from("workout_exercises")
    .select(`
      id,
      order_index,
      notes,
      exercise_id,
      exercises!inner(
        id, name, slug, primary_muscles, secondary_muscles,
        equipment, category, force, is_unilateral, notes, created_at
      ),
      workout_sets(
        id, set_number, weight_kg, reps, rir, rpe,
        set_type, e1rm_kg, is_pr, logged_at
      )
    `)
    .eq("session_id", id)
    .order("order_index")

  const workoutExercises = (rawWorkoutExercises ?? []) as unknown as RawWorkoutExercise[]

  // Fetch previous session sets for each exercise (for "last time" reference)
  const exerciseIds = workoutExercises.map((we) => we.exercise_id)

  let previousSetsMap: Record<string, { weight_kg: number; reps: number; e1rm_kg: number | null }[]> = {}

  if (exerciseIds.length > 0) {
    type PrevRow = {
      exercise_id: string
      workout_sets: { weight_kg: number | null; reps: number | null; e1rm_kg: number | null; set_type: string; set_number: number }[]
    }

    const { data: rawPrev } = await supabase
      .from("workout_exercises")
      .select(`
        exercise_id,
        workout_sets(weight_kg, reps, e1rm_kg, set_type, set_number),
        workout_sessions!inner(started_at, is_template)
      `)
      .eq("workout_sessions.user_id", user.id)
      .eq("workout_sessions.is_template", false)
      .neq("workout_sessions.id", id)
      .in("exercise_id", exerciseIds)
      .order("workout_sessions(started_at)", { ascending: false })
      .limit(1, { foreignTable: "workout_sessions" })

    const prevData = (rawPrev ?? []) as unknown as PrevRow[]

    for (const we of prevData) {
      const exId = we.exercise_id
      if (!previousSetsMap[exId]) {
        const workingSets = (we.workout_sets ?? [])
          .filter((s) => s.set_type === "working")
          .map((s) => ({
            weight_kg: s.weight_kg ?? 0,
            reps: s.reps ?? 0,
            e1rm_kg: s.e1rm_kg,
          }))
        if (workingSets.length > 0) {
          previousSetsMap[exId] = workingSets
        }
      }
    }
  }

  const initialExercises = workoutExercises.map((we) => ({
    workoutExerciseId: we.id,
    exercise: we.exercises,
    sets: (we.workout_sets ?? [])
      .sort((a, b) => a.set_number - b.set_number)
      .map((s) => ({
        id: s.id,
        set_number: s.set_number,
        weight_kg: s.weight_kg,
        reps: s.reps,
        rir: s.rir,
        rpe: s.rpe,
        set_type: s.set_type as "warmup" | "working" | "drop" | "failure",
        e1rm_kg: s.e1rm_kg,
        is_pr: s.is_pr,
      })),
    prevSets: previousSetsMap[we.exercise_id] ?? [],
  }))

  return (
    <WorkoutLogger
      session={session as WorkoutSession}
      initialExercises={initialExercises}
    />
  )
}
