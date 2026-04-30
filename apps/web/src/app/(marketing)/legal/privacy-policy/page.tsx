import { MarketingShell } from '@/components/marketing/MarketingShell'

export default function PrivacyPolicyPage() {
  return (
    <MarketingShell pathname="/legal/privacy-policy">
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
        <h1 className="font-heading text-5xl font-black uppercase">Privacy policy</h1>
        <p className="mt-6 text-base font-light leading-relaxed text-[#5C403D]">
          Placeholder legal content. Final text will be inserted from approved legal provider during compliance
          implementation.
        </p>
      </section>
    </MarketingShell>
  )
}
