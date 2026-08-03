'use client'

import { LoaderCircle, MessageCircle, PhoneCall } from 'lucide-react'
import { useState } from 'react'

import { submitConfiguratorQuote, type ContactFormState } from '@/app/actions'
import { TurnstileWidget } from '@/components/security/TurnstileWidget'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { buildQuoteSharePath } from '@/lib/configurator/share-token'
import { BUSINESS } from '@/lib/marketing/business'
import { useConfiguratorStore } from '@/store/configuratorStore'

/** Shared form id so the sticky action bars can submit this form from outside it. */
export const CONFIGURATOR_QUOTE_FORM_ID = 'cfg-quote-form'

const FIELD_CLASS =
  'mt-2 h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary'
const LABEL_CLASS = 'block font-mono text-xs uppercase tracking-widest text-muted'

/**
 * Final configurator step: request the survey-led quote without leaving the
 * configurator. Saves the configuration on submit, then runs the same
 * pipeline as the contact form (quote_request + lead + emails).
 */
export function ConfiguratorQuoteRequestForm() {
  const ensureSavedConfiguration = useConfiguratorStore((state) => state.ensureSavedConfiguration)
  const markQuoteSubmitted = useConfiguratorStore((state) => state.markQuoteSubmitted)
  const quoteSubmitted = useConfiguratorStore((state) => state.quoteSubmitted)
  const shareToken = useConfiguratorStore((state) => state.shareToken)

  const [state, setState] = useState<ContactFormState>({ status: 'idle' })
  const [submitting, setSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    if (turnstileRequired && !turnstileToken) {
      setState({ status: 'error', message: 'Please complete the security check and try again.' })
      return
    }

    const formData = new FormData(event.currentTarget)
    setSubmitting(true)
    setState({ status: 'idle' })

    try {
      const saved = await ensureSavedConfiguration()
      if (!saved?.shareToken) {
        setState({ status: 'error', message: 'Could not save your configuration. Please try again.' })
        return
      }

      formData.set('share_token', saved.shareToken)
      if (turnstileToken) {
        formData.set('turnstile_token', turnstileToken)
      }

      const result = await submitConfiguratorQuote(formData)
      setState(result)

      if (result.status === 'success') {
        markQuoteSubmitted()
        captureConfiguratorEvent('configurator quote submitted', { share_token: saved.shareToken })
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (quoteSubmitted || state.status === 'success') {
    const configUrl = shareToken
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}${buildQuoteSharePath(shareToken)}`
      : ''
    const whatsAppText = encodeURIComponent(
      `Hi Steelyes, I've just requested a quote for my gate design.${configUrl ? ` ${configUrl}` : ''}`,
    )

    return (
      <div className="border border-steel/10 bg-white p-5" data-testid="quote-request-success">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Request received</p>
        <h3 className="mt-2 font-heading text-xl font-black uppercase tracking-tight text-steel">
          We&rsquo;ll be in touch
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-deep">
          Your design and details are with the workshop. We respond within 1 business day, and we&rsquo;ve emailed you
          a copy of your configuration.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href={`tel:${BUSINESS.phone}`}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-steel/12 bg-paper px-4 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
          >
            <PhoneCall className="h-4 w-4" aria-hidden />
            {BUSINESS.phoneDisplay}
          </a>
          <a
            href={`https://wa.me/${BUSINESS.phone.replace(/\D/g, '')}?text=${whatsAppText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-steel/12 bg-paper px-4 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp us
          </a>
        </div>
      </div>
    )
  }

  return (
    <form
      id={CONFIGURATOR_QUOTE_FORM_ID}
      onSubmit={handleSubmit}
      className="space-y-4 border border-steel/10 bg-white p-5"
      data-testid="quote-request-form"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Get your quote</p>
        <p className="mt-1 text-sm leading-6 text-muted-deep">
          Leave your details and we&rsquo;ll come back within 1 business day with next steps — no obligation.
        </p>
      </div>

      <input type="text" name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" className="sr-only" />

      {state.status === 'error' ? (
        <p role="alert" className="border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-primary">
          {state.message}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          <span className={LABEL_CLASS}>
            Full name <span aria-hidden="true" className="text-primary">*</span>
          </span>
          <input name="name" required autoComplete="name" className={FIELD_CLASS} />
        </label>
        <label className="block text-sm font-medium">
          <span className={LABEL_CLASS}>
            Email <span aria-hidden="true" className="text-primary">*</span>
          </span>
          <input name="email" type="email" inputMode="email" required autoComplete="email" className={FIELD_CLASS} />
        </label>
        <label className="block text-sm font-medium">
          <span className={LABEL_CLASS}>
            Phone <span aria-hidden="true" className="text-primary">*</span>
          </span>
          <input name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={FIELD_CLASS} />
        </label>
        <label className="block text-sm font-medium">
          <span className={LABEL_CLASS}>Postcode</span>
          <input name="postcode" autoComplete="postal-code" className={FIELD_CLASS} />
        </label>
      </div>

      <label className="block text-sm font-medium">
        <span className={LABEL_CLASS}>Anything we should know? (optional)</span>
        <textarea
          name="message"
          rows={3}
          className="mt-2 w-full border border-steel/12 bg-white px-4 py-3 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
          placeholder="Access notes, timelines, questions… Custom hex is already saved on the design; add RAL name here if you have it."
        />
      </label>

      {turnstileRequired ? <TurnstileWidget onToken={setTurnstileToken} /> : null}

      {/* Submitted by the sticky action bar via form={CONFIGURATOR_QUOTE_FORM_ID}. */}
      {submitting ? (
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted" role="status">
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          Sending your request…
        </p>
      ) : null}

      <p className="text-xs leading-5 text-muted">
        Estimated pricing — the final quote is confirmed after a site survey. We only use your details to handle
        this request.
      </p>
    </form>
  )
}
