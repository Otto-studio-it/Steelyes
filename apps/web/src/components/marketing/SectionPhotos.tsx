import { MarketingPhoto } from '@/components/marketing/MarketingPhoto'

export function SectionPhotos({
  images,
  title,
}: {
  images: readonly string[]
  title: string
}) {
  if (images.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
      <p className="mb-6 font-mono text-xs uppercase tracking-widest text-primary">Photographs</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((src, n) => (
          <div key={src} className="relative aspect-[4/3] overflow-hidden bg-paper">
            <MarketingPhoto
              src={src}
              alt={`${title} photograph ${n + 1}`}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
