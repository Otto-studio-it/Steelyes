'use client'

import { TRACKED_RUNBACK_EXTRA_MM, type GateType } from '@steelyes/gate-engine'

type TrackedRunbackNoteProps = {
  gateType: GateType
  clearOpeningMm: number
}

/** Intake: tracked needs opening + 350 mm for rack/motor. */
export function TrackedRunbackNote({ gateType, clearOpeningMm }: TrackedRunbackNoteProps) {
  if (gateType !== 'tracked_sliding') {
    return null
  }

  const total = Math.max(0, clearOpeningMm) + TRACKED_RUNBACK_EXTRA_MM

  return (
    <aside className="border-l-4 border-primary/50 bg-paper px-4 py-3" data-testid="tracked-runback-note">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Site runback</p>
      <p className="mt-1 text-sm leading-6 text-muted-deep">
        Tracked sliding needs about{' '}
        <strong className="font-semibold text-steel">{TRACKED_RUNBACK_EXTRA_MM} mm</strong> beyond the clear
        opening for rack and motor — allow at least{' '}
        <strong className="font-semibold text-steel">{total.toLocaleString('en-GB')} mm</strong> total run.
      </p>
    </aside>
  )
}
