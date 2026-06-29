import type { Metadata } from "next"
import { Apple, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = { title: "Nutrition" }

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Nutrition</h1>
          <p className="mt-1 text-sm text-fg-muted">Calories, macros, and weekly adjustments</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Log food
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
          <Apple className="h-8 w-8 text-fg-muted" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-base font-semibold text-fg">No food logged today</p>
          <p className="mt-1 text-sm text-fg-muted max-w-xs">
            Track your calories and macros to get science-based adjustments based on your weight trend.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Log first meal
        </Button>
      </div>

      <p className="text-xs text-fg-subtle text-center">
        Calorie and macro targets are for informational purposes only — not medical or nutrition advice.
      </p>
    </div>
  )
}
