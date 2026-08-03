import { LEGAL_DRAFT_NOTICE } from '@/lib/marketing/business'

export function LegalDraftNotice() {
  return (
    <div
      role="note"
      className="mb-8 border border-amber-200 bg-amber-50 px-4 py-3 font-mono text-xs uppercase tracking-wide text-amber-900"
    >
      {LEGAL_DRAFT_NOTICE}
    </div>
  )
}
