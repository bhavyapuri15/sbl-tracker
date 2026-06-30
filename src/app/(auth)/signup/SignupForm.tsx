"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <CheckCircle className="h-14 w-14 text-success" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-fg">Check your email</h2>
          <p className="mt-2 text-sm text-fg-muted">
            We sent a confirmation link to <strong className="text-fg">{email}</strong>.
            Click it to activate your account.
          </p>
        </div>
        <Link href="/login" className="text-sm text-brand hover:underline underline-offset-2">
          Back to sign in
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient shadow-lg shadow-brand/20">
          <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Create account</h1>
          <p className="mt-1 text-sm text-fg-muted">Start tracking your lifts today</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          type="text"
          label="Display name"
          placeholder="Alex"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="h-4 w-4" />}
          autoComplete="name"
          required
        />
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
          required
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          minLength={8}
          required
          hint="At least 8 characters"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-danger/10 border border-danger/20 px-3 py-2 text-sm text-danger"
          >
            {error}
          </motion.p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create account
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-center text-sm text-fg-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brand font-medium hover:underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
