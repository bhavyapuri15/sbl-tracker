"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { Trophy, TrendingUp, Flame, Zap, ChevronRight, Plus, Check } from "lucide-react"

// ── Motion tokens ────────────────────────────────────────────────────────────
const easeOut = [0.16, 1, 0.3, 1] as const
const spring = { type: "spring", stiffness: 300, damping: 24 } as const
const bouncy = { type: "spring", stiffness: 400, damping: 18 } as const

// ── Animated count-up hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = 0
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [target, duration])
  return value
}

// ── Magnetic button ──────────────────────────────────────────────────────────
function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })

  function handleMove(e: React.MouseEvent) {
    const el = ref.current!
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.3)
    y.set((e.clientY - cy) * 0.3)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, unit, suffix, icon: Icon, accent = false, delay = 0
}: {
  label: string; value: number; unit?: string; suffix?: string
  icon: React.ElementType; accent?: boolean; delay?: number
}) {
  const count = useCountUp(value, 1000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut, delay }}
      whileHover={{ y: -4, transition: { ...spring } }}
      className={`relative overflow-hidden rounded-2xl border p-5 cursor-default ${
        accent
          ? "bg-brand border-brand/30 text-card"
          : "bg-card border-border"
      }`}
    >
      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }}
      />

      {/* Glow blob */}
      {accent && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      )}

      <div className={`mb-3 flex items-center justify-between ${accent ? "text-card/70" : "text-fg-muted"}`}>
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
        <Icon className="h-4 w-4" />
      </div>

      <div className={`flex items-end gap-1.5 ${accent ? "text-card" : "text-fg"}`}>
        <span className="font-display text-5xl leading-none">{count}</span>
        {unit && <span className={`mb-1 text-sm font-semibold ${accent ? "text-card/60" : "text-fg-muted"}`}>{unit}</span>}
      </div>

      {suffix && (
        <p className={`mt-1.5 text-xs font-medium ${accent ? "text-card/60" : "text-fg-muted"}`}>{suffix}</p>
      )}
    </motion.div>
  )
}

// ── Exercise card sample ─────────────────────────────────────────────────────
function ExerciseCardSample() {
  const [sets, setSets] = useState([
    { id: 1, weight: 100, reps: 5, e1rm: 116.7, pr: true },
    { id: 2, weight: 100, reps: 4, e1rm: 113.3 },
    { id: 3, weight: 97.5, reps: 5, e1rm: 114.2 },
  ])

  function addSet() {
    setSets(prev => [...prev, { id: Date.now(), weight: 95, reps: 5, e1rm: 111.1 }])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut, delay: 0.3 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-fg">Barbell Back Squat</h3>
            <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand border border-brand/20">
              Compound
            </span>
          </div>
          <p className="mt-0.5 text-xs text-fg-muted">Quads · Glutes · Hamstrings</p>
        </div>
        <span className="text-xs text-fg-subtle">Last: 95 kg × 5</span>
      </div>

      {/* Sets */}
      <div className="px-5 pb-3 space-y-0 divide-y divide-border/40">
        <AnimatePresence initial={false}>
          {sets.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12, height: 0 }}
              transition={{ ...spring }}
              className="flex items-center gap-3 py-2.5"
            >
              <span className="min-w-[2rem] text-center text-xs font-bold rounded-md bg-brand/10 text-brand border border-brand/20 px-1.5 py-0.5">
                W
              </span>
              <span className="flex-1 text-sm text-fg">
                <span className="font-bold">{s.weight}</span>
                <span className="text-fg-muted text-xs"> kg × </span>
                <span className="font-bold">{s.reps}</span>
              </span>
              <span className="text-xs text-fg-muted">{s.e1rm.toFixed(1)} 1RM</span>
              {s.pr && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...bouncy }}
                  className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-400"
                >
                  <Trophy className="h-3 w-3" />PR
                </motion.span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add set */}
      <div className="border-t border-border/40 p-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={addSet}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-semibold text-fg-muted hover:border-brand/40 hover:text-brand transition-colors"
        >
          <Plus className="h-4 w-4" />
          Log set {sets.length + 1}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Main preview ─────────────────────────────────────────────────────────────
export default function DesignPreview() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="min-h-screen bg-surface text-fg">

      {/* ── Hero section ── */}
      <div className="relative overflow-hidden mesh-bg-strong px-6 py-20">
        {/* Subtle grid lines */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(oklch(97% 0 0 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(97% 0 0 / 0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="relative max-w-lg"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
            className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand"
          >
            Design preview · Carbon Lime
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
            className="font-display text-[clamp(4rem,12vw,8rem)] leading-none uppercase text-fg"
          >
            SBL
            <br />
            <span className="text-brand glow-brand-text">TRACK</span>
            <span className="text-fg-muted">ER</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.3 }}
            className="mt-4 text-base text-fg-muted max-w-sm"
          >
            Science-based lifting and nutrition — track every rep, rank every lift.
          </motion.p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10 space-y-12">

        {/* ── Color swatches ── */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Palette</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: "Surface", color: "bg-surface border" },
              { name: "Card", color: "bg-card border" },
              { name: "Elevated", color: "bg-elevated" },
              { name: "Border", color: "bg-border" },
              { name: "Brand", color: "bg-brand" },
              { name: "Brand dim", color: "bg-brand-dim" },
              { name: "Danger", color: "bg-danger" },
              { name: "Success", color: "bg-success" },
            ].map(s => (
              <div key={s.name} className="space-y-1.5">
                <div className={`h-12 rounded-xl ${s.color}`} />
                <p className="text-xs text-fg-muted">{s.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ── */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Typography</h2>
          <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-6xl uppercase leading-none text-fg">Bebas Neue</p>
            <p className="font-display text-3xl uppercase text-brand">142.5 KG · PR</p>
            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-2xl font-bold text-fg">Space Grotesk — Dashboard header</p>
              <p className="text-base font-semibold text-fg">UI label / card title — Semibold 600</p>
              <p className="text-sm text-fg-muted">Body copy and descriptions — Regular 400. This is what exercise names, set details, and nutrition entries will use throughout the app.</p>
              <p className="text-xs text-fg-subtle uppercase tracking-widest font-semibold">Caption / overline — XS + tracking</p>
            </div>
          </div>
        </section>

        {/* ── Stat cards ── */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Stat Cards (count-up on mount)</h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="e1RM" value={142} unit="kg" icon={TrendingUp} accent delay={0} />
            <StatCard label="Volume" value={8450} unit="kg" icon={Flame} delay={0.08} />
            <StatCard label="Streak" value={12} suffix="days in a row" icon={Zap} delay={0.16} />
          </div>
        </section>

        {/* ── Buttons ── */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Buttons (magnetic on desktop)</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <MagneticButton className="flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-card transition-all hover:brightness-110 active:scale-95">
              <Zap className="h-4 w-4" />
              Start Workout
            </MagneticButton>

            <MagneticButton className="flex items-center gap-2 rounded-xl border border-border bg-elevated px-5 py-3 text-sm font-semibold text-fg hover:bg-card-hover transition-all active:scale-95">
              View Progress
              <ChevronRight className="h-4 w-4" />
            </MagneticButton>

            <MagneticButton className="rounded-xl px-5 py-3 text-sm font-semibold text-fg-muted hover:text-fg hover:bg-elevated transition-all active:scale-95">
              Cancel
            </MagneticButton>

            <MagneticButton className="rounded-xl border border-danger/25 bg-danger/10 px-5 py-3 text-sm font-semibold text-danger hover:bg-danger/20 transition-all active:scale-95">
              Delete
            </MagneticButton>

            {/* Animated check button */}
            <motion.button
              onClick={() => setChecked(v => !v)}
              className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
                checked
                  ? "border-brand/30 bg-brand/10 text-brand"
                  : "border-border bg-elevated text-fg-muted"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {checked ? (
                  <motion.span key="check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ ...bouncy }}>
                    <Check className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ ...bouncy }}>
                    <Plus className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              {checked ? "Logged" : "Log set"}
            </motion.button>
          </div>
        </section>

        {/* ── Exercise card ── */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Exercise Card (tap "Log set")</h2>
          <ExerciseCardSample />
        </section>

        {/* ── Rank badges ── */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Strength Rank Badges</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { tier: "Beginner", color: "bg-rank-beginner/10 text-rank-beginner border-rank-beginner/20" },
              { tier: "Novice", color: "bg-rank-novice/10 text-rank-novice border-rank-novice/20" },
              { tier: "Intermediate", color: "bg-rank-intermediate/10 text-rank-intermediate border-rank-intermediate/20" },
              { tier: "Advanced", color: "bg-rank-advanced/10 text-rank-advanced border-rank-advanced/20" },
              { tier: "Elite", color: "bg-rank-elite/10 text-rank-elite border-rank-elite/20" },
            ].map(b => (
              <motion.span
                key={b.tier}
                whileHover={{ scale: 1.06, y: -2 }}
                transition={{ ...spring }}
                className={`rounded-full border px-4 py-2 text-sm font-bold cursor-default ${b.color}`}
              >
                {b.tier}
              </motion.span>
            ))}
          </div>
        </section>

        {/* ── Mesh backgrounds ── */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Gradient mesh backgrounds</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="mesh-bg h-32 rounded-2xl border border-border flex items-end p-4">
              <p className="text-xs font-semibold text-fg-muted">mesh-bg (subtle)</p>
            </div>
            <div className="mesh-bg-strong h-32 rounded-2xl border border-border/50 flex items-end p-4">
              <p className="text-xs font-semibold text-fg-muted">mesh-bg-strong (hero)</p>
            </div>
          </div>
        </section>

        <div className="border-t border-border pt-8 pb-16 text-center">
          <p className="text-sm text-fg-muted">
            Palette: <span className="text-brand font-semibold">Carbon Lime</span> ·
            Display: <span className="font-display text-fg">Bebas Neue</span> ·
            UI: <span className="font-semibold text-fg">Space Grotesk</span>
          </p>
          <p className="mt-2 text-xs text-fg-subtle">Visit <code className="font-mono">/preview</code> any time to see the design system</p>
        </div>
      </div>
    </div>
  )
}
