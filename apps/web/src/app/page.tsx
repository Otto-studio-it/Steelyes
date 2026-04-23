import { headers } from 'next/headers'
import { getPostHogClient } from '@/lib/posthog'
import { CtaButtons } from '@/components/CtaButtons'

export default function Home() {
  const headersList = headers()
  const distinctId = headersList.get('X-POSTHOG-DISTINCT-ID') ?? 'anonymous'

  getPostHogClient().capture({
    distinctId,
    event: 'home page viewed',
    properties: {
      $current_url: '/',
    },
  })

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
      <h1 className="font-heading text-5xl tracking-tight uppercase mb-6">
        The Architectural Forge
      </h1>
      <p className="text-lg max-w-2xl mb-12">
        British industrial heritage meets precision engineering. 
        Premium bespoke steel gates, built to last.
      </p>
      
      <CtaButtons />

      <div className="mt-24 p-6 border border-gray-300 w-full max-w-md text-left">
        <h2 className="font-heading text-2xl uppercase mb-4 text-center">Internal Scaffold Status</h2>
        <ul className="list-disc pl-5 font-mono text-sm space-y-2">
          <li>Next.js 14 App Router: OK</li>
          <li>Tailwind CSS + Brand Tokens: OK</li>
          <li>gate-engine placeholder: Ready</li>
          <li>External Services: DISCONNECTED</li>
        </ul>
      </div>
    </main>
  );
}
