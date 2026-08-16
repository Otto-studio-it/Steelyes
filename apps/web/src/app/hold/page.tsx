import type { Metadata } from 'next'

import { BUSINESS } from '@/lib/marketing/business'
import { getSiteHoldContactEmail } from '@/lib/site-hold'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Temporarily unavailable',
  description: `${BUSINESS.tradingName} is temporarily unavailable. Please check back shortly.`,
  robots: { index: false, follow: true },
}

export default function HoldPage() {
  const contact = getSiteHoldContactEmail()

  return (
    <main className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-steel text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 20% 0%, #9E000C 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, #795916 0%, transparent 50%)',
        }}
      />

      <header className="relative px-6 pt-10 md:px-12 md:pt-14">
        <p className="font-heading text-3xl font-black uppercase tracking-tight text-paper md:text-4xl">
          {BUSINESS.tradingName}
        </p>
      </header>

      <section className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16 md:px-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-foundry-gold">Operational pause</p>
        <h1 className="font-heading text-5xl font-black uppercase leading-[0.92] text-paper sm:text-6xl md:text-7xl">
          Temporarily
          <br />
          unavailable
        </h1>
        <p className="mt-6 max-w-md text-base font-light leading-relaxed text-paper/70 md:text-lg">
          This site is on a short operational pause. The platform is intact and will return once operations resume.
        </p>
        {contact ? (
          <p className="mt-10 text-sm text-paper/55">
            Site operations:{' '}
            <a
              href={`mailto:${contact}`}
              className="border-b border-foundry-gold/50 text-foundry-gold transition-colors hover:border-foundry-gold hover:text-paper"
            >
              {contact}
            </a>
          </p>
        ) : null}
      </section>

      <footer className="relative px-6 pb-10 md:px-12">
        <p className="font-mono text-[11px] uppercase tracking-widest text-paper/35">
          {BUSINESS.legalName} · United Kingdom
        </p>
      </footer>
    </main>
  )
}
