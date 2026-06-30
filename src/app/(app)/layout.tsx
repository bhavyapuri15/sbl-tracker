import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppNav } from "@/components/layout/AppNav"
import { BottomNav } from "@/components/layout/BottomNav"
import { TopBar } from "@/components/layout/TopBar"
import { PageTransition } from "@/components/layout/PageTransition"
import { QueueFlusher } from "@/components/QueueFlusher"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Desktop sidebar */}
      <AppNav />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <TopBar />

        <main className="flex-1 flex flex-col px-4 py-5 lg:px-6 lg:py-6 pb-24 lg:pb-6 max-w-4xl w-full mx-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
      <QueueFlusher />
    </div>
  )
}
