import type { Metadata } from "next"
import { TrendingUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = { title: "Progress" }

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Progress</h1>
          <p className="mt-1 text-sm text-fg-muted">Body metrics, strength ranking, and trends</p>
        </div>
        <Button size="sm" variant="secondary">
          <Plus className="h-4 w-4" />
          Log weight
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
          <TrendingUp className="h-8 w-8 text-fg-muted" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-base font-semibold text-fg">No data yet</p>
          <p className="mt-1 text-sm text-fg-muted max-w-xs">
            Log your bodyweight and measurements to see trend charts and your strength ranking.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Log first weigh-in
        </Button>
      </div>
    </div>
  )
}
