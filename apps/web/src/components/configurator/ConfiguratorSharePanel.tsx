'use client'

import { Check, Copy, Link2, LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import { buildQuoteSharePath } from '@/lib/configurator/share-token'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { useConfiguratorStore } from '@/store/configuratorStore'

export function ConfiguratorSharePanel() {
  const ensureSavedConfiguration = useConfiguratorStore((state) => state.ensureSavedConfiguration)
  const saveState = useConfiguratorStore((state) => state.saveState)
  const shareToken = useConfiguratorStore((state) => state.shareToken)
  const saveError = useConfiguratorStore((state) => state.saveError)
  const [copied, setCopied] = useState(false)

  async function handleCopyLink() {
    const result = await ensureSavedConfiguration()
    if (!result?.shareToken) {
      return
    }

    const url = `${window.location.origin}${buildQuoteSharePath(result.shareToken)}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      captureConfiguratorEvent('share link copied', { share_token: result.shareToken })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard may be unavailable on some mobile browsers.
    }
  }

  const activeToken = shareToken

  return (
    <div className="rounded-2xl border border-steel/10 bg-white px-4 py-4">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
        <Link2 className="h-3.5 w-3.5" aria-hidden />
        Share configuration
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-deep">
        Save a read-only link you can reopen or send to the workshop before requesting a quote.
      </p>

      {activeToken ? (
        <p className="mt-3 break-all font-mono text-xs text-steel">
          {buildQuoteSharePath(activeToken)}
        </p>
      ) : null}

      {saveError ? (
        <p className="mt-3 text-sm text-primary" role="alert">
          {saveError}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleCopyLink}
        disabled={saveState === 'saving'}
        className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-steel/12 bg-paper px-4 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary disabled:opacity-60"
      >
        {saveState === 'saving' ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : copied ? (
          <>
            <Check className="h-4 w-4" aria-hidden />
            Link copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" aria-hidden />
            Copy share link
          </>
        )}
      </button>
    </div>
  )
}
