import { MarketingShell } from '@/components/marketing/MarketingShell'

export default function TermsPage() {
  return (
    <MarketingShell pathname="/legal/terms">
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <h1 className="font-heading text-4xl font-black uppercase sm:text-5xl">Terms</h1>
        <p className="mt-6 text-base font-light leading-relaxed text-[#5C403D]">
          Placeholder legal content. Final terms text will be added once client legal data is finalized.
        </p>
      </section>
    </MarketingShell>
  )
}
