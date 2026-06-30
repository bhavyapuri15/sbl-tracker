"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ExerciseSearch } from "./components/ExerciseSearch"
import { ExerciseCard } from "./components/ExerciseCard"
import { RestTimer } from "./components/RestTimer"
import {
  finishWorkoutSession,
  addExerciseToSession,
  logSetAndCheckPR,
  removeSet,
  removeExercise,
} from "@/lib/actions/workout"
import type { Exercise, WorkoutSession } from "@/types/domain"

export interface LocalSet {
  id?: string
  set_number: number
  weight_kg: number | null
  reps: number | null
  rir: number | null
  set_type: "warmup" | "working" | "drop" | "failure"
  e1rm_kg?: number | null
  is_pr?: boolean
  saving?: boolean
}

export interface LocalExercise {
  workoutExerciseId: string
  exercise: Exercise
  sets: LocalSet[]
  prevSets: { weight_kg: number; reps: number; e1rm_kg: number | null }[]
}

interface WorkoutLoggerProps {
  session: WorkoutSession
  initialExercises: LocalExercise[]
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

export function WorkoutLogger({ session, initialExercises }: WorkoutLoggerProps) {
  const [exercises, setExercises] = useState<LocalExercise[]>(initialExercises)
  const [searchOpen, setSearchOpen] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [restTimer, setRestTimer] = useState<number | null>(null)  // seconds remaining
  const [isPending, startTransition] = useTransition()
  const [confirmFinish, setConfirmFinish] = useState(false)

  // Duration timer
  useEffect(() => {
    const start = new Date(session.started_at).getTime()
    const update = () => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [session.started_at])

  // Rest timer countdown
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return
    const t = setTimeout(() => setRestTimer((r) => (r !== null ? r - 1 : null)), 1000)
    return () => clearTimeout(t)
  }, [restTimer])

  const handleAddExercise = useCallback(async (exercise: Exercise) => {
    setSearchOpen(false)
    const orderIndex = exercises.length

    // Optimistic add
    const tempId = `temp-${Date.now()}`
    setExercises((prev) => [
      ...prev,
      { workoutExerciseId: tempId, exercise, sets: [], prevSets: [] },
    ])

    try {
      const realId = await addExerciseToSession(session.id, exercise.id, orderIndex)
      setExercises((prev) =>
        prev.map((e) =>
          e.workoutExerciseId === tempId ? { ...e, workoutExerciseId: realId } : e
        )
      )
    } catch {
      // Roll back on failure
      setExercises((prev) => prev.filter((e) => e.workoutExerciseId !== tempId))
    }
  }, [exercises.length, session.id])

  const handleLogSet = useCallback(async (
    workoutExerciseId: string,
    setData: Omit<LocalSet, "id" | "is_pr" | "e1rm_kg" | "saving">
  ) => {
    // Optimistic update
    setExercises((prev) =>
      prev.map((e) => {
        if (e.workoutExerciseId !== workoutExerciseId) return e
        return {
          ...e,
          sets: [...e.sets, { ...setData, saving: true }],
        }
      })
    )

    setRestTimer(90)  // start rest timer

    try {
      const result = await logSetAndCheckPR(workoutExerciseId, {
        set_number: setData.set_number,
        weight_kg: setData.weight_kg ?? 0,
        reps: setData.reps ?? 0,
        rir: setData.rir,
        rpe: null,
        set_type: setData.set_type,
      })

      setExercises((prev) =>
        prev.map((e) => {
          if (e.workoutExerciseId !== workoutExerciseId) return e
          const sets = e.sets.map((s) =>
            s.saving && s.set_number === setData.set_number
              ? { ...s, id: result.id, e1rm_kg: result.e1rm_kg, is_pr: result.is_pr, saving: false }
              : s
          )
          return { ...e, sets }
        })
      )
    } catch {
      // Mark as failed
      setExercises((prev) =>
        prev.map((e) => {
          if (e.workoutExerciseId !== workoutExerciseId) return e
          return {
            ...e,
            sets: e.sets.map((s) =>
              s.saving && s.set_number === setData.set_number
                ? { ...s, saving: false, id: undefined }
                : s
            ),
          }
        })
      )
    }
  }, [])

  const handleRemoveSet = useCallback(async (workoutExerciseId: string, setIndex: number) => {
    const ex = exercises.find((e) => e.workoutExerciseId === workoutExerciseId)
    const set = ex?.sets[setIndex]
    if (!set) return

    // Optimistic
    setExercises((prev) =>
      prev.map((e) => {
        if (e.workoutExerciseId !== workoutExerciseId) return e
        const sets = e.sets.filter((_, i) => i !== setIndex)
          .map((s, i) => ({ ...s, set_number: i + 1 }))
        return { ...e, sets }
      })
    )

    if (set.id) {
      try {
        await removeSet(set.id)
      } catch {
        // Could restore here; for now silent
      }
    }
  }, [exercises])

  const handleRemoveExercise = useCallback(async (workoutExerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.workoutExerciseId !== workoutExerciseId))
    if (!workoutExerciseId.startsWith("temp-")) {
      await removeExercise(workoutExerciseId)
    }
  }, [])

  const totalSets = exercises.reduce((acc, e) => acc + e.sets.filter(s => s.set_type === "working").length, 0)

  return (
    <div className="space-y-4 pb-36">

      {/* ── Session header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-border bg-card px-4 py-3.5 flex items-center justify-between gap-3"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            {/* Live pulse dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <h1 className="text-sm font-bold text-fg truncate">
              {session.name ?? "Active Workout"}
            </h1>
          </div>
          <div className="flex items-baseline gap-2 pl-4">
            <span className="font-display text-2xl text-fg leading-none tabular-nums">
              {formatDuration(elapsed)}
            </span>
            <span className="text-xs text-fg-muted">
              · {totalSets} set{totalSets !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {confirmFinish ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="flex gap-2 shrink-0"
            >
              <Button size="sm" variant="ghost" onClick={() => setConfirmFinish(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                loading={isPending}
                onClick={() => startTransition(() => finishWorkoutSession(session.id))}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Finish
              </Button>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Button size="sm" variant="secondary" onClick={() => setConfirmFinish(true)} className="shrink-0">
                Finish
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Exercise cards ── */}
      <AnimatePresence initial={false}>
        {exercises.map((ex) => (
          <motion.div
            key={ex.workoutExerciseId}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ExerciseCard
              localExercise={ex}
              onLogSet={(setData) => handleLogSet(ex.workoutExerciseId, setData)}
              onRemoveSet={(i) => handleRemoveSet(ex.workoutExerciseId, i)}
              onRemoveExercise={() => handleRemoveExercise(ex.workoutExerciseId)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Empty state ── */}
      {exercises.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-3 text-center"
        >
          <div className="h-14 w-14 rounded-2xl bg-elevated flex items-center justify-center">
            <Plus className="h-7 w-7 text-fg-subtle" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-base font-bold text-fg">No exercises yet</p>
            <p className="mt-1 text-sm text-fg-muted">Add your first exercise to start logging sets.</p>
          </div>
        </motion.div>
      )}

      {/* ── Add exercise button ── */}
      <motion.button
        type="button"
        onClick={() => setSearchOpen(true)}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3.5 text-sm font-semibold text-fg-muted hover:border-brand/40 hover:text-brand transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Exercise
      </motion.button>

      <ExerciseSearch open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={handleAddExercise} />

      <RestTimer
        seconds={restTimer}
        total={90}
        onDismiss={() => setRestTimer(null)}
        onExtend={() => setRestTimer((r) => (r ?? 0) + 60)}
      />
    </div>
  )
}
