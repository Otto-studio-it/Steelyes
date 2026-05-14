import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Construction } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'

export const metadata: Metadata = {
  title: 'Gate configurator — coming soon',
  description:
    'The Steelyes gate configurator is in development. Request a quote or return to the homepage for an overview of our steel fabrication services.',
}

export default function ConfiguratorPage() {
  return (
    <MarketingShell pathname="/configurator">
      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-[#FBF9F6] px-4 py-16 md:py-24">
        <div className="w-full max-w-lg text-center">
          <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full bg-[#9E000C]/15 animate-ping motion-reduce:animate-none"
              aria-hidden
            />
            <span
              className="absolute inset-2 rounded-full border border-[#9E000C]/25 motion-reduce:hidden"
              aria-hidden
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm">
              <Construction
                className="h-8 w-8 text-[#9E000C] motion-safe:animate-pulse"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          </div>

          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#9E000C]">Work in progress</p>
          <h1 className="mt-3 font-heading text-3xl font-black uppercase leading-tight tracking-tight text-[#1B1C1A] sm:text-4xl">
            Configure your gate
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[#5C403D] md:text-lg">
            We&apos;re putting the finishing touches on an online tool so you can outline style, dimensions, and finishes
            before we follow up with a survey-led quote.{' '}
            <strong className="font-semibold text-[#1B1C1A]">This feature isn&apos;t live yet</strong> — it will appear
            here soon.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#5C403D]/85">
            In the meantime, use <Link href="/contact" className="text-[#9E000C] underline underline-offset-2 hover:text-[#C41E1E]">Request a quote</Link> and we&apos;ll respond with next steps.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 border-2 border-[#1B1C1A] bg-[#1B1C1A] px-8 py-3 font-heading text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9E000C] hover:border-[#9E000C]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
