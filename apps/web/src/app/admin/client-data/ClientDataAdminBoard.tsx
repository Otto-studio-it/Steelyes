'use client'

import { useMemo, useState, useTransition } from 'react'

import {
  adminSaveIntakeAnswer,
  adminSetIntakeStatus,
  createNewIntakeSession,
  ensureIntakeSession,
  exportIntakePdfAction,
} from '@/app/admin/client-data/actions'
import { IntakeQuestionField } from '@/components/client-intake/IntakeQuestionField'
import { isAdminActionError } from '@/lib/admin/admin-action-result'
import {
  INTAKE_QUESTIONS,
  INTAKE_SECTIONS,
  type IntakeAnswerStatus,
  type IntakeSectionId,
} from '@/lib/client-intake/questions'
import { computeProgressFromStatuses } from '@/lib/client-intake/progress'
import type { IntakeSessionRow } from '@/lib/client-intake/session'
import { cn } from '@/lib/utils'

type AnswerView = {
  question_id: string
  value_json: unknown
  status: IntakeAnswerStatus
  source: string
  updated_at: string
}

type Props = {
  session: IntakeSessionRow | null
  answers: AnswerView[]
  siteUrl: string
}

function downloadBase64Pdf(filename: string, base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ClientDataAdminBoard({ session, answers: initialAnswers, siteUrl }: Props) {
  const [openSection, setOpenSection] = useState<IntakeSectionId | null>('confirm_shared')
  const [answers, setAnswers] = useState<AnswerView[]>(initialAnswers)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const byId = useMemo(() => {
    const map = new Map(answers.map((a) => [a.question_id, a]))
    return map
  }, [answers])

  const progress = useMemo(() => {
    const statuses = new Map<string, IntakeAnswerStatus>()
    for (const q of INTAKE_QUESTIONS) {
      statuses.set(q.id, byId.get(q.id)?.status ?? 'missing')
    }
    return computeProgressFromStatuses(statuses)
  }, [byId])

  const intakeUrl = session ? `${siteUrl}/intake/${session.access_token}` : null

  function patchAnswer(questionId: string, value: unknown, status: IntakeAnswerStatus) {
    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.question_id === questionId)
      const next: AnswerView = {
        question_id: questionId,
        value_json: value,
        status,
        source: 'admin',
        updated_at: new Date().toISOString(),
      }
      if (idx === -1) return [...prev, next]
      const copy = prev.slice()
      copy[idx] = { ...copy[idx], ...next }
      return copy
    })
  }

  return (
    <div className="space-y-6">
      {!session ? (
        <div className="border border-zinc-200 bg-white px-5 py-6">
          <p className="text-sm text-zinc-600">
            Nessuna sessione intake. Creane una per generare il link da mandare a Marius (con i
            dati già noti precompilati).
          </p>
          <button
            type="button"
            disabled={pending}
            className="mt-4 min-h-[44px] bg-[#9e000c] px-4 font-heading text-sm font-bold uppercase tracking-tight text-white disabled:opacity-60"
            onClick={() => {
              setMessage(null)
              startTransition(async () => {
                const res = await ensureIntakeSession()
                if (isAdminActionError(res)) setMessage(res.error)
                else {
                  setMessage('Sessione creata — ricarica la pagina se non vedi il link.')
                  window.location.reload()
                }
              })
            }}
          >
            Crea sessione intake
          </button>
        </div>
      ) : (
        <>
          <div className="border border-zinc-200 bg-white px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Link cliente · stato {session.status}
            </p>
            <a
              href={intakeUrl ?? '#'}
              className="mt-1 block break-all font-mono text-xs text-[#9e000c] underline-offset-2 hover:underline"
            >
              {intakeUrl}
            </a>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="min-h-[40px] border border-zinc-200 px-3 font-mono text-[10px] uppercase tracking-widest"
                onClick={async () => {
                  if (!intakeUrl) return
                  await navigator.clipboard.writeText(intakeUrl)
                  setMessage('Link copiato.')
                }}
              >
                Copia link
              </button>
              <button
                type="button"
                disabled={pending}
                className="min-h-[40px] border border-zinc-200 px-3 font-mono text-[10px] uppercase tracking-widest"
                onClick={() => {
                  setMessage(null)
                  startTransition(async () => {
                    const res = await exportIntakePdfAction(session.id)
                    if ('error' in res) {
                      setMessage(res.error)
                      return
                    }
                    downloadBase64Pdf(res.filename, res.base64)
                    setMessage('PDF scaricato.')
                  })
                }}
              >
                Esporta PDF
              </button>
              <button
                type="button"
                disabled={pending}
                className="min-h-[40px] border border-zinc-200 px-3 font-mono text-[10px] uppercase tracking-widest"
                onClick={() => {
                  startTransition(async () => {
                    const res = await adminSetIntakeStatus(session.id, 'in_progress')
                    setMessage(isAdminActionError(res) ? res.error : 'Sbloccata / in corso.')
                  })
                }}
              >
                Sblocca
              </button>
              <button
                type="button"
                disabled={pending}
                className="min-h-[40px] border border-zinc-200 px-3 font-mono text-[10px] uppercase tracking-widest"
                onClick={() => {
                  startTransition(async () => {
                    const res = await adminSetIntakeStatus(session.id, 'locked')
                    setMessage(isAdminActionError(res) ? res.error : 'Sessione bloccata.')
                  })
                }}
              >
                Blocca
              </button>
              <button
                type="button"
                disabled={pending}
                className="min-h-[40px] border border-[#9e000c] px-3 font-mono text-[10px] uppercase tracking-widest text-[#9e000c]"
                onClick={() => {
                  if (
                    !confirm(
                      'Creare una NUOVA sessione? Il link precedente resterà valido finché non lo revochi a mano.',
                    )
                  ) {
                    return
                  }
                  startTransition(async () => {
                    const res = await createNewIntakeSession()
                    if (isAdminActionError(res)) setMessage(res.error)
                    else {
                      setMessage('Nuova sessione creata.')
                      window.location.reload()
                    }
                  })
                }}
              >
                Nuova sessione
              </button>
            </div>
            {message && <p className="mt-2 text-xs text-zinc-600">{message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2 border border-zinc-200 bg-white p-3 text-center sm:grid-cols-5">
            <MiniStat label="Confermati" value={progress.confirmed} />
            <MiniStat label="Provvisori" value={progress.provisional} />
            <MiniStat label="Da confermare" value={progress.proposed} />
            <MiniStat label="Mancanti" value={progress.missing} />
            <MiniStat label="Bloccanti" value={progress.blockingMissing} accent />
          </div>

          <div className="flex flex-col gap-2">
            {INTAKE_SECTIONS.map((section) => {
              const qs = INTAKE_QUESTIONS.filter((q) => q.section === section.id)
              const open = openSection === section.id
              const done = qs.filter((q) => {
                const st = byId.get(q.id)?.status
                return st === 'confirmed' || st === 'provisional'
              }).length
              return (
                <div key={section.id} className="border border-zinc-200 bg-white">
                  <button
                    type="button"
                    className="flex min-h-[48px] w-full items-center justify-between px-4 py-3 text-left"
                    onClick={() => setOpenSection(open ? null : section.id)}
                  >
                    <span className="font-heading text-sm font-bold uppercase tracking-tight">
                      {section.title}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                      {done}/{qs.length} · {open ? 'Chiudi' : 'Apri'}
                    </span>
                  </button>
                  {open && (
                    <div className="flex flex-col gap-3 border-t border-zinc-100 px-3 py-3">
                      {qs.map((q) => {
                        const answer = byId.get(q.id)
                        return (
                          <div key={q.id}>
                            <IntakeQuestionField
                              token=""
                              question={q}
                              initialValue={answer?.value_json ?? q.seed?.value ?? null}
                              initialStatus={answer?.status ?? q.seed?.status ?? 'missing'}
                              onLocalChange={({ questionId, value, status }) =>
                                patchAnswer(questionId, value, status)
                              }
                              onSave={async ({ questionId, value, status }) => {
                                const res = await adminSaveIntakeAnswer({
                                  sessionId: session.id,
                                  questionId,
                                  value,
                                  status,
                                })
                                if (isAdminActionError(res)) {
                                  return { ok: false, error: res.error }
                                }
                                return { ok: true }
                              }}
                            />
                            {answer && (
                              <p className="mt-1 px-1 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                                source {answer.source} ·{' '}
                                {new Date(answer.updated_at).toLocaleString('it-IT')}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div>
      <p className={cn('font-heading text-lg font-black', accent ? 'text-[#9e000c]' : 'text-[#1b1c1a]')}>
        {value}
      </p>
      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">{label}</p>
    </div>
  )
}
