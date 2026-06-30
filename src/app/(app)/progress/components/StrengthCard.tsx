"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TierBadge } from "./TierBadge"
import { E1RMChart } from "./E1RMChart"
import { cn } from "@/lib/utils"
import type { StrengthTier } from "@/types/domain"
import type { E1RMPoint } from "./E1RMChart"

const TIER_BAR_COLOR: Partial<Record<StrengthTier, string>> = {
  unranked:     "bg-blue-400",
  beginner:     "bg-blue-400",
  novice:       "bg-violet-400",
  intermediate: "bg-amber-400",
  advanced:     "bg-orange-400",
  elite:        "bg-brand",
}

function useCountUp(target: number, duration = 800, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const timer = setTimeout(() => {
      let start: number | null = null
      const step = (ts: number) => {
        if (!start) start = ts
        const pct = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - pct, 3)
        setVal(parseFloat((eased * target).toFixed(1)))
        if (pct < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [target, duration, delay])
  return val
}

export interface StrengthCardProps {
  exerciseId: string
  name: string
  e1rm: number
  weightKg: number
  reps: number
  tier: StrengthTier
  nextTier: StrengthTier | null
  nextThreshold: number | null
  pctToNext: number
  history: E1RMPoint[]
  delay?: number
}

export function StrengthCard({
  exerciseId,
  name,
  e1rm,
  weightKg,
  reps,
  tier,
  nextTier,
  nextThreshold,
  pctToNext,
  history,
  delay = 0,
}: StrengthCardProps) {
  const displayed = useCountUp(e1rm, 750, delay * 1000 + 150)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-16px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay }}
      className="rounded-2xl border border-border bg-card p-4 space-y-4"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fg-subtle truncate">{name}</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-display text-3xl leading-none text-fg tabular-nums">{displayed}</span>
            <span className="text-sm text-fg-muted">kg e1RM</span>
          </div>
          <p className="text-xs text-fg-subtle mt-0.5 tabular-nums">
            {weightKg} kg × {reps} rep{reps !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="shrink-0 mt-0.5">
          <TierBadge tier={tier} size="md" />
        </div>
      </div>

      {/* Progress to next tier */}
      {nextTier && nextThreshold ? (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wide text-fg-subtle">
              → {nextTier}
            </span>
            <span className="text-[10px] tabular-nums text-fg-subtle">
              {(nextThreshold - e1rm).toFixed(1)} kg away
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctToNext}%` }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: delay + 0.25 }}
              className={cn("h-full rounded-full", TIER_BAR_COLOR[tier] ?? "bg-brand")}
            />
          </div>
          <p className="text-[10px] text-fg-subtle/70">
            {Math.round(pctToNext)}% · target {nextThreshold.toFixed(0)} kg
          </p>
        </div>
      ) : tier === "elite" ? (
        <div className="flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/5 px-3 py-2">
          <span className="text-brand text-sm leading-none">★</span>
          <p className="text-xs font-semibold text-brand">Elite — peak strength achieved</p>
        </div>
      ) : null}

      {/* Trend chart */}
      {history.length >= 2 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-fg-subtle mb-2">
            90-day trend
          </p>
          <E1RMChart
            data={history}
            height={88}
            gradientId={`e1rm-${exerciseId.slice(0, 8)}`}
          />
        </div>
      )}
    </motion.div>
  )
}
