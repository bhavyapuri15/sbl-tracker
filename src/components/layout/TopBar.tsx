"use client"

import { Zap } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

interface TopBarProps {
  title?: string
  action?: React.ReactNode
}

export function TopBar({ title, action }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-card/90 backdrop-blur-md px-4 lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg brand-gradient">
          <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold tracking-tight text-fg">
          {title ?? "SBL Tracker"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {action}
        <ThemeToggle />
      </div>
    </header>
  )
}
