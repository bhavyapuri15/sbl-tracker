"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface VolumeBarProps {
  muscle: string
  sets: number
  mev: number
  mav: number
  mrv: number
  delay?: number
}

type Status = "empty" | "below_mev" | "optimal" | "high" | "over_mrv"

function getStatus(sets: number, mev: number, mav: number, mrv: number): Status {
  if (sets === 0) return "empty"
  if (sets < mev) return "below_mev"
  if (sets <= mav) return "optimal"
  if (sets <= mrv) return "high"
  return "over_mrv"
}

const BAR_COLOR: Record<Status, string> = {
  empty:     "bg-border",
  below_mev: "bg-blue-400/70",
  optimal:   "bg-brand",
  high:      "bg-amber-400",
  over_mrv:  "bg-danger",
}

const STATUS_LABEL: Record<Status, string> = {
  empty:     "No data",
  below_mev: "Below MEV",
  optimal:   "Optimal",
  high:      "Near MRV",
  over_mrv:  "Above MRV",
}

const STATUS_COLOR: Record<Status, string> = {
  empty:     "text-fg-subtle",
  below_mev: "text-blue-400",
  optimal:   "text-brand",
  high:      "text-amber-400",
  over_mrv:  "text-danger",
}

export function VolumeBar({ muscle, sets, mev, mav, mrv, delay = 0 }: VolumeBarProps) {
  const status = getStatus(sets, mev, mav, mrv)
  const pct = Math.min((sets / mrv) * 100, 103)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold capitalize text-fg">
          {muscle.replace(/_/g, " ")}
        </span>
        <div className="flex items-center gap-2.5">
          <span className={cn("text-[10px] font-bold uppercase tracking-wide", STATUS_COLOR[status])}>
            {STATUS_LABEL[status]}
          </span>
          <span className="text-xs font-bold tabular-nums text-fg-muted">
            {sets}<span className="font-normal">/wk</span>
          </span>
        </div>
      </div>

      <div className="relative h-1.5 rounded-full bg-elevated overflow-hidden">
        {/* MEV marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-border z-10"
          style={{ left: `${(mev / mrv) * 100}%` }}
        />
        {/* MAV marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-border/50 z-10"
          style={{ left: `${(mav / mrv) * 100}%` }}
        />
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: delay + 0.1 }}
          className={cn("absolute inset-y-0 left-0 rounded-full", BAR_COLOR[status])}
        />
      </div>

      <div className="flex justify-between text-[9px] text-fg-subtle/50 tabular-nums">
        <span>MEV {mev}</span>
        <span>MAV {mav}</span>
        <span>MRV {mrv}</span>
      </div>
    </motion.div>
  )
}
