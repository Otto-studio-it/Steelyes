'use client'

import { useTransition } from 'react'

import { updateQuoteRequest } from '@/app/admin/quotes/actions'
import type { Database } from '@/types/database.types'

type QuoteStatus = Database['public']['Enums']['quote_status']

const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: 'new', label: 'Nuova' },
  { value: 'contacted', label: 'Contattato' },
  { value: 'quote_sent', label: 'Preventivo inviato' },
  { value: 'won', label: 'Vinta' },
  { value: 'lost', label: 'Persa' },
]

type QuoteAdminControlsProps = {
  quoteId: string
  status: QuoteStatus
  adminNotes: string | null
}

export function QuoteAdminControls({ quoteId, status, adminNotes }: QuoteAdminControlsProps) {
  const [pending, startTransition] = useTransition()

  return (
    <form
      className="mt-4 border-t border-zinc-100 pt-4"
      action={(formData) => {
        startTransition(async () => {
          await updateQuoteRequest(formData)
        })
      }}
    >
      <input type="hidden" name="id" value={quoteId} />
      <div className="grid gap-3 sm:grid-cols-[minmax(0,180px)_1fr_auto] sm:items-end">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Stato</span>
          <select
            name="status"
            defaultValue={status}
            className="mt-1 block w-full min-h-[44px] border border-zinc-200 bg-white px-3 text-sm text-zinc-800"
            disabled={pending}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Note admin</span>
          <input
            name="admin_notes"
            type="text"
            defaultValue={adminNotes ?? ''}
            placeholder="Follow-up, prezzo inviato, ecc."
            className="mt-1 block w-full min-h-[44px] border border-zinc-200 bg-white px-3 text-sm text-zinc-800"
            disabled={pending}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[44px] items-center justify-center bg-primary px-4 font-heading text-xs font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? 'Salvo…' : 'Salva'}
        </button>
      </div>
    </form>
  )
}
