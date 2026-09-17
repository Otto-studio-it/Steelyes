import type { ReactNode } from 'react'

import { ConfiguratorOpeningOverlay } from '@/components/marketing/ConfiguratorOpeningOverlay'
import { MarketingFloatingChrome } from '@/components/marketing/MarketingFloatingChrome'
import { ScrollProgress } from '@/components/marketing/ScrollProgress'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { SiteHeader } from '@/components/marketing/SiteHeader'
import { SocialFollowStrip } from '@/components/marketing/SocialFollowStrip'

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
      <section
        aria-label="More project photos on social media"
        className="border-t border-zinc-200 bg-canvas"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
          <SocialFollowStrip body="This gallery is a selection — see more recent workshop and install photos on Instagram and TikTok." />
        </div>
      </section>
      <SiteFooter />
      <ConfiguratorOpeningOverlay />
      <MarketingFloatingChrome enableQuoteBar={!pathname.startsWith('/configurator')} />
    </div>
  )
}
