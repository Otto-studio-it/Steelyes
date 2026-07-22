import Link from 'next/link'

import { SocialLinks } from '@/components/marketing/SocialLinks'
import {
  BUSINESS,
  formatCompanyRegistration,
  formatVatRegistration,
} from '@/lib/marketing/business'

const GATE_LINKS = [
  { label: 'All Gates', href: '/gates' },
  { label: 'Sliding Gates', href: '/gates/sliding' },
  { label: 'Cantilever Gates', href: '/gates/cantilever' },
  { label: 'Bifold Gates', href: '/gates/bifold' },
  { label: 'Pedestrian Gates', href: '/gates/pedestrian' },
  { label: 'Telescopic Gates', href: '/gates/telescopic' },
  { label: 'Architectural Gates', href: '/gates/architectural' },
] as const

const SERVICE_LINKS = [
  { label: 'Services Overview', href: '/services' },
  { label: 'Railings', href: '/services/railings' },
  { label: 'Balconies', href: '/services/balconies' },
  { label: 'Security', href: '/services/security' },
  { label: 'Installation Process', href: '/installation' },
] as const

const START_LINKS = [
  { label: 'Request a quote', href: '/contact', primary: true },
  { label: 'Configure a gate', href: '/configurator', primary: false },
  { label: 'About', href: '/about', primary: false },
] as const

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/legal/privacy-policy' },
  { label: 'Cookie Policy', href: '/legal/cookie-policy' },
  { label: 'Terms', href: '/legal/terms' },
] as const

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex min-h-[44px] items-center transition-colors hover:text-white">
      {label}
    </Link>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-[#1B1C1A] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 text-left md:grid-cols-2 md:px-8 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <section>
          <h2 className="mb-5 font-heading text-3xl font-black uppercase">Steelyes Ltd</h2>
          <p className="max-w-sm text-sm font-light leading-relaxed text-zinc-400">
            Bespoke steel gates and fabrication, specified around each entrance, site condition, and survey-led quote path.
          </p>
          <address className="mt-5 not-italic text-sm leading-relaxed text-zinc-400">
            <p>{BUSINESS.address.line1}</p>
            <p>
              {BUSINESS.address.locality}, {BUSINESS.address.region} {BUSINESS.address.postalCode}
            </p>
            <p className="mt-2">
              <a href={`tel:${BUSINESS.phone}`} className="transition-colors hover:text-white">
                {BUSINESS.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${BUSINESS.email}`} className="transition-colors hover:text-white">
                {BUSINESS.email}
              </a>
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
              {formatCompanyRegistration()} · {formatVatRegistration()}
            </p>
          </address>
          <SocialLinks className="mt-5" />
        </section>

        <section>
          <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-[#C41E1E]">Gates</h3>
          <ul className="space-y-1 text-sm text-zinc-400">
            {GATE_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-[#C41E1E]">Services</h3>
          <ul className="space-y-1 text-sm text-zinc-400">
            {SERVICE_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-[#C41E1E]">Start</h3>
          <p className="mb-5 text-sm font-light leading-relaxed text-zinc-400">
            Share photos, measurements, or a rough brief to begin a measured specification.
          </p>
          <ul className="space-y-2 text-sm text-zinc-400">
            {START_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    link.primary
                      ? 'inline-flex min-h-[44px] w-full items-center justify-center bg-[#9E000C] px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9B1515]'
                      : 'inline-flex min-h-[44px] items-center transition-colors hover:text-white'
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-zinc-800 px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            (c) 2026 {BUSINESS.legalName}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <nav aria-label="Footer legal navigation">
              <ul className="flex flex-col gap-2 text-sm text-zinc-400 sm:flex-row sm:gap-5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex min-h-[44px] items-center transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <SocialLinks iconClassName="hover:text-white" />
          </div>
        </div>
      </div>
    </footer>
  )
}
