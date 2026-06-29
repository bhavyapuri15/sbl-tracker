"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Apple,
  User,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard", icon: LayoutDashboard },
  { href: "/workout",    label: "Workout",   icon: Dumbbell },
  { href: "/progress",  label: "Progress",  icon: TrendingUp },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/profile",   label: "Profile",   icon: User },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-card min-h-dvh sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient">
          <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-base font-bold tracking-tight text-fg">SBL Tracker</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-brand"
                  : "text-fg-muted hover:text-fg hover:bg-elevated"
              )}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-nav-indicator"
                  className="absolute inset-0 rounded-xl bg-brand/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className="h-4.5 w-4.5 shrink-0 relative"
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span className="relative">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-fg-subtle px-2">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  )
}
