"use client"

import { useState, useTransition } from "react"
import { Sheet } from "@/components/ui/Sheet"
import { Input } from "@/components/ui/Input"
import { NumberInput } from "@/components/ui/NumberInput"
import { Button } from "@/components/ui/Button"
import { logFood } from "@/lib/actions/nutrition"
import { cn } from "@/lib/utils"

const SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const
type Slot = typeof SLOTS[number]

interface AddFoodSheetProps {
  open: boolean
  onClose: () => void
  defaultSlot?: Slot
}

export function AddFoodSheet({ open, onClose, defaultSlot = "lunch" }: AddFoodSheetProps) {
  const [name, setName] = useState("")
  const [calories, setCalories] = useState<number | "">("")
  const [protein, setProtein] = useState<number | "">("")
  const [carbs, setCarbs] = useState<number | "">("")
  const [fat, setFat] = useState<number | "">("")
  const [slot, setSlot] = useState<Slot>(defaultSlot)
  const [isPending, startTransition] = useTransition()

  function reset() {
    setName("")
    setCalories("")
    setProtein("")
    setCarbs("")
    setFat("")
  }

  const canLog = name.trim().length > 0 && calories !== "" && (calories as number) > 0

  function handleLog() {
    if (!canLog) return
    startTransition(async () => {
      await logFood({
        food_name: name.trim(),
        calories: calories as number,
        protein_g: protein === "" ? null : protein as number,
        carbs_g: carbs === "" ? null : carbs as number,
        fat_g: fat === "" ? null : fat as number,
        meal_slot: slot,
      })
      reset()
      onClose()
    })
  }

  return (
    <Sheet open={open} onClose={onClose} title="Log food" snapTo="full">
      <div className="px-5 pb-8 pt-4 space-y-5">
        {/* Meal slot */}
        <div className="grid grid-cols-4 gap-1.5">
          {SLOTS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSlot(s)}
              className={cn(
                "py-2 rounded-xl text-xs font-bold capitalize transition-all active:scale-95",
                slot === s
                  ? "bg-brand text-card shadow-sm shadow-brand/20"
                  : "bg-elevated text-fg-muted hover:text-fg",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Name */}
        <Input
          id="food-name"
          label="Food name"
          placeholder="e.g. Chicken breast, 200g"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />

        {/* Calories */}
        <NumberInput
          label="Calories"
          value={calories}
          onChange={setCalories}
          step={50}
          min={1}
          unit="kcal"
          inputMode="numeric"
        />

        {/* Macros */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">
            Macros <span className="text-fg-subtle/50 normal-case tracking-normal font-normal">(optional)</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <NumberInput label="Protein" value={protein} onChange={setProtein} step={5}   min={0} unit="g" inputMode="decimal" />
            <NumberInput label="Carbs"   value={carbs}   onChange={setCarbs}   step={5}   min={0} unit="g" inputMode="decimal" />
            <NumberInput label="Fat"     value={fat}     onChange={setFat}     step={2.5} min={0} unit="g" inputMode="decimal" />
          </div>
        </div>

        {/* Submit */}
        <Button
          className="w-full"
          disabled={!canLog}
          loading={isPending}
          onClick={handleLog}
        >
          Log {slot}
        </Button>
      </div>
    </Sheet>
  )
}
