'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { loginAdmin } from '../auth-actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-[#9e000c] px-6 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9b1515] disabled:opacity-60"
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      {pending ? 'Accesso...' : 'Accedi'}
    </button>
  )
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/admin/dashboard'
  const error = searchParams.get('error')
  const [state, formAction] = useFormState(loginAdmin, {
    error: error === 'unauthorized' ? 'Account non autorizzato come admin.' : null,
  })

  const [showPwd, setShowPwd] = useState(false)

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

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <div>
          <label
            htmlFor="email"
            className="block font-mono text-[10px] uppercase tracking-widest text-[#1b1c1a]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              required
              autoComplete="current-password"
              className="mt-2 w-full border-b border-zinc-300 bg-transparent py-2 pr-10 text-sm text-[#1b1c1a] outline-none transition-colors focus:border-[#9e000c]"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? 'Nascondi password' : 'Mostra password'}
              className="absolute bottom-2 right-0 flex h-6 w-6 items-center justify-center text-zinc-400 hover:text-zinc-600"
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {state.error ? (
          <p className="font-mono text-xs text-[#ba1a1a]">{state.error}</p>
        ) : null}

        <SubmitButton />
      </form>
    </div>
  )
}
