'use client'

import { getCantileverSiteSpace } from '@steelyes/gate-engine'

type CantileverSiteSpaceNoteProps = {
  clearOpeningMm: number
}

/** Live site-space warning for cantilever — CA-05 / CL-705. */
export function CantileverSiteSpaceNote({ clearOpeningMm }: CantileverSiteSpaceNoteProps) {
  const { clearOpeningMm: opening, tailMm, totalRunMm } = getCantileverSiteSpace(clearOpeningMm)

  return (
    <aside
      className="border-l-4 border-primary bg-paper px-4 py-3"
      aria-live="polite"
      data-testid="cantilever-site-space"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Site space required</p>
      <p className="mt-1 font-heading text-sm font-bold uppercase tracking-tight text-steel">
        {totalRunMm} mm clear run minimum
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-deep">
        Opening {opening} mm needs a counterbalance tail of at least {tailMm} mm (1/3). Allow {totalRunMm} mm
        of clear run on the parking side, plus posts and hardware. Confirm on survey.
      </p>
    </aside>
  )
}
