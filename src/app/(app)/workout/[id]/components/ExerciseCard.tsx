"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, Trash2, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { SetRow } from "./SetRow"
import { AddSetForm } from "./AddSetForm"
import { cn } from "@/lib/utils"
import type { LocalExercise, LocalSet } from "../WorkoutLogger"

const ease = [0.16, 1, 0.3, 1] as const

export function ExerciseCard({
  localExercise,
  onLogSet,
  onRemoveSet,
  onRemoveExercise,
}: {
  localExercise: LocalExercise
  onLogSet: (set: Omit<LocalSet, "id" | "is_pr" | "e1rm_kg" | "saving">) => void
  onRemoveSet: (index: number) => void
  onRemoveExercise: () => void
}) {
  const { exercise, sets, prevSets } = localExercise
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const nextSetNum = sets.length + 1
  const prevSet = prevSets[sets.length] ?? prevSets[prevSets.length - 1]
  const workingSets = sets.filter(s => s.set_type === "working").length
  const muscles = (exercise.primary_muscles ?? []).slice(0, 2).map(m => m.replace(/_/g, " "))

  return (
    <Card className="overflow-visible shadow-card">
      <CardContent className="p-0">

        {/* Header */}
        <div className="flex items-start gap-3 px-4 pt-4 pb-3">
          {/* Category dot */}
          <div className={cn(
            "mt-0.5 h-2 w-2 rounded-full shrink-0",
            exercise.category === "compound" ? "bg-brand" : "bg-fg-subtle"
          )} />

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-fg leading-tight">{exercise.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {muscles.map(m => (
                <span key={m} className="text-[10px] font-semibold uppercase tracking-wide text-fg-subtle capitalize">
                  {m}
                </span>
              ))}
              {exercise.is_unilateral && (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">· Unilateral</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setCollapsed(v => !v)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-fg-subtle hover:bg-elevated transition-colors"
            >
              <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronUp className="h-4 w-4" />
              </motion.span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(v => !v)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-fg-subtle hover:bg-elevated transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-float min-w-[160px] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); onRemoveExercise() }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-danger hover:bg-danger/5 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove exercise
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Body */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-0">
                {/* Column labels */}
                {sets.length > 0 && (
                  <div className="flex items-center gap-3 pb-1 border-b border-border/50">
                    <span className="min-w-[2.25rem] text-[10px] font-bold uppercase tracking-wide text-fg-subtle text-center">Type</span>
                    <span className="flex-1 text-[10px] font-bold uppercase tracking-wide text-fg-subtle">Weight × Reps</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-fg-subtle">e1RM</span>
                    <span className="w-7" />
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {sets.map((set, i) => (
                    <SetRow key={set.id ?? `pending-${i}`} set={set} onRemove={() => onRemoveSet(i)} />
                  ))}
                </AnimatePresence>

                {/* Divider before form */}
                {sets.length > 0 && <div className="border-t border-border/50 mt-1" />}

                <AddSetForm setNumber={nextSetNum} prevSet={prevSet} onLog={onLogSet} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed summary */}
        {collapsed && workingSets > 0 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-fg-subtle">
              {workingSets} working set{workingSets !== 1 ? "s" : ""} logged
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
