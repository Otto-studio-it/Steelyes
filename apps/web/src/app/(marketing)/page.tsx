import { getServerClient } from '@/lib/supabase/server'

export default async function HomePage() {
  let dbStatus = { connected: false, gatesCount: 0, error: null as string | null }

  try {
    const supabase = await getServerClient()
    const { data: gates, error } = await supabase
      .from('gates')
      .select('id', { count: 'exact' })
      .limit(1)

    if (error) {
      dbStatus.error = error.message
    } else {
      dbStatus.connected = true
      dbStatus.gatesCount = gates?.length || 0
    }
  } catch (err) {
    dbStatus.error = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      {/* Header */}
      <header className="border-b border-gray-300 px-6 py-8 md:py-12">
        <h1 className="text-lg font-bold tracking-wider">STEELYES LTD</h1>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          BESPOKE STEEL
          <br />
          <span className="text-primary">GATES</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
          British engineering excellence. Precision built, hand-finished in our Yorkshire workshop
          using premium-grade structural steel and architectural coatings.
        </p>

        {/* Database Status Card */}
        <div className="border border-gray-300 p-6 mb-8 bg-gray-50">
          {dbStatus.connected ? (
            <div className="text-green-700">
              <p className="font-semibold text-lg">✅ Database Connected</p>
              <p className="text-sm text-gray-600 mt-1">
                {dbStatus.gatesCount} gate catalogue loaded from Supabase EU
              </p>
            </div>
          ) : dbStatus.error ? (
            <div className="text-red-700">
              <p className="font-semibold text-lg">⚠️ Database Connection Failed</p>
              <p className="text-sm text-gray-600 mt-1">{dbStatus.error}</p>
              <p className="text-xs text-gray-500 mt-2">
                Check your NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
              </p>
            </div>
          ) : (
            <div className="text-yellow-700">
              <p className="font-semibold text-lg">⏳ Connecting...</p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button className="px-8 py-3 bg-primary text-white font-semibold hover:bg-primary-container transition-colors duration-100">
          REQUEST QUOTE
        </button>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-12 tracking-tight">
            THE ARCHITECTURAL FORGE
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: 'PRECISION',
                description: 'Every gate calculated for thermal expansion, wind load, and millimetre accuracy.',
              },
              {
                label: 'RELIABILITY',
                description: 'Industrial-grade powder coating and marine-spec welding ensure decades of service.',
              },
              {
                label: 'CRAFT',
                description: 'Hand-finished in our British workshop. Bespoke to your exact specification.',
              },
            ].map((item) => (
              <div key={item.label} className="border-l-2 border-primary pl-4">
                <p className="text-sm font-bold text-gray-500 mb-2">0{[item.label].indexOf(item.label) + 1}</p>
                <p className="font-bold text-lg mb-2">{item.label}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-canvas px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="font-bold">STEELYES LTD</p>
            <p className="text-xs text-gray-400 mt-2">British Engineering Excellence</p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-xs text-gray-400">
              © 2026 Steelyes Ltd. All rights reserved. Phase 0 setup {new Date().toISOString().split('T')[0]}
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
