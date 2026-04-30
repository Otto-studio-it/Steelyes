import { MarketingShell } from '@/components/marketing/MarketingShell'

export default function CookiePolicyPage() {
  return (
    <MarketingShell pathname="/legal/cookie-policy">
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
        <h1 className="font-heading text-5xl font-black uppercase">Cookie policy</h1>
        <p className="mt-6 text-base font-light leading-relaxed text-[#5C403D]">
          Placeholder legal content. Cookie and consent details are added in the compliance milestone.
        </p>
      </section>
    </MarketingShell>
  )
}
