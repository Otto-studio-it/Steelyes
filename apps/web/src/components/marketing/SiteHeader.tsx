'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'

type SiteHeaderProps = {
  pathname: string
}

type NavLink = {
  label: string
  href: string
}

type NavGroup = {
  label: string
  href: string
  links: NavLink[]
}

const GATE_LINKS: NavLink[] = [
  { label: 'All Gates', href: '/gates' },
  { label: 'Double Swing', href: '/gates/double-swing' },
  { label: 'Single Swing', href: '/gates/single-swing' },
  { label: 'Tracked Sliding', href: '/gates/tracked-sliding' },
  { label: 'Cantilever', href: '/gates/cantilever' },
  { label: 'Bifold', href: '/gates/bifold' },
  { label: 'Single Bifold', href: '/gates/single-bifold' },
  { label: 'Telescopic', href: '/gates/telescopic' },
  { label: 'Radius', href: '/gates/radius' },
]

const SERVICE_LINKS: NavLink[] = [
  { label: 'Services Overview', href: '/services' },
  { label: 'Glass Balustrades & Terraces', href: '/services/railings' },
  { label: 'Metal & Glass Balconies', href: '/services/balconies' },
  { label: 'Steel Structures', href: '/services/structures' },
  { label: 'Platforms & Staircases', href: '/services/staircases' },
  { label: 'Security Grills', href: '/services/security' },
]

const NAV_GROUPS: NavGroup[] = [
  { label: 'Gates', href: '/gates', links: GATE_LINKS },
  { label: 'Services', href: '/services', links: SERVICE_LINKS },
]

const PRIMARY_LINKS: NavLink[] = [
  { label: 'Installation', href: '/installation' },
  { label: 'Workshop gallery', href: '/gallery' },
  { label: 'Configurator', href: '/configurator' },
  { label: 'About', href: '/about' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function groupIsActive(pathname: string, group: NavGroup) {
  return isActive(pathname, group.href) || group.links.some((link) => isActive(pathname, link.href))
}

export function SiteHeader({ pathname }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 md:px-8">
        <Link
          href="/"
          className="inline-flex min-h-[44px] shrink-0 items-center font-heading text-lg font-black uppercase tracking-tight sm:text-xl"
        >
          Steelyes Ltd
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
          {NAV_GROUPS.map((group) => {
            const active = groupIsActive(pathname, group)

            return (
              <div
                key={group.label}
                className="group relative"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
                onFocus={() => setOpenGroup(group.label)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setOpenGroup(null)
                }}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openGroup === group.label}
                  aria-controls={`desktop-${group.label.toLowerCase()}-menu`}
                  onClick={() => setOpenGroup((current) => (current === group.label ? null : group.label))}
                  className={cn(
                    'inline-flex min-h-[44px] items-center gap-1 font-heading text-sm font-bold uppercase tracking-tight text-zinc-600 transition-colors duration-100 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
                    active && 'text-primary',
                  )}
                >
                  {group.label}
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform', openGroup === group.label && 'rotate-180')}
                    aria-hidden
                  />
                </button>
                <div
                  id={`desktop-${group.label.toLowerCase()}-menu`}
                  className={cn(
                    'absolute left-0 top-full min-w-[260px] pt-3 transition-all',
                    openGroup === group.label ? 'visible opacity-100' : 'invisible opacity-0',
                  )}
                >
                  <ul className="border border-zinc-200 bg-white p-2 shadow-lg">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'flex min-h-[42px] items-center px-3 font-heading text-xs font-bold uppercase tracking-tight text-zinc-700 transition-colors hover:bg-canvas hover:text-primary focus-visible:bg-canvas focus-visible:outline-none',
                            isActive(pathname, link.href) && 'bg-canvas text-primary',
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}

          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-configurator-placement={link.href === '/configurator' ? 'desktop-primary-nav' : undefined}
              className={cn(
                'inline-flex min-h-[44px] items-center font-heading text-sm font-bold uppercase tracking-tight text-zinc-600 transition-colors duration-100 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
                isActive(pathname, link.href) && 'text-primary',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center justify-center bg-primary px-5 py-2 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors duration-100 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Request a quote
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-zinc-300 text-steel transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile primary navigation"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-zinc-200 bg-white lg:hidden"
        >
          <div className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-2">
            <Link
              href="/contact"
              onClick={closeMenu}
              className="inline-flex min-h-[52px] w-full items-center justify-center bg-primary px-5 py-3 font-heading text-sm font-bold uppercase tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Request a quote
            </Link>
            <Link
              href="/configurator"
              onClick={closeMenu}
              data-configurator-placement="mobile-menu-quick-action"
              className="inline-flex min-h-[52px] w-full items-center justify-center border border-zinc-300 px-5 py-3 font-heading text-sm font-bold uppercase tracking-tight text-steel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Configure a gate
            </Link>
          </div>

          <ul className="border-t border-zinc-200 px-4 pb-4">
            {NAV_GROUPS.map((group) => {
              const open = Boolean(openSections[group.label])
              const active = groupIsActive(pathname, group)

              return (
                <li key={group.label} className="border-b border-zinc-100 py-1">
                  <button
                    type="button"
                    onClick={() => setOpenSections((prev) => ({ ...prev, [group.label]: !prev[group.label] }))}
                    aria-expanded={open}
                    className={cn(
                      'flex min-h-[54px] w-full items-center justify-between font-heading text-sm font-bold uppercase tracking-tight text-zinc-700',
                      active && 'text-primary',
                    )}
                  >
                    {group.label}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
                  </button>
                  {open ? (
                    <ul className="space-y-1 pb-3">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={closeMenu}
                            className={cn(
                              'flex min-h-[46px] items-center border-l-2 border-zinc-200 px-4 font-heading text-xs font-bold uppercase tracking-tight text-zinc-700 hover:border-primary hover:bg-canvas',
                              isActive(pathname, link.href) && 'border-primary bg-canvas text-primary',
                            )}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}

            {PRIMARY_LINKS.filter((link) => link.href !== '/configurator').map((link) => (
              <li key={link.href} className="border-b border-zinc-100">
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    'flex min-h-[54px] items-center font-heading text-sm font-bold uppercase tracking-tight text-zinc-700',
                    isActive(pathname, link.href) && 'text-primary',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
