import { redirect } from 'next/navigation'

import { ClientDataAdminBoard } from '@/app/admin/client-data/ClientDataAdminBoard'
import { ClientProvenancePanel } from '@/components/client-intake/ClientProvenancePanel'
import { requireAdmin } from '@/lib/admin/require-admin'
import type { IntakeAnswerStatus } from '@/lib/client-intake/questions'
import {
  ensureAnswersSeeded,
  getIntakeEvents,
  getLatestIntakeSession,
} from '@/lib/client-intake/session'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export default async function ClientDataAdminPage() {
  const denied = await requireAdmin()
  if (denied) redirect('/admin/login?error=unauthorized')

  const session = await getLatestIntakeSession()
  const answers = session ? await ensureAnswersSeeded(session.id) : []
  const events = session ? await getIntakeEvents(session.id, 60) : []
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? 'https://steelyes.co.uk').replace(/\/$/, '')

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
          Intake prodotto
        </p>
        <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-[#1b1c1a]">
          Dati cliente
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Prima la documentazione di provenienza (cosa ci ha scritto Marius), poi il questionario
          editabile. Le risposte si salvano in automatico anche dal link telefono.
        </p>

        <div className="mt-6">
          <ClientProvenancePanel />
        </div>

        <div className="mt-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
            Questionario live
          </p>
          <ClientDataAdminBoard
            session={session}
            siteUrl={siteUrl}
            answers={answers.map((a) => ({
              question_id: a.question_id,
              value_json: a.value_json,
              status: a.status as IntakeAnswerStatus,
              source: a.source,
              updated_at: a.updated_at,
            }))}
            events={events.map((e) => ({
              event_type: e.event_type,
              actor: e.actor,
              question_id: e.question_id,
              created_at: e.created_at,
            }))}
          />
        </div>
      </main>
    </>
  )
}
