'use client'

import type { GateType } from '@steelyes/gate-engine'

type DimensionMeaningNoteProps = {
  gateType: GateType
}

/**
 * CA-08: width = clear opening between posts; height = ground → top rail.
 * Cantilever tail remains extra (CA-05).
 */
export function DimensionMeaningNote({ gateType }: DimensionMeaningNoteProps) {
  const isCantilever = gateType === 'cantilever_sliding'

  return (
    <aside
      className="border-l-4 border-primary bg-paper px-4 py-3"
      data-testid={isCantilever ? 'dimension-meaning-cantilever' : 'dimension-meaning-confirmed'}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Width / height meaning</p>
      <p className="mt-1 text-sm leading-6 text-muted-deep">
        Width is the <strong className="font-semibold text-steel">clear opening between post inner faces</strong>{' '}
        — posts are not included in the millimetres you type (example: 3000 mm double swing → leaves ≈ 1500 mm
        each). Height is <strong className="font-semibold text-steel">ground to top rail</strong>; railheads sit
        above and do not count.
        {isCantilever ? (
          <>
            {' '}
            Cantilever counterbalance tail is <strong className="font-semibold text-steel">extra</strong> — see
            the site-space note below.
          </>
        ) : null}
      </p>
    </aside>
  )
}
