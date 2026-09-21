'use client'

import { useState } from 'react'
import { createGateConfig, createGatePreset, GATE_TYPES, type GateType } from '@steelyes/gate-engine'

import { GateTypeExplorationDialog } from '@/components/configurator/GateTypeExplorationDialog'
import { SelectedCheck } from '@/components/configurator/SelectedCheck'
import {
  gateTypeAvailabilityLabel,
  getGateTypeAvailability,
} from '@/lib/configurator/gate-type-availability'
import { PRIMARY_GATE_TYPE } from '@/lib/configurator/navigation'
import { gateTypeLabel } from '@/lib/configurator/labels'
import { BUSINESS } from '@/lib/marketing/business'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

function typeMasterThumb(gateType: GateType): string {
  return `/2d-masters/${gateType}/silhouettes/base.svg`
}

function enquireMailto(gateType: GateType): string {
  const subject = encodeURIComponent(`Enquiry — ${gateTypeLabel(gateType)}`)
  const body = encodeURIComponent(
    `Hi Steelyes,\n\nI am interested in a ${gateTypeLabel(gateType)}. Please contact me to discuss options.\n`,
  )
  return `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`
}

type GateTypeCardGridProps = {
  /** Called after a type is committed so parent sheets can close and reveal the drawing. */
  onTypeCommitted?: () => void
}

export function GateTypeCardGrid({ onTypeCommitted }: GateTypeCardGridProps) {
  const config = useConfiguratorConfig()
  const setConfig = useConfiguratorStore((state) => state.setConfig)
  const [pendingType, setPendingType] = useState<GateType | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const commitType = (nextType: GateType) => {
    setConfig(createGateConfig(createGatePreset(nextType)))
    onTypeCommitted?.()
  }

  const selectType = (nextType: GateType) => {
    if (nextType === config.gateType) {
      onTypeCommitted?.()
      return
    }

    const availability = getGateTypeAvailability(nextType)

    if (availability === 'enquire') {
      setPendingType(nextType)
      setDialogOpen(true)
      return
    }

    if (nextType === PRIMARY_GATE_TYPE || availability === 'configure') {
      commitType(nextType)
      return
    }

    // schematic exploration
    setPendingType(nextType)
    setDialogOpen(true)
  }

  const confirmPendingType = () => {
    if (!pendingType) {
      return
    }
    if (getGateTypeAvailability(pendingType) === 'enquire') {
      return
    }
    commitType(pendingType)
    setPendingType(null)
  }

  return (
    <>
      <div className="space-y-2">
        <span className="block font-mono text-xs uppercase tracking-widest text-muted">Gate mechanism</span>
        <div
          className="grid grid-cols-2 gap-3 xl:grid-cols-4"
          role="radiogroup"
          aria-label="Gate type"
        >
          {GATE_TYPES.map((gateType) => {
            const selected = config.gateType === gateType
            const availability = getGateTypeAvailability(gateType)
            const primary = gateType === PRIMARY_GATE_TYPE
            const imageSrc = typeMasterThumb(gateType)
            // Every fully configurable type would carry the same "Configure" tag — only badge the exceptions.
            const badge = primary
              ? 'Most popular'
              : availability === 'configure'
                ? null
                : gateTypeAvailabilityLabel(availability)

            return (
              <button
                key={gateType}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => selectType(gateType)}
                className={`relative flex min-h-[120px] min-w-0 flex-col overflow-hidden border-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  selected ? 'border-primary bg-primary/5' : 'border-steel/12 bg-white hover:border-primary/30'
                }`}
              >
                {selected ? <SelectedCheck /> : null}
                <div className="relative aspect-[16/10] w-full bg-[#F3F2EF]">
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element -- static public master SVG
                    <img
                      src={imageSrc}
                      alt=""
                      className="absolute inset-0 h-full w-full object-contain object-center p-1"
                      aria-hidden
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-muted">
                      {gateTypeLabel(gateType).slice(0, 2)}
                    </div>
                  )}
                  {badge ? (
                    <span
                      className={`absolute left-2 top-2 z-10 px-2 py-0.5 font-mono text-xs uppercase tracking-wider ${
                        primary
                          ? 'bg-primary text-white'
                          : availability === 'enquire'
                            ? 'bg-steel text-white'
                            : 'bg-steel/80 text-white'
                      }`}
                    >
                      {badge}
                    </span>
                  ) : null}
                  {imageSrc ? (
                    <span
                      className="pointer-events-none absolute bottom-1.5 right-1.5 z-10 rounded-sm bg-steel/55 px-1.5 py-0.5 font-heading text-[8px] font-bold uppercase tracking-[0.14em] text-white/90"
                      aria-hidden
                    >
                      Steelyes
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col justify-center px-3 py-2">
                  <span className="font-heading text-xs font-bold uppercase tracking-tight text-steel sm:text-sm">
                    {gateTypeLabel(gateType)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <GateTypeExplorationDialog
        gateType={pendingType}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={confirmPendingType}
        enquireHref={pendingType ? enquireMailto(pendingType) : undefined}
      />
    </>
  )
}
