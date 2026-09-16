import Link from 'next/link'

import { SocialLinks } from '@/components/marketing/SocialLinks'
import {
  BUSINESS,
  formatCompanyRegistration,
  formatVatRegistration,
} from '@/lib/marketing/business'

const GATE_LINKS = [
  { label: 'All Gates', href: '/gates' },
  { label: 'Double Swing', href: '/gates/double-swing' },
  { label: 'Single Swing', href: '/gates/single-swing' },
  { label: 'Tracked Sliding', href: '/gates/tracked-sliding' },
  { label: 'Cantilever', href: '/gates/cantilever' },
  { label: 'Bifold', href: '/gates/bifold' },
  { label: 'Telescopic', href: '/gates/telescopic' },
  { label: 'Radius', href: '/gates/radius' },
] as const

const SERVICE_LINKS = [
  { label: 'Services Overview', href: '/services' },
  { label: 'Glass Balustrades & Terraces', href: '/services/railings' },
  { label: 'Metal & Glass Balconies', href: '/services/balconies' },
  { label: 'Steel Structures', href: '/services/structures' },
  { label: 'Platforms & Staircases', href: '/services/staircases' },
  { label: 'Security Grills', href: '/services/security' },
] as const

const AREA_LINKS = [
  { label: 'All Areas', href: '/areas' },
  { label: 'South London', href: '/areas/south-london' },
  { label: 'Sydenham', href: '/areas/sydenham' },
  { label: 'Lewisham', href: '/areas/lewisham' },
  { label: 'Bromley', href: '/areas/bromley' },
  { label: 'Surrey', href: '/areas/surrey' },
  { label: 'Kent', href: '/areas/kent' },
] as const

const START_LINKS = [
  { label: 'Request a quote', href: '/contact', tone: 'primary' },
  { label: 'Open gate configurator', href: '/configurator', tone: 'secondary' },
] as const

const RESOURCE_LINKS = [
  { label: 'Customer Reviews', href: '/reviews' },
  { label: 'Case Studies', href: '/case-study' },
  { label: 'Blog & Guides', href: '/blog' },
  { label: 'Gate Costs Guide', href: '/blog/steel-gate-costs-london-2026' },
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
    <footer className="bg-steel text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 text-left md:grid-cols-2 md:px-8 lg:grid-cols-6">
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
          <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-primary-container">Gates</h3>
          <ul className="space-y-1 text-sm text-zinc-400">
            {GATE_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-primary-container">Services</h3>
          <ul className="space-y-1 text-sm text-zinc-400">
            {SERVICE_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-primary-container">Areas</h3>
          <ul className="space-y-1 text-sm text-zinc-400">
            {AREA_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-primary-container">Resources</h3>
          <ul className="space-y-1 text-sm text-zinc-400">
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-primary-container">Start</h3>
          <p className="mb-5 text-sm font-light leading-relaxed text-zinc-400">
            Design a gate online, or share photos and measurements for a direct, survey-led specification.
          </p>
          <ul className="space-y-2 text-sm text-zinc-400">
            {START_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-configurator-placement={link.href === '/configurator' ? 'footer' : undefined}
                  className={link.tone === 'primary'
                    ? 'inline-flex min-h-[44px] w-full items-center justify-center bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                    : 'inline-flex min-h-[44px] w-full items-center justify-center border border-white/35 px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'}
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
        </div>
      </div>
    </footer>
  )
}
