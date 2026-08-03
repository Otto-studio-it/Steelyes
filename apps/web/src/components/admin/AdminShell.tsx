'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { logoutAdmin } from '@/app/admin/auth-actions'
import { cn } from '@/lib/utils'

type NavItem = { label: string; href: string }
type NavGroup = { label: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Panoramica',
    items: [{ label: 'Dashboard', href: '/admin/dashboard' }],
  },
  {
    label: 'Listino',
    items: [
      { label: 'Listino Master', href: '/admin/listino' },
      { label: 'Prezzi Cancelli', href: '/admin/gates' },
      { label: 'Addon', href: '/admin/gate-options' },
      { label: 'Recinzioni', href: '/admin/fencing' },
    ],
  },
  {
    label: 'Clienti',
    items: [
      { label: 'Dati Cliente', href: '/admin/client-data' },
      { label: 'Preventivi', href: '/admin/quotes' },
      { label: 'Posta in arrivo', href: '/admin/inbox' },
    ],
  },
]

const FLAT_NAV: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)

/**
 * CRM shell: fixed sidebar on desktop, sticky chip bar on mobile.
 * Renders children untouched on /admin/login (no chrome before auth).
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login' || pathname === '/admin') {
    return <>{children}</>
  }

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-[#fbf9f6] lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
        <div className="sticky top-0 flex h-screen flex-col">
          <Link href="/admin/dashboard" className="border-b border-zinc-100 px-5 py-5">
            <span className="font-heading text-base font-black uppercase tracking-tight text-[#1b1c1a]">
              Steelyes <span className="text-[#9e000c]">Admin</span>
            </span>
          </Link>

          <nav className="flex-1 overflow-y-auto py-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-5 px-3">
                <p className="px-2 pb-1.5 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block border-l-2 px-3 py-2 font-heading text-sm font-bold uppercase tracking-tight transition-colors',
                      isActive(item.href)
                        ? 'border-[#9e000c] bg-[#f5f3f0] text-[#9e000c]'
                        : 'border-transparent text-zinc-600 hover:bg-[#f5f3f0] hover:text-[#1b1c1a]',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <form action={logoutAdmin} className="border-t border-zinc-100">
            <button
              type="submit"
              className="flex min-h-[48px] w-full items-center gap-2 px-5 font-mono text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#ba1a1a]"
            >
              <LogOut size={14} strokeWidth={2} /> Esci
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md lg:hidden">
          <div className="flex h-12 items-center justify-between px-4">
            <Link
              href="/admin/dashboard"
              className="font-heading text-sm font-black uppercase tracking-tight text-[#1b1c1a]"
            >
              Steelyes <span className="text-[#9e000c]">Admin</span>
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                aria-label="Esci dall'admin"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-zinc-500"
              >
                <LogOut size={14} strokeWidth={2} />
              </button>
            </form>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-2">
            {FLAT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 rounded px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-tight',
                  isActive(item.href) ? 'bg-[#9e000c] text-white' : 'bg-zinc-100 text-zinc-700',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
