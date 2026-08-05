'use client'

import { Check, LoaderCircle, Mail } from 'lucide-react'
import { useState } from 'react'

import { emailMyDesign, type EmailMyDesignState } from '@/app/actions'
import { TurnstileWidget } from '@/components/security/TurnstileWidget'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { useConfiguratorStore } from '@/store/configuratorStore'

const FIELD_CLASS =
  'h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary'

/**
 * Low-commitment save: emails the customer a link to their saved design.
 * Replaces the copy-share-link panel — a plain email works for everyone.
 */
export function EmailMyDesignPanel() {
  const ensureSavedConfiguration = useConfiguratorStore((state) => state.ensureSavedConfiguration)
  const [state, setState] = useState<EmailMyDesignState>({ status: 'idle' })
  const [submitting, setSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const formData = new FormData(event.currentTarget)
    if (turnstileRequired && !turnstileToken) {
      setState({ status: 'error', message: 'Please complete the security check and try again.' })
      return
    }
    if (turnstileToken) formData.set('turnstile_token', turnstileToken)
    setSubmitting(true)
    setState({ status: 'idle' })

    try {
      const saved = await ensureSavedConfiguration()
      if (!saved?.shareToken) {
        setState({ status: 'error', message: 'Could not save your design. Please try again.' })
        return
      }

      formData.set('share_token', saved.shareToken)
      const result = await emailMyDesign(formData)
      setState(result)

      if (result.status === 'success') {
        captureConfiguratorEvent('design emailed', { share_token: saved.shareToken })
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (state.status === 'success') {
    return (
      <div className="border border-steel/10 bg-paper px-4 py-4">
        <p className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-tight text-steel">
          <Check className="h-4 w-4 text-primary" aria-hidden />
          Design sent — check your inbox
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-deep">
          Your saved design link is on its way. Open it any time to keep editing or request a quote.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-steel/10 bg-paper px-4 py-4">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
        <Mail className="h-3.5 w-3.5" aria-hidden />
        Not ready yet?
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-deep">
        Email yourself a link to this design so you can come back to it later.
      </p>

      <input type="text" name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" className="sr-only" />

      {state.status === 'error' ? (
        <p role="alert" className="mt-3 text-sm text-primary">
          {state.message}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Email address</span>
          <input
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={FIELD_CLASS}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 border border-steel/12 bg-white px-4 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary disabled:opacity-60"
        >
          {submitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            'Email my design'
          )}
        </button>
      </div>
      {turnstileRequired ? <div className="mt-3"><TurnstileWidget onToken={setTurnstileToken} /></div> : null}
    </form>
  )
}
