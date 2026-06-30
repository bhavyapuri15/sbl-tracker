import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect("/dashboard")

  return (
    <div className="min-h-dvh grid lg:grid-cols-2">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-card border-r border-border">
        <div className="absolute inset-0 mesh-bg-strong" />
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(oklch(97% 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(97% 0 0 / 0.025) 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}
        />
        <div className="relative flex flex-col h-full p-10">
          <Link href="/" className="inline-flex items-center gap-2.5 w-fit">
            <div className="h-8 w-8 rounded-xl bg-brand flex items-center justify-center">
              <span className="font-display text-sm text-card leading-none">SBL</span>
            </div>
            <span className="text-sm font-bold text-fg">Tracker</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand">Science-based lifting</p>
            <h1 className="font-display text-[5.5rem] uppercase leading-[0.88] text-fg mb-8">
              TRACK<br />
              <span className="text-brand" style={{ textShadow: "0 0 40px oklch(89% 0.23 128 / 0.35)" }}>
                EVERY
              </span><br />
              REP.
            </h1>
            <div className="space-y-3 max-w-xs">
              {[
                "Workout logging with e1RM tracking",
                "Strength rank — Beginner to Elite",
                "Science-based calorie & macro targets",
                "Progress charts & volume landmarks",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  <span className="text-sm text-fg-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-fg-subtle">Free · No credit card needed</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-col min-h-dvh bg-surface">
        <div className="flex items-center justify-between px-5 pt-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center">
            <span className="font-display text-[11px] text-card leading-none">SBL</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
