"use client"

import { motion } from "framer-motion"

const R = 36
const CIRC = 2 * Math.PI * R

interface MacroRingProps {
  label: string
  consumed: number
  target: number
  unit?: string
  color: string
  size?: number
  strokeWidth?: number
  delay?: number
  large?: boolean
}

export function MacroRing({
  label,
  consumed,
  target,
  unit = "g",
  color,
  size = 80,
  strokeWidth = 8,
  delay = 0,
  large = false,
}: MacroRingProps) {
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0
  const remaining = Math.max(target - consumed, 0)
  const over = consumed > target

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {/* SVG ring (rotated so 0% starts at top) */}
        <svg
          viewBox="0 0 100 100"
          style={{ width: size, height: size }}
          className="absolute inset-0 -rotate-90"
        >
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="oklch(16% 0.004 60)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: CIRC * (1 - pct) }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
            style={{ opacity: over ? 0.5 : 1 }}
          />
          {/* Over-target arc (red indicator) */}
          {over && (
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="oklch(64% 0.20 25)"
              strokeWidth={strokeWidth * 0.5}
              strokeDasharray={`${CIRC * Math.min((consumed - target) / target, 0.5)} ${CIRC}`}
              strokeDashoffset={CIRC * 0.25}
            />
          )}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {large ? (
            <>
              <span className="font-display text-3xl leading-none text-fg tabular-nums">
                {consumed}
              </span>
              <span className="text-[10px] text-fg-muted tabular-nums">/ {target} kcal</span>
            </>
          ) : (
            <>
              <span className="text-sm font-bold leading-none text-fg tabular-nums">{consumed}</span>
              <span className="text-[9px] text-fg-muted tabular-nums">/{target}</span>
            </>
          )}
        </div>
      </div>

      {/* Label + remaining */}
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
          {label}
        </p>
        {over ? (
          <p className="text-[9px] text-danger">+{consumed - target}{unit} over</p>
        ) : remaining === 0 ? (
          <p className="text-[9px] text-brand">Done ✓</p>
        ) : (
          <p className="text-[9px] text-fg-subtle">{remaining}{unit} left</p>
        )}
      </div>
    </div>
  )
}
