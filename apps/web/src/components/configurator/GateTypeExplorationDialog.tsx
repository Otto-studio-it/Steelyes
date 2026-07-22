'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { gateTypeLabel } from '@/lib/configurator/labels'
import type { GateType } from '@steelyes/gate-engine'

type GateTypeExplorationDialogProps = {
  gateType: GateType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function GateTypeExplorationDialog({
  gateType,
  open,
  onOpenChange,
  onConfirm,
}: GateTypeExplorationDialogProps) {
  if (!gateType) {
    return null
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-steel/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 border border-steel/10 bg-white p-6 shadow-none focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-heading text-lg font-black uppercase tracking-tight text-steel">
                Exploration mode
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-muted-deep">
                <strong className="font-semibold text-steel">{gateTypeLabel(gateType)}</strong> is outside the
                primary Double Swing path. You can explore it with a schematic preview — visual fidelity and
                pricing may be incomplete until survey.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-steel/12 text-steel transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <p className="mt-4 border-l-4 border-primary/40 bg-paper px-4 py-3 text-sm leading-6 text-muted-deep">
            Your current choices will be reset to the default preset for this gate type.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex min-h-[48px] items-center justify-center border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              className="inline-flex min-h-[48px] items-center justify-center bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Continue in exploration
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
