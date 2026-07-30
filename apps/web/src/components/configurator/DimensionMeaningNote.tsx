'use client'

import type { GateType } from '@steelyes/gate-engine'

type DimensionMeaningNoteProps = {
  gateType: GateType
}

/**
 * Honest width/height meaning until Marius closes open.width_meaning / open.height_meaning.
 * Cantilever clear-opening meaning is confirmed (CA-05).
 */
export function DimensionMeaningNote({ gateType }: DimensionMeaningNoteProps) {
  if (gateType === 'cantilever_sliding') {
    return (
      <aside
        className="border-l-4 border-primary bg-paper px-4 py-3"
        data-testid="dimension-meaning-cantilever"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Width meaning</p>
        <p className="mt-1 text-sm leading-6 text-muted-deep">
          Width is the <strong className="font-semibold text-steel">clear opening between posts</strong>. The
          counterbalance tail is extra — see the site-space note below.
        </p>
      </aside>
    )
  }

  return (
    <aside
      className="border-l-4 border-steel/30 bg-paper px-4 py-3"
      data-testid="dimension-meaning-provisional"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Width / height meaning</p>
      <p className="mt-1 text-sm leading-6 text-muted-deep">
        We treat width as the <strong className="font-semibold text-steel">clear opening</strong> between post
        inner faces, and height as ground to top of gate. Exact workshop datum is confirmed at the site survey.
      </p>
    </aside>
  )
}
