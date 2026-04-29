import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'

function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

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

          <div className="flex items-center justify-center gap-2 mt-16">
            <a
              href="https://www.instagram.com/lekomese/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-xs text-white/20 hover:text-gold/50 transition-colors duration-300 tracking-wide"
            >
              <InstagramIcon size={14} />
              <span>Dibuat oleh @lekomese_studio</span>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  )
}
