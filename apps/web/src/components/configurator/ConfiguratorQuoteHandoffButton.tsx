'use client'

import { LoaderCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { buildContactHandoffPath } from '@/lib/configurator/share-token'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { useConfiguratorStore } from '@/store/configuratorStore'

type ConfiguratorQuoteHandoffButtonProps = {
  className?: string
  children?: React.ReactNode
}

/** ponytail: one click — save then navigate (no Save → then Link two-step). */
export function ConfiguratorQuoteHandoffButton({
  className = '',
  children = 'Request a quote',
}: ConfiguratorQuoteHandoffButtonProps) {
  const router = useRouter()
  const ensureSavedConfiguration = useConfiguratorStore((state) => state.ensureSavedConfiguration)
  const saveState = useConfiguratorStore((state) => state.saveState)
  const [error, setError] = useState<string | null>(null)

  async function handleHandoff() {
    setError(null)
    const result = await ensureSavedConfiguration()
    if (!result?.shareToken) {
      setError('Could not save configuration. Try again.')
      return
    }
    captureConfiguratorEvent('quote handoff prepared', { share_token: result.shareToken })
    router.push(buildContactHandoffPath(result.shareToken))
  }

  const busy = saveState === 'saving'

  return (
    <span className="inline-flex flex-col items-stretch gap-1 sm:items-end">
      <button
        type="button"
        onClick={handleHandoff}
        disabled={busy}
        className={className}
        aria-busy={busy}
      >
        {busy ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          <>
            {children}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>
      {error ? (
        <p role="alert" className="text-xs text-primary">
          {error}
        </p>
      ) : null}
    </span>
  )
}
