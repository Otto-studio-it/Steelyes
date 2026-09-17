'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ConfiguratorLoadingScreen } from '@/components/configurator/ConfiguratorLoadingScreen'

function isConfiguratorHref(href: string | null): boolean {
  if (!href) return false
  try {
    const url = new URL(href, window.location.origin)
    return url.origin === window.location.origin && url.pathname === '/configurator'
  } catch {
    return false
  }
}

export function ConfiguratorOpeningOverlay() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (pathname === '/configurator') setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const timeout = window.setTimeout(() => setOpen(false), 15_000)
    return () => window.clearTimeout(timeout)
  }, [open])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a')
      if (!link) return
      if (link.target && link.target !== '_self') return
      if (!isConfiguratorHref(link.getAttribute('href'))) return
      if (window.location.pathname === '/configurator') return

      setOpen(true)
    }

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setOpen(false)
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  if (!open) return null

  return <ConfiguratorLoadingScreen overlay label="Opening the configurator" />
}
