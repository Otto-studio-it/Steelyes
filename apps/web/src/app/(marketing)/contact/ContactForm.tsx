'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useState } from 'react'
import type { GateConfig, PricingCatalog } from '@steelyes/gate-engine'

import { submitContactForm, type ContactFormState } from '@/app/actions'
import { ConfigurationReferenceBanner } from '@/components/configurator/ConfigurationReferenceBanner'
import { TurnstileWidget } from '@/components/security/TurnstileWidget'
import { BUSINESS } from '@/lib/marketing/business'

const initialState: ContactFormState = { status: 'idle' }

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-primary px-8 py-3 font-heading text-base font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <svg className="h-4 w-4 motion-safe:animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Sending…
        </>
      ) : (
        'Request a quote'
      )}
    </button>
  )
}

const fieldClassName =
  'mt-2 min-h-[44px] w-full border-b-2 border-zinc-300 bg-transparent px-0 transition-[border-color] focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

type ContactFormProps = {
  shareToken?: string
  attachedConfig?: GateConfig | null
  pricingCatalog?: PricingCatalog
  gateInterest?: { title: string; customerVoice: string } | null
}

export function ContactForm({
  shareToken,
  attachedConfig = null,
  pricingCatalog,
  gateInterest = null,
}: ContactFormProps) {
  const [state, action] = useFormState(submitContactForm, initialState)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

  const defaultMessage = attachedConfig && shareToken
    ? `Please quote the attached gate configuration (${shareToken}). Add any site notes, access constraints, or timeline here.`
    : gateInterest
      ? `I'm interested in ${gateInterest.title} gates.\n\nTypical brief:\n${gateInterest.customerVoice}\n\nOpening width (approx): \nSite notes: `
      : undefined

  if (state.status === 'success') {
    return (
      <div className="flex min-h-[400px] flex-col items-start justify-center space-y-4 border border-zinc-200 bg-white p-8">
        <div className="flex h-12 w-12 items-center justify-center bg-steel">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-black uppercase">Enquiry received</h2>
        <p className="max-w-sm text-sm font-light leading-relaxed text-muted-deep">
          We&apos;ll review your brief and come back to you within 24–48 hours to discuss next steps and arrange a site survey if relevant.
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
          T: {BUSINESS.phoneDisplay} · {BUSINESS.email}
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6 border border-zinc-200 bg-white p-5 md:p-8">
      <h2 className="font-heading text-2xl font-black uppercase">Project brief</h2>

      {attachedConfig && shareToken ? (
        <ConfigurationReferenceBanner
          config={attachedConfig}
          shareToken={shareToken}
          pricingCatalog={pricingCatalog}
        />
      ) : null}

      <div className="inline-flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-2">
        <span className="h-2 w-2 bg-primary motion-safe:animate-pulse" aria-hidden="true" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          We respond within 1 business day
        </span>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="sr-only"
      />

      {shareToken ? <input type="hidden" name="share_token" value={shareToken} /> : null}
      {turnstileToken ? <input type="hidden" name="turnstile_token" value={turnstileToken} /> : null}

      {state.status === 'error' && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-700">
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Full name <span aria-hidden="true" className="text-primary">*</span>
          <input
            name="name"
            required
            autoComplete="name"
            className={fieldClassName}
          />
        </label>
        <label className="block text-sm font-medium">
          Email <span aria-hidden="true" className="text-primary">*</span>
          <input
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Phone
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={fieldClassName}
          />
        </label>
        <label className="block text-sm font-medium">
          Postcode
          <input
            name="postcode"
            autoComplete="postal-code"
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Project type
        <select
          name="project_type"
          defaultValue={
            gateInterest?.title ??
            (attachedConfig ? 'Double Swing' : '')
          }
          className={fieldClassName}
        >
          <option value="">Select a type</option>
          <option>Double Swing</option>
          <option>Single Swing</option>
          <option>Tracked Sliding</option>
          <option>Cantilever Sliding</option>
          <option>Bifold Double</option>
          <option>Single Bifold</option>
          <option>Telescopic Sliding</option>
          <option>Radius Sliding</option>
          <option>Steel Railings</option>
          <option>Steel Balcony</option>
          <option>Security Gates / Doors</option>
          <option>Other</option>
        </select>
      </label>

      <label className="block text-sm font-medium">
        Project details <span aria-hidden="true" className="text-primary">*</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Describe your project — opening width, gate style, access requirements, timeline..."
          defaultValue={defaultMessage}
          className={`${fieldClassName} min-h-[120px] resize-none placeholder:text-zinc-400`}
        />
      </label>

      <TurnstileWidget onToken={setTurnstileToken} />

      <SubmitButton disabled={turnstileRequired && !turnstileToken} />
    </form>
  )
}
