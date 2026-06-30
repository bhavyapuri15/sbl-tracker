"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Dumbbell, TrendingUp, Apple, Trophy, ChevronRight, Zap, BarChart2, Target } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

// ── Marquee ──────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "TRACK EVERY REP",
  "RANK YOUR STRENGTH",
  "FUEL YOUR TRAINING",
  "SCIENCE-BASED",
  "PROGRESSIVE OVERLOAD",
  "BEAT YOUR PR",
  "LOG YOUR MACROS",
  "MEASURE PROGRESS",
]

function Marquee() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="overflow-hidden border-y border-border bg-card py-4 select-none">
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-sm uppercase tracking-widest text-fg-muted">
            {item}
            <span className="text-brand">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, label, title, body, accent, delay }: {
  icon: React.ElementType; label: string; title: string; body: string
  accent?: boolean; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease, delay }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
      className={`relative overflow-hidden rounded-2xl border p-7 cursor-default ${
        accent ? "border-brand/30 bg-brand/5" : "border-border bg-card"
      }`}
    >
      {accent && (
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
      )}
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
        accent ? "bg-brand/20" : "bg-elevated"
      }`}>
        <Icon className={`h-6 w-6 ${accent ? "text-brand" : "text-fg-muted"}`} strokeWidth={1.8} />
      </div>
      <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${accent ? "text-brand" : "text-fg-subtle"}`}>{label}</p>
      <h3 className="mb-3 text-xl font-bold text-fg leading-tight">{title}</h3>
      <p className="text-sm text-fg-muted leading-relaxed">{body}</p>
    </motion.div>
  )
}

// ── Step ─────────────────────────────────────────────────────────────────────
function Step({ n, title, body, delay }: { n: string; title: string; body: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease, delay }}
      className="flex gap-5"
    >
      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand/10">
        <span className="font-display text-lg text-brand">{n}</span>
      </div>
      <div>
        <p className="text-base font-bold text-fg">{title}</p>
        <p className="mt-1 text-sm text-fg-muted leading-relaxed">{body}</p>
      </div>
    </motion.div>
  )
}

// ── Floating stat card ────────────────────────────────────────────────────────
function FloatCard({ label, value, sub, accent, style }: {
  label: string; value: string; sub: string; accent?: boolean
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
      style={style}
      className={`rounded-2xl border px-5 py-4 shadow-float backdrop-blur-md ${
        accent
          ? "border-brand/30 bg-brand text-card"
          : "border-border bg-card/90 text-fg"
      }`}
    >
      <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${accent ? "text-card/60" : "text-fg-muted"}`}>{label}</p>
      <p className="font-display text-4xl leading-none">{value}</p>
      <p className={`mt-1 text-xs ${accent ? "text-card/60" : "text-fg-muted"}`}>{sub}</p>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="min-h-screen bg-surface text-fg">

      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center">
              <span className="font-display text-[11px] text-card leading-none">SBL</span>
            </div>
            <span className="text-sm font-bold text-fg">Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-fg-muted hover:text-fg transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-card hover:brightness-110 transition-all active:scale-95"
            >
              Get started
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-14"
      >
        {/* Mesh background */}
        <div className="absolute inset-0 mesh-bg-strong" />

        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(oklch(97% 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(97% 0 0 / 0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative w-full max-w-6xl mx-auto px-5 pt-16 pb-24"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.05 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand"
              >
                <Zap className="h-3 w-3" />
                Science-based training
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease, delay: 0.1 }}
                className="font-display text-[clamp(4.5rem,11vw,9rem)] uppercase leading-[0.9] tracking-tight text-fg"
              >
                TRACK
                <br />
                <span className="text-brand" style={{ textShadow: "0 0 40px oklch(89% 0.23 128 / 0.4)" }}>
                  EVERY
                </span>
                <br />
                REP.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease, delay: 0.25 }}
                className="mt-6 text-base text-fg-muted max-w-md leading-relaxed"
              >
                Log workouts, rank your strength against established standards, and nail your macros — all in one app built on exercise science.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.35 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href="/signup"
                  className="flex items-center gap-2 rounded-2xl bg-brand px-7 py-3.5 text-base font-bold text-card hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-brand/20"
                >
                  Start for free
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-2xl border border-border bg-elevated px-7 py-3.5 text-base font-semibold text-fg hover:bg-card-hover transition-all active:scale-95"
                >
                  Sign in
                </Link>
              </motion.div>
            </div>

            {/* Right: floating stat cards */}
            <div className="relative h-72 lg:h-96 hidden sm:block">
              <FloatCard
                label="Best squat e1RM"
                value="142 kg"
                sub="Intermediate · +8 kg this month"
                accent
                style={{ position: "absolute", top: "0%", right: "0", width: 200 }}
              />
              <FloatCard
                label="Weekly volume"
                value="8,450"
                sub="kg total · 12 working sets"
                style={{ position: "absolute", top: "38%", left: "0", width: 190 }}
              />
              <FloatCard
                label="Protein today"
                value="164g"
                sub="82% of 200g target"
                style={{ position: "absolute", bottom: "0%", right: "15%", width: 175 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Features ── */}
      <section className="py-24 px-5">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-14 max-w-xl"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">Everything in one place</p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-tight text-fg">
              TRAIN.
              <br />
              <span className="text-fg-muted">RANK.</span>
              <br />
              FUEL.
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={Dumbbell}
              label="01 — Train"
              title="Fast workout logging built for the gym floor"
              body="Log sets in seconds. See your last session's weights as reference. Rest timer starts automatically. Add exercises from 65+ movements across all muscle groups."
              accent
              delay={0}
            />
            <FeatureCard
              icon={TrendingUp}
              label="02 — Rank"
              title="Know exactly where your strength stands"
              body="Every PR is ranked against bodyweight-ratio standards — Beginner through Elite. See your e1RM trend over time and what you need to reach the next tier."
              delay={0.08}
            />
            <FeatureCard
              icon={Apple}
              label="03 — Fuel"
              title="Nutrition targets calibrated to your goal"
              body="Cut, maintain, or bulk — the app calculates TDEE via Mifflin-St Jeor and sets protein, carbs, and fat targets. Log food, track macros, adjust weekly."
              delay={0.16}
            />
          </div>
        </div>
      </section>

      {/* ── Science section ── */}
      <section className="py-24 px-5 border-t border-border">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">Built on science</p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-tight text-fg mb-6">
              NOT<br />
              <span className="text-fg-muted">GUESSWORK</span>
            </h2>
            <p className="text-base text-fg-muted leading-relaxed mb-8">
              Every recommendation in SBL Tracker comes from peer-reviewed research — Israetel's volume landmarks, Mifflin-St Jeor for TDEE, Epley's formula for e1RM. Science as the default, not the exception.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline underline-offset-4"
            >
              Start tracking
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="space-y-5">
            {[
              {
                icon: BarChart2,
                title: "Volume landmarks",
                body: "MEV → MAV → MRV per muscle group from RP Hypertrophy research. See exactly when you're undertrained, optimal, or overreaching."
              },
              {
                icon: Trophy,
                title: "Strength standards",
                body: "Bodyweight-ratio tiers from StrengthLevel.com for each lift and sex. Know your real level — not just a number."
              },
              {
                icon: Target,
                title: "Progressive overload detection",
                body: "The app flags when you've stalled and suggests adding weight or reps based on your recent performance trend."
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease, delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl border border-border bg-card hover:border-brand/20 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-elevated flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-fg-muted" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-bold text-fg mb-1">{title}</p>
                  <p className="text-xs text-fg-muted leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-5 border-t border-border">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-14 text-center"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">How it works</p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-tight text-fg">
              UP AND LIFTING<br />
              <span className="text-fg-muted">IN MINUTES</span>
            </h2>
          </motion.div>

          <div className="space-y-8 max-w-lg mx-auto">
            <Step n="01" title="Create your profile" body="Enter your sex, height, weight, and activity level. The app calculates your TDEE and sets science-based macro targets instantly." delay={0} />
            <Step n="02" title="Start a workout" body="Pick a training split or go freeform. Add exercises from the library, log sets with weight and reps, and watch your e1RM update in real time." delay={0.08} />
            <Step n="03" title="Track your progress" body="See strength rank badges, e1RM trends, weekly volume by muscle group, and bodyweight trajectory — all on one screen." delay={0.16} />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-5 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg-strong" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative text-center max-w-2xl mx-auto"
        >
          <h2 className="font-display text-[clamp(3rem,10vw,7rem)] uppercase leading-none text-fg mb-6">
            READY<br />
            <span className="text-brand" style={{ textShadow: "0 0 60px oklch(89% 0.23 128 / 0.4)" }}>
              TO LIFT?
            </span>
          </h2>
          <p className="text-base text-fg-muted mb-10 max-w-md mx-auto">
            Free, no credit card needed. Start logging your first session in under 2 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand px-10 py-4 text-lg font-bold text-card hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-brand/20"
          >
            Get started free
            <ChevronRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-5">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-lg bg-brand flex items-center justify-center">
              <span className="font-display text-[9px] text-card leading-none">SBL</span>
            </div>
            <span className="text-xs font-bold text-fg">SBL Tracker</span>
          </div>
          <p className="text-xs text-fg-subtle text-center">
            Science-based lifting · for informational use only, not medical advice
          </p>
          <div className="flex gap-5 text-xs text-fg-muted">
            <Link href="/login" className="hover:text-fg transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-fg transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
