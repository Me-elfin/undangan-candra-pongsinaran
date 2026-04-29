import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'

export default function ClosingSection({ config }) {
  const quote = config?.closing_quote || {}
  const groom = config?.couple?.groom?.nickname || 'Candra'
  const bride = config?.couple?.bride?.nickname || 'Pongsinaran'
  const eventDate = config?.event?.resepsi?.date || '2026-12-12'

  const formattedDate = new Date(eventDate + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <footer className="py-24 px-6 bg-charcoal text-center">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection>
          <div className="font-display text-7xl text-gold/20 leading-none mb-8 select-none">"</div>

          {quote.text && (
            <blockquote className="font-display text-xl md:text-2xl font-light text-white/75 italic leading-relaxed">
              {quote.text}
            </blockquote>
          )}
          {quote.source && (
            <cite className="font-body text-sm text-gold/50 tracking-widest not-italic block mt-4">
              {quote.source}
            </cite>
          )}

          <GoldDivider className="max-w-xs mx-auto mt-12 mb-12" />

          <h3 className="font-display font-light text-white">
            <span className="text-4xl md:text-5xl">{groom}</span>
            <span className="text-2xl text-gold/50 italic mx-4">&</span>
            <span className="text-4xl md:text-5xl">{bride}</span>
          </h3>
          <p className="font-body text-xs text-white/30 mt-4 tracking-[0.25em] uppercase">
            {formattedDate}
          </p>

          <p className="font-body text-xs text-white/15 mt-16 tracking-wide">
            Dibuat dengan ♡ menggunakan teknologi digital
          </p>
        </AnimatedSection>
      </div>
    </footer>
  )
}
