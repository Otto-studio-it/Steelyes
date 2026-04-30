'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'

type SiteHeaderProps = {
  pathname: string
}

type NavItem = {
  label: string
  href?: string
  children?: { label: string; href: string }[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Our Gates', href: '/gates' },
  { label: 'Case Studies', href: '/gallery' },
  { label: 'The Process', href: '/installation' },
  {
    label: 'Bespoke Forge',
    children: [
      { label: 'About', href: '/about' },
      { label: 'Configurator', href: '/configurator' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

function isActive(pathname: string, href?: string) {
  if (!href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader({ pathname }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<Record<string, boolean>>({
    'Bespoke Forge': false,
  })

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:rounded focus:bg-[#1A1A1A] focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-heading text-xl font-black uppercase tracking-tight">
          Steelyes Ltd
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href ?? '#'}
                  className={cn(
                    'font-heading text-sm font-bold uppercase tracking-tight text-zinc-600 transition-colors duration-100 hover:text-[#9E000C]',
                    isActive(pathname, item.href) && 'border-b-2 border-[#9E000C] pb-1 text-[#9E000C]',
                  )}
                >
                  {item.label}
                </Link>
              )
            }

            const anyActive = item.children.some((child) => isActive(pathname, child.href))
            return (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-1 font-heading text-sm font-bold uppercase tracking-tight text-zinc-600 transition-colors duration-100 hover:text-[#9E000C]',
                    anyActive && 'border-b-2 border-[#9E000C] pb-1 text-[#9E000C]',
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
                <ul className="invisible absolute right-0 top-full mt-3 min-w-[220px] rounded border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={cn(
                          'block rounded px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100',
                          isActive(pathname, child.href) && 'bg-zinc-100 text-[#9E000C]',
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center justify-center bg-[#9E000C] px-5 py-2 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors duration-100 hover:bg-[#9B1515]"
          >
            Request Quote
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-zinc-300 md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {isOpen ? (
        <nav aria-label="Mobile primary navigation" className="border-t border-zinc-200 bg-white md:hidden">
          <ul className="px-4 py-3">
            {NAV_ITEMS.map((item) => {
              if (!item.children) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href ?? '#'}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-[48px] items-center border-b border-zinc-100 font-heading text-sm font-bold uppercase tracking-tight text-zinc-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              }

              const open = Boolean(openSubmenu[item.label])
              return (
                <li key={item.label} className="border-b border-zinc-100 py-1">
                  <button
                    type="button"
                    onClick={() => setOpenSubmenu((prev) => ({ ...prev, [item.label]: !prev[item.label] }))}
                    aria-expanded={open}
                    className="flex min-h-[48px] w-full items-center justify-between font-heading text-sm font-bold uppercase tracking-tight text-zinc-700"
                  >
                    {item.label}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
                  </button>
                  {open ? (
                    <ul className="space-y-1 pb-2 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className="flex min-h-[44px] items-center rounded px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
          <div className="px-4 pb-4">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-[44px] w-full items-center justify-center bg-[#9E000C] px-5 py-2 font-heading text-sm font-bold uppercase tracking-tight text-white"
            >
              Request Quote
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
