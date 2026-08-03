'use client'

import Image from 'next/image'
import { useState } from 'react'
import { createGateConfig, createGatePreset, GATE_TYPES, type GateType } from '@steelyes/gate-engine'

import { GateTypeExplorationDialog } from '@/components/configurator/GateTypeExplorationDialog'
import {
  gateTypeAvailabilityLabel,
  getGateTypeAvailability,
} from '@/lib/configurator/gate-type-availability'
import { PRIMARY_GATE_TYPE } from '@/lib/configurator/navigation'
import { GATE_TYPE_IMAGES } from '@/lib/configurator/presentation'
import { gateTypeLabel } from '@/lib/configurator/labels'
import { BUSINESS } from '@/lib/marketing/business'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

function enquireMailto(gateType: GateType): string {
  const subject = encodeURIComponent(`Enquiry — ${gateTypeLabel(gateType)}`)
  const body = encodeURIComponent(
    `Hi Steelyes,\n\nI am interested in a ${gateTypeLabel(gateType)}. Please contact me to discuss options.\n`,
  )
  return `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`
}

export function GateTypeCardGrid() {
  const config = useConfiguratorConfig()
  const setConfig = useConfiguratorStore((state) => state.setConfig)
  const [pendingType, setPendingType] = useState<GateType | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const selectType = (nextType: GateType) => {
    if (nextType === config.gateType) {
      return
    }

    const availability = getGateTypeAvailability(nextType)

    if (availability === 'enquire') {
      setPendingType(nextType)
      setDialogOpen(true)
      return
    }

    if (nextType === PRIMARY_GATE_TYPE || availability === 'configure') {
      setConfig(createGateConfig(createGatePreset(nextType)))
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
    setConfig(createGateConfig(createGatePreset(pendingType)))
    setPendingType(null)
  }

  return (
    <>
      <div className="space-y-2">
        <span className="block font-mono text-xs uppercase tracking-widest text-muted">Gate mechanism</span>
        <div
          className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4"
          role="radiogroup"
          aria-label="Gate type"
        >
          {GATE_TYPES.map((gateType) => {
            const selected = config.gateType === gateType
            const availability = getGateTypeAvailability(gateType)
            const primary = gateType === PRIMARY_GATE_TYPE
            const imageSrc = GATE_TYPE_IMAGES[gateType]
            const badge = primary ? 'Primary' : gateTypeAvailabilityLabel(availability)

            return (
              <button
                key={gateType}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => selectType(gateType)}
                className={`flex min-h-[120px] min-w-[160px] shrink-0 flex-col overflow-hidden border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-w-0 ${
                  selected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-steel/12 bg-white hover:border-primary/30'
                }`}
              >
                <div className="relative h-20 w-full bg-steel/5">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="160px"
                      aria-hidden
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-muted">
                      {gateTypeLabel(gateType).slice(0, 2)}
                    </div>
                  )}
                  <span
                    className={`absolute left-2 top-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                      primary
                        ? 'bg-primary text-white'
                        : availability === 'enquire'
                          ? 'bg-steel text-white'
                          : 'bg-steel/80 text-white'
                    }`}
                  >
                    {badge}
                  </span>
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
