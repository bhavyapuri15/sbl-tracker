import { SBL } from "@/config/sbl"
import type { ActivityLevel, Goal, MacroTargets, Sex } from "@/types/domain"

/**
 * Mifflin-St Jeor BMR (1990)
 * weight: kg, height: cm, age: years
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: Sex
): number {
  const base = 10 * weight + 6.25 * height - 5 * age
  return Math.round(sex === "male" ? base + 5 : base - 161)
}

export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  const factor = SBL.activityFactors[activity ?? "sedentary"] ?? 1.2
  return Math.round(bmr * factor)
}

export function calculateTargetCalories(
  tdee: number,
  goal: Goal
): number {
  if (goal === "cut") {
    return Math.round(tdee * (1 - SBL.goals.cut.deficitPctDefault / 100))
  }
  if (goal === "bulk") {
    return Math.round(tdee * (1 + SBL.goals.bulk.surplusPctDefault / 100))
  }
  return tdee
}

export function calculateMacroTargets(
  calories: number,
  weightKg: number
): MacroTargets {
  const protein_g = Math.round(weightKg * SBL.protein.defaultGPerKg)
  const fat_g = Math.round(weightKg * SBL.fat.defaultGPerKg)
  const proteinCals = protein_g * 4
  const fatCals = fat_g * 9
  const carbs_g = Math.max(0, Math.round((calories - proteinCals - fatCals) / 4))
  return { calories, protein_g, fat_g, carbs_g }
}

/**
 * Compares the 7-day weight trend slope against the goal rate.
 * Returns a kcal suggestion (positive = eat more, negative = eat less).
 */
export function suggestCalorieAdjustment(
  slopeKgPerWeek: number,
  goal: Goal
): number | null {
  const target = goal === "cut"
    ? SBL.goals.cut.targetKgPerWeek
    : goal === "bulk"
    ? SBL.goals.bulk.targetKgPerWeek
    : 0

  const deviation = slopeKgPerWeek - target
  if (Math.abs(deviation) < SBL.weeklyAdjustment.deviationThresholdKg) return null

  // 1 kg body mass ≈ 7700 kcal; weekly slope → daily adjustment
  const rawKcal = (-deviation * 7700) / 7
  const sign = rawKcal > 0 ? 1 : -1
  return sign * SBL.weeklyAdjustment.adjustmentKcal
}
