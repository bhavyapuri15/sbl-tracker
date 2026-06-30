"use client"

import { motion } from "framer-motion"
import { Zap, RefreshCw, TrendingDown, AlertTriangle, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Suggestion } from "@/types/domain"

const KIND_CONFIG = {
  add_weight: {
    icon: Zap,
    label: "Level up",
    color: "text-brand",
    bg: "bg-brand/8",
    border: "border-brand/20",
    dot: "bg-brand",
  },
  add_reps: {
    icon: Zap,
    label: "Level up",
    color: "text-brand",
    bg: "bg-brand/8",
    border: "border-brand/20",
    dot: "bg-brand",
  },
  deload: {
    icon: RefreshCw,
    label: "Consider a deload",
    color: "text-amber-400",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  lagging_muscle: {
    icon: TrendingDown,
    label: "Lagging muscle",
    color: "text-blue-400",
    bg: "bg-blue-500/8",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  volume_warning: {
    icon: AlertTriangle,
    label: "Volume warning",
    color: "text-orange-400",
    bg: "bg-orange-500/8",
    border: "border-orange-500/20",
    dot: "bg-orange-400",
  },
  calorie_adjust: {
    icon: Scale,
    label: "Calorie adjustment",
    color: "text-violet-400",
    bg: "bg-violet-500/8",
    border: "border-violet-500/20",
    dot: "bg-violet-400",
  },
} as const

interface SuggestionCardProps {
  suggestion: Suggestion
  delay?: number
}

export function SuggestionCard({ suggestion, delay = 0 }: SuggestionCardProps) {
  const cfg = KIND_CONFIG[suggestion.kind]
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn("flex gap-3.5 rounded-2xl border p-4", cfg.bg, cfg.border)}
    >
      {/* Icon */}
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          cfg.bg,
        )}
      >
        <Icon className={cn("h-4 w-4", cfg.color)} />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", cfg.color)}>
          {cfg.label}
        </p>
        <p className="text-sm text-fg leading-relaxed">{suggestion.message}</p>
      </div>
    </motion.div>
  )
}
