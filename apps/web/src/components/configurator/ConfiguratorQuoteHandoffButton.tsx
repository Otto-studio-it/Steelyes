'use client'

import Link from 'next/link'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import { buildContactHandoffPath } from '@/lib/configurator/share-token'
import { useConfiguratorStore } from '@/store/configuratorStore'

type ConfiguratorQuoteHandoffButtonProps = {
  className?: string
  children?: React.ReactNode
}

export function ConfiguratorQuoteHandoffButton({
  className = '',
  children = 'Request survey-led quote',
}: ConfiguratorQuoteHandoffButtonProps) {
  const ensureSavedConfiguration = useConfiguratorStore((state) => state.ensureSavedConfiguration)
  const saveState = useConfiguratorStore((state) => state.saveState)
  const shareToken = useConfiguratorStore((state) => state.shareToken)
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  async function handlePrepare() {
    const result = await ensureSavedConfiguration()
    if (result?.shareToken) {
      setPendingHref(buildContactHandoffPath(result.shareToken))
    }
  }

  if (pendingHref || (saveState === 'saved' && shareToken)) {
    const href = pendingHref ?? buildContactHandoffPath(shareToken!)
    return (
      <Link
        href={href}
        className={className}
      >
        {children}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={handlePrepare}
      disabled={saveState === 'saving'}
      className={className}
    >
      {saveState === 'saving' ? (
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
  )
}
