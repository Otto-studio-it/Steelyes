import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/marketing/SiteFooter'
import { SiteHeader } from '@/components/marketing/SiteHeader'

type MarketingShellProps = {
  pathname: string
  children: ReactNode
}

export function MarketingShell({ pathname, children }: MarketingShellProps) {
  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#1B1C1A]">
      <SiteHeader pathname={pathname} />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  )
}
