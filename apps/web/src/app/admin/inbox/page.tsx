import { redirect } from 'next/navigation'

import { requireAdmin } from '@/lib/admin/require-admin'
import { getServiceRoleClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

import { InboxAdminControls } from './InboxAdminControls'

export const dynamic = 'force-dynamic'

type InboundEmailCategory = Database['public']['Tables']['inbound_emails']['Row']['category']

const CATEGORY_LABELS: Record<InboundEmailCategory, string> = {
  preventivo: 'Preventivo',
  reclamo: 'Reclamo',
  fattura: 'Fattura',
  garanzia: 'Garanzia',
  generico: 'Generico',
}

const CATEGORY_STYLES: Record<InboundEmailCategory, string> = {
  preventivo: 'bg-primary/10 text-primary',
  reclamo: 'bg-red-100 text-red-800',
  fattura: 'bg-blue-100 text-blue-800',
  garanzia: 'bg-amber-100 text-amber-800',
  generico: 'bg-zinc-200 text-zinc-600',
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function InboxAdminPage() {
  const denied = await requireAdmin()
  if (denied) redirect('/admin/login?error=unauthorized')

  const client = getServiceRoleClient()

  const { data: emails, error } = await client
    .from('inbound_emails')
    .select('id, from_email, subject, snippet, category, received_at, handled')
    .order('received_at', { ascending: false })
    .limit(100)

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Posta in arrivo</p>
      <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-steel">
        Email dirette a info@
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Email arrivate direttamente in casella (non dal sito), già auto-risposte e classificate da Gmail. Segna come
        gestite quando hai risposto di persona.
      </p>

      {error && <p className="mt-4 font-mono text-xs text-red-700">Errore caricamento: {error.message}</p>}

      {!error && emails && emails.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {emails.map((email) => (
            <li
              key={email.id}
              className={`border border-zinc-200 bg-white px-5 py-4 ${email.handled ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                  {email.subject || '(senza oggetto)'}
                </p>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${CATEGORY_STYLES[email.category]}`}
                >
                  {CATEGORY_LABELS[email.category]}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600">
                <a href={`mailto:${email.from_email}`} className="underline-offset-2 hover:underline">
                  {email.from_email}
                </a>
              </p>
              {email.snippet ? <p className="mt-2 text-xs text-zinc-500">{email.snippet}</p> : null}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  {formatDate(email.received_at)}
                </p>
                <InboxAdminControls emailId={email.id} handled={email.handled} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p className="mt-6 font-mono text-sm text-zinc-400">Nessuna email diretta ancora registrata.</p>
      )}
    </main>
  )
}
