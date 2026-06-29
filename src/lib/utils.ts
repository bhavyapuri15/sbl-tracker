import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWeight(kg: number, unit: "metric" | "imperial" = "metric"): string {
  if (unit === "imperial") {
    return `${(kg * 2.20462).toFixed(1)} lb`
  }
  return `${kg} kg`
}

export function toKg(value: number, unit: "metric" | "imperial"): number {
  return unit === "imperial" ? value / 2.20462 : value
}

export function fromKg(kg: number, unit: "metric" | "imperial"): number {
  return unit === "imperial" ? kg * 2.20462 : kg
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0]
}

/** Exponential weighted moving average — alpha=0.2 gives ~7-day smoothing */
export function ewma(values: number[], alpha = 0.2): number[] {
  if (values.length === 0) return []
  const result: number[] = [values[0]]
  for (let i = 1; i < values.length; i++) {
    result.push(alpha * values[i] + (1 - alpha) * result[i - 1])
  }
  return result
}

/** Linear regression slope — units/day */
export function trendSlope(points: { x: number; y: number }[]): number {
  const n = points.length
  if (n < 2) return 0
  const meanX = points.reduce((s, p) => s + p.x, 0) / n
  const meanY = points.reduce((s, p) => s + p.y, 0) / n
  const num = points.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0)
  const den = points.reduce((s, p) => s + (p.x - meanX) ** 2, 0)
  return den === 0 ? 0 : num / den
}
