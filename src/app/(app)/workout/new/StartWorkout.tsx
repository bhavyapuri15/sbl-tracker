"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { createWorkoutSession } from "@/lib/actions/workout"
import { SBL, type SplitKey } from "@/config/sbl"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

const SPLIT_ABBR: Record<SplitKey, string> = {
  full_body:   "FB",
  upper_lower: "UL",
  ppl:         "PPL",
  bro_split:   "BS",
}

const SPLIT_NAMES: Record<SplitKey, string[]> = {
  full_body:   ["Full Body A", "Full Body B", "Full Body C"],
  upper_lower: ["Upper A", "Lower A", "Upper B", "Lower B"],
  ppl:         ["Push", "Pull", "Legs"],
  bro_split:   ["Chest & Tris", "Back & Bis", "Legs", "Shoulders"],
}

export function StartWorkout() {
  const [name, setName] = useState("")
  const [split, setSplit] = useState<SplitKey | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleStart() {
    startTransition(async () => {
      await createWorkoutSession(name)
    })
  }

  return (
    <div className="space-y-6">

      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="space-y-3"
      >
        <Input
          id="workout-name"
          label="Session name"
          placeholder="e.g. Push Day, Upper A…"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        {/* Quick name chips */}
        <AnimatePresence>
          {split && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2 overflow-hidden"
            >
              {SPLIT_NAMES[split].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setName(n)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-all active:scale-95",
                    name === n
                      ? "border-brand/30 bg-brand/10 text-brand"
                      : "border-border bg-elevated text-fg-muted hover:text-fg hover:border-border"
                  )}
                >
                  {n}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Split selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.06 }}
        className="space-y-2"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">Training split (optional)</p>
        <div className="grid grid-cols-2 gap-2.5">
          {(Object.keys(SBL.splits) as SplitKey[]).map(key => {
            const s = SBL.splits[key]
            const active = split === key
            return (
              <motion.button
                key={key}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setSplit(active ? null : key)}
                className={cn(
                  "flex flex-col gap-2.5 rounded-2xl border p-4 text-left transition-all",
                  active
                    ? "border-brand/30 bg-brand/6"
                    : "border-border bg-card hover:bg-card-hover"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-display text-lg leading-none",
                    active ? "text-brand" : "text-fg-muted"
                  )}>
                    {SPLIT_ABBR[key]}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-fg-subtle">
                    {s.daysPerWeek.join("/")}d
                  </span>
                </div>
                <div>
                  <p className={cn("text-sm font-bold", active ? "text-fg" : "text-fg")}>{s.label}</p>
                  <p className="mt-0.5 text-xs text-fg-muted line-clamp-2 leading-relaxed">{s.rationale}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Science note */}
      <AnimatePresence>
        {split && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4"
          >
            <Zap className="h-4 w-4 text-brand shrink-0 mt-0.5" />
            <p className="text-xs text-fg-muted leading-relaxed">
              {SBL.splits[split].rationale}{" "}
              <span className="text-fg-subtle">~{SBL.splits[split].freqPerMuscle}× per muscle / week.</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.12 }}
      >
        <motion.button
          type="button"
          onClick={handleStart}
          disabled={isPending}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-bold transition-all",
            isPending
              ? "bg-brand/50 text-card/50 cursor-not-allowed"
              : "bg-brand text-card shadow-lg shadow-brand/20 hover:brightness-110"
          )}
        >
          {isPending ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-card border-t-transparent" />
          ) : (
            <>
              Start workout
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  )
}
