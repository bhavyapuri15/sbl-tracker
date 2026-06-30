"use client"

import { useTransition } from "react"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { deleteFood } from "@/lib/actions/nutrition"
import type { FoodEntry as FoodEntryType } from "@/types/domain"

interface FoodEntryProps {
  entry: FoodEntryType
}

export function FoodEntry({ entry }: FoodEntryProps) {
  const [isPending, startTransition] = useTransition()

  const hasMacros =
    entry.protein_g !== null || entry.carbs_g !== null || entry.fat_g !== null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-fg truncate">{entry.food_name}</p>
        {hasMacros && (
          <div className="flex items-center gap-3 mt-0.5">
            {entry.protein_g !== null && (
              <span className="text-[10px] text-blue-400 font-semibold">
                P {entry.protein_g}g
              </span>
            )}
            {entry.carbs_g !== null && (
              <span className="text-[10px] text-amber-400 font-semibold">
                C {entry.carbs_g}g
              </span>
            )}
            {entry.fat_g !== null && (
              <span className="text-[10px] text-orange-400 font-semibold">
                F {entry.fat_g}g
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-bold text-fg tabular-nums">{entry.calories}</span>
        <span className="text-xs text-fg-muted">kcal</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => deleteFood(entry.id))}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-fg-subtle hover:text-danger hover:bg-danger/10 transition-all active:scale-90 disabled:opacity-40"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
