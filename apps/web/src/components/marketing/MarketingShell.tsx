import type { ReactNode } from 'react'

import { MarketingFloatingChrome } from '@/components/marketing/MarketingFloatingChrome'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { SiteHeader } from '@/components/marketing/SiteHeader'

type MarketingShellProps = {
  pathname: string
  children: ReactNode
}

export function MarketingShell({ pathname, children }: MarketingShellProps) {
  return (
    <div className="min-h-dvh bg-[#FBF9F6] text-[#1B1C1A]">
      <SiteHeader pathname={pathname} />
      <main id="main-content" className="pb-20 lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <MarketingFloatingChrome enableQuoteBar={!pathname.startsWith('/configurator')} />
    </div>
  )
}
