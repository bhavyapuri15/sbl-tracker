export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── Row types (no self-reference) ────────────────────────────────────

type ProfileRow = {
  id: string
  display_name: string | null
  sex: "male" | "female" | null
  date_of_birth: string | null
  unit_system: "metric" | "imperial"
  theme: "dark" | "light" | "system"
  activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active" | null
  goal: "cut" | "maintain" | "bulk" | null
  cut_deficit_pct: number
  bulk_surplus_pct: number
  protein_target_gkg: number
  fat_floor_gkg: number
  e1rm_formula: "epley" | "brzycki"
  created_at: string
  updated_at: string
}

type ExerciseRow = {
  id: string
  name: string
  slug: string
  primary_muscles: string[]
  secondary_muscles: string[]
  equipment: string
  category: "compound" | "isolation"
  force: string | null
  is_unilateral: boolean
  notes: string | null
  created_at: string
}

type StrengthStandardRow = {
  id: string
  exercise_slug: string
  sex: "male" | "female"
  bw_lower_kg: number
  bw_upper_kg: number
  tier: "beginner" | "novice" | "intermediate" | "advanced" | "elite"
  min_e1rm_kg: number
  source: string | null
}

type VolumeLandmarkRow = {
  id: string
  muscle_group: string
  mv_sets: number
  mev_sets: number
  mav_lower: number
  mav_upper: number
  mrv_sets: number
  source: string | null
}

type BodyMetricRow = {
  id: string
  user_id: string
  logged_at: string
  weight_kg: number | null
  height_cm: number | null
  body_fat_pct: number | null
  chest_cm: number | null
  waist_cm: number | null
  hips_cm: number | null
  left_arm_cm: number | null
  right_arm_cm: number | null
  left_thigh_cm: number | null
  right_thigh_cm: number | null
  notes: string | null
}

type WorkoutSessionRow = {
  id: string
  user_id: string
  name: string | null
  notes: string | null
  started_at: string
  ended_at: string | null
  is_template: boolean
  template_id: string | null
  created_at: string
}

type WorkoutExerciseRow = {
  id: string
  session_id: string
  exercise_id: string
  order_index: number
  notes: string | null
}

type WorkoutSetRow = {
  id: string
  workout_exercise_id: string
  set_number: number
  weight_kg: number | null
  reps: number | null
  rir: number | null
  rpe: number | null
  set_type: "warmup" | "working" | "drop" | "failure"
  e1rm_kg: number | null
  is_pr: boolean
  logged_at: string
}

type PersonalRecordRow = {
  id: string
  user_id: string
  exercise_id: string
  e1rm_kg: number
  weight_kg: number
  reps: number
  achieved_at: string
  set_id: string | null
}

type FoodEntryRow = {
  id: string
  user_id: string
  logged_at: string
  meal_slot: "breakfast" | "lunch" | "dinner" | "snack" | "any"
  food_name: string
  calories: number
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  fiber_g: number | null
  serving_size: string | null
  notes: string | null
  created_at: string
}

type NutritionGoalRow = {
  user_id: string
  effective_from: string
  calories_target: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  tdee_estimate: number | null
  bmr_estimate: number | null
  adjustment_reason: string | null
}

// ── Database type (no circular refs) ────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Partial<ProfileRow> & { id: string }
        Update: Partial<ProfileRow>
        Relationships: []
      }
      exercises: {
        Row: ExerciseRow
        Insert: Omit<ExerciseRow, "id" | "created_at"> & { id?: string }
        Update: Partial<ExerciseRow>
        Relationships: []
      }
      strength_standards: {
        Row: StrengthStandardRow
        Insert: Omit<StrengthStandardRow, "id"> & { id?: string }
        Update: Partial<StrengthStandardRow>
        Relationships: []
      }
      volume_landmarks: {
        Row: VolumeLandmarkRow
        Insert: Omit<VolumeLandmarkRow, "id"> & { id?: string }
        Update: Partial<VolumeLandmarkRow>
        Relationships: []
      }
      body_metrics: {
        Row: BodyMetricRow
        Insert: Omit<BodyMetricRow, "id"> & { id?: string }
        Update: Partial<BodyMetricRow>
        Relationships: []
      }
      workout_sessions: {
        Row: WorkoutSessionRow
        Insert: Omit<WorkoutSessionRow, "id" | "created_at"> & { id?: string }
        Update: Partial<WorkoutSessionRow>
        Relationships: []
      }
      workout_exercises: {
        Row: WorkoutExerciseRow
        Insert: Omit<WorkoutExerciseRow, "id"> & { id?: string }
        Update: Partial<WorkoutExerciseRow>
        Relationships: []
      }
      workout_sets: {
        Row: WorkoutSetRow
        Insert: Omit<WorkoutSetRow, "id"> & { id?: string }
        Update: Partial<WorkoutSetRow>
        Relationships: []
      }
      personal_records: {
        Row: PersonalRecordRow
        Insert: Omit<PersonalRecordRow, "id"> & { id?: string }
        Update: Partial<PersonalRecordRow>
        Relationships: []
      }
      food_entries: {
        Row: FoodEntryRow
        Insert: Omit<FoodEntryRow, "id" | "created_at"> & { id?: string }
        Update: Partial<FoodEntryRow>
        Relationships: []
      }
      nutrition_goals: {
        Row: NutritionGoalRow
        Insert: NutritionGoalRow
        Update: Partial<NutritionGoalRow>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
  }
}
