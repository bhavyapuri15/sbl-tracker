import type { Metadata } from "next"
import { Dumbbell, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export const metadata: Metadata = { title: "Workout" }

export default function WorkoutPage() {
  return (
    <div className="space-y-6">
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

      {/* Empty state */}
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
    </div>
  )
}
