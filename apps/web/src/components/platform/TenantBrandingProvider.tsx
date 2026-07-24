'use client'

import { createContext, useContext, useMemo } from 'react'
import type { TenantBundle } from '@steelyes/gate-engine'

const TenantContext = createContext<TenantBundle | null>(null)

export function TenantBrandingProvider({
  tenant,
  children,
}: {
  tenant: TenantBundle
  children: React.ReactNode
}) {
  const style = useMemo(
    () =>
      ({
        '--tenant-primary': tenant.branding.primaryColor,
        '--tenant-accent': tenant.branding.accentColor,
      }) as React.CSSProperties,
    [tenant.branding.accentColor, tenant.branding.primaryColor],
  )

  return (
    <TenantContext.Provider value={tenant}>
      <div style={style} data-tenant-id={tenant.id}>
        {children}
      </div>
    </TenantContext.Provider>
  )
}

export function useTenantBundle(): TenantBundle | null {
  return useContext(TenantContext)
}
