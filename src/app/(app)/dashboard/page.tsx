import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Dumbbell, TrendingUp, Apple, Zap, ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = { title: "Dashboard" }

const QUICK_ACTIONS = [
  {
    href: "/workout/new",
    icon: Dumbbell,
    label: "Start Workout",
    description: "Log today's session",
    color: "text-brand",
    bg: "bg-brand/10",
  },
  {
    href: "/nutrition",
    icon: Apple,
    label: "Log Food",
    description: "Track your macros",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    href: "/progress",
    icon: TrendingUp,
    label: "View Progress",
    description: "Charts & strength rank",
    color: "text-warning",
    bg: "bg-warning/10",
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user!.id)
    .single()

  const firstName = profile?.display_name?.split(" ")[0] ?? "Athlete"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-fg">
          Hey, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          Ready to train? Here&apos;s your overview.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {QUICK_ACTIONS.map(({ href, icon: Icon, label, description, color, bg }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors hover:border-brand/40 hover:bg-card-hover cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-fg group-hover:text-brand transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-fg-muted mt-0.5">{description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-fg-subtle shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats row (empty state) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Workouts this week", value: "—", sub: "Start logging" },
          { label: "Best squat e1RM",    value: "—", sub: "No data yet" },
          { label: "Avg. daily calories", value: "—", sub: "Start logging" },
          { label: "Current weight",      value: "—", sub: "Log first weigh-in" },
        ].map(({ label, value, sub }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted">{label}</p>
              <p className="mt-1 text-2xl font-bold text-fg">{value}</p>
              <p className="mt-0.5 text-xs text-fg-subtle">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting started card */}
      <Card className="border-brand/20 bg-brand/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand" />
            <CardTitle className="text-brand">Getting started</CardTitle>
          </div>
          <CardDescription>
            Complete these steps to unlock all features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Set up your profile (sex, height, activity level)", href: "/profile" },
            { label: "Log your first weigh-in", href: "/progress" },
            { label: "Start your first workout", href: "/workout/new" },
            { label: "Set your nutrition goals", href: "/nutrition" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-brand/10 transition-colors"
            >
              <div className="h-5 w-5 rounded-full border-2 border-brand/40 shrink-0" />
              <span className="text-sm text-fg">{label}</span>
              <ChevronRight className="h-3.5 w-3.5 text-fg-muted ml-auto shrink-0" />
            </Link>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-fg-subtle text-center">
        <Badge variant="default" size="sm">Disclaimer</Badge>{" "}
        Calorie and macro suggestions are for informational purposes only — not medical or nutrition advice.
      </p>
    </div>
  )
}
