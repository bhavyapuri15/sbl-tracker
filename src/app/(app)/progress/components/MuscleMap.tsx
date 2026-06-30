"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type View = "front" | "back"

interface MuscleMapProps {
  volume: Record<string, number>
}

const LIME = "oklch(89% 0.23 128)"
const BODY_FILL = "oklch(16% 0.004 60)"
const BODY_STROKE = "oklch(22% 0.005 60)"

function opacity(muscle: string, volume: Record<string, number>): number {
  const sets = volume[muscle] ?? 0
  if (sets === 0) return 0.04
  if (sets < 4)  return 0.18
  if (sets < 8)  return 0.38
  if (sets < 14) return 0.60
  if (sets < 20) return 0.80
  return 0.92
}

const HOVER_LABEL: Record<string, string> = {
  chest: "Chest", shoulders: "Shoulders", biceps: "Biceps", abs: "Abs",
  quads: "Quads", calves: "Calves", back: "Back", traps: "Traps",
  triceps: "Triceps", glutes: "Glutes", hamstrings: "Hamstrings",
}

function BodyBase() {
  return (
    <>
      {/* Head */}
      <circle cx="50" cy="16" r="12" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.6" />
      {/* Neck */}
      <rect x="45" y="27" width="10" height="10" rx="2" fill={BODY_FILL} />
      {/* Torso */}
      <path
        d="M 24 38 Q 50 34 76 38 L 78 62 Q 76 96 72 122 L 64 136 L 36 136 L 28 122 Q 24 96 22 62 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.6"
      />
      {/* Left upper arm */}
      <rect x="9" y="38" width="14" height="44" rx="6" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
      {/* Right upper arm */}
      <rect x="77" y="38" width="14" height="44" rx="6" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
      {/* Left forearm */}
      <rect x="10" y="80" width="12" height="36" rx="5" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
      {/* Right forearm */}
      <rect x="78" y="80" width="12" height="36" rx="5" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
      {/* Left thigh */}
      <rect x="27" y="135" width="19" height="56" rx="7" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
      {/* Right thigh */}
      <rect x="54" y="135" width="19" height="56" rx="7" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
      {/* Left calf */}
      <rect x="28" y="189" width="16" height="44" rx="6" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
      {/* Right calf */}
      <rect x="56" y="189" width="16" height="44" rx="6" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
    </>
  )
}

interface HighlightProps {
  muscle: string
  volume: Record<string, number>
  onEnter: (m: string) => void
  onLeave: () => void
  delay?: number
}

function Highlight({ muscle, volume, onEnter, onLeave, delay = 0, children }: HighlightProps & { children: React.ReactNode }) {
  const op = opacity(muscle, volume)
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: op }}
      transition={{ duration: 0.4, delay }}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => onEnter(muscle)}
      onMouseLeave={onLeave}
    >
      <g fill={LIME}>{children}</g>
    </motion.g>
  )
}

export function MuscleMap({ volume }: MuscleMapProps) {
  const [view, setView] = useState<View>("front")
  const [hovered, setHovered] = useState<string | null>(null)

  const enter = (m: string) => setHovered(m)
  const leave = () => setHovered(null)

  const hovSets = hovered ? (volume[hovered] ?? 0) : 0

  return (
    <div className="space-y-4">
      {/* Front / Back toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-elevated w-fit mx-auto">
        {(["front", "back"] as View[]).map(v => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "relative px-5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors",
              view === v ? "text-fg" : "text-fg-muted hover:text-fg"
            )}
          >
            {view === v && (
              <motion.span
                layoutId="muscle-view-pill"
                className="absolute inset-0 rounded-lg bg-card shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{v}</span>
          </button>
        ))}
      </div>

      {/* SVG body */}
      <div className="relative mx-auto w-40">
        <AnimatePresence mode="wait">
          {view === "front" ? (
            <motion.svg
              key="front"
              viewBox="0 0 100 240"
              className="w-full h-auto"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              <defs>
                <clipPath id="front-torso">
                  <path d="M 24 38 Q 50 34 76 38 L 78 62 Q 76 96 72 122 L 64 136 L 36 136 L 28 122 Q 24 96 22 62 Z" />
                </clipPath>
                <clipPath id="front-left-arm">
                  <rect x="9" y="38" width="14" height="44" rx="6" />
                </clipPath>
                <clipPath id="front-right-arm">
                  <rect x="77" y="38" width="14" height="44" rx="6" />
                </clipPath>
                <clipPath id="front-left-thigh">
                  <rect x="27" y="135" width="19" height="56" rx="7" />
                </clipPath>
                <clipPath id="front-right-thigh">
                  <rect x="54" y="135" width="19" height="56" rx="7" />
                </clipPath>
                <clipPath id="front-left-calf">
                  <rect x="28" y="189" width="16" height="44" rx="6" />
                </clipPath>
                <clipPath id="front-right-calf">
                  <rect x="56" y="189" width="16" height="44" rx="6" />
                </clipPath>
              </defs>

              <BodyBase />

              {/* Chest */}
              <Highlight muscle="chest" volume={volume} onEnter={enter} onLeave={leave} delay={0.05}>
                <ellipse cx="50" cy="68" rx="22" ry="16" clipPath="url(#front-torso)" />
              </Highlight>

              {/* Front delts */}
              <Highlight muscle="shoulders" volume={volume} onEnter={enter} onLeave={leave} delay={0.1}>
                <ellipse cx="22" cy="52" rx="11" ry="14" clipPath="url(#front-torso)" />
                <ellipse cx="78" cy="52" rx="11" ry="14" clipPath="url(#front-torso)" />
              </Highlight>

              {/* Biceps */}
              <Highlight muscle="biceps" volume={volume} onEnter={enter} onLeave={leave} delay={0.15}>
                <ellipse cx="16" cy="60" rx="6" ry="18" clipPath="url(#front-left-arm)" />
                <ellipse cx="84" cy="60" rx="6" ry="18" clipPath="url(#front-right-arm)" />
              </Highlight>

              {/* Abs */}
              <Highlight muscle="abs" volume={volume} onEnter={enter} onLeave={leave} delay={0.2}>
                <rect x="37" y="88" width="26" height="40" rx="4" clipPath="url(#front-torso)" />
              </Highlight>

              {/* Quads */}
              <Highlight muscle="quads" volume={volume} onEnter={enter} onLeave={leave} delay={0.25}>
                <ellipse cx="36.5" cy="163" rx="11" ry="24" clipPath="url(#front-left-thigh)" />
                <ellipse cx="63.5" cy="163" rx="11" ry="24" clipPath="url(#front-right-thigh)" />
              </Highlight>

              {/* Calves */}
              <Highlight muscle="calves" volume={volume} onEnter={enter} onLeave={leave} delay={0.3}>
                <ellipse cx="36" cy="209" rx="8" ry="20" clipPath="url(#front-left-calf)" />
                <ellipse cx="64" cy="209" rx="8" ry="20" clipPath="url(#front-right-calf)" />
              </Highlight>
            </motion.svg>
          ) : (
            <motion.svg
              key="back"
              viewBox="0 0 100 240"
              className="w-full h-auto"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
            >
              <defs>
                <clipPath id="back-torso">
                  <path d="M 22 38 Q 50 32 78 38 L 82 68 Q 80 102 74 126 L 64 136 L 36 136 L 26 126 Q 20 102 18 68 Z" />
                </clipPath>
                <clipPath id="back-left-arm">
                  <rect x="8" y="38" width="14" height="44" rx="6" />
                </clipPath>
                <clipPath id="back-right-arm">
                  <rect x="78" y="38" width="14" height="44" rx="6" />
                </clipPath>
                <clipPath id="back-left-thigh">
                  <rect x="27" y="135" width="19" height="56" rx="7" />
                </clipPath>
                <clipPath id="back-right-thigh">
                  <rect x="54" y="135" width="19" height="56" rx="7" />
                </clipPath>
                <clipPath id="back-left-calf">
                  <rect x="28" y="189" width="16" height="44" rx="6" />
                </clipPath>
                <clipPath id="back-right-calf">
                  <rect x="56" y="189" width="16" height="44" rx="6" />
                </clipPath>
              </defs>

              {/* Wider lats torso outline */}
              <circle cx="50" cy="16" r="12" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.6" />
              <rect x="45" y="27" width="10" height="10" rx="2" fill={BODY_FILL} />
              <path
                d="M 22 38 Q 50 32 78 38 L 82 68 Q 80 102 74 126 L 64 136 L 36 136 L 26 126 Q 20 102 18 68 Z"
                fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.6"
              />
              <rect x="8" y="38" width="14" height="44" rx="6" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
              <rect x="78" y="38" width="14" height="44" rx="6" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
              <rect x="9" y="80" width="12" height="36" rx="5" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
              <rect x="79" y="80" width="12" height="36" rx="5" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
              <rect x="27" y="135" width="19" height="56" rx="7" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
              <rect x="54" y="135" width="19" height="56" rx="7" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
              <rect x="28" y="189" width="16" height="44" rx="6" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />
              <rect x="56" y="189" width="16" height="44" rx="6" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="0.5" />

              {/* Traps */}
              <Highlight muscle="traps" volume={volume} onEnter={enter} onLeave={leave} delay={0.05}>
                <ellipse cx="50" cy="46" rx="28" ry="12" clipPath="url(#back-torso)" />
              </Highlight>

              {/* Lats / Back */}
              <Highlight muscle="back" volume={volume} onEnter={enter} onLeave={leave} delay={0.1}>
                <path
                  d="M 26 56 Q 50 52 74 56 L 76 98 Q 70 116 50 120 Q 30 116 24 98 Z"
                  clipPath="url(#back-torso)"
                />
              </Highlight>

              {/* Rear delts */}
              <Highlight muscle="shoulders" volume={volume} onEnter={enter} onLeave={leave} delay={0.15}>
                <ellipse cx="21" cy="50" rx="12" ry="14" clipPath="url(#back-torso)" />
                <ellipse cx="79" cy="50" rx="12" ry="14" clipPath="url(#back-torso)" />
              </Highlight>

              {/* Triceps */}
              <Highlight muscle="triceps" volume={volume} onEnter={enter} onLeave={leave} delay={0.2}>
                <ellipse cx="15" cy="62" rx="6" ry="19" clipPath="url(#back-left-arm)" />
                <ellipse cx="85" cy="62" rx="6" ry="19" clipPath="url(#back-right-arm)" />
              </Highlight>

              {/* Glutes */}
              <Highlight muscle="glutes" volume={volume} onEnter={enter} onLeave={leave} delay={0.25}>
                <ellipse cx="38" cy="143" rx="17" ry="12" clipPath="url(#back-left-thigh)" />
                <ellipse cx="62" cy="143" rx="17" ry="12" clipPath="url(#back-right-thigh)" />
              </Highlight>

              {/* Hamstrings */}
              <Highlight muscle="hamstrings" volume={volume} onEnter={enter} onLeave={leave} delay={0.3}>
                <ellipse cx="36.5" cy="166" rx="11" ry="26" clipPath="url(#back-left-thigh)" />
                <ellipse cx="63.5" cy="166" rx="11" ry="26" clipPath="url(#back-right-thigh)" />
              </Highlight>

              {/* Calves (back) */}
              <Highlight muscle="calves" volume={volume} onEnter={enter} onLeave={leave} delay={0.35}>
                <ellipse cx="36" cy="210" rx="8" ry="20" clipPath="url(#back-left-calf)" />
                <ellipse cx="64" cy="210" rx="8" ry="20" clipPath="url(#back-right-calf)" />
              </Highlight>
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Hover label */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute top-2 right-0 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-fg shadow-float pointer-events-none"
            >
              {HOVER_LABEL[hovered] ?? hovered}{" "}
              <span className="text-brand font-bold">{hovSets}</span>
              <span className="text-fg-muted font-normal">/wk</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-5 text-[10px] text-fg-subtle">
        {[["bg-brand/15", "Low"], ["bg-brand/50", "Optimal"], ["bg-brand/85", "High"]].map(([cls, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={cn("h-2 w-5 rounded-full", cls)} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
