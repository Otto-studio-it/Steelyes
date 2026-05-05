import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Steelyes Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fbf9f6]">
      {children}
    </div>
  )
}
