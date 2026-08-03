'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { FinishPicker } from '@/components/configurator/FinishPicker'
import { GateTypeCardGrid } from '@/components/configurator/GateTypeCardGrid'
import { StyleComparisonPicker } from '@/components/configurator/StyleComparisonPicker'
import { useSheetSwipeDismiss } from '@/hooks/useSheetSwipeDismiss'
import { gateTypeLabel, styleLabel } from '@/lib/configurator/labels'
import { GATE_TYPE_IMAGES } from '@/lib/configurator/presentation'
import { isPrimarySlice, useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

/** Quick Path screen 1 — gate look: type hero (progressive disclosure), style, finish, motor. */
export function QuickGateScreen() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const [typeSheetOpen, setTypeSheetOpen] = useState(false)
  const typeSheetSwipe = useSheetSwipeDismiss(() => setTypeSheetOpen(false))
  const primary = isPrimarySlice(config)
  const heroImage = GATE_TYPE_IMAGES[config.gateType]

  return (
    <div className="space-y-6">
      <div className="overflow-hidden border border-steel/12 bg-white">
        <div className="relative h-32 w-full bg-steel/5">
          {heroImage ? (
            <Image src={heroImage} alt="" fill className="object-cover" sizes="100vw" aria-hidden />
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-steel/8 px-4 py-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Gate mechanism</p>
            <p className="truncate font-heading text-sm font-bold uppercase tracking-tight text-steel">
              {gateTypeLabel(config.gateType)} · {styleLabel(config.style)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTypeSheetOpen(true)}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1 border border-steel/12 bg-white px-3 font-mono text-xs uppercase tracking-widest text-muted transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Change
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>

      {!primary ? (
        <p className="border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm leading-6 text-muted-deep">
          You&rsquo;re in exploration mode for this gate type. Visual detail and pricing may differ from the
          primary Double Swing reference.
        </p>
      ) : null}

      <StyleComparisonPicker />

      <FinishPicker
        value={config.finish}
        customHex={config.customFinishHex}
        onChange={(finish) =>
          patchConfig({
            finish,
            customFinishHex: finish === 'other_ral' ? config.customFinishHex ?? null : null,
          })
        }
        onCustomHexChange={(customFinishHex) => patchConfig({ customFinishHex })}
      />

      <div className="border border-steel/10 bg-paper p-4">
        <ConfiguratorSwitch
          checked={config.motorised}
          onCheckedChange={(motorised) => patchConfig({ motorised })}
          label={config.motorised ? 'Motorised' : 'Manual only'}
          description={
            config.motorised
              ? 'Automated opening — no leaf handle. Motor kit confirmed at survey.'
              : 'Manual operation — leaf handle included on the preview.'
          }
          id="quick-motorised"
        />
      </div>

      <Dialog.Root open={typeSheetOpen} onOpenChange={setTypeSheetOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="cfg-sheet-overlay fixed inset-0 z-50 bg-steel/60 backdrop-blur-sm" />
          <Dialog.Content
            className="cfg-sheet-content cfg-sheet-draggable fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col border-t border-steel/10 bg-canvas focus:outline-none"
            style={{ overscrollBehavior: 'contain', paddingBottom: 'env(safe-area-inset-bottom)', ...typeSheetSwipe.contentStyle }}
          >
            <div className="relative flex items-center justify-between gap-3 border-b border-steel/10 px-4 py-3">
              <span
                aria-hidden
                className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-steel/20"
              />
              <div className="flex-1 py-2" {...typeSheetSwipe.handleProps}>
                <Dialog.Title className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                  Choose gate type
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-steel/15 text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Close gate type chooser"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto p-4" style={{ overscrollBehavior: 'contain' }}>
              <GateTypeCardGrid />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
