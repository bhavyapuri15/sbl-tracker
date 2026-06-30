import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NutritionClient } from "./NutritionClient"
import type { FoodEntry, NutritionGoal } from "@/types/domain"

export const metadata: Metadata = { title: "Nutrition" }

export default async function NutritionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Today's date range (local midnight → midnight)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()

  const [goalRes, entriesRes] = await Promise.all([
    supabase
      .from("nutrition_goals")
      .select("*")
      .eq("user_id", user.id)
      .lte("effective_from", now.toISOString().split("T")[0])
      .order("effective_from", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("food_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_at", todayStart)
      .lt("logged_at", todayEnd)
      .order("logged_at", { ascending: true }),
  ])

  const goal = goalRes.data as NutritionGoal | null
  const entries = (entriesRes.data ?? []) as FoodEntry[]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">Daily</p>
        <h1 className="font-display text-4xl leading-none text-fg">NUTRITION<br />TODAY.</h1>
        {goal && (
          <p className="mt-2 text-sm text-fg-muted">
            Target {goal.calories_target?.toLocaleString()} kcal · {goal.protein_g}g P · {goal.carbs_g}g C · {goal.fat_g}g F
          </p>
        )}
      </div>
      <NutritionClient goal={goal} entries={entries} />
    </div>
  )
}
