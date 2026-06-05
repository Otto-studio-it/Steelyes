import type { Metadata } from 'next'

import { LegalDraftNotice } from '@/components/marketing/LegalDraftNotice'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'

export const metadata: Metadata = {
  title: 'Privacy Policy | Steelyes',
  description: 'How Steelyes collects, uses and protects your personal data in accordance with UK GDPR.',
}

export default function PrivacyPolicyPage() {
  return (
    <MarketingShell pathname="/legal/privacy-policy">
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Legal</p>
        <h1 className="font-heading text-4xl font-black uppercase sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 font-mono text-xs text-zinc-500">Last updated: May 2026</p>
        <LegalDraftNotice />

        <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-[#3A3A3A] [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-[#1B1C1A] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">

          <h2>1. Who we are</h2>
          <p>
            Steelyes (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is the data controller for the personal data collected through this website.
            We are a steel fabrication and gate installation business operating across the United Kingdom.
          </p>
          <p>
            <strong>Contact:</strong><br />
            {BUSINESS.legalName}<br />
            {BUSINESS.address.line1}, {BUSINESS.address.locality}, {BUSINESS.address.region} {BUSINESS.address.postalCode}<br />
            Email: <a href={`mailto:${BUSINESS.email}`} className="text-[#9E000C] hover:underline">{BUSINESS.email}</a><br />
            Phone: {BUSINESS.phoneDisplay}
          </p>

          <h2>2. Data we collect and why</h2>
          <p>We collect personal data only when you actively provide it to us — specifically through our contact and enquiry form.</p>

          <h3>Enquiry form</h3>
          <p>When you submit an enquiry we collect:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Project type (if provided)</li>
            <li>Postcode (if provided)</li>
            <li>Project details / free-text message</li>
          </ul>
          <p>
            <strong>Legal basis:</strong> Legitimate interests (Art. 6(1)(f) UK GDPR) — processing your enquiry in order
            to provide you with a quotation or survey, and to manage our business communications. We have assessed that
            our interests are not overridden by your rights in this context.
          </p>

          <h2>3. How we use your data</h2>
          <ul>
            <li>To respond to your enquiry and arrange a site survey where appropriate</li>
            <li>To send you a quotation or specification</li>
            <li>To manage our ongoing relationship with you as a client</li>
          </ul>
          <p>We do not use your data for automated decision-making or profiling.</p>

          <h2>4. How long we keep your data</h2>
          <p>
            Enquiry records are retained for up to 3 years from the date of submission, or for the duration of any
            ongoing client relationship, whichever is longer. After this period data is securely deleted.
          </p>

          <h2>5. Who we share your data with</h2>
          <p>
            We do not sell, rent or share your personal data with third parties for marketing purposes.
          </p>
          <p>
            We use the following sub-processors to operate this website and handle enquiry data:
          </p>
          <ul>
            <li><strong>Supabase Inc.</strong> — cloud database provider (enquiry storage). Data is processed in the EU.</li>
            <li><strong>Resend Inc.</strong> — transactional email provider (notification emails). Data is processed in the US under appropriate safeguards.</li>
            <li><strong>Vercel Inc.</strong> — hosting and CDN provider.</li>
          </ul>
          <p>Each sub-processor is bound by appropriate data processing agreements.</p>

          <h2>6. Your rights</h2>
          <p>Under UK GDPR you have the following rights:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
            <li><strong>Rectification</strong> — ask us to correct inaccurate data</li>
            <li><strong>Erasure</strong> — ask us to delete your data in certain circumstances</li>
            <li><strong>Restriction</strong> — ask us to limit how we use your data</li>
            <li><strong>Portability</strong> — receive your data in a machine-readable format</li>
            <li><strong>Object</strong> — object to processing based on legitimate interests</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{' '}
            <a href={`mailto:${BUSINESS.email}`} className="text-[#9E000C] hover:underline">{BUSINESS.email}</a>.
            We will respond within one calendar month.
          </p>

          <h2>7. Complaints</h2>
          <p>
            If you are unhappy with how we handle your data, you have the right to lodge a complaint with the
            Information Commissioner&apos;s Office (ICO), the UK supervisory authority for data protection.
          </p>
          <p>
            ICO website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#9E000C] hover:underline">ico.org.uk</a><br />
            ICO helpline: 0303 123 1113
          </p>

          <h2>8. Cookies</h2>
          <p>
            This website uses a small number of strictly necessary cookies to operate correctly. For full details see
            our <a href="/legal/cookie-policy" className="text-[#9E000C] hover:underline">Cookie Policy</a>.
          </p>

          <h2>9. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of this page indicates when it was last
            revised. Continued use of the website after changes constitutes acceptance of the revised policy.
          </p>
        </div>
      </section>
    </MarketingShell>
  )
}
