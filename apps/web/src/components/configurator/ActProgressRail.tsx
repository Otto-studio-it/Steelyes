'use client'

import { Check, ChevronLeft } from 'lucide-react'

import { CONFIGURATOR_ACTS } from '@/lib/configurator/navigation'
import { useConfiguratorStore, useConfiguratorAct } from '@/store/configuratorStore'

export function ActProgressRail() {
  const { actIndex, act, isFirst, totalActs } = useConfiguratorAct()
  const setActIndex = useConfiguratorStore((state) => state.setActIndex)
  const prevAct = useConfiguratorStore((state) => state.prevAct)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 border-l-4 border-primary pl-4">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            {act.overline} · {actIndex + 1} of {totalActs}
          </p>
          <h2 className="mt-1 font-heading text-xl font-black uppercase tracking-tight text-steel sm:text-2xl">
            {act.label}
          </h2>
        </div>
        {!isFirst ? (
          <button
            type="button"
            onClick={prevAct}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1 border border-steel/12 bg-white px-4 font-heading text-xs font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        ) : null}
      </div>

      <div className="flex items-end gap-2" role="tablist" aria-label="Configuration progress">
        {CONFIGURATOR_ACTS.map((item, index) => {
          const active = index === actIndex
          const complete = index < actIndex

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              onClick={() => setActIndex(index)}
              className="group flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-end gap-1.5 px-1 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-current={active ? 'step' : undefined}
              aria-selected={active}
              aria-label={`${item.label}${active ? ', current act' : complete ? ', completed' : ''}`}
            >
              {complete ? (
                <Check className="h-4 w-4 text-steel" aria-hidden />
              ) : (
                <span className="h-4" aria-hidden />
              )}
              <span
                className={`h-1 w-full transition ${
                  active ? 'bg-primary' : complete ? 'bg-steel' : 'bg-steel/15 group-hover:bg-steel/25'
                }`}
              />
              <span
                className={`truncate font-mono text-xs uppercase tracking-widest ${
                  active ? 'text-primary' : complete ? 'text-steel' : 'text-muted'
                }`}
              >
                {item.shortLabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
