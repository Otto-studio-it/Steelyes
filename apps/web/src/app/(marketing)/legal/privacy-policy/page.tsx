import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'
import { breadcrumbSchema } from '@/lib/marketing/schema'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Steelyes collects, uses and protects your personal data in accordance with UK GDPR and DPA 2018.',
  alternates: { canonical: '/legal/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <MarketingShell pathname="/legal/privacy-policy">
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">Legal</p>
        <h1 className="font-heading text-4xl font-black uppercase sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 font-mono text-xs text-zinc-500">Last updated: November 2026</p>

        <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-muted-deep [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-steel [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
          
          <h2>1. Who we are</h2>
          <p>
            {BUSINESS.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is the data controller for personal data collected through this website.
            We are a steel fabrication and gate installation business registered in England and Wales.
          </p>
          <p>
            <strong>Contact details:</strong><br />
            {BUSINESS.legalName}<br />
            Company number: {BUSINESS.companyNumber || '[COMPANY-NUMBER]'}<br />
            {BUSINESS.address.line1}<br />
            {BUSINESS.address.locality}, {BUSINESS.address.region} {BUSINESS.address.postalCode}<br />
            United Kingdom
          </p>
          <p>
            Email: <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a><br />
            Phone: {BUSINESS.phoneDisplay}<br />
            Privacy contact: <a href="mailto:info@steelyes.co.uk" className="text-primary hover:underline">info@steelyes.co.uk</a>
          </p>
          <p>
            ICO Registration Number: <strong>(to be provided)</strong>
          </p>

          <h2>2. Personal data we collect</h2>
          
          <h3>Information you provide to us</h3>
          <p>When you use our website or contact us, we may collect:</p>
          <ul>
            <li><strong>Contact data</strong> — name, email address, phone number, postal address</li>
            <li><strong>Enquiry data</strong> — project type, location (postcode), project details, measurements, photographs you upload</li>
            <li><strong>Configurator data</strong> — gate design preferences, dimensions, material selections, pricing estimates (stored locally in your browser)</li>
            <li><strong>Communications</strong> — messages you send us via contact forms or email</li>
            <li><strong>Account data</strong> — if you create an admin account: email, password (hashed), authentication cookies</li>
          </ul>

          <h3>Information collected automatically</h3>
          <p>When you visit our website, we and our service providers may automatically collect:</p>
          <ul>
            <li><strong>Device and browser data</strong> — IP address, browser type and version, operating system, screen resolution, language settings</li>
            <li><strong>Usage data</strong> — pages visited, time on site, navigation paths, referring website</li>
            <li><strong>Cookies and similar technologies</strong> — see our <a href="/legal/cookie-policy" className="text-primary hover:underline">Cookie Policy</a> for details</li>
          </ul>

          <p>
            We do <strong>not</strong> use session replay, heatmaps, keystroke logging, or fingerprinting technologies.
          </p>

          <h2>3. Lawful basis for processing</h2>
          <p>We process your personal data under the following lawful bases (Article 6, UK GDPR):</p>
          <ul>
            <li><strong>Legitimate interests</strong> (Art. 6(1)(f)) — responding to enquiries, improving our website, fraud prevention. We have assessed that our interests do not override your rights and freedoms.</li>
            <li><strong>Contract</strong> (Art. 6(1)(b)) — when you request a quotation or place an order, processing is necessary to fulfil our contract with you.</li>
            <li><strong>Consent</strong> (Art. 6(1)(a)) — for optional cookies (analytics, marketing) as described in our Cookie Policy.</li>
            <li><strong>Legal obligation</strong> (Art. 6(1)(c)) — where required by law (e.g., tax, accounting).</li>
          </ul>

          <h2>4. How we use your personal data</h2>
          <p>We use your personal data to:</p>
          <ul>
            <li>Respond to your enquiries and provide quotations</li>
            <li>Arrange site surveys and installation appointments</li>
            <li>Process orders and manage our customer relationship with you</li>
            <li>Operate and secure our website</li>
            <li>Improve our services and website (when you consent to analytics cookies)</li>
            <li>Comply with legal and regulatory requirements</li>
            <li>Prevent fraud and abuse</li>
          </ul>
          <p>
            We do <strong>not</strong> use automated decision-making or profiling that produces legal or similarly significant effects.
          </p>

          <h2>5. Who we share your personal data with</h2>
          <p>
            We do not sell, rent, or share your personal data for marketing purposes. We share personal data only with trusted processors as necessary:
          </p>
          <ul>
            <li><strong>Supabase Inc.</strong> (US) — database hosting for enquiries and admin authentication. Data stored in EU region. Appropriate safeguards in place (Standard Contractual Clauses).</li>
            <li><strong>Cloudflare, Inc.</strong> (US) — CDN, DNS, DDoS protection, and bot management (Turnstile). Minimal personal data processed. <a href="https://www.cloudflare.com/en-gb/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy policy</a></li>
            <li><strong>DigitalOcean LLC</strong> (US) — application hosting and cloud storage for uploaded images. Data stored in EU region (London). <a href="https://www.digitalocean.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy policy</a></li>
            <li><strong>Resend Inc.</strong> (US) — transactional email delivery for enquiry notifications. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy policy</a></li>
            <li><strong>Google Ireland Limited</strong> — only if you consent to marketing cookies and we have configured Google Ads. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy policy</a></li>
          </ul>
          <p>
            Each processor is bound by written data processing agreements meeting UK GDPR requirements.
          </p>

          <h3>International transfers</h3>
          <p>
            Some processors are based outside the UK. Where this occurs, we ensure appropriate safeguards are in place:
          </p>
          <ul>
            <li>Standard Contractual Clauses approved by the UK Information Commissioner&apos;s Office</li>
            <li>Data stored in EU/UK regions where available</li>
            <li>Adequacy decisions recognised by the UK government</li>
          </ul>

          <h2>6. How long we keep your personal data</h2>
          <p>We retain personal data only as long as necessary for the purposes described:</p>
          <ul>
            <li><strong>Enquiry records</strong> — [RETENTION-PERIOD-ENQUIRIES, e.g., 3 years] from date of enquiry, or duration of client relationship, whichever is longer</li>
            <li><strong>Customer records</strong> — [RETENTION-PERIOD-CUSTOMERS, e.g., 7 years] after last transaction (accounting and legal requirements)</li>
            <li><strong>Website logs and analytics</strong> — [RETENTION-PERIOD-LOGS, e.g., 90 days]</li>
            <li><strong>Marketing consent records</strong> — [RETENTION-PERIOD-MARKETING, e.g., until withdrawn or 3 years of inactivity]</li>
            <li><strong>Admin accounts</strong> — until account is deleted or [RETENTION-PERIOD-INACTIVE-ACCOUNTS, e.g., 2 years] of inactivity</li>
          </ul>
          <p>
            After the retention period, personal data is securely deleted or anonymised.
          </p>

          <h2>7. Your rights</h2>
          <p>Under UK GDPR and the Data Protection Act 2018, you have the following rights:</p>
          <ul>
            <li><strong>Right of access</strong> (Art. 15) — request a copy of your personal data</li>
            <li><strong>Right to rectification</strong> (Art. 16) — correct inaccurate or incomplete data</li>
            <li><strong>Right to erasure</strong> (Art. 17) — request deletion in certain circumstances</li>
            <li><strong>Right to restriction</strong> (Art. 18) — limit how we process your data in certain circumstances</li>
            <li><strong>Right to data portability</strong> (Art. 20) — receive your data in a machine-readable format</li>
            <li><strong>Right to object</strong> (Art. 21) — object to processing based on legitimate interests or for direct marketing</li>
            <li><strong>Rights related to automated decision-making</strong> (Art. 22) — not applicable as we do not use automated decision-making</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:info@steelyes.co.uk" className="text-primary hover:underline">info@steelyes.co.uk</a> or{' '}
            <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a>.
          </p>
          <p>
            We will respond within <strong>one month</strong> of receiving your request. In complex cases, we may extend this by a further two months and will inform you of any delay.
          </p>
          <p>
            You will not have to pay a fee to access your personal data or exercise your other rights. However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive.
          </p>

          <h2>8. Right to complain</h2>
          <p>
            If you are unhappy with how we have handled your personal data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO):
          </p>
          <p>
            <strong>Information Commissioner&apos;s Office</strong><br />
            Wycliffe House<br />
            Water Lane<br />
            Wilmslow<br />
            Cheshire SK9 5AF
          </p>
          <p>
            Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a><br />
            Helpline: 0303 123 1113
          </p>
          <p>
            We would appreciate the opportunity to resolve your concerns before you contact the ICO, so please contact us first.
          </p>

          <h2>9. Security</h2>
          <p>
            We implement appropriate technical and organisational measures to protect your personal data against unauthorised or unlawful processing, accidental loss, destruction, or damage:
          </p>
          <ul>
            <li>Transport Layer Security (TLS) encryption for data in transit</li>
            <li>Encrypted database storage</li>
            <li>Access controls and authentication</li>
            <li>Regular security assessments</li>
            <li>Staff training on data protection</li>
          </ul>
          <p>
            However, no internet transmission is completely secure. We cannot guarantee absolute security but will notify you and the ICO of any data breach where legally required.
          </p>

          <h2>10. Children&apos;s privacy</h2>
          <p>
            Our website and services are not directed at children under 16. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately.
          </p>

          <h2>11. Cookies and tracking</h2>
          <p>
            We use cookies and similar technologies as described in our{' '}
            <a href="/legal/cookie-policy" className="text-primary hover:underline">Cookie Policy</a>.
          </p>
          <p>
            We comply with the Privacy and Electronic Communications Regulations (PECR) 2003. We do not use non-essential cookies unless you consent via our cookie banner.
          </p>

          <h2>12. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The &quot;Last updated&quot; date at the top indicates when it was last revised.
          </p>
          <p>
            Material changes will be notified via a prominent notice on our website or by email (where we have your email address).
          </p>
          <p>
            We encourage you to review this policy periodically.
          </p>

          <h2>13. Contact us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <p>
            Email: <a href="mailto:info@steelyes.co.uk" className="text-primary hover:underline">info@steelyes.co.uk</a> or{' '}
            <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a><br />
            Post: {BUSINESS.legalName}, {BUSINESS.address.line1}, {BUSINESS.address.locality}, {BUSINESS.address.region} {BUSINESS.address.postalCode}
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/legal/privacy-policy' }]),
          ),
        }}
      />
    </MarketingShell>
  )
}
