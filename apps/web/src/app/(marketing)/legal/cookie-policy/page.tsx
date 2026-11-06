import type { Metadata } from 'next'

import { ConsentSettings } from '@/components/consent/ConsentSettings'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'
import { breadcrumbSchema } from '@/lib/marketing/schema'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Steelyes uses cookies on its website in accordance with UK PECR and GDPR.',
  alternates: { canonical: '/legal/cookie-policy' },
}

export default function CookiePolicyPage() {
  return (
    <MarketingShell pathname="/legal/cookie-policy">
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">Legal</p>
        <h1 className="font-heading text-4xl font-black uppercase sm:text-5xl">Cookie Policy</h1>
        <p className="mt-4 font-mono text-xs text-zinc-500">Last updated: November 2026</p>

        <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-muted-deep [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-steel [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
          
          <h2>1. Introduction</h2>
          <p>
            This Cookie Policy explains how {BUSINESS.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) uses cookies and similar technologies on our website{' '}
            <a href={BUSINESS.website} className="text-primary hover:underline">{BUSINESS.website}</a> (the &quot;Site&quot;).
          </p>
          <p>
            We comply with the Privacy and Electronic Communications Regulations (PECR) 2003, the UK General Data Protection Regulation (UK GDPR), and the Data Protection Act 2018.
          </p>
          <p>
            For information on how we process your personal data, please see our{' '}
            <a href="/legal/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
          </p>

          <h2>2. What are cookies?</h2>
          <p>
            Cookies are small text files placed on your device (computer, smartphone, tablet) when you visit a website. They are widely used to make websites work efficiently and provide information to website owners.
          </p>
          <p>
            Cookies can be:
          </p>
          <ul>
            <li><strong>Session cookies</strong> — temporary cookies that expire when you close your browser</li>
            <li><strong>Persistent cookies</strong> — remain on your device for a set period or until you delete them</li>
          </ul>
          <p>
            Cookies can be:
          </p>
          <ul>
            <li><strong>First-party cookies</strong> — set by us, the website you are visiting</li>
            <li><strong>Third-party cookies</strong> — set by another organisation&apos;s domain (e.g., analytics or advertising services)</li>
          </ul>

          <h2>3. How we use cookies</h2>
          <p>
            We use cookies for the following purposes:
          </p>
          
          <h3>3.1 Strictly Necessary Cookies</h3>
          <p>
            These cookies are essential for the Site to function. They enable core features such as security, authentication, and remembering your cookie preferences. <strong>These cannot be disabled.</strong>
          </p>
          <p>
            Under UK PECR, we do not need your consent for strictly necessary cookies.
          </p>

          <table className="mt-4 w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <th className="px-3 py-2 text-left font-semibold">Cookie Name</th>
                <th className="px-3 py-2 text-left font-semibold">Purpose</th>
                <th className="px-3 py-2 text-left font-semibold">Duration</th>
                <th className="px-3 py-2 text-left font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-200">
                <td className="px-3 py-2 font-mono">sy_cookie_consent</td>
                <td className="px-3 py-2">Stores your cookie consent preferences</td>
                <td className="px-3 py-2">12 months</td>
                <td className="px-3 py-2">First-party (localStorage)</td>
              </tr>
              <tr className="border-b border-zinc-200">
                <td className="px-3 py-2 font-mono">sb-*-auth-token</td>
                <td className="px-3 py-2">Authentication for admin area (Supabase)</td>
                <td className="px-3 py-2">Session / 7 days</td>
                <td className="px-3 py-2">First-party</td>
              </tr>
              <tr className="border-b border-zinc-200">
                <td className="px-3 py-2 font-mono">cf_clearance</td>
                <td className="px-3 py-2">Cloudflare security challenge token (Turnstile)</td>
                <td className="px-3 py-2">30 minutes</td>
                <td className="px-3 py-2">Third-party (Cloudflare)</td>
              </tr>
              <tr className="border-b border-zinc-200">
                <td className="px-3 py-2 font-mono">__cf_bm</td>
                <td className="px-3 py-2">Cloudflare bot management</td>
                <td className="px-3 py-2">30 minutes</td>
                <td className="px-3 py-2">Third-party (Cloudflare)</td>
              </tr>
            </tbody>
          </table>

          <h3>3.2 Analytics Cookies</h3>
          <p>
            We may use analytics cookies to understand how visitors use our Site. This helps us improve the Site and user experience.
          </p>
          <p>
            <strong>We only set analytics cookies if you consent via our cookie banner.</strong>
          </p>
          <p>
            Currently, we do <strong>not</strong> use Google Analytics, PostHog, or other third-party analytics tools. If we introduce analytics in the future, we will update this policy and request your consent.
          </p>

          <h3>3.3 Marketing Cookies</h3>
          <p>
            Marketing cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.
          </p>
          <p>
            <strong>We only set marketing cookies if you consent via our cookie banner.</strong>
          </p>
          <p>
            If you consent to marketing cookies and we have configured Google Ads (via the environment variable{' '}
            <code className="font-mono text-xs">NEXT_PUBLIC_GOOGLE_ADS_ID</code>), the following cookies may be set:
          </p>

          <table className="mt-4 w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <th className="px-3 py-2 text-left font-semibold">Cookie Name</th>
                <th className="px-3 py-2 text-left font-semibold">Purpose</th>
                <th className="px-3 py-2 text-left font-semibold">Duration</th>
                <th className="px-3 py-2 text-left font-semibold">Provider</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-200">
                <td className="px-3 py-2 font-mono">_gcl_au</td>
                <td className="px-3 py-2">Google Ads conversion tracking</td>
                <td className="px-3 py-2">90 days</td>
                <td className="px-3 py-2">Google Ireland Limited</td>
              </tr>
              <tr className="border-b border-zinc-200">
                <td className="px-3 py-2 font-mono">_gac_*</td>
                <td className="px-3 py-2">Google Ads campaign information</td>
                <td className="px-3 py-2">90 days</td>
                <td className="px-3 py-2">Google Ireland Limited</td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4">
            For more information, see{' '}
            <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Google&apos;s cookie policy
            </a>.
          </p>

          <h2>4. Google Consent Mode v2</h2>
          <p>
            We implement <strong>Google Consent Mode v2</strong> to ensure Google tags respect your cookie preferences:
          </p>
          <ul>
            <li><strong>Default state</strong> — all Google consent types are denied until you make a choice</li>
            <li><strong>Consent types</strong> — ad_storage, ad_user_data, ad_personalization, analytics_storage</li>
            <li><strong>Dynamic updates</strong> — consent signals are updated in real-time when you change preferences</li>
            <li><strong>No scripts loaded</strong> — Google tag scripts (<code>gtag.js</code>) are only loaded if you consent to marketing cookies <strong>and</strong> we have configured a Google Ads ID</li>
          </ul>

          <h2>5. Local storage</h2>
          <p>
            In addition to cookies, we use browser localStorage for:
          </p>
          <ul>
            <li><strong>sy_cookie_consent</strong> — your consent preferences (strictly necessary)</li>
            <li><strong>Gate configurator state</strong> — your design choices are saved locally in your browser so you don&apos;t lose progress (optional feature; no personal data is sent to our servers unless you submit an enquiry)</li>
          </ul>
          <p>
            localStorage persists until you clear your browser data or we delete it programmatically.
          </p>

          <h2>6. Third-party cookies</h2>
          <p>
            We use services from trusted third parties who may set cookies:
          </p>
          <ul>
            <li>
              <strong>Cloudflare</strong> — security, CDN, and bot management (cf_clearance, __cf_bm). These are strictly necessary for security.{' '}
              <a href="https://www.cloudflare.com/en-gb/cookie-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Cloudflare cookie policy
              </a>
            </li>
            <li>
              <strong>Supabase</strong> — authentication for admin users only (not set for public visitors).{' '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Supabase privacy policy
              </a>
            </li>
            <li>
              <strong>Google (if enabled and consented)</strong> — advertising and conversion tracking.{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google privacy policy
              </a>
            </li>
          </ul>

          <h2>7. What we do NOT use</h2>
          <p>We do not use:</p>
          <ul>
            <li>Google Analytics or similar visitor-tracking tools</li>
            <li>Facebook Pixel, TikTok Pixel, or social media tracking pixels</li>
            <li>Session replay or heatmap tools (e.g., Hotjar, FullStory)</li>
            <li>Retargeting or programmatic advertising platforms (unless Google Ads is enabled and you consent)</li>
            <li>Cross-site tracking or third-party data brokers</li>
          </ul>

          <h2>8. Your choices and consent</h2>
          <p>
            When you first visit our Site, a cookie banner appears asking for your consent to optional cookies. You can:
          </p>
          <ul>
            <li><strong>Accept all</strong> — consent to all cookie categories</li>
            <li><strong>Reject all</strong> — only strictly necessary cookies will be set</li>
            <li><strong>Manage preferences</strong> — choose which categories you accept (analytics, marketing)</li>
          </ul>
          <p>
            Your choice is stored for <strong>12 months</strong>. After 12 months, we will ask for your consent again.
          </p>
          <p>
            If we update the consent mechanism or add new cookie categories, we may ask for your consent again.
          </p>
          <p>
            You can change your cookie preferences at any time:
          </p>
          <ul>
            <li>Click &quot;Cookie Settings&quot; in the footer of any page</li>
            <li>Visit this Cookie Policy page and use the preference manager below</li>
          </ul>

          <h2>9. Manage your preferences</h2>
          <p>
            Use the preference manager below to view and update your cookie settings:
          </p>
        </div>

        <div className="mt-8">
          <ConsentSettings />
        </div>

        <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-muted-deep [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-steel [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">

          <h2>10. Browser controls</h2>
          <p>
            You can also manage cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul>
            <li>View cookies stored on your device</li>
            <li>Delete cookies</li>
            <li>Block all cookies</li>
            <li>Block third-party cookies</li>
          </ul>
          <p>
            Instructions for popular browsers:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Apple Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p>
            <strong>Please note:</strong> Blocking strictly necessary cookies may prevent parts of the Site from working correctly (e.g., admin login, contact form security).
          </p>
          <p>
            For more information about cookies and how to control them, visit{' '}
            <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              www.aboutcookies.org
            </a>{' '}
            or{' '}
            <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              www.allaboutcookies.org
            </a>.
          </p>

          <h2>11. Changes to this policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our use of cookies or legal requirements. The &quot;Last updated&quot; date at the top indicates when it was last revised.
          </p>
          <p>
            We recommend checking this page periodically.
          </p>

          <h2>12. Contact us</h2>
          <p>
            If you have questions about our use of cookies, please contact us:
          </p>
          <p>
            Email: <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a><br />
            Post: {BUSINESS.legalName}, {BUSINESS.address.line1}, {BUSINESS.address.locality}, {BUSINESS.address.region} {BUSINESS.address.postalCode}
          </p>

          <p className="mt-8 border-t border-zinc-200 pt-6 text-xs text-zinc-400">
            For information on how we handle personal data, see our{' '}
            <a href="/legal/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Cookie Policy', path: '/legal/cookie-policy' }]),
          ),
        }}
      />
    </MarketingShell>
  )
}
