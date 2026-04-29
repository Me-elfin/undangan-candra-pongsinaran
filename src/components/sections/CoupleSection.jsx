import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'

function PersonCard({ person, variant }) {
  return (
    <AnimatedSection variant={variant} className="text-center flex-1">
      <div className="relative inline-block mb-8">
        <img
          src={person.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}
          alt={person.fullName}
          className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-full mx-auto"
          style={{ boxShadow: '0 0 0 4px #F2EDE3, 0 0 0 6px rgba(201,168,76,0.3)' }}
        />
      </div>
      <h3 className="font-display text-4xl md:text-5xl font-light text-charcoal">
        {person.nickname || person.fullName}
      </h3>
      <p className="font-body text-sm text-muted mt-1 tracking-wide">{person.fullName}</p>
      <GoldDivider className="max-w-[180px] mx-auto" />
      <p className="font-body text-sm text-muted">Putra/Putri dari</p>
      <p className="font-body text-sm text-charcoal mt-1 leading-relaxed">
        {person.fatherName}
        <br />
        <span className="text-muted text-xs">&</span>
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
    <section className="py-24 px-6 bg-ivory">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="section-subtitle mb-4">Mempelai</p>
          <h2 className="section-title">Kedua Insan</h2>
          <GoldDivider className="max-w-xs mx-auto" />
        </AnimatedSection>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 lg:gap-16">
          <PersonCard person={groom} variant="slide-left" />

          <div className="flex-shrink-0 text-center hidden md:block">
            <span className="font-display text-7xl text-gold/20 font-light leading-none">&</span>
          </div>

          <PersonCard person={bride} variant="slide-right" />
        </div>
      </div>
    </section>
  )
}
