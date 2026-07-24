import type { Metadata } from 'next'

import { LegalDraftNotice } from '@/components/marketing/LegalDraftNotice'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'

export const metadata: Metadata = {
  title: 'Cookie Policy | Steelyes',
  description: 'How Steelyes uses cookies on its website.',
}

export default function CookiePolicyPage() {
  return (
    <MarketingShell pathname="/legal/cookie-policy">
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Legal</p>
        <h1 className="font-heading text-4xl font-black uppercase sm:text-5xl">Cookie Policy</h1>
        <p className="mt-4 font-mono text-xs text-zinc-500">Last updated: May 2026</p>
        <LegalDraftNotice />

        <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-[#3A3A3A] [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-[#1B1C1A] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">

          <h2>1. What are cookies</h2>
          <p>
            Cookies are small text files placed on your device when you visit a website. They are widely used to
            make websites work, or work more efficiently, and to provide information to website operators.
          </p>

          <h2>2. Cookies we use</h2>
          <p>
            This website uses only strictly necessary cookies. We do not use analytics, advertising, or tracking cookies.
          </p>

          <h3>Strictly necessary cookies</h3>
          <p>
            These cookies are required for the website to function correctly. They cannot be disabled without
            breaking core functionality.
          </p>
          <ul>
            <li>
              <strong>Session / authentication cookies</strong> — Set by Supabase for the admin area only.
              These cookies are not set for regular visitors browsing the public website. They expire at the
              end of the browser session or after a fixed period.
            </li>
            <li>
              <strong>Cookie consent preference</strong> — A small cookie or localStorage entry that records
              whether you have acknowledged this notice. This prevents the banner from reappearing on every
              page visit. It contains no personal data and expires after 12 months.
            </li>
          </ul>

          <h2>3. What we do NOT use</h2>
          <ul>
            <li>Google Analytics or similar visitor-tracking tools</li>
            <li>Facebook Pixel or social media tracking</li>
            <li>Advertising or retargeting cookies</li>
            <li>Heatmap or session-recording tools</li>
          </ul>

          <h2>4. Third-party cookies</h2>
          <p>
            Supabase (our database provider) may set a session cookie when you access the admin area of this
            website. This cookie is not accessible to Steelyes staff from the public-facing site and is used
            purely for authentication.
          </p>
          <p>
            If you embed or link to third-party content (such as YouTube videos or maps) those third parties
            may set their own cookies, subject to their own privacy policies. We do not currently embed such
            content on this site.
          </p>

          <h2>5. How to control cookies</h2>
          <p>
            You can control and delete cookies through your browser settings. The following links provide
            guidance for common browsers:
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#9E000C] hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[#9E000C] hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#9E000C] hover:underline">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#9E000C] hover:underline">Microsoft Edge</a></li>
          </ul>
          <p>
            Please note that disabling strictly necessary cookies may prevent some parts of the website from
            working correctly.
          </p>

          <h2>6. Changes to this policy</h2>
          <p>
            We may update this Cookie Policy from time to time. The date at the top of this page indicates when it
            was last revised. We recommend checking this page periodically.
          </p>

          <h2>7. Contact</h2>
          <p>
            If you have questions about our use of cookies, please contact us at{' '}
            <a href={`mailto:${BUSINESS.email}`} className="text-[#9E000C] hover:underline">{BUSINESS.email}</a>.
          </p>

          <p className="mt-8 border-t border-zinc-200 pt-6 text-xs text-zinc-400">
            For information on how we handle personal data, see our{' '}
            <a href="/legal/privacy-policy" className="text-[#9E000C] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </MarketingShell>
  )
}
