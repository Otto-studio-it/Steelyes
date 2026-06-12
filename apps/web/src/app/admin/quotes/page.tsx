import Link from 'next/link'
import { redirect } from 'next/navigation'

import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin/require-admin'
import { formatConfigurationSummaryInline } from '@/lib/configurator/configuration-summary'
import { buildQuoteSharePath, buildConfiguratorEditorPath } from '@/lib/configurator/share-token'
import { getServiceRoleClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import { deserializeGateConfig, type SerializedGateConfigV1 } from '@steelyes/gate-engine'

import { QuoteAdminControls } from './QuoteAdminControls'

export const dynamic = 'force-dynamic'

type QuoteStatus = Database['public']['Enums']['quote_status']

const STATUS_LABELS: Record<QuoteStatus, string> = {
  new: 'Nuova',
  contacted: 'Contattato',
  quote_sent: 'Preventivo inviato',
  won: 'Vinta',
  lost: 'Persa',
}

const STATUS_STYLES: Record<QuoteStatus, string> = {
  new: 'bg-primary/10 text-primary',
  contacted: 'bg-amber-100 text-amber-800',
  quote_sent: 'bg-blue-100 text-blue-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-zinc-200 text-zinc-600',
}

function formatStoredConfigurationSummary(parameters: unknown): string {
  try {
    const config = deserializeGateConfig(parameters as SerializedGateConfigV1)
    return formatConfigurationSummaryInline(config)
  } catch {
    return '—'
  }
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

export default async function QuotesAdminPage() {
  const denied = await requireAdmin()
  if (denied) redirect('/admin/login?error=unauthorized')

  const client = getServiceRoleClient()

  const { data: quotes, error } = await client
    .from('quote_requests')
    .select(
      'id, first_name, last_name, email, postcode, status, admin_notes, created_at, configurations ( share_token, gate_type, parameters )',
    )
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Pipeline preventivi</p>
        <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-steel">
          Richieste di preventivo
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Le richieste arrivate dal configuratore, con la configurazione collegata. Aggiorna lo stato man mano che
          procedi.
        </p>

        {error && (
          <p className="mt-4 font-mono text-xs text-red-700">Errore caricamento: {error.message}</p>
        )}

        {!error && quotes && quotes.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-3">
            {quotes.map((quote) => {
              const configuration = quote.configurations
              return (
                <li key={quote.id} className="border border-zinc-200 bg-white px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                      {quote.first_name} {quote.last_name}
                    </p>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STATUS_STYLES[quote.status]}`}
                    >
                      {STATUS_LABELS[quote.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">
                    <a href={`mailto:${quote.email}`} className="underline-offset-2 hover:underline">
                      {quote.email}
                    </a>
                    {' · '}
                    {quote.postcode}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {configuration
                      ? formatStoredConfigurationSummary(configuration.parameters)
                      : 'Nessuna configurazione collegata'}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                      {formatDate(quote.created_at)}
                    </p>
                    {configuration?.share_token ? (
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={buildQuoteSharePath(configuration.share_token)}
                          className="font-mono text-[10px] uppercase tracking-widest text-primary underline-offset-2 hover:underline"
                        >
                          Vista cliente →
                        </Link>
                        <Link
                          href={buildConfiguratorEditorPath(configuration.share_token)}
                          className="font-mono text-[10px] uppercase tracking-widest text-steel underline-offset-2 hover:underline"
                        >
                          Apri nel configuratore →
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  <QuoteAdminControls
                    quoteId={quote.id}
                    status={quote.status}
                    adminNotes={quote.admin_notes}
                  />
                </li>
              )
            })}
          </ul>
        ) : (
          !error && (
            <p className="mt-6 font-mono text-sm text-zinc-400">Nessuna richiesta di preventivo ancora.</p>
          )
        )}
      </main>
    </>
  )
}
