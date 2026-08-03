'use client'

/** Honest copy when decorative counts are schematic only. */
export function ProvisionalCountNotice() {
  return (
    <div
      className="border border-dashed border-steel/20 bg-paper px-3 py-2.5"
      data-testid="provisional-count-notice"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Schematic counts</p>
      <p className="mt-1 text-xs leading-5 text-muted-deep">
        These quantities are layout guides for the preview only — not workshop maximums. Exact counts are
        confirmed at the site survey.
      </p>
    </div>
  )
}
