"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { NumberInput } from "@/components/ui/NumberInput"
import { Button } from "@/components/ui/Button"
import { saveProfileAndGoal } from "@/lib/actions/nutrition"
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacroTargets } from "@/lib/nutrition"
import { cn } from "@/lib/utils"
import type { Profile } from "@/types/domain"

type Goal = "cut" | "maintain" | "bulk"
type Activity = "sedentary" | "light" | "moderate" | "active" | "very_active"

const GOAL_LABELS: Record<Goal, { label: string; desc: string; emoji: string }> = {
  cut:      { label: "Cut",      desc: "Lose fat",        emoji: "↓" },
  maintain: { label: "Maintain", desc: "Stay the same",   emoji: "→" },
  bulk:     { label: "Bulk",     desc: "Build muscle",    emoji: "↑" },
}

const ACTIVITY_OPTS: Array<{ value: Activity; label: string; sub: string }> = [
  { value: "sedentary",   label: "Sedentary",  sub: "Desk job, no gym" },
  { value: "light",       label: "Light",      sub: "1-3 days/week" },
  { value: "moderate",    label: "Moderate",   sub: "3-5 days/week" },
  { value: "active",      label: "Active",     sub: "6-7 days/week" },
  { value: "very_active", label: "Very active",sub: "Twice/day" },
]

function computePreview(
  sex: string | null,
  dob: string,
  activity: string | null,
  goal: string | null,
  weight: number | "",
  height: number | "",
) {
  if (!sex || !dob || !activity || !goal || !weight || !height) return null
  try {
    const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    if (age < 10 || age > 100) return null
    const bmr = calculateBMR(weight as number, height as number, age, sex as "male" | "female")
    const tdee = calculateTDEE(bmr, activity as import("@/types/domain").ActivityLevel)
    const calories = calculateTargetCalories(tdee, goal as Goal)
    const macros = calculateMacroTargets(calories, weight as number)
    return { bmr, tdee, ...macros }
  } catch {
    return null
  }
}

interface ProfileFormProps {
  profile: Profile | null
  email: string
  latestWeightKg: number | null
  latestHeightCm: number | null
}

export function ProfileForm({ profile, email, latestWeightKg, latestHeightCm }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "")
  const [sex, setSex] = useState<"male" | "female" | null>(profile?.sex ?? null)
  const [dob, setDob] = useState(profile?.date_of_birth ?? "")
  const [activity, setActivity] = useState<Activity | null>((profile?.activity_level as Activity) ?? null)
  const [goal, setGoal] = useState<Goal | null>((profile?.goal as Goal) ?? null)
  const [weight, setWeight] = useState<number | "">(latestWeightKg ?? "")
  const [height, setHeight] = useState<number | "">(latestHeightCm ?? "")
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const preview = computePreview(sex, dob, activity, goal, weight, height)

  function handleSave() {
    startTransition(async () => {
      await saveProfileAndGoal({
        display_name: displayName || undefined,
        sex: sex ?? undefined,
        date_of_birth: dob || undefined,
        activity_level: activity ?? undefined,
        goal: goal ?? undefined,
        weight_kg: weight === "" ? null : weight as number,
        height_cm: height === "" ? null : height as number,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  async function signOut() {
    const { createBrowserClient } = await import("@supabase/ssr")
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="space-y-8 pb-10">

      {/* Account */}
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">Account</p>
        <div className="rounded-2xl border border-border bg-card px-4 py-3.5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center shrink-0">
            <span className="font-display text-base text-card leading-none">
              {(displayName || email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg truncate">{displayName || "—"}</p>
            <p className="text-xs text-fg-muted truncate">{email}</p>
          </div>
        </div>
        <Input
          id="display-name"
          label="Display name"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Your name"
        />
      </section>

      {/* Body */}
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">Body</p>

        {/* Sex */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-fg-muted">Sex (for BMR calculation)</p>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSex(s)}
                className={cn(
                  "py-3 rounded-2xl border text-sm font-bold capitalize transition-all",
                  sex === s
                    ? "border-brand/30 bg-brand/8 text-brand"
                    : "border-border bg-card text-fg-muted hover:text-fg",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* DOB */}
        <Input
          id="dob"
          label="Date of birth"
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
        />

        {/* Weight + Height */}
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Weight" value={weight} onChange={setWeight} step={0.5} min={30} unit="kg" inputMode="decimal" />
          <NumberInput label="Height" value={height} onChange={setHeight} step={1}   min={100} unit="cm" inputMode="numeric" />
        </div>
      </section>

      {/* Training */}
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">Training</p>

        {/* Activity */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-fg-muted">Activity level</p>
          <div className="space-y-2">
            {ACTIVITY_OPTS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setActivity(opt.value)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all",
                  activity === opt.value
                    ? "border-brand/30 bg-brand/6"
                    : "border-border bg-card hover:bg-card-hover",
                )}
              >
                <div>
                  <p className={cn("text-sm font-bold", activity === opt.value ? "text-fg" : "text-fg")}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-fg-muted mt-0.5">{opt.sub}</p>
                </div>
                {activity === opt.value && (
                  <div className="h-2 w-2 rounded-full bg-brand shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-fg-muted">Goal</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(GOAL_LABELS) as Array<[Goal, typeof GOAL_LABELS[Goal]]>).map(([g, cfg]) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={cn(
                  "flex flex-col items-center py-3 rounded-2xl border transition-all",
                  goal === g
                    ? "border-brand/30 bg-brand/8"
                    : "border-border bg-card hover:bg-card-hover",
                )}
              >
                <span className={cn(
                  "font-display text-xl leading-none mb-1",
                  goal === g ? "text-brand" : "text-fg-muted",
                )}>
                  {cfg.emoji}
                </span>
                <span className={cn("text-xs font-bold", goal === g ? "text-fg" : "text-fg")}>
                  {cfg.label}
                </span>
                <span className="text-[10px] text-fg-muted">{cfg.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TDEE preview */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-brand/20 bg-brand/5 p-4 space-y-3"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Computed targets</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "BMR",      value: `${preview.bmr} kcal` },
              { label: "TDEE",     value: `${preview.tdee} kcal` },
              { label: "Target",   value: `${preview.calories} kcal` },
              { label: "Protein",  value: `${preview.protein_g}g` },
              { label: "Carbs",    value: `${preview.carbs_g}g` },
              { label: "Fat",      value: `${preview.fat_g}g` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-fg-muted">{label}</span>
                <span className="text-xs font-bold text-fg tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Save */}
      <Button
        className="w-full"
        loading={isPending}
        onClick={handleSave}
      >
        {saved ? "Saved ✓" : "Save profile"}
      </Button>

      {/* Sign out */}
      <button
        type="button"
        onClick={signOut}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-danger/20 bg-danger/5 py-3 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  )
}
