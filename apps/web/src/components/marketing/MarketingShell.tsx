import type { ReactNode } from 'react'

import { CookieBanner } from '@/components/marketing/CookieBanner'
import { MobileQuoteCTA } from '@/components/marketing/MobileQuoteCTA'
import { WhatsAppHelpBanner } from '@/components/marketing/WhatsAppHelpBanner'
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
      {!pathname.startsWith('/configurator') ? <MobileQuoteCTA /> : null}
      <WhatsAppHelpBanner />
      <CookieBanner />
    </div>
  )
}
