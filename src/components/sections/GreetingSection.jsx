import { useSearchParams } from 'react-router-dom'
import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'

export default function GreetingSection() {
  const [searchParams] = useSearchParams()
  const guestName = searchParams.get('to') || ''

  return (
    <section className="py-24 px-6 bg-cream text-center">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection variant="fade-up">
          <p className="section-subtitle mb-5">Kepada Yang Terhormat</p>
          {guestName && (
            <p className="font-display text-3xl md:text-5xl font-light text-charcoal mb-1 mt-3">
              {decodeURIComponent(guestName)}
            </p>
          )}
          <GoldDivider className="max-w-xs mx-auto" />
          <p className="font-body text-base md:text-lg text-muted leading-relaxed mt-2">
            Dengan penuh sukacita dan rasa syukur kepada Tuhan Yang Maha Kasih,
            kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan
            doa restu pada hari pernikahan kami.
          </p>
          <p className="font-body text-base text-muted leading-relaxed mt-5">
            Kehadiran dan doa Anda adalah kebahagiaan terbesar bagi kami
            dan seluruh keluarga.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
