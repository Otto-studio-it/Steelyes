import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-[#1B1C1A] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 text-left md:grid-cols-4 md:px-8">
        <div>
          <h2 className="mb-5 font-heading text-3xl font-black uppercase">Steelyes Ltd</h2>
          <p className="font-body text-sm font-light leading-relaxed text-zinc-500">
            British Engineering Excellence. Custom steel fabrication and installation across the United Kingdom.
          </p>
        </div>
        <div>
          <h4 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-red-600">Resources</h4>
          <ul className="space-y-3 text-zinc-400">
            <li>
              <Link href="/gates" className="transition-colors hover:text-white">
                Our Gates
              </Link>
            </li>
            <li>
              <Link href="/installation" className="transition-colors hover:text-white">
                Installation
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="transition-colors hover:text-white">
                Case Studies
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-red-600">Legal</h4>
          <ul className="space-y-3 text-zinc-400">
            <li>
              <Link href="/legal/privacy-policy" className="transition-colors hover:text-white">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/legal/cookie-policy" className="transition-colors hover:text-white">
                Cookie policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-red-600">The Forge</h4>
          <div className="space-y-2 font-mono text-sm text-zinc-400">
            <p>Unit 14, Industrial Estate</p>
            <p>Sheffield, S1 4ST</p>
            <p className="pt-2 text-white">T: 0800 123 4567</p>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-900 px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-xs uppercase tracking-widest text-zinc-600">
            © 2026 Steelyes Ltd. British Engineering Excellence.
          </p>
          <div className="flex gap-5 text-zinc-500">
            <span className="font-mono text-[10px] uppercase">Precision</span>
            <span className="font-mono text-[10px] uppercase">Strength</span>
            <span className="font-mono text-[10px] uppercase">Heritage</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
