"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { MacroRing } from "./components/MacroRing"
import { FoodEntry } from "./components/FoodEntry"
import { AddFoodSheet } from "./components/AddFoodSheet"
import type { FoodEntry as FoodEntryType, NutritionGoal } from "@/types/domain"

const SLOT_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  any: "Other",
}

const SLOT_ORDER = ["breakfast", "lunch", "dinner", "snack", "any"]

interface NutritionClientProps {
  goal: NutritionGoal | null
  entries: FoodEntryType[]
}

export function NutritionClient({ goal, entries }: NutritionClientProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [defaultSlot, setDefaultSlot] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch")

  // Totals from today's entries
  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories ?? 0),
      protein: acc.protein + (e.protein_g ?? 0),
      carbs: acc.carbs + (e.carbs_g ?? 0),
      fat: acc.fat + (e.fat_g ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  // Group by meal slot
  const bySlot = entries.reduce<Record<string, FoodEntryType[]>>((acc, e) => {
    const s = e.meal_slot ?? "any"
    if (!acc[s]) acc[s] = []
    acc[s].push(e)
    return acc
  }, {})

  const slots = SLOT_ORDER.filter(s => bySlot[s]?.length)

  // No goal set — prompt setup
  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
        <div className="h-16 w-16 rounded-2xl bg-elevated flex items-center justify-center">
          <span className="font-display text-3xl text-fg-subtle leading-none">N</span>
        </div>
        <div>
          <p className="text-base font-bold text-fg">Set up your nutrition targets</p>
          <p className="mt-1.5 text-sm text-fg-muted max-w-xs leading-relaxed">
            Complete your profile — sex, date of birth, activity level, goal, and body weight — to get science-based calorie and macro targets.
          </p>
        </div>
        <a
          href="/profile"
          className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-bold text-card shadow-lg shadow-brand/20 hover:brightness-110 transition-all"
        >
          Set up profile →
        </a>
      </div>
    )
  }

  const calTarget   = goal.calories_target ?? 2000
  const protTarget  = goal.protein_g ?? 150
  const carbsTarget = goal.carbs_g ?? 200
  const fatTarget   = goal.fat_g ?? 70

  const remaining = Math.max(calTarget - Math.round(totals.calories), 0)

  function openAdd(slot: "breakfast" | "lunch" | "dinner" | "snack") {
    setDefaultSlot(slot)
    setAddOpen(true)
  }

  return (
    <>
      <div className="space-y-6 pb-24">

        {/* ── Macro rings ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-border bg-card p-5 space-y-5"
        >
          {/* Calorie ring — center hero */}
          <div className="flex flex-col items-center gap-1.5">
            <MacroRing
              label="Calories"
              consumed={Math.round(totals.calories)}
              target={calTarget}
              unit=" kcal"
              color="oklch(89% 0.23 128)"
              size={110}
              strokeWidth={10}
              delay={0}
              large
            />
            <p className="text-xs text-fg-muted">
              {remaining > 0
                ? <><span className="font-bold text-fg">{remaining}</span> kcal remaining</>
                : <span className="text-brand font-semibold">Daily goal reached ✓</span>
              }
            </p>
          </div>

          {/* Macro rings row */}
          <div className="flex justify-around">
            <MacroRing
              label="Protein"
              consumed={Math.round(totals.protein)}
              target={protTarget}
              color="oklch(70% 0.18 250)"
              size={80}
              delay={0.1}
            />
            <MacroRing
              label="Carbs"
              consumed={Math.round(totals.carbs)}
              target={carbsTarget}
              color="oklch(78% 0.16 85)"
              size={80}
              delay={0.18}
            />
            <MacroRing
              label="Fat"
              consumed={Math.round(totals.fat)}
              target={fatTarget}
              color="oklch(72% 0.17 50)"
              size={80}
              delay={0.26}
            />
          </div>
        </motion.div>

        {/* ── Food log ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">Today&apos;s food</p>
            <div className="flex-1 border-t border-border/40" />
          </div>

          {slots.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3 text-center">
              <p className="text-sm text-fg-muted">Nothing logged yet today.</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {slots.map(slot => (
                <motion.div
                  key={slot}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  {/* Slot header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
                    <p className="text-xs font-bold uppercase tracking-wide text-fg-subtle">
                      {SLOT_LABEL[slot] ?? slot}
                    </p>
                    <p className="text-xs font-semibold text-fg-muted tabular-nums">
                      {(bySlot[slot] ?? []).reduce((s, e) => s + (e.calories ?? 0), 0)} kcal
                    </p>
                  </div>
                  <div className="px-4">
                    <AnimatePresence initial={false}>
                      {(bySlot[slot] ?? []).map(entry => (
                        <FoodEntry key={entry.id} entry={entry} />
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="px-4 pb-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => openAdd(slot as "breakfast" | "lunch" | "dinner" | "snack")}
                      className="flex items-center gap-1.5 text-xs text-fg-subtle hover:text-brand transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Add to {SLOT_LABEL[slot]?.toLowerCase()}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* FAB */}
      <motion.button
        type="button"
        onClick={() => setAddOpen(true)}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-card shadow-lg shadow-brand/30 hover:brightness-110 transition-all"
        aria-label="Log food"
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      <AddFoodSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        defaultSlot={defaultSlot}
      />
    </>
  )
}
