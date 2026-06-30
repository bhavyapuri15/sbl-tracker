"use client"

import { useEffect } from "react"
import { usePendingQueue, type PendingSetPayload } from "@/stores/pendingQueue"
import { logSetAndCheckPR, removeSet } from "@/lib/actions/workout"

export function useQueueFlush() {
  const { items, dequeue } = usePendingQueue()

  useEffect(() => {
    async function flush() {
      if (!navigator.onLine || items.length === 0) return

      for (const item of items) {
        try {
          if (item.type === "log_set") {
            const p = item.payload as PendingSetPayload
            await logSetAndCheckPR(p.workout_exercise_id, {
              set_number: p.set_number,
              weight_kg: p.weight_kg ?? 0,
              reps: p.reps ?? 0,
              rir: null,
              rpe: p.rpe,
              set_type: p.set_type as "warmup" | "working" | "drop" | "failure",
            })
          } else if (item.type === "delete_set") {
            const p = item.payload as { id: string }
            await removeSet(p.id)
          }
          dequeue(item.id)
        } catch {
          // leave in queue — will retry on next online event
        }
      }
    }

    flush()
    window.addEventListener("online", flush)
    return () => window.removeEventListener("online", flush)
  }, [items, dequeue])
}
