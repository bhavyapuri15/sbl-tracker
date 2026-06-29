import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = { title: "Profile" }

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  async function signOut() {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Profile</h1>
        <p className="mt-1 text-sm text-fg-muted">Your account and training preferences</p>
      </div>

      {/* User card */}
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient shrink-0">
            <User className="h-6 w-6 text-white" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-fg truncate">
              {profile?.display_name ?? "—"}
            </p>
            <p className="text-sm text-fg-muted truncate">{user.email}</p>
          </div>
          <Badge variant="brand" size="sm">
            {profile?.goal ?? "No goal set"}
          </Badge>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Training preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Sex",            value: profile?.sex ?? "Not set" },
            { label: "Units",          value: profile?.unit_system ?? "metric" },
            { label: "Activity level", value: profile?.activity_level?.replace("_", " ") ?? "Not set" },
            { label: "Goal",           value: profile?.goal ?? "Not set" },
            { label: "e1RM formula",   value: profile?.e1rm_formula ?? "epley" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <span className="text-sm text-fg-muted">{label}</span>
              <span className="text-sm font-medium text-fg capitalize">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sign out */}
      <form action={signOut}>
        <Button variant="danger" className="w-full" type="submit">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </form>
    </div>
  )
}
