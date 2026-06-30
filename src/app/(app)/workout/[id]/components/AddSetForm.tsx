"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { NumberInput } from "@/components/ui/NumberInput"
import { cn } from "@/lib/utils"
import type { LocalSet } from "../WorkoutLogger"

type SetType = LocalSet["set_type"]
const RIR_OPTIONS = [0, 1, 2, 3, 4]
const SET_TYPES: SetType[] = ["working", "warmup", "drop", "failure"]

export function AddSetForm({
  setNumber,
  prevSet,
  onLog,
}: {
  setNumber: number
  prevSet?: { weight_kg: number; reps: number }
  onLog: (set: Omit<LocalSet, "id" | "is_pr" | "e1rm_kg" | "saving">) => void
}) {
  const [weight, setWeight] = useState<number | "">(prevSet?.weight_kg ?? "")
  const [reps, setReps] = useState<number | "">(prevSet?.reps ?? "")
  const [rir, setRir] = useState<number | null>(2)
  const [setType, setSetType] = useState<SetType>("working")
  const [showTypeMenu, setShowTypeMenu] = useState(false)

  const canLog = weight !== "" && reps !== "" && (weight as number) > 0 && (reps as number) > 0

  function handleLog() {
    if (!canLog) return
    onLog({ set_number: setNumber, weight_kg: weight as number, reps: reps as number, rir, set_type: setType })
    setRir(2)
  }

  return (
    <div className="pt-3 pb-1 space-y-3">
      {/* Last time hint */}
      {prevSet && (
        <p className="text-xs text-fg-subtle px-0.5">
          Last time — <span className="text-fg-muted font-semibold">{prevSet.weight_kg} kg × {prevSet.reps}</span>
        </p>
      )}

      {/* Inputs */}
      <div className="flex gap-2.5">
        <NumberInput
          label="Weight (kg)" value={weight} onChange={setWeight}
          step={2.5} min={0} unit="kg" inputMode="decimal" className="flex-1"
        />
        <NumberInput
          label="Reps" value={reps} onChange={setReps}
          step={1} min={1} inputMode="numeric" className="flex-1"
        />
      </div>

      {/* RIR */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-fg-subtle shrink-0 w-6">RIR</span>
        <div className="flex gap-1.5 flex-1">
          {RIR_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRir(rir === r ? null : r)}
              className={cn(
                "flex-1 h-8 rounded-lg text-sm font-bold transition-all active:scale-95",
                rir === r
                  ? "bg-brand text-card shadow-sm shadow-brand/20"
                  : "bg-elevated text-fg-muted hover:bg-card-hover"
              )}
            >
              {r}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setRir(null)}
            className={cn(
              "px-2.5 h-8 rounded-lg text-xs font-semibold transition-all",
              rir === null ? "bg-brand/12 text-brand" : "text-fg-subtle hover:bg-elevated"
            )}
          >
            Skip
          </button>
        </div>
      </div>

      {/* Set type + log button */}
      <div className="flex gap-2">
        {/* Set type dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowTypeMenu((v) => !v)}
            className={cn(
              "h-11 px-3 rounded-xl border flex items-center gap-1.5 text-sm font-bold transition-colors",
              setType === "working"
                ? "bg-brand/10 text-brand border-brand/25"
                : "bg-elevated text-fg-muted border-border"
            )}
          >
            {setType === "working" ? "W" : setType === "warmup" ? "WU" : setType === "drop" ? "D" : "F"}
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <AnimatePresence>
            {showTypeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className="absolute bottom-full left-0 mb-2 z-20 bg-card border border-border rounded-xl shadow-float min-w-[140px] overflow-hidden"
              >
                {SET_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setSetType(t); setShowTypeMenu(false) }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                      t === setType ? "bg-brand/8 text-brand font-semibold" : "text-fg hover:bg-elevated"
                    )}
                  >
                    <span className="capitalize">{t}</span>
                    {t === setType && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Log button */}
        <motion.button
          type="button"
          onClick={handleLog}
          disabled={!canLog}
          whileTap={canLog ? { scale: 0.97 } : undefined}
          className={cn(
            "flex-1 h-11 rounded-xl text-sm font-bold transition-all",
            canLog
              ? "bg-brand text-card shadow-md shadow-brand/20 hover:brightness-110"
              : "bg-elevated text-fg-subtle cursor-not-allowed"
          )}
        >
          Log set {setNumber}
        </motion.button>
      </div>
    </div>
  )
}
