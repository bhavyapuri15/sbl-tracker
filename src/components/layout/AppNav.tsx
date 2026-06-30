"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Dumbbell, TrendingUp, Apple, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard", icon: LayoutDashboard },
  { href: "/workout",    label: "Workout",   icon: Dumbbell },
  { href: "/progress",   label: "Progress",  icon: TrendingUp },
  { href: "/nutrition",  label: "Nutrition", icon: Apple },
  { href: "/profile",    label: "Profile",   icon: User },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border bg-card min-h-dvh sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand shrink-0">
          <span className="font-display text-sm text-card leading-none">SBL</span>
        </div>
        <span className="text-sm font-bold tracking-tight text-fg">Tracker</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active ? "text-brand" : "text-fg-muted hover:text-fg hover:bg-elevated"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-brand/10 border border-brand/15"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4 shrink-0 relative z-10" strokeWidth={active ? 2.2 : 1.8} />
              <span className="relative z-10">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-fg-subtle px-2">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  )
}
