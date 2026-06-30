"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { StrengthTier } from "@/types/domain"

const TIER_CONFIG: Record<StrengthTier, { label: string; color: string; bg: string; border: string; glow?: boolean }> = {
  unranked:     { label: "—",            color: "text-fg-subtle",   bg: "bg-elevated",        border: "border-border/40" },
  beginner:     { label: "Beginner",     color: "text-blue-400",    bg: "bg-blue-500/10",     border: "border-blue-500/20" },
  novice:       { label: "Novice",       color: "text-violet-400",  bg: "bg-violet-500/10",   border: "border-violet-500/20" },
  intermediate: { label: "Intermediate", color: "text-amber-400",   bg: "bg-amber-500/10",    border: "border-amber-500/20" },
  advanced:     { label: "Advanced",     color: "text-orange-400",  bg: "bg-orange-500/10",   border: "border-orange-500/20" },
  elite:        { label: "Elite",        color: "text-brand",       bg: "bg-brand/10",        border: "border-brand/25", glow: true },
}

interface TierBadgeProps {
  tier: StrengthTier
  size?: "sm" | "md" | "lg"
}

export function TierBadge({ tier, size = "sm" }: TierBadgeProps) {
  const cfg = TIER_CONFIG[tier]
  return (
    <motion.span
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-bold uppercase tracking-wide",
        cfg.color, cfg.bg, cfg.border,
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-3 py-1 text-xs",
        size === "lg" && "px-4 py-1.5 text-sm",
        cfg.glow && "shadow-sm shadow-brand/25",
      )}
    >
      {cfg.label}
      {tier === "elite" && <span className="text-[8px] leading-none">★</span>}
    </motion.span>
  )
}
