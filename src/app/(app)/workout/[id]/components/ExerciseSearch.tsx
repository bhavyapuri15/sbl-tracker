"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Dumbbell } from "lucide-react"
import { Sheet } from "@/components/ui/Sheet"
import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { Exercise } from "@/types/domain"

const MUSCLE_FILTERS = [
  "chest", "back", "quads", "hamstrings",
  "glutes", "shoulders", "biceps", "triceps",
  "calves", "abs",
]

interface ExerciseSearchProps {
  open: boolean
  onClose: () => void
  onSelect: (exercise: Exercise) => void
}

export function ExerciseSearch({ open, onClose, onSelect }: ExerciseSearchProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null)

  // Fetch once when sheet opens
  useEffect(() => {
    if (!open || exercises.length > 0) return
    setLoading(true)
    const supabase = createClient()
    supabase
      .from("exercises")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setExercises((data as Exercise[]) ?? [])
        setLoading(false)
      })
  }, [open, exercises.length])

  const filtered = useMemo(() => {
    let list = exercises
    if (muscleFilter) {
      list = list.filter(
        (e) =>
          e.primary_muscles.includes(muscleFilter) ||
          e.secondary_muscles.includes(muscleFilter)
      )
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((e) => e.name.toLowerCase().includes(q))
    }
    return list
  }, [exercises, query, muscleFilter])

  function handleClose() {
    setQuery("")
    setMuscleFilter(null)
    onClose()
  }

  return (
    <Sheet open={open} onClose={handleClose} title="Add Exercise" snapTo="full">
      <div className="flex flex-col gap-0 h-full">
        {/* Search bar */}
        <div className="px-4 pt-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted pointer-events-none" />
            <input
              type="search"
              placeholder="Search exercises…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className={cn(
                "w-full h-11 pl-10 pr-4 rounded-xl bg-elevated border border-border text-sm text-fg",
                "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
                "placeholder:text-fg-muted transition-colors"
              )}
            />
          </div>
        </div>

        {/* Muscle filter chips */}
        <div className="px-4 pb-3 shrink-0 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              type="button"
              onClick={() => setMuscleFilter(null)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors border shrink-0",
                muscleFilter === null
                  ? "bg-brand/15 text-brand border-brand/30"
                  : "bg-elevated text-fg-muted border-border hover:text-fg"
              )}
            >
              All
            </button>
            {MUSCLE_FILTERS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMuscleFilter(muscleFilter === m ? null : m)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors border shrink-0 capitalize",
                  muscleFilter === m
                    ? "bg-brand/15 text-brand border-brand/30"
                    : "bg-elevated text-fg-muted border-border hover:text-fg"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 space-y-1">
          {loading && (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 px-1">
                <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <Dumbbell className="h-10 w-10 text-fg-muted/30" strokeWidth={1.5} />
              <p className="text-sm font-medium text-fg-muted">No exercises found</p>
              <p className="text-xs text-fg-subtle">Try a different search or muscle filter</p>
            </div>
          )}

          {!loading && filtered.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => onSelect(exercise)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors",
                "hover:bg-elevated active:bg-card-hover"
              )}
            >
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold",
                exercise.category === "compound"
                  ? "bg-brand/15 text-brand"
                  : "bg-elevated text-fg-muted"
              )}>
                {exercise.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-fg truncate">{exercise.name}</p>
                <p className="text-xs text-fg-muted capitalize truncate">
                  {exercise.primary_muscles.slice(0, 2).map(m => m.replace(/_/g, " ")).join(" · ")}
                  {exercise.equipment ? ` · ${exercise.equipment}` : ""}
                </p>
              </div>
              <Badge variant={exercise.category === "compound" ? "brand" : "default"} className="text-xs shrink-0">
                {exercise.category === "compound" ? "Compound" : "Isolation"}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  )
}
