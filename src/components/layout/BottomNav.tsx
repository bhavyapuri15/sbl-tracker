"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Dumbbell, TrendingUp, Apple, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Home",      icon: LayoutDashboard },
  { href: "/workout",    label: "Workout",   icon: Dumbbell },
  { href: "/progress",   label: "Progress",  icon: TrendingUp },
  { href: "/nutrition",  label: "Nutrition", icon: Apple },
  { href: "/profile",    label: "Profile",   icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/80 backdrop-blur-xl safe-bottom lg:hidden"
      aria-label="Main navigation"
    >
      <ul className="flex items-center justify-around px-1 py-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all",
                  active ? "text-brand" : "text-fg-subtle hover:text-fg-muted"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-xl bg-brand/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 relative z-10" strokeWidth={active ? 2.2 : 1.6} />
                <span className="text-[9px] font-semibold tracking-wide uppercase relative z-10">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
