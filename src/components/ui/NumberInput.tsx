"use client"

import { cn } from "@/lib/utils"

interface NumberInputProps {
  value: number | ""
  onChange: (val: number | "") => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  label?: string
  unit?: string
  className?: string
  inputMode?: "numeric" | "decimal"
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  step = 1,
  placeholder = "0",
  label,
  unit,
  className,
  inputMode = "decimal",
}: NumberInputProps) {
  function adjust(delta: number) {
    const current = value === "" ? 0 : value
    const next = Math.max(min, Math.round((current + delta) * 100) / 100)
    onChange(next)
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <span className="text-xs font-medium text-fg-muted text-center">{label}</span>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => adjust(-step)}
          className="h-11 w-11 shrink-0 rounded-xl bg-elevated hover:bg-card-hover active:scale-95 transition-all flex items-center justify-center text-lg font-bold text-fg-muted select-none"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <div className="relative flex-1">
          <input
            type="number"
            inputMode={inputMode}
            value={value}
            min={min}
            step={step}
            placeholder={placeholder}
            onChange={(e) => {
              const v = e.target.value
              if (v === "" || v === "-") {
                onChange("")
              } else {
                const n = parseFloat(v)
                if (!isNaN(n)) onChange(n)
              }
            }}
            className={cn(
              "w-full h-11 rounded-xl bg-elevated border border-border text-center text-base font-bold text-fg",
              "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
              "transition-colors",
              unit && "pr-8"
            )}
          />
          {unit && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-fg-muted pointer-events-none">
              {unit}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => adjust(step)}
          className="h-11 w-11 shrink-0 rounded-xl bg-elevated hover:bg-card-hover active:scale-95 transition-all flex items-center justify-center text-lg font-bold text-fg-muted select-none"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
