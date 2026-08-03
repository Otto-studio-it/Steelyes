import type { Metadata } from 'next'

import { CookiebotDeclaration } from '@/components/consent/CookiebotDeclaration'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Steelyes uses cookies on its website.',
  alternates: { canonical: '/legal/cookie-policy' },
}

export default function CookiePolicyPage() {
  return (
    <MarketingShell pathname="/legal/cookie-policy">
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Legal</p>
        <h1 className="font-heading text-4xl font-black uppercase sm:text-5xl">Cookie Policy</h1>
        <p className="mt-4 font-mono text-xs text-zinc-500">Last updated: August 2026</p>

        <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-[#3A3A3A] [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-[#1B1C1A] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
          <h2>1. What are cookies</h2>
          <p>
            Cookies are small text files placed on your device when you visit a website. They are widely used to
            make websites work, or work more efficiently, and to provide information to website operators.
          </p>

          <h2>2. Consent manager</h2>
          <p>
            We use <strong>Cookiebot by Usercentrics</strong> as our cookie consent platform when it is configured
            for this domain. Cookiebot shows a consent dialog, stores your choices, and blocks non-essential cookies
            until you allow them. You can change your mind later via the Cookiebot settings control (usually a
            floating cookie icon).
          </p>
          <p>
            Until Cookiebot is activated on a given environment, a simple notice may appear stating that only
            strictly necessary cookies are used.
          </p>

          <h2>3. Cookie declaration</h2>
          <p>
            The live list of cookies detected on this domain is maintained by Cookiebot and shown below.
          </p>
        </div>

        <div className="mt-6">
          <CookiebotDeclaration />
        </div>

        <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-[#3A3A3A] [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-[#1B1C1A] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
          <h2>4. Cookies we use</h2>
          <p>
            We do <strong>not</strong> use PostHog, Google Analytics, advertising pixels, or session-replay tools.
          </p>

          <h3>Strictly necessary cookies</h3>
          <p>
            These cookies are required for the website to function correctly. They cannot be disabled without
            breaking core functionality.
          </p>
          <ul>
            <li>
              <strong>Session / authentication cookies</strong> — Set by Supabase for the admin area only.
              These cookies are not set for regular visitors browsing the public website.
            </li>
            <li>
              <strong>Cookiebot consent cookies</strong> — When Cookiebot is active, it stores your consent
              state (for example CookieConsent). These are required for the consent mechanism itself.
            </li>
            <li>
              <strong>Fallback preference</strong> — If Cookiebot is not yet active, a small localStorage entry
              may record that you acknowledged the necessary-cookies notice.
            </li>
          </ul>

          <h3>Other categories</h3>
          <p>
            If Cookiebot later detects optional cookies (statistics, marketing, preferences), those categories
            appear in the Cookiebot dialog and are off until you opt in. The live list is maintained in Cookiebot
            and reflected in the declaration above.
          </p>

          <h2>5. What we do NOT use</h2>
          <ul>
            <li>PostHog or similar product analytics</li>
            <li>Google Analytics or similar visitor-tracking tools</li>
            <li>Facebook Pixel or social media tracking</li>
            <li>Advertising or retargeting cookies (unless you later enable them via Cookiebot)</li>
            <li>Heatmap or session-recording tools</li>
          </ul>

          <h2>6. Third-party cookies</h2>
          <p>
            Supabase (our database provider) may set a session cookie when you access the admin area of this
            website. This cookie is used purely for authentication.
          </p>
          <p>
            Cookiebot / Usercentrics may set cookies required to remember consent. Cloudflare may set security
            cookies (for example challenge tokens) as part of protecting the site.
          </p>
          <p>
            If you embed or link to third-party content (such as YouTube videos or maps) those third parties
            may set their own cookies, subject to their own privacy policies. We do not currently embed such
            content on this site.
          </p>

          <h2>7. How to control cookies</h2>
          <p>
            Prefer the Cookiebot dialog when it is shown. You can also control and delete cookies through your
            browser settings:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9E000C] hover:underline"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9E000C] hover:underline"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9E000C] hover:underline"
              >
                Apple Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9E000C] hover:underline"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p>
            Please note that disabling strictly necessary cookies may prevent some parts of the website from
            working correctly.
          </p>

          <h2>8. Changes to this policy</h2>
          <p>
            We may update this Cookie Policy from time to time. The date at the top of this page indicates when it
            was last revised. We recommend checking this page periodically.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have questions about our use of cookies, please contact us at{' '}
            <a href={`mailto:${BUSINESS.email}`} className="text-[#9E000C] hover:underline">
              {BUSINESS.email}
            </a>
            .
          </p>

          <p className="mt-8 border-t border-zinc-200 pt-6 text-xs text-zinc-400">
            For information on how we handle personal data, see our{' '}
            <a href="/legal/privacy-policy" className="text-[#9E000C] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </MarketingShell>
  )
}
