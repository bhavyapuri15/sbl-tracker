"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { calculateE1RM } from "@/lib/e1rm"

export async function createWorkoutSession(name: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: session, error } = await supabase
    .from("workout_sessions")
    .insert({
      user_id: user.id,
      name: name.trim() || null,
      started_at: new Date().toISOString(),
      is_template: false,
    })
    .select("id")
    .single()

  if (error || !session) throw new Error("Failed to create session")

  redirect(`/workout/${session.id}`)
}

export async function finishWorkoutSession(sessionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase
    .from("workout_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("user_id", user.id)

  redirect("/workout")
}

export async function deleteWorkoutSession(sessionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase
    .from("workout_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id)

  redirect("/workout")
}

/** Called client-side via import — keeps PR logic server-authoritative. */
export async function logSetAndCheckPR(
  workoutExerciseId: string,
  set: {
    set_number: number
    weight_kg: number
    reps: number
    rir: number | null
    rpe: number | null
    set_type: "warmup" | "working" | "drop" | "failure"
  }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const e1rm_kg = calculateE1RM(set.weight_kg, set.reps)

  // Resolve exercise_id via workout_exercise
  const { data: we } = await supabase
    .from("workout_exercises")
    .select("exercise_id")
    .eq("id", workoutExerciseId)
    .single()

  const exerciseId = we?.exercise_id

  // Current PR
  const { data: currentPR } = exerciseId
    ? await supabase
        .from("personal_records")
        .select("e1rm_kg")
        .eq("user_id", user.id)
        .eq("exercise_id", exerciseId)
        .single()
    : { data: null }

  const is_pr = set.set_type === "working" && (!currentPR || e1rm_kg > (currentPR.e1rm_kg ?? 0))

  const { data: saved, error } = await supabase
    .from("workout_sets")
    .insert({
      workout_exercise_id: workoutExerciseId,
      set_number: set.set_number,
      weight_kg: set.weight_kg,
      reps: set.reps,
      rir: set.rir,
      rpe: set.rpe,
      set_type: set.set_type,
      e1rm_kg,
      is_pr,
    })
    .select("id")
    .single()

  if (error || !saved) throw new Error("Failed to log set")

  if (is_pr && exerciseId) {
    await supabase.from("personal_records").upsert(
      {
        user_id: user.id,
        exercise_id: exerciseId,
        e1rm_kg,
        weight_kg: set.weight_kg,
        reps: set.reps,
        achieved_at: new Date().toISOString(),
        set_id: saved.id,
      },
      { onConflict: "user_id,exercise_id" }
    )
  }

  return { id: saved.id, e1rm_kg, is_pr }
}

export async function addExerciseToSession(
  sessionId: string,
  exerciseId: string,
  orderIndex: number
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("workout_exercises")
    .insert({ session_id: sessionId, exercise_id: exerciseId, order_index: orderIndex })
    .select("id")
    .single()

  if (error || !data) throw new Error("Failed to add exercise")
  return data.id
}

export async function removeSet(setId: string) {
  const supabase = await createClient()
  await supabase.from("workout_sets").delete().eq("id", setId)
}

export async function removeExercise(workoutExerciseId: string) {
  const supabase = await createClient()
  await supabase
    .from("workout_exercises")
    .delete()
    .eq("id", workoutExerciseId)
}
