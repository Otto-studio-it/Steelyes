import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { IntakeForm } from '@/components/client-intake/IntakeForm'
import type { IntakeAnswerStatus } from '@/lib/client-intake/questions'
import { ensureAnswersSeeded, getIntakeSessionByToken } from '@/lib/client-intake/session'

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
      />
    </div>
  )
}
