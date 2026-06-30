import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "./ProfileForm"
import type { Profile } from "@/types/domain"

export const metadata: Metadata = { title: "Profile" }

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [profileRes, metricRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("body_metrics")
      .select("weight_kg, height_cm")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const profile = profileRes.data as Profile | null

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">Settings</p>
        <h1 className="font-display text-4xl leading-none text-fg">YOUR<br />PROFILE.</h1>
        <p className="mt-2 text-sm text-fg-muted">Body stats, activity level, and nutrition targets.</p>
      </div>
      <ProfileForm
        profile={profile}
        email={user.email ?? ""}
        latestWeightKg={metricRes.data?.weight_kg ?? null}
        latestHeightCm={metricRes.data?.height_cm ?? null}
      />
    </div>
  )
}
