'use client'

import { useState } from 'react'

import { PROVENANCE_DOCS, PROVENANCE_META } from '@/lib/client-intake/provenance'
import { cn } from '@/lib/utils'

export function ClientProvenancePanel() {
  const [openId, setOpenId] = useState<string | null>(PROVENANCE_DOCS[0]?.id ?? null)

  return (
    <section className="border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
          Fonti · Documentazione
        </p>
        <h2 className="mt-1 font-heading text-lg font-black uppercase tracking-tight text-[#1b1c1a]">
          Cosa ci ha detto Marius
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Organizzato dal messaggio originale (listino cancelli + opzioni Victorian + pannelli).
          Origine: {PROVENANCE_META.primaryChannel}. {PROVENANCE_META.note}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          File collegati: {PROVENANCE_META.companionFiles.join(' · ')}
        </p>
      </div>

      <ul className="divide-y divide-zinc-100">
        {PROVENANCE_DOCS.map((doc) => {
          const open = openId === doc.id
          return (
            <li key={doc.id}>
              <button
                type="button"
                className="flex min-h-[48px] w-full items-center justify-between gap-3 px-5 py-3 text-left"
                onClick={() => setOpenId(open ? null : doc.id)}
                aria-expanded={open}
              >
                <span>
                  <span className="font-heading text-sm font-bold uppercase tracking-tight text-[#1b1c1a]">
                    {doc.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    {doc.origin}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-zinc-400">{open ? '▲' : '▼'}</span>
              </button>
              {open && (
                <div className="space-y-3 px-5 pb-4">
                  <p className="text-sm leading-relaxed text-zinc-700">{doc.summary}</p>
                  <p className="text-xs text-zinc-500">
                    <span className="font-mono uppercase tracking-widest">Ricevuto come:</span>{' '}
                    {doc.receivedAs}
                  </p>
                  {doc.facts.length > 0 && (
                    <dl className="grid gap-1.5 border border-zinc-100 bg-[#fbf9f6] px-3 py-3 text-sm">
                      {doc.facts.map((f) => (
                        <div key={f.label} className="flex flex-wrap gap-x-2">
                          <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                            {f.label}
                          </dt>
                          <dd className="text-zinc-800">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {doc.originalExcerpt && (
                    <blockquote
                      className={cn(
                        'border-l-2 border-[#9e000c]/40 pl-3 text-xs italic leading-relaxed text-zinc-600',
                      )}
                    >
                      “{doc.originalExcerpt}”
                    </blockquote>
                  )}
                  {doc.questionIds.length > 0 && (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                      Domande collegate: {doc.questionIds.length}
                    </p>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
