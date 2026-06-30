"use client"


import { motion, AnimatePresence } from "framer-motion"
import { X, Plus } from "lucide-react"

interface RestTimerProps {
  seconds: number | null
  total?: number
  onDismiss: () => void
  onExtend: () => void
}

const RADIUS = 64
const CIRC = 2 * Math.PI * RADIUS
const SIZE = 160

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, "0")}`
}

function ringColor(s: number) {
  if (s <= 10) return "oklch(64% 0.20 25)"    // danger
  if (s <= 30) return "oklch(74% 0.16 85)"    // warning
  return "oklch(89% 0.23 128)"                 // brand lime
}

export function RestTimer({ seconds, total = 90, onDismiss, onExtend }: RestTimerProps) {
  const progress = seconds !== null ? Math.max(0, seconds / total) : 0
  const offset = CIRC * (1 - progress)
  const isLow = seconds !== null && seconds <= 10

  return (
    <AnimatePresence>
      {seconds !== null && seconds > 0 && (
        <motion.div
          initial={{ y: 120, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 120, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          className="fixed bottom-24 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
        >
          <div className="pointer-events-auto flex flex-col items-center gap-4 rounded-3xl border border-border bg-card/95 backdrop-blur-xl px-8 py-6 shadow-float">

            {/* Circular ring */}
            <div className="relative flex items-center justify-center">
              <svg width={SIZE} height={SIZE} className="-rotate-90">
                {/* Track */}
                <circle
                  cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                  fill="none"
                  stroke="oklch(20% 0.004 60)"
                  strokeWidth={5}
                />
                {/* Progress */}
                <motion.circle
                  cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                  fill="none"
                  stroke={ringColor(seconds)}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-0.5">REST</p>
                <motion.p
                  key={Math.floor(seconds / 10)}
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className={`font-display text-4xl leading-none ${isLow ? "text-danger" : "text-fg"}`}
                  style={!isLow ? undefined : undefined}
                >
                  {formatTime(seconds)}
                </motion.p>
                {isLow && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="mt-1 h-1.5 w-1.5 rounded-full bg-danger"
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onExtend}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-elevated px-4 py-2 text-sm font-semibold text-fg-muted hover:text-fg hover:bg-card-hover transition-all active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                +60s
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-card hover:brightness-110 transition-all active:scale-95"
              >
                <X className="h-3.5 w-3.5" />
                Skip
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
