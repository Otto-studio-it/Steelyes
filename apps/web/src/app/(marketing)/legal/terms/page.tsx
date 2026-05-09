import type { Metadata } from 'next'
import { MarketingShell } from '@/components/marketing/MarketingShell'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Steelyes',
  description: 'Terms and conditions for Steelyes steel fabrication, gate supply and installation services.',
}

export default function TermsPage() {
  return (
    <MarketingShell pathname="/legal/terms">
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Legal</p>
        <h1 className="font-heading text-4xl font-black uppercase sm:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-4 font-mono text-xs text-zinc-500">Last updated: May 2026</p>

        <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-[#3A3A3A] [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-[#1B1C1A] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">

          <h2>1. About us</h2>
          <p>
            Steelyes (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a steel fabrication and installation business operating across the
            United Kingdom. Our registered workshop is at Unit 7, Meridian Industrial Estate, Enfield, London EN3 7TW.
          </p>
          <p>
            These Terms &amp; Conditions govern your use of this website and any contract formed between us for the
            supply and installation of steelwork. By using this website or accepting a quotation from us, you agree
            to these terms.
          </p>

          <h2>2. Quotations</h2>
          <p>
            All quotations are provided free of charge and without obligation. Prices given via our website enquiry
            form or by telephone are indicative only. A formal written quotation will be issued following a site
            survey where required.
          </p>
          <ul>
            <li>Quotations are valid for 30 days from the date of issue unless otherwise stated.</li>
            <li>Prices are exclusive of VAT unless expressly stated otherwise.</li>
            <li>We reserve the right to revise a quotation if the scope of works changes following a site survey.</li>
            <li>Acceptance of a quotation must be confirmed in writing (email is acceptable).</li>
          </ul>

          <h2>3. Orders and contracts</h2>
          <p>
            A binding contract is formed only when we issue a written order confirmation following your acceptance of
            our quotation. We reserve the right to decline any order at our discretion before confirmation is issued.
          </p>
          <p>
            Bespoke fabricated items are made to your specification and are non-cancellable once manufacturing has
            commenced unless agreed otherwise in writing.
          </p>

          <h2>4. Payments</h2>
          <ul>
            <li>A deposit (typically 50%) is required before fabrication commences. The exact amount will be specified in your quotation.</li>
            <li>The balance is due on practical completion of the installation, or on delivery for supply-only orders.</li>
            <li>Late payments may attract interest at 8% above the Bank of England base rate under the Late Payment of Commercial Debts (Interest) Act 1998.</li>
            <li>Title in goods does not pass until full payment is received.</li>
          </ul>

          <h2>5. Installation and site access</h2>
          <p>
            Where installation is included in the contract:
          </p>
          <ul>
            <li>You are responsible for ensuring clear and safe site access on the agreed installation date.</li>
            <li>You must ensure any required planning permissions, building regulations consents, or neighbour agreements are in place before installation begins.</li>
            <li>If access is refused or the site is not ready on the agreed date, we may charge for abortive visits at our standard day rate.</li>
            <li>Any additional works identified on site that fall outside the agreed specification will be quoted and agreed separately before proceeding.</li>
          </ul>

          <h2>6. Intellectual property</h2>
          <p>
            All designs, drawings, specifications, and technical documents produced by Steelyes remain our intellectual
            property unless expressly transferred to you in writing. We grant you a licence to use such documents solely
            for the purpose of the project to which they relate.
          </p>

          <h2>7. Liability</h2>
          <p>
            To the maximum extent permitted by law:
          </p>
          <ul>
            <li>Our total liability to you in connection with any contract shall not exceed the price paid under that contract.</li>
            <li>We are not liable for any indirect, consequential, or economic losses including loss of profit, loss of revenue, or loss of anticipated savings.</li>
            <li>Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded by law.</li>
          </ul>

          <h2>8. Defects and warranty</h2>
          <p>
            We warrant that goods supplied by us will be free from material defects in workmanship for a period of
            12 months from the date of installation or delivery (supply-only). This warranty does not cover:
          </p>
          <ul>
            <li>Fair wear and tear</li>
            <li>Damage caused by misuse, neglect, or failure to follow our maintenance guidance</li>
            <li>Corrosion arising from exposure to coastal salt air or aggressive chemical environments unless specifically factored into the specification</li>
            <li>Work carried out by third parties after delivery or installation</li>
          </ul>
          <p>
            To make a warranty claim, contact us at{' '}
            <a href="mailto:steelyes@yahoo.com" className="text-[#9E000C] hover:underline">steelyes@yahoo.com</a>{' '}
            within the warranty period with a description and photographs of the defect.
          </p>

          <h2>9. Governing law</h2>
          <p>
            These terms and any dispute arising from them are governed by the law of England and Wales. Both parties
            submit to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2>10. Changes to these terms</h2>
          <p>
            We may update these Terms &amp; Conditions from time to time. The date at the top of this page shows when
            they were last revised. Changes do not affect contracts already formed.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about these terms: <a href="mailto:steelyes@yahoo.com" className="text-[#9E000C] hover:underline">steelyes@yahoo.com</a><br />
            Tel: +44 7803 002145
          </p>
        </div>
      </section>
    </MarketingShell>
  )
}
