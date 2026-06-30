"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StrengthCard } from "./components/StrengthCard"
import { MuscleMap } from "./components/MuscleMap"
import { VolumeBar } from "./components/VolumeBar"
import { cn } from "@/lib/utils"
import { SBL } from "@/config/sbl"
import type { StrengthTier } from "@/types/domain"
import type { E1RMPoint } from "./components/E1RMChart"

type Tab = "strength" | "volume" | "body"

export interface PRWithRanking {
  exerciseId: string
  name: string
  slug: string
  e1rm: number
  weightKg: number
  reps: number
  tier: StrengthTier
  nextTier: StrengthTier | null
  nextThreshold: number | null
  pctToNext: number
  history: E1RMPoint[]
}

interface ProgressClientProps {
  rankings: PRWithRanking[]
  weeklyVolume: Record<string, number>
}

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "strength", label: "Strength" },
  { key: "volume",   label: "Volume" },
  { key: "body",     label: "Body" },
]

const MUSCLES = Object.keys(SBL.volumeLandmarks)

export function ProgressClient({ rankings, weeklyVolume }: ProgressClientProps) {
  const [tab, setTab] = useState<Tab>("strength")

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="relative flex gap-1 p-1 rounded-xl bg-elevated">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className="relative flex-1 py-2 text-xs font-bold uppercase tracking-wide"
          >
            {tab === t.key && (
              <motion.div
                layoutId="progress-tab-bg"
                className="absolute inset-0 rounded-lg bg-card shadow-sm"
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              />
            )}
            <span className={cn(
              "relative z-10 transition-colors duration-150",
              tab === t.key ? "text-fg" : "text-fg-muted"
            )}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        {tab === "strength" && (
          <motion.div
            key="strength"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {rankings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="h-16 w-16 rounded-2xl bg-elevated flex items-center justify-center">
                  <span className="font-display text-3xl text-fg-subtle leading-none">—</span>
                </div>
                <div>
                  <p className="text-base font-bold text-fg">No strength data yet</p>
                  <p className="mt-1.5 text-sm text-fg-muted max-w-xs leading-relaxed">
                    Log working sets to start ranking your lifts and tracking e1RM over time.
                  </p>
                </div>
              </div>
            ) : (
              rankings.map((r, i) => (
                <StrengthCard
                  key={r.exerciseId}
                  exerciseId={r.exerciseId}
                  name={r.name}
                  e1rm={r.e1rm}
                  weightKg={r.weightKg}
                  reps={r.reps}
                  tier={r.tier}
                  nextTier={r.nextTier}
                  nextThreshold={r.nextThreshold}
                  pctToNext={r.pctToNext}
                  history={r.history}
                  delay={i * 0.055}
                />
              ))
            )}
          </motion.div>
        )}

        {tab === "volume" && (
          <motion.div
            key="volume"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <MuscleMap volume={weeklyVolume} />

            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">Weekly Volume</p>
                <div className="flex-1 border-t border-border/40" />
              </div>
              <div className="space-y-4">
                {MUSCLES.map((muscle, i) => {
                  const lm = SBL.volumeLandmarks[muscle]
                  return (
                    <VolumeBar
                      key={muscle}
                      muscle={muscle}
                      sets={weeklyVolume[muscle] ?? 0}
                      mev={lm.mev}
                      mav={lm.mavLow}
                      mrv={lm.mrv}
                      delay={i * 0.04}
                    />
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {tab === "body" && (
          <motion.div
            key="body"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-elevated flex items-center justify-center">
              <span className="font-display text-3xl text-fg-subtle leading-none">B</span>
            </div>
            <div>
              <p className="text-base font-bold text-fg">Body metrics — Phase 4</p>
              <p className="mt-1.5 text-sm text-fg-muted max-w-xs leading-relaxed">
                Weight trend, measurements, BMR/TDEE, and body composition analysis coming next.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
