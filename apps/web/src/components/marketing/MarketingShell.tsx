import type { ReactNode } from 'react'

import { MarketingFloatingChrome } from '@/components/marketing/MarketingFloatingChrome'
import { ScrollProgress } from '@/components/marketing/ScrollProgress'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { SiteHeader } from '@/components/marketing/SiteHeader'

type MarketingShellProps = {
  pathname: string
  children: ReactNode
}

export function MarketingShell({ pathname, children }: MarketingShellProps) {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <ScrollProgress />
      <SiteHeader pathname={pathname} />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <MarketingFloatingChrome enableQuoteBar={!pathname.startsWith('/configurator')} />
    </div>
  )
}
