export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
      <h1 className="font-heading text-5xl tracking-tight uppercase mb-6">
        The Architectural Forge
      </h1>
      <p className="text-lg max-w-2xl mb-12">
        British industrial heritage meets precision engineering. 
        Premium bespoke steel gates, built to last.
      </p>
      
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-primary text-white font-semibold transition-colors duration-100 hover:bg-primary-container">
          Get a Quote
        </button>
        <button className="px-6 py-3 border-2 border-primary text-primary font-semibold transition-colors duration-100 hover:bg-primary hover:text-white">
          View Catalogue
        </button>
      </div>

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
