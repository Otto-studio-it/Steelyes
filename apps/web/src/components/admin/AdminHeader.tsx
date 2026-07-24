'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { logoutAdmin } from '@/app/admin/auth-actions'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Prezzi Cancelli', href: '/admin/gates' },
  { label: 'Addon', href: '/admin/gate-options' },
  { label: 'Recinzioni', href: '/admin/fencing' },
  { label: 'Preventivi', href: '/admin/quotes' },
  { label: 'Dati Cliente', href: '/admin/client-data' },
]

export function AdminHeader() {
  const pathname = usePathname()
  const onDashboard = pathname === '/admin/dashboard'

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-4 md:px-8">
        {/* Left: back link on sub-pages, logo on dashboard */}
        {onDashboard ? (
          <span className="font-heading text-base font-black uppercase tracking-tight text-[#1b1c1a]">
            Steelyes <span className="text-[#9e000c]">Admin</span>
          </span>
        ) : (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#1b1c1a]"
          >
            <span aria-hidden>←</span> Dashboard
          </Link>
        )}

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'font-heading text-sm font-bold uppercase tracking-tight text-zinc-600 transition-colors hover:text-[#9e000c]',
                pathname.startsWith(item.href) && 'border-b-2 border-[#9e000c] pb-0.5 text-[#9e000c]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAdmin}>
          <button
            type="submit"
            aria-label="Esci dall'admin"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 font-mono text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#ba1a1a]"
          >
            <LogOut size={14} strokeWidth={2} />
            <span className="hidden sm:inline">Esci</span>
          </button>
        </form>
      </div>

      {/* Mobile nav — sempre visibile, include Dashboard come ancora */}
      <nav className="flex gap-1 overflow-x-auto border-t border-zinc-100 px-4 pb-2 pt-1 md:hidden">
        <Link
          href="/admin/dashboard"
          className={cn(
            'shrink-0 rounded px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-tight',
            onDashboard ? 'bg-[#9e000c] text-white' : 'bg-zinc-100 text-zinc-700'
          )}
        >
          Home
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'shrink-0 rounded px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-tight text-zinc-600',
              pathname.startsWith(item.href)
                ? 'bg-[#9e000c] text-white'
                : 'bg-zinc-100 text-zinc-700'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
