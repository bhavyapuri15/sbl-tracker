"use client"

import { ThemeToggle } from "./ThemeToggle"

interface TopBarProps {
  title?: string
  action?: React.ReactNode
}

export function TopBar({ title, action }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-13 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur-xl px-4 lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand shrink-0">
          <span className="font-display text-[11px] text-card leading-none">SBL</span>
        </div>
        <span className="text-sm font-bold tracking-tight text-fg">
          {title ?? "Tracker"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {action}
        <ThemeToggle />
      </div>
    </header>
  )
}
