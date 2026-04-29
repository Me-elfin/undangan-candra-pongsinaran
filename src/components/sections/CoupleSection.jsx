import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'

function PersonCard({ person, variant, childLabel = "Putra/Putri dari" }) {
  return (
    <AnimatedSection variant={variant} className="text-center flex-1">
      <div className="relative inline-block mb-8">
        <img
          src={person.photoUrl || ''}
          alt={person.fullName}
          className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-full mx-auto"
          style={{ boxShadow: '0 0 0 4px rgba(44,44,44,0.8), 0 0 0 8px rgba(201,168,76,0.35)' }}
        />
      </div>
      <h3 className="font-display text-4xl md:text-5xl font-light text-white">
        {person.nickname || person.fullName}
      </h3>
      <p className="font-body text-[16.6px] text-white/50 mt-1 tracking-wide">{person.fullName}</p>
      <GoldDivider className="max-w-[180px] mx-auto" />
      <p className="font-body text-sm text-white/40">{childLabel}</p>
      <p className="font-body text-sm text-white/70 mt-1 leading-relaxed">
        {person.fatherName}
        <br />
        <span className="text-white/30 text-xs">&</span>
        <br />
        {person.motherName}
      </p>
    </AnimatedSection>
  )
}

export default function CoupleSection({ config }) {
  const groom = config?.couple?.groom || {}
  const bride = config?.couple?.bride || {}

  return (
    <section className="relative z-20 -mt-[100svh] md:mt-0 py-24 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold/60 mb-4">Mempelai</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-white">Kedua Insan</h2>
          <GoldDivider className="max-w-xs mx-auto" />
        </AnimatedSection>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 lg:gap-16">
          <PersonCard person={groom} variant="slide-left" childLabel="Putra dari" />

          <div className="flex-shrink-0 text-center hidden md:block">
            <span className="font-display text-7xl text-gold/30 font-light leading-none">&</span>
          </div>

          <PersonCard person={bride} variant="slide-right" childLabel="Putri dari" />
        </div>
      </div>
    </section>
  )
}
