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
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Home",      icon: LayoutDashboard },
  { href: "/workout",    label: "Workout",   icon: Dumbbell },
  { href: "/progress",  label: "Progress",  icon: TrendingUp },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/profile",   label: "Profile",   icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/90 backdrop-blur-md safe-bottom lg:hidden"
      aria-label="Main navigation"
    >
      <ul className="flex items-center justify-around px-2 py-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-colors",
                  active ? "text-brand" : "text-fg-muted hover:text-fg"
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 rounded-xl bg-brand/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 relative" strokeWidth={active ? 2.2 : 1.7} />
                <span className="text-[10px] font-medium relative">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
