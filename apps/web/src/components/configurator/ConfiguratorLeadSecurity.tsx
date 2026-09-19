'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

import { TurnstileWidget } from '@/components/security/TurnstileWidget'

type LeadSecurityContextValue = {
  token: string
  required: boolean
  reset: () => void
  widget: ReactNode
}

const LeadSecurityContext = createContext<LeadSecurityContextValue>({
  token: '',
  required: false,
  reset: () => undefined,
  widget: null,
})

export function useConfiguratorLeadSecurity(): LeadSecurityContextValue {
  return useContext(LeadSecurityContext)
}

/**
 * One Turnstile for both "Request quote" and "Email my design".
 * Two widgets on the same step made it easy to submit with an empty/expired token.
 */
export function ConfiguratorLeadSecurity({ children }: { children: ReactNode }) {
  const [token, setToken] = useState('')
  const [generation, setGeneration] = useState(0)
  const required = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

  const reset = useCallback(() => {
    setToken('')
    setGeneration((current) => current + 1)
  }, [])

  const widget =
    required ? (
      <div className="border border-steel/10 bg-paper px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Security check</p>
        <p className="mt-1 text-sm leading-6 text-muted-deep">
          Complete this once before emailing your design or requesting a quote.
        </p>
        <div className="mt-3" id="cfg-lead-turnstile">
          <TurnstileWidget key={generation} onToken={setToken} onExpire={() => setToken('')} />
        </div>
      </div>
    ) : null

  return (
    <LeadSecurityContext.Provider value={{ token, required, reset, widget }}>
      {children}
    </LeadSecurityContext.Provider>
  )
}

export function ConfiguratorLeadTurnstile() {
  return useConfiguratorLeadSecurity().widget
}
