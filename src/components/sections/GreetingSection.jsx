import { useSearchParams } from 'react-router-dom'
import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'

const GREETING_TEXT =
  'Dengan penuh sukacita dan rasa syukur kepada Tuhan Yang Maha Esa, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi bagian dari momen bahagia pernikahan kami, serta memberikan doa restu.'

export default function GreetingSection() {
  const [searchParams] = useSearchParams()
  const guestName = searchParams.get('to') || ''

  return (
    <>
      {/* Mobile: zona parallax 200svh — BG sticky 100svh, teks 100svh teratas, sisa 100svh adalah ruang transisi untuk CoupleSection naik */}
      <section className="md:hidden relative" style={{ height: '200svh' }}>

        {/* BG sticky — diam selama 100svh pertama, lalu ikut terangkat saat container habis */}
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: '100svh' }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/BgGreetingSection.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Teks — absolute di 100svh teratas section, scroll naik bersama section */}
        <div
          className="absolute inset-x-0 top-0 z-10 flex items-start justify-center px-8 text-center"
          style={{ height: '100svh' }}
        >
          <div className="max-w-sm mx-auto pt-16">
            <AnimatedSection variant="fade-up">
              <p className="font-body text-base font-bold tracking-[0.3em] uppercase mb-5" style={{ color: '#1F1A09' }}>
                Kepada Yang Terhormat
              </p>
              {guestName && (
                <p className="font-display text-4xl font-light mb-1 mt-3" style={{ color: '#1F1A09' }}>
                  {decodeURIComponent(guestName)}
                </p>
              )}
              <GoldDivider className="max-w-xs mx-auto" />
              <p className="font-body text-base leading-relaxed mt-2" style={{ color: '#1F1A09' }}>
                {GREETING_TEXT}
              </p>
            </AnimatedSection>
          </div>
        </div>

      </section>

      {/* Desktop: layout lama */}
      <section className="hidden md:block py-24 px-6 bg-cream text-center">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection variant="fade-up">
            <p className="font-body text-base font-bold tracking-[0.3em] uppercase text-muted mb-5">Kepada Yang Terhormat</p>
            {guestName && (
              <p className="font-display text-3xl md:text-5xl font-light text-charcoal mb-1 mt-3">
                {decodeURIComponent(guestName)}
              </p>
            )}
            <GoldDivider className="max-w-xs mx-auto" />
            <p className="font-body text-base md:text-lg text-muted leading-relaxed mt-2">
              {GREETING_TEXT}
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
