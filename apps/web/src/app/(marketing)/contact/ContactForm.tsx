'use client'

import { useFormState, useFormStatus } from 'react-dom'
import type { GateConfig } from '@steelyes/gate-engine'

import { submitContactForm, type ContactFormState } from '@/app/actions'
import { ConfigurationReferenceBanner } from '@/components/configurator/ConfigurationReferenceBanner'

const initialState: ContactFormState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-[#9E000C] px-8 py-3 font-heading text-base font-bold uppercase tracking-[0.08em] text-white disabled:opacity-60"
    >
      {pending ? (
        <>
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Sending…
        </>
      ) : (
        'Send specification'
      )}
    </button>
  )
}

type ContactFormProps = {
  shareToken?: string
  attachedConfig?: GateConfig | null
}

export function ContactForm({ shareToken, attachedConfig = null }: ContactFormProps) {
  const [state, action] = useFormState(submitContactForm, initialState)

  if (state.status === 'success') {
    return (
      <div className="flex min-h-[400px] flex-col items-start justify-center space-y-4 border border-zinc-200 bg-white p-8">
        <div className="flex h-12 w-12 items-center justify-center bg-[#1B1C1A]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9E000C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-black uppercase">Enquiry received</h2>
        <p className="max-w-sm text-sm font-light leading-relaxed text-[#5C403D]">
          We&apos;ll review your brief and come back to you within 24–48 hours to discuss next steps and arrange a site survey if relevant.
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
          T: +44 7803 002145 · steelyes@yahoo.com
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6 border border-zinc-200 bg-white p-5 md:p-8">
      <h2 className="font-heading text-2xl font-black uppercase">Project brief</h2>

      {attachedConfig && shareToken ? (
        <ConfigurationReferenceBanner config={attachedConfig} shareToken={shareToken} />
      ) : null}

      <div className="inline-flex items-center gap-3 border border-[#9E000C]/20 bg-[#9E000C]/5 px-4 py-2">
        <span className="h-2 w-2 animate-pulse bg-[#9E000C]" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E000C]">
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

      {state.status === 'error' && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-700">
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Full name <span aria-hidden="true" className="text-[#9E000C]">*</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="mt-2 min-h-[44px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:outline-none focus:ring-0"
          />
        </label>
        <label className="block text-sm font-medium">
          Email <span aria-hidden="true" className="text-[#9E000C]">*</span>
          <input
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            className="mt-2 min-h-[44px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:outline-none focus:ring-0"
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Project type
        <select
          name="project_type"
          defaultValue={attachedConfig ? 'Automated Swing Gates' : ''}
          className="mt-2 min-h-[44px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:outline-none focus:ring-0"
        >
          <option value="">Select a type</option>
          <option>Automated Swing Gates</option>
          <option>Sliding Gates</option>
          <option>Pedestrian Entry</option>
          <option>Cantilever Sliding</option>
          <option>Bifold Gates</option>
          <option>Steel Railings</option>
          <option>Steel Balcony</option>
          <option>Security Gates / Doors</option>
          <option>Other</option>
        </select>
      </label>

      <label className="block text-sm font-medium">
        Postcode
        <input
          name="postcode"
          autoComplete="postal-code"
          className="mt-2 min-h-[44px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:outline-none focus:ring-0"
        />
      </label>

      <label className="block text-sm font-medium">
        Project details <span aria-hidden="true" className="text-[#9E000C]">*</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Describe your project — opening width, gate style, access requirements, timeline..."
          defaultValue={
            attachedConfig && shareToken
              ? `Please quote the attached gate configuration (${shareToken}). Add any site notes, access constraints, or timeline here.`
              : undefined
          }
          className="mt-2 min-h-[120px] w-full resize-none border-b border-zinc-300 bg-transparent px-0 placeholder:text-zinc-400 focus:border-[#9E000C] focus:outline-none focus:ring-0"
        />
      </label>

      <SubmitButton />
    </form>
  )
}
