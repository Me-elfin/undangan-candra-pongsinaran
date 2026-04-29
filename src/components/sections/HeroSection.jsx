import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection({ config, onOpen }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const heroImage = config?.heroImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'
  const groomName = config?.couple?.groom?.nickname || 'Candra'
  const brideName = config?.couple?.bride?.nickname || 'Pongsinaran'
  const eventDate = config?.event?.resepsi?.date || '2026-12-12'

  const formattedDate = new Date(eventDate + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* Parallax Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <div
          className="w-full h-[120%] bg-center bg-cover"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/75" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body text-xs tracking-[0.4em] uppercase text-gold/80 mb-8"
        >
          Undangan Pernikahan
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="font-display font-light text-white leading-none"
        >
          <span className="text-5xl md:text-7xl lg:text-8xl block">{groomName}</span>
          <span className="text-2xl md:text-3xl text-gold/70 italic block my-4">&</span>
          <span className="text-5xl md:text-7xl lg:text-8xl block">{brideName}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center justify-center gap-4 mt-8 mb-10"
        >
          <div className="w-10 h-px bg-gold/50" />
          <p className="font-body text-xs text-white/60 tracking-[0.25em] uppercase">{formattedDate}</p>
          <div className="w-10 h-px bg-gold/50" />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          onClick={onOpen}
          className="inline-flex items-center gap-3 px-10 py-3.5 border border-white/40 text-white font-body text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-charcoal transition-all duration-400 cursor-pointer"
        >
          Buka Undangan
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border border-white/25 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
