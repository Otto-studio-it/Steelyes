import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { IntakeForm } from '@/components/client-intake/IntakeForm'
import type { IntakeAnswerStatus } from '@/lib/client-intake/questions'
import {
  ensureAnswersSeeded,
  getIntakeEvents,
  getIntakeSessionByToken,
  logIntakeEvent,
} from '@/lib/client-intake/session'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Steelyes — Conferma dati prodotto',
  robots: { index: false, follow: false },
}

type Props = { params: { token: string } }

export default async function IntakePage({ params }: Props) {
  const token = params.token
  if (!token || token.length < 16) notFound()

  const session = await getIntakeSessionByToken(token)
  if (!session) notFound()

  const answers = await ensureAnswersSeeded(session.id)

  // Activity: log the visit (throttled to one per 30 min) and load
  // the client-visible timeline of what they have already done.
  const events = await getIntakeEvents(session.id, 40)
  const lastOpen = events.find((e) => e.event_type === 'intake_opened')
  if (!lastOpen || Date.now() - new Date(lastOpen.created_at).getTime() > 30 * 60 * 1000) {
    await logIntakeEvent({ sessionId: session.id, type: 'intake_opened', actor: 'client' })
  }

  return (
    <div className="min-h-screen bg-[#fbf9f6]">
      <IntakeForm
        token={session.access_token}
        clientName={session.client_name}
        sessionStatus={session.status}
        answers={answers.map((a) => ({
          question_id: a.question_id,
          value_json: a.value_json,
          status: a.status as IntakeAnswerStatus,
        }))}
        events={events.map((e) => ({
          event_type: e.event_type,
          actor: e.actor,
          question_id: e.question_id,
          created_at: e.created_at,
        }))}
      />
    </div>
  )
}
