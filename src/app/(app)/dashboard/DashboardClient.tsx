"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Dumbbell, TrendingUp, Apple, ChevronRight, Zap, Circle } from "lucide-react"
import { SuggestionCard } from "./components/SuggestionCard"
import type { Suggestion } from "@/types/domain"

const ease = [0.16, 1, 0.3, 1] as const
const spring = { type: "spring", stiffness: 300, damping: 24 } as const

function useCountUp(target: number | null, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (target === null || target === 0) { setVal(0); return }
    let current = 0
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(current))
    }, step)
    return () => clearInterval(timer)
  }, [target, duration])
  return val
}

interface Props {
  firstName: string
  workoutsThisWeek: number
  bestE1rm: number | null
  bestE1rmExercise: string | null
  currentWeight: number | null
  goal: "cut" | "maintain" | "bulk" | null
  suggestions: Suggestion[]
}

const GOAL_LABEL: Record<string, string> = {
  cut: "Cutting", maintain: "Maintaining", bulk: "Bulking",
}

const ACTIONS = [
  { href: "/workout/new", icon: Dumbbell, label: "Start Workout", sub: "Log today's session", color: "text-brand", bg: "bg-brand/10", border: "border-brand/20", hoverBorder: "hover:border-brand/40" },
  { href: "/nutrition",   icon: Apple,    label: "Log Food",     sub: "Track your macros",  color: "text-success", bg: "bg-success/10", border: "border-success/20", hoverBorder: "hover:border-success/30" },
  { href: "/progress",    icon: TrendingUp, label: "Progress",   sub: "Charts & strength",  color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", hoverBorder: "hover:border-warning/30" },
]

const CHECKLIST = [
  { label: "Set up your profile", href: "/profile", key: "profile" },
  { label: "Log your first weigh-in", href: "/progress", key: "weight" },
  { label: "Start your first workout", href: "/workout/new", key: "workout" },
  { label: "Set nutrition goals", href: "/nutrition", key: "nutrition" },
]

export function DashboardClient({ firstName, workoutsThisWeek, bestE1rm, bestE1rmExercise, currentWeight, goal, suggestions }: Props) {
  const workoutsCount = useCountUp(workoutsThisWeek)
  const e1rmCount = useCountUp(bestE1rm ? Math.round(bestE1rm) : null)
  const weightCount = useCountUp(currentWeight ? Math.round(currentWeight) : null)

  const stats = [
    {
      label: "Workouts this week",
      value: workoutsThisWeek > 0 ? workoutsCount.toString() : null,
      unit: workoutsThisWeek === 1 ? "session" : "sessions",
      empty: "Start logging",
      accent: true,
    },
    {
      label: bestE1rmExercise ? `Best ${bestE1rmExercise.split(" ")[0]} e1RM` : "Best e1RM",
      value: bestE1rm ? e1rmCount.toString() : null,
      unit: "kg",
      empty: "No PRs yet",
      accent: false,
    },
    {
      label: "Current weight",
      value: currentWeight ? weightCount.toString() : null,
      unit: "kg",
      empty: "Log first weigh-in",
      accent: false,
    },
    {
      label: "Goal",
      value: goal ? GOAL_LABEL[goal] : null,
      unit: "",
      empty: "Set in profile",
      accent: false,
    },
  ]

  return (
    <div className="space-y-8">

      {/* ── Greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long" })}
        </p>
        <h1 className="text-3xl font-bold text-fg tracking-tight">
          Hey, {firstName}.
        </h1>
        <p className="mt-1 text-sm text-fg-muted">Ready to train?</p>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, unit, empty, accent }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: i * 0.07 }}
            whileHover={{ y: -3, transition: { ...spring } }}
            className={`relative overflow-hidden rounded-2xl border p-4 cursor-default ${
              accent && value
                ? "border-brand/25 bg-brand/8"
                : "border-border bg-card"
            }`}
          >
            {accent && value && (
              <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-brand/10 blur-2xl" />
            )}
            <p className={`text-xs font-semibold mb-2 ${accent && value ? "text-brand/70" : "text-fg-muted"}`}>
              {label}
            </p>
            {value ? (
              <div className="flex items-end gap-1">
                <span className={`font-display text-3xl leading-none ${accent ? "text-brand" : "text-fg"}`}>
                  {value}
                </span>
                {unit && (
                  <span className="mb-0.5 text-xs text-fg-muted">{unit}</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-fg-subtle">{empty}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Insights ── */}
      {suggestions.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">Insights</p>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <SuggestionCard key={`${s.kind}-${i}`} suggestion={s} delay={0.1 + i * 0.06} />
            ))}
          </div>
        </div>
      )}

      {/* ── Quick actions ── */}
      <div className="space-y-2.5">
        <p className="text-xs font-bold uppercase tracking-widest text-fg-subtle">Quick actions</p>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {ACTIONS.map(({ href, icon: Icon, label, sub, color, bg, border, hoverBorder }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: 0.2 + i * 0.07 }}
            >
              <Link href={href} className="group block">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ ...spring }}
                  className={`flex items-center gap-4 rounded-2xl border ${border} bg-card p-4 transition-colors ${hoverBorder} hover:bg-card-hover`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-fg group-hover:text-brand transition-colors">{label}</p>
                    <p className="text-xs text-fg-muted mt-0.5">{sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-fg-subtle shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Getting started ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.4 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <Zap className="h-4 w-4 text-brand" />
          <p className="text-sm font-bold text-fg">Getting started</p>
        </div>
        <div className="p-2">
          {CHECKLIST.map(({ label, href }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease, delay: 0.45 + i * 0.06 }}
            >
              <Link
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-elevated transition-colors group"
              >
                <Circle className="h-4 w-4 text-border shrink-0" />
                <span className="text-sm text-fg-muted group-hover:text-fg transition-colors flex-1">{label}</span>
                <ChevronRight className="h-3.5 w-3.5 text-fg-subtle shrink-0 group-hover:text-fg-muted transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
