import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PendingSetPayload = {
  workout_exercise_id: string
  set_number: number
  weight_kg: number | null
  reps: number | null
  rpe: number | null
  set_type: string
  completed_at: string
}

export type PendingItem = {
  id: string
  type: "log_set" | "delete_set"
  payload: PendingSetPayload | { id: string }
  queuedAt: string
}

interface PendingQueueState {
  items: PendingItem[]
  enqueue: (item: Omit<PendingItem, "id" | "queuedAt">) => void
  dequeue: (id: string) => void
  clear: () => void
}

export const usePendingQueue = create<PendingQueueState>()(
  persist(
    (set) => ({
      items: [],
      enqueue: (item) =>
        set((s) => ({
          items: [
            ...s.items,
            {
              ...item,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              queuedAt: new Date().toISOString(),
            },
          ],
        })),
      dequeue: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "sbl-pending-queue" },
  ),
)
