'use client'

import { useMemo, useState, useTransition } from 'react'

import { submitIntakeSession } from '@/app/intake/actions'
import { IntakeQuestionField } from '@/components/client-intake/IntakeQuestionField'
import {
  INTAKE_QUESTIONS,
  INTAKE_SECTIONS,
  type IntakeAnswerStatus,
  type IntakeSectionId,
} from '@/lib/client-intake/questions'
import { computeProgressFromStatuses } from '@/lib/client-intake/progress'
import { cn } from '@/lib/utils'

export type IntakeAnswerView = {
  question_id: string
  value_json: unknown
  status: IntakeAnswerStatus
}

export type IntakeEventView = {
  event_type: string
  actor: string
  question_id: string | null
  created_at: string
}

type Props = {
  token: string
  clientName: string
  sessionStatus: string
  answers: IntakeAnswerView[]
  events?: IntakeEventView[]
}

const PHASE_LABEL: Record<string, string> = {
  confirm: '1 · Controlla e conferma',
  open: '2 · Domande aperte',
  gate: '3 · Per tipo di cancello',
  launch: '4 · Lancio sito',
}

export function IntakeForm({
  token,
  clientName,
  sessionStatus,
  answers: initialAnswers,
  events = [],
}: Props) {
  const [openSection, setOpenSection] = useState<IntakeSectionId | null>(
    INTAKE_SECTIONS[0]?.id ?? null,
  )
  const [answers, setAnswers] = useState<IntakeAnswerView[]>(initialAnswers)
  const [submitted, setSubmitted] = useState(sessionStatus === 'submitted')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const locked = sessionStatus === 'locked'

  const byId = useMemo(() => {
    const map = new Map<string, IntakeAnswerView>()
    for (const a of answers) map.set(a.question_id, a)
    return map
  }, [answers])

  const progress = useMemo(() => {
    const statuses = new Map<string, IntakeAnswerStatus>()
    for (const q of INTAKE_QUESTIONS) {
      statuses.set(q.id, byId.get(q.id)?.status ?? 'missing')
    }
    return computeProgressFromStatuses(statuses)
  }, [byId])

  function patchAnswer(questionId: string, value: unknown, status: IntakeAnswerStatus) {
    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.question_id === questionId)
      const next: IntakeAnswerView = { question_id: questionId, value_json: value, status }
      if (idx === -1) return [...prev, next]
      const copy = prev.slice()
      copy[idx] = next
      return copy
    })
  }

  const phases = ['confirm', 'open', 'gate', 'launch'] as const

  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-6">
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
          Steelyes · Dati prodotto
        </p>
        <h1 className="mt-1 font-heading text-2xl font-black uppercase tracking-tight text-[#1b1c1a]">
          Ciao {clientName}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Prima controlla i dati che abbiamo già. Poi rispondi alle domande aperte. Ogni risposta si
          salva da sola — puoi chiudere e riprendere quando vuoi.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 border border-zinc-200 bg-white p-3 text-center sm:grid-cols-4">
          <Stat label="Confermati" value={progress.confirmed} />
          <Stat label="Provvisori" value={progress.provisional} />
          <Stat label="Da confermare" value={progress.proposed} />
          <Stat label="Bloccanti aperti" value={progress.blockingMissing} accent />
        </div>
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          {progress.answeredLike}/{progress.total} risposte utili
        </p>
        {locked && (
          <p className="mt-3 border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Sessione bloccata dall’admin — in sola lettura.
          </p>
        )}
        {submitted && !locked && (
          <p className="mt-3 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
            Hai segnato la sessione come completata. Puoi ancora correggere finché non viene
            bloccata.
          </p>
        )}
      </header>

      {phases.map((phase) => {
        const sections = INTAKE_SECTIONS.filter((s) => s.phase === phase)
        return (
          <section key={phase} className="mb-8">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
              {PHASE_LABEL[phase]}
            </h2>
            <div className="flex flex-col gap-2">
              {sections.map((section) => {
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
                      className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      onClick={() => setOpenSection(open ? null : section.id)}
                      aria-expanded={open}
                    >
                      <div>
                        <p className="font-heading text-sm font-bold uppercase tracking-tight text-[#1b1c1a]">
                          {section.title}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">{section.intro}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                        {done}/{qs.length} {open ? '▲' : '▼'}
                      </span>
                    </button>
                    {open && (
                      <div className="flex flex-col gap-3 border-t border-zinc-100 px-3 py-3">
                        {qs.map((q) => {
                          const answer = byId.get(q.id)
                          return (
                            <IntakeQuestionField
                              key={q.id}
                              token={token}
                              question={q}
                              initialValue={answer?.value_json ?? q.seed?.value ?? null}
                              initialStatus={answer?.status ?? q.seed?.status ?? 'missing'}
                              readOnly={locked}
                              onLocalChange={({ questionId, value, status }) =>
                                patchAnswer(questionId, value, status)
                              }
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {events.length > 0 && <ActivityTimeline events={events} />}

      {!locked && (
        <div className="sticky bottom-0 -mx-4 border-t border-zinc-200 bg-[#fbf9f6]/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            disabled={pending}
            className={cn(
              'flex min-h-[48px] w-full items-center justify-center bg-[#9e000c] font-heading text-sm font-bold uppercase tracking-tight text-white',
              pending && 'opacity-70',
            )}
            onClick={() => {
              setSubmitError(null)
              startTransition(async () => {
                const res = await submitIntakeSession(token)
                if (!res.ok) {
                  setSubmitError(res.error)
                  return
                }
                setSubmitted(true)
              })
            }}
          >
            {pending ? 'Invio…' : 'Ho finito — avvisa Steelyes'}
          </button>
          {submitError && <p className="mt-2 text-center text-xs text-red-700">{submitError}</p>}
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            Le risposte sono già salvate in automatico
          </p>
        </div>
      )}
    </div>
  )
}

const EVENT_LABEL: Record<string, string> = {
  session_created: 'Sessione creata da Steelyes',
  intake_opened: 'Hai aperto il questionario',
  answer_saved: 'Risposta salvata',
  session_submitted: 'Hai segnato la sessione come completata',
  session_locked: 'Steelyes ha bloccato la sessione',
  session_unlocked: 'Steelyes ha riaperto la sessione',
  pdf_exported: 'Steelyes ha esportato il PDF delle risposte',
}

function ActivityTimeline({ events }: { events: IntakeEventView[] }) {
  const [open, setOpen] = useState(false)
  const shown = open ? events : events.slice(0, 5)
  return (
    <section className="mb-8 border border-zinc-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-tight text-[#1b1c1a]">
            La tua attività
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Ogni salvataggio resta registrato: niente va perso, anche se correggi una risposta.
          </p>
        </div>
        {events.length > 5 && (
          <button
            type="button"
            className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Meno' : `Tutte (${events.length})`}
          </button>
        )}
      </div>
      <ul className="border-t border-zinc-100 px-4 py-2">
        {shown.map((e, i) => {
          const q = e.question_id ? INTAKE_QUESTIONS.find((x) => x.id === e.question_id) : null
          return (
            <li
              key={`${e.created_at}-${i}`}
              className="flex items-baseline justify-between gap-3 border-b border-zinc-50 py-1.5 last:border-b-0"
            >
              <span className="text-xs text-zinc-700">
                {EVENT_LABEL[e.event_type] ?? e.event_type}
                {q && <span className="text-zinc-400"> — {q.label}</span>}
              </span>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                {new Date(e.created_at).toLocaleString('it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Stat({
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
      <p
        className={cn(
          'font-heading text-lg font-black',
          accent ? 'text-[#9e000c]' : 'text-[#1b1c1a]',
        )}
      >
        {value}
      </p>
      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">{label}</p>
    </div>
  )
}
