'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { userIsAdmin } from '@/lib/admin/user-is-admin'
import { supabase } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/admin/dashboard'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(
    error === 'unauthorized' ? 'Account non autorizzato come admin.' : null
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr(null)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setErr('Email o password errati.')
      setLoading(false)
      return
    }

    if (!userIsAdmin(data.user)) {
      await supabase.auth.signOut()
      setErr('Account non autorizzato come admin.')
      setLoading(false)
      return
    }

    router.push(redirectTo)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
          Pannello Interno
        </p>
        <h1 className="mt-1 font-heading text-3xl font-black uppercase tracking-tight text-[#1b1c1a]">
          Steelyes Admin
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b border-zinc-300 bg-transparent py-2 text-sm text-[#1b1c1a] outline-none transition-colors focus:border-[#9e000c]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-zinc-300 bg-transparent py-2 text-sm text-[#1b1c1a] outline-none transition-colors focus:border-[#9e000c]"
          />
        </div>

        {err ? (
          <p className="font-mono text-xs text-[#ba1a1a]">{err}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[48px] w-full items-center justify-center bg-[#9e000c] px-6 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9b1515] disabled:opacity-60"
        >
          {loading ? 'Accesso...' : 'Accedi'}
        </button>
      </form>
    </div>
  )
}
