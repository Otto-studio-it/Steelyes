'use client'

import { useMemo, useState } from 'react'
import { humanizeSlug } from '@/lib/admin/format'
import { GatePriceCard, type Gate } from './GatePriceCard'

type FinishFilter = 'all' | 'metal' | 'composite'

const FINISH_FILTERS: Array<{ value: FinishFilter; label: string }> = [
  { value: 'all', label: 'Tutti' },
  { value: 'metal', label: 'Metallo' },
  { value: 'composite', label: 'Composito' },
]

export function GatesBoard({ gates }: { gates: Gate[] }) {
  const [finishFilter, setFinishFilter] = useState<FinishFilter>('all')

  const groupedByType = useMemo(() => {
    const groups = new Map<string, Gate[]>()

    for (const gate of gates) {
      if (finishFilter !== 'all' && gate.finish !== finishFilter) continue
      const current = groups.get(gate.type) ?? []
      current.push(gate)
      groups.set(gate.type, current)
    }

    return Array.from(groups.entries())
  }, [finishFilter, gates])

  const visibleCount = groupedByType.reduce((count, [, items]) => count + items.length, 0)

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap gap-2">
        {FINISH_FILTERS.map((filter) => {
          const active = finishFilter === filter.value
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setFinishFilter(filter.value)}
              aria-pressed={active}
              className={[
                'inline-flex min-h-[40px] items-center border px-3 font-mono text-[10px] uppercase tracking-widest transition-colors',
                active
                  ? 'border-[#9e000c] bg-[#9e000c] text-white'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-[#9e000c] hover:text-[#9e000c]',
              ].join(' ')}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {groupedByType.length > 0 ? (
        <div className="space-y-6">
          {groupedByType.map(([type, items]) => (
            <section key={type} className="space-y-2">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#906f6b]">
                    Tipo
                  </p>
                  <h2 className="font-heading text-sm font-bold uppercase tracking-tight text-[#1b1c1a]">
                    {humanizeSlug(type)}
                  </h2>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  {items.length} {items.length === 1 ? 'cancello' : 'cancelli'}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {items.map((gate) => (
                  <GatePriceCard key={gate.id} gate={gate} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="font-mono text-sm text-zinc-400">
          Nessun cancello corrisponde al filtro selezionato.
        </p>
      )}

      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
        {visibleCount} {visibleCount === 1 ? 'cancello visibile' : 'cancelli visibili'}
      </p>
    </div>
  )
}
