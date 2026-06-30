"use client"

import { motion } from "framer-motion"
import { Trash2, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LocalSet } from "../WorkoutLogger"

const SET_TYPE_LABEL: Record<string, string> = {
  working: "W",
  warmup: "WU",
  drop: "D",
  failure: "F",
}

const SET_TYPE_CLASS: Record<string, string> = {
  working: "bg-brand/12 text-brand border-brand/20",
  warmup:  "bg-fg-muted/8 text-fg-muted border-border",
  drop:    "bg-orange-500/12 text-orange-400 border-orange-500/20",
  failure: "bg-danger/12 text-danger border-danger/20",
}

export function SetRow({ set, onRemove }: { set: LocalSet; onRemove: () => void }) {


  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10, height: 0 }}
      animate={{ opacity: set.saving ? 0.5 : 1, x: 0, height: "auto" }}
      exit={{ opacity: 0, x: 10, height: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 py-2.5 overflow-hidden"
    >
      {/* Set type badge */}
      <span className={cn(
        "min-w-[2.25rem] text-center text-[11px] font-bold px-1.5 py-0.5 rounded-md border shrink-0",
        SET_TYPE_CLASS[set.set_type] ?? SET_TYPE_CLASS.working
      )}>
        {SET_TYPE_LABEL[set.set_type] ?? "W"}
      </span>

      {/* Weight × reps */}
      <div className="flex-1 flex items-baseline gap-1">
        <span className="text-base font-bold text-fg tabular-nums">{set.weight_kg ?? "—"}</span>
        <span className="text-xs text-fg-muted">kg</span>
        <span className="text-xs text-fg-subtle mx-0.5">×</span>
        <span className="text-base font-bold text-fg tabular-nums">{set.reps ?? "—"}</span>
        <span className="text-xs text-fg-muted">reps</span>
        {set.rir !== null && set.rir !== undefined && (
          <span className="text-xs text-fg-subtle ml-1">@{set.rir} RIR</span>
        )}
      </div>

      {/* e1RM */}
      {!!set.e1rm_kg && (
        <span className="text-xs font-medium text-fg-muted shrink-0 tabular-nums">
          {set.e1rm_kg.toFixed(1)} 1RM
        </span>
      )}

      {/* PR badge */}
      {set.is_pr && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/12 px-2 py-0.5 text-[11px] font-bold text-amber-400 shrink-0"
        >
          <Trophy className="h-2.5 w-2.5" />
          PR
        </motion.div>
      )}

      {/* Remove */}
      <button
        type="button"
        onClick={() => setTimeout(onRemove, 120)}
        className="shrink-0 h-7 w-7 rounded-lg flex items-center justify-center text-fg-subtle hover:text-danger hover:bg-danger/10 transition-all active:scale-90"
        aria-label="Remove set"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}
