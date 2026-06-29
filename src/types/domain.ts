import type { Database } from "./supabase"

// ── Table row shortcuts ───────────────────────────────────────────────
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"]
export type StrengthStandard = Database["public"]["Tables"]["strength_standards"]["Row"]
export type VolumeLandmark = Database["public"]["Tables"]["volume_landmarks"]["Row"]
export type BodyMetric = Database["public"]["Tables"]["body_metrics"]["Row"]
export type WorkoutSession = Database["public"]["Tables"]["workout_sessions"]["Row"]
export type WorkoutExercise = Database["public"]["Tables"]["workout_exercises"]["Row"]
export type WorkoutSet = Database["public"]["Tables"]["workout_sets"]["Row"]
export type PersonalRecord = Database["public"]["Tables"]["personal_records"]["Row"]
export type FoodEntry = Database["public"]["Tables"]["food_entries"]["Row"]
export type NutritionGoal = Database["public"]["Tables"]["nutrition_goals"]["Row"]

// ── Nested / enriched types ──────────────────────────────────────────
export interface WorkoutExerciseWithSets extends WorkoutExercise {
  exercise: Exercise
  sets: WorkoutSet[]
}

export interface WorkoutSessionWithExercises extends WorkoutSession {
  workout_exercises: WorkoutExerciseWithSets[]
}

// ── Strength tier ─────────────────────────────────────────────────────
export type StrengthTier =
  | "beginner"
  | "novice"
  | "intermediate"
  | "advanced"
  | "elite"
  | "unranked"

export interface StrengthRanking {
  exercise: Exercise
  e1rm_kg: number
  tier: StrengthTier
  nextTier: StrengthTier | null
  nextTierThreshold: number | null
  percentToNext: number
}

// ── Volume tracking ───────────────────────────────────────────────────
export type MuscleGroup =
  | "chest"
  | "back"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "calves"
  | "abs"
  | "traps"
  | "forearms"

export interface WeeklyVolume {
  muscle: MuscleGroup
  sets: number
  landmark: VolumeLandmark
  status: "below_mev" | "optimal" | "above_mrv" | "no_data"
}

// ── Nutrition ─────────────────────────────────────────────────────────
export interface MacroTargets {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface DailyNutrition {
  date: string
  entries: FoodEntry[]
  totals: MacroTargets
  goal: NutritionGoal | null
}

// ── Body metrics / trend ──────────────────────────────────────────────
export interface WeightTrend {
  entries: Array<{ date: string; weight: number; trend: number }>
  slopeKgPerWeek: number
  latestWeight: number | null
  latestTrend: number | null
}

// ── Suggestion types ──────────────────────────────────────────────────
export type SuggestionKind =
  | "add_weight"
  | "add_reps"
  | "deload"
  | "lagging_muscle"
  | "calorie_adjust"
  | "volume_warning"

export interface Suggestion {
  kind: SuggestionKind
  message: string
  exerciseId?: string
  muscle?: MuscleGroup
  delta?: number
}

// ── Activity & goal enums ─────────────────────────────────────────────
export type ActivityLevel = Profile["activity_level"]
export type Goal = Profile["goal"]
export type UnitSystem = Profile["unit_system"]
export type Sex = NonNullable<Profile["sex"]>
