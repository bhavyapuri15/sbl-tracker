import type { Metadata } from "next"
import { StartWorkout } from "./StartWorkout"

export const metadata: Metadata = { title: "Start Workout" }

export default function NewWorkoutPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">New Session</p>
        <h1 className="font-display text-4xl leading-none text-fg">START<br />LIFTING.</h1>
        <p className="mt-2 text-sm text-fg-muted">Name your session and optionally pick a training split.</p>
      </div>
      <StartWorkout />
    </div>
  )
}
