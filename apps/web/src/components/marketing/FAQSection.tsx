import { faqSchema } from '@/lib/marketing/schema'

export type FAQItem = {
  question: string
  answer: string
}

type FAQSectionProps = {
  title?: string
  subtitle?: string
  items: FAQItem[]
  className?: string
}

export function FAQSection({ title = 'Frequently asked questions', subtitle, items, className = '' }: FAQSectionProps) {
  return (
    <section className={className}>
      <div className="mb-8">
        {subtitle && (
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">{subtitle}</p>
        )}
        <h2 className="font-heading text-3xl font-black uppercase md:text-4xl">{title}</h2>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <details
            key={index}
            className="group border border-zinc-200 bg-white"
            open={index === 0}
          >
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 p-5 font-heading text-sm font-bold uppercase tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              {item.question}
              <span className="shrink-0 font-mono text-lg text-zinc-500" aria-hidden="true">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <div className="border-t border-zinc-100 p-5 pt-4">
              <p className="text-sm font-light leading-relaxed text-muted-deep">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

/**
 * Returns the FAQ schema script tag content for a page
 */
export function FAQSchemaScript({ items }: { items: FAQItem[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema(items)),
      }}
    />
  )
}
