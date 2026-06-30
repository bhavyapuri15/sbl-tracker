"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacroTargets } from "@/lib/nutrition"

export async function logFood(data: {
  food_name: string
  calories: number
  protein_g?: number | null
  carbs_g?: number | null
  fat_g?: number | null
  meal_slot: "breakfast" | "lunch" | "dinner" | "snack" | "any"
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { error } = await supabase.from("food_entries").insert({
    user_id: user.id,
    logged_at: new Date().toISOString(),
    food_name: data.food_name.trim(),
    calories: data.calories,
    protein_g: data.protein_g ?? null,
    carbs_g: data.carbs_g ?? null,
    fat_g: data.fat_g ?? null,
    fiber_g: null,
    serving_size: null,
    notes: null,
    meal_slot: data.meal_slot,
  })

  if (error) throw new Error("Failed to log food")
  revalidatePath("/nutrition")
}

export async function deleteFood(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  await supabase.from("food_entries").delete().eq("id", id).eq("user_id", user.id)
  revalidatePath("/nutrition")
}

export async function saveProfileAndGoal(data: {
  display_name?: string
  sex?: "male" | "female"
  date_of_birth?: string
  activity_level?: "sedentary" | "light" | "moderate" | "active" | "very_active"
  goal?: "cut" | "maintain" | "bulk"
  weight_kg?: number | null
  height_cm?: number | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 1. Update profile fields
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      ...(data.display_name !== undefined  ? { display_name:   data.display_name }  : {}),
      ...(data.sex !== undefined           ? { sex:            data.sex }            : {}),
      ...(data.date_of_birth !== undefined ? { date_of_birth:  data.date_of_birth } : {}),
      ...(data.activity_level !== undefined? { activity_level: data.activity_level }: {}),
      ...(data.goal !== undefined          ? { goal:           data.goal }           : {}),
    })
    .eq("id", user.id)
  if (profileError) throw new Error("Failed to update profile")

  // 2. Log body metric if weight/height provided
  if (data.weight_kg != null || data.height_cm != null) {
    await supabase.from("body_metrics").insert({
      user_id: user.id,
      logged_at: new Date().toISOString(),
      weight_kg: data.weight_kg ?? null,
      height_cm: data.height_cm ?? null,
      body_fat_pct: null,
      chest_cm: null,
      waist_cm: null,
      hips_cm: null,
      left_arm_cm: null,
      right_arm_cm: null,
      left_thigh_cm: null,
      right_thigh_cm: null,
      notes: null,
    })
  }

  // 3. Try to compute and save nutrition goal
  const [profileRes, metricRes] = await Promise.all([
    supabase.from("profiles")
      .select("sex, date_of_birth, activity_level, goal")
      .eq("id", user.id).single(),
    supabase.from("body_metrics")
      .select("weight_kg, height_cm")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(1).maybeSingle(),
  ])

  const p = profileRes.data
  const weight = metricRes.data?.weight_kg
  const height = metricRes.data?.height_cm

  if (p?.sex && p.date_of_birth && p.activity_level && p.goal && weight && height) {
    const dob = new Date(p.date_of_birth)
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    const bmr = calculateBMR(weight, height, age, p.sex as "male" | "female")
    const tdee = calculateTDEE(bmr, p.activity_level)
    const calories = calculateTargetCalories(tdee, p.goal as "cut" | "maintain" | "bulk")
    const macros = calculateMacroTargets(calories, weight)

    await supabase.from("nutrition_goals").upsert(
      {
        user_id: user.id,
        effective_from: new Date().toISOString().split("T")[0],
        calories_target: macros.calories,
        protein_g: macros.protein_g,
        carbs_g: macros.carbs_g,
        fat_g: macros.fat_g,
        tdee_estimate: tdee,
        bmr_estimate: bmr,
        adjustment_reason: `${p.goal} · ${p.activity_level}`,
      },
      { onConflict: "user_id,effective_from" },
    )
  }

  revalidatePath("/profile")
  revalidatePath("/nutrition")
}
