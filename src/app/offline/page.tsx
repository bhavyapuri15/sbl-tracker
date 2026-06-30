import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
        <WifiOff className="h-7 w-7 text-brand" strokeWidth={1.8} />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-4xl text-fg">YOU&apos;RE OFFLINE</h1>
        <p className="text-sm text-fg-muted">
          No connection detected. Any sets you log will sync automatically when you&apos;re back online.
        </p>
      </div>
      <a
        href="/dashboard"
        className="rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-card transition-opacity hover:opacity-90"
      >
        Try again
      </a>
    </div>
  )
}
