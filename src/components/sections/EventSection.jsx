import AnimatedSection from '../ui/AnimatedSection'
import CountdownTimer from '../ui/CountdownTimer'
import GoldDivider from '../ui/GoldDivider'

function EventCard({ title, event, delay }) {
  if (!event) return null

  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <AnimatedSection variant="scale" delay={delay}>
      <div className="card-ivory text-center h-full flex flex-col items-center">
        <div className="w-10 h-10 border border-gold/40 rotate-45 flex items-center justify-center mb-8">
          <div className="w-2.5 h-2.5 bg-gold/60 rotate-0" />
        </div>
        <h3 className="font-display text-3xl font-light text-charcoal mb-1">{title}</h3>
        <GoldDivider className="w-32" />
        <p className="font-body text-sm text-muted leading-loose">{formattedDate}</p>
        <p className="font-display text-2xl text-gold font-light mt-1">{event.time} WIB</p>
        <p className="font-body text-sm font-medium text-charcoal mt-5">{event.venue}</p>
        <p className="font-body text-xs text-muted mt-1 leading-relaxed max-w-xs">{event.address}</p>
        {event.mapsUrl && (
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-8 text-xs"
          >
            Lihat di Google Maps
          </a>
        )}
      </div>
    </AnimatedSection>
  )
}

export default function EventSection({ config }) {
  const akad = config?.event?.akad
  const resepsi = config?.event?.resepsi
  const countdownDate =
    resepsi?.date
      ? `${resepsi.date}T${resepsi.time || '09:00'}:00`
      : '2026-12-12T09:00:00'

  return (
    <section className="py-24 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="section-subtitle mb-4">Waktu & Tempat</p>
          <h2 className="section-title">Detail Acara</h2>
          <GoldDivider className="max-w-xs mx-auto" />
        </AnimatedSection>

        <AnimatedSection className="mb-20 text-center" delay={0.1}>
          <p className="section-subtitle mb-8">Menuju Hari Bahagia</p>
          <CountdownTimer targetDate={countdownDate} />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          <EventCard title="Pemberkatan" event={akad} delay={0} />
          <EventCard title="Resepsi" event={resepsi} delay={0.15} />
        </div>
      </div>
    </section>
  )
}
