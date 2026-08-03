'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { saveIntakeAnswer } from '@/app/intake/actions'
import type { IntakeAnswerStatus, IntakeQuestion } from '@/lib/client-intake/questions'
import { buildPlainExplanation, getProvenanceForQuestion } from '@/lib/client-intake/provenance'
import { cn } from '@/lib/utils'

type Props = {
  token: string
  question: IntakeQuestion
  initialValue: unknown
  initialStatus: IntakeAnswerStatus
  readOnly?: boolean
  /** Admin can force-edit with different save path */
  onSave?: (payload: {
    questionId: string
    value: unknown
    status: IntakeAnswerStatus
  }) => Promise<{ ok: boolean; error?: string }>
  /** Called immediately when the user changes a value (for live progress). */
  onLocalChange?: (payload: {
    questionId: string
    value: unknown
    status: IntakeAnswerStatus
  }) => void
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

function statusFromConfirmChoice(choice: string | null | undefined): IntakeAnswerStatus {
  if (choice === 'confirm') return 'confirmed'
  if (choice === 'correct') return 'confirmed'
  if (choice === 'unsure') return 'provisional'
  return 'proposed'
}

function statusBadge(status: IntakeAnswerStatus) {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-800'
    case 'provisional':
      return 'bg-amber-100 text-amber-800'
    case 'proposed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-zinc-100 text-zinc-600'
  }
}

const STATUS_LABEL: Record<IntakeAnswerStatus, string> = {
  confirmed: 'Confermato',
  provisional: 'Provvisorio',
  proposed: 'Da confermare',
  missing: 'Mancante',
}

export function IntakeQuestionField({
  token,
  question,
  initialValue,
  initialStatus,
  readOnly,
  onSave,
  onLocalChange,
}: Props) {
  const [value, setValue] = useState<unknown>(initialValue)
  const [status, setStatus] = useState<IntakeAnswerStatus>(initialStatus)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [explainOpen, setExplainOpen] = useState(false)
  const [, startTransition] = useTransition()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const explanation = buildPlainExplanation({
    questionId: question.id,
    label: question.label,
    context: question.context,
  })
  const sources = getProvenanceForQuestion(question.id)

  useEffect(() => {
    setValue(initialValue)
    setStatus(initialStatus)
  }, [initialValue, initialStatus, question.id])

  function persist(nextValue: unknown, nextStatus: IntakeAnswerStatus) {
    if (readOnly) return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setSaveState('saving')
      setError(null)
      startTransition(async () => {
        const result = onSave
          ? await onSave({ questionId: question.id, value: nextValue, status: nextStatus })
          : await saveIntakeAnswer({
              token,
              questionId: question.id,
              value: nextValue,
              status: nextStatus,
            })

        if (!result.ok) {
          setSaveState('error')
          setError('error' in result ? (result.error ?? 'Errore') : 'Errore')
          return
        }
        setStatus(nextStatus)
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 1600)
      })
    }, 700)
  }

  function update(nextValue: unknown, nextStatus: IntakeAnswerStatus) {
    setValue(nextValue)
    setStatus(nextStatus)
    onLocalChange?.({ questionId: question.id, value: nextValue, status: nextStatus })
    persist(nextValue, nextStatus)
  }

  // confirm / choice helpers
  const record = asRecord(value)
  const choice = typeof record.choice === 'string' ? record.choice : ''
  const note = typeof record.note === 'string' ? record.note : ''
  const textValue = typeof value === 'string' ? value : value == null ? '' : String(value ?? '')

  return (
    <article
      className={cn(
        'border border-zinc-200 bg-white px-4 py-4',
        question.blocking && status !== 'confirmed' && status !== 'provisional' && 'border-l-4 border-l-[#9e000c]',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-[#1b1c1a]">
          {question.label}
          {question.blocking ? (
            <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-widest text-[#9e000c]">
              Bloccante
            </span>
          ) : null}
        </h3>
        <span
          className={cn(
            'rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest',
            statusBadge(status),
          )}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
      {question.context ? <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{question.context}</p> : null}

      <div className="mt-2">
        <button
          type="button"
          className="min-h-[36px] font-mono text-[10px] uppercase tracking-widest text-[#9e000c] underline-offset-2 hover:underline"
          onClick={() => setExplainOpen((v) => !v)}
          aria-expanded={explainOpen}
        >
          {explainOpen ? 'Nascondi spiegazione' : 'Non capisco — spiega meglio'}
        </button>
        {explainOpen && (
          <div className="mt-2 space-y-2 border border-zinc-100 bg-[#fbf9f6] px-3 py-3 text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap">
            {explanation}
            {sources.length > 0 && (
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                Fonti: {sources.map((s) => s.title).join(' · ')}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {question.input === 'confirm' && (
          <>
            <div className="flex flex-col gap-2">
              {(question.options ?? []).map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    'flex min-h-[44px] cursor-pointer items-center gap-3 border px-3 py-2 text-sm',
                    choice === opt.value ? 'border-[#9e000c] bg-[#9e000c]/5' : 'border-zinc-200',
                    readOnly && 'pointer-events-none opacity-70',
                  )}
                >
                  <input
                    type="radio"
                    className="size-4 accent-[#9e000c]"
                    name={question.id}
                    value={opt.value}
                    checked={choice === opt.value}
                    disabled={readOnly}
                    onChange={() => {
                      const next = { ...record, choice: opt.value }
                      update(next, statusFromConfirmChoice(opt.value))
                    }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {(choice === 'correct' || choice === 'unsure') && (
              <textarea
                className="min-h-[88px] w-full border border-zinc-200 bg-[#fbf9f6] px-3 py-2 text-sm outline-none focus:border-[#9e000c]"
                placeholder={choice === 'correct' ? 'Scrivi la correzione…' : 'Cosa non ti è chiaro?'}
                value={note}
                disabled={readOnly}
                onChange={(e) => {
                  const next = { ...record, note: e.target.value, choice }
                  update(next, statusFromConfirmChoice(choice))
                }}
              />
            )}
          </>
        )}

        {question.input === 'choice' && (
          <div className="flex flex-col gap-2">
            {(question.options ?? []).map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'flex min-h-[44px] cursor-pointer items-center gap-3 border px-3 py-2 text-sm',
                  value === opt.value ? 'border-[#9e000c] bg-[#9e000c]/5' : 'border-zinc-200',
                  readOnly && 'pointer-events-none opacity-70',
                )}
              >
                <input
                  type="radio"
                  className="size-4 accent-[#9e000c]"
                  name={question.id}
                  value={opt.value}
                  checked={value === opt.value}
                  disabled={readOnly}
                  onChange={() => update(opt.value, 'confirmed')}
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}

        {question.input === 'text' && (
          <input
            type="text"
            className="min-h-[44px] w-full border border-zinc-200 bg-[#fbf9f6] px-3 py-2 text-sm outline-none focus:border-[#9e000c]"
            placeholder={question.placeholder}
            value={textValue}
            disabled={readOnly}
            onChange={(e) => {
              const v = e.target.value
              update(v, v.trim() ? 'confirmed' : 'missing')
            }}
          />
        )}

        {(question.input === 'textarea' || question.input === 'number') && (
          <textarea
            className="min-h-[100px] w-full border border-zinc-200 bg-[#fbf9f6] px-3 py-2 text-sm outline-none focus:border-[#9e000c]"
            placeholder={question.placeholder}
            value={textValue}
            disabled={readOnly}
            onChange={(e) => {
              const v = e.target.value
              update(v, v.trim() ? 'confirmed' : 'missing')
            }}
          />
        )}

        {question.input !== 'confirm' && question.input !== 'choice' && !readOnly && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className="min-h-[40px] border border-zinc-200 px-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600"
              onClick={() => update(value, 'provisional')}
            >
              Segna come provvisorio
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 flex min-h-[18px] items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          {saveState === 'saving' && 'Salvataggio…'}
          {saveState === 'saved' && 'Salvato'}
          {saveState === 'error' && (error ?? 'Errore salvataggio')}
        </p>
      </div>
    </article>
  )
}
