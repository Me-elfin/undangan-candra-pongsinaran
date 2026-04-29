import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'
import PhotoLightbox from '../ui/PhotoLightbox'
import { supabase } from '../../lib/supabase'

const FALLBACK_PHOTOS = [
  { id: 1, image_url: '/gallery-DSC_4304.jpg', caption: '' },
  { id: 2, image_url: '/gallery-DSC_4397.jpg', caption: '' },
  { id: 3, image_url: '/gallery-DSC_4402.jpg', caption: '' },
  { id: 4, image_url: '/gallery-DSC_4465.jpg', caption: '' },
  { id: 5, image_url: '/gallery-DSC_4487.jpg', caption: '' },
  { id: 6, image_url: '/gallery-DSC_4541.jpg', caption: '' },
  { id: 7, image_url: '/gallery-DSC_4554.jpg', caption: '' },
  { id: 8, image_url: '/gallery-DSC_4595.jpg', caption: '' },
  { id: 9, image_url: '/gallery-DSC_4605.jpg', caption: '' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function GallerySection() {
  const [photos, setPhotos] = useState(FALLBACK_PHOTOS)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setPhotos(data)
      })
  }, [])

  return (
    <section className="py-24 px-6 bg-ivory">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <p className="section-subtitle mb-4">Kenangan Bersama</p>
          <h2 className="section-title">Galeri Foto</h2>
          <GoldDivider className="max-w-xs mx-auto" />
        </AnimatedSection>

        {/* Mobile Collage Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:hidden grid-cols-2 gap-2"
        >
          {[
            { src: '/mobile-gallery/gambar 1.jpg', index: 0, className: 'col-span-2 aspect-[2/1]' },
            { src: '/mobile-gallery/gambar 2.jpg', index: 1, className: 'col-span-1 row-span-2 h-full' },
            { src: '/mobile-gallery/gambar 3.jpg', index: 2, className: 'col-span-1 aspect-square' },
            { src: '/mobile-gallery/gambar 4.jpg', index: 3, className: 'col-span-1 aspect-square' },
            { src: '/mobile-gallery/gambar 6.jpg', index: 5, className: 'col-span-1 aspect-square' },
            { src: '/mobile-gallery/gambar 7.jpg', index: 6, className: 'col-span-1 aspect-square' },
            { src: '/mobile-gallery/gambar 5.jpg', index: 4, className: 'col-span-2 aspect-[2/1]' },
            { src: '/mobile-gallery/gambar 8.jpg', index: 7, className: 'col-span-1 aspect-square' },
            { src: '/mobile-gallery/gambar 9.jpg', index: 8, className: 'col-span-1 aspect-square' },
          ].map((item, i) => (
            <motion.div
              key={`mobile-${i}`}
              variants={itemVariants}
              className={`relative overflow-hidden cursor-pointer group ${item.className}`}
              onClick={() => setLightboxIndex(item.index)}
            >
              <img
                src={item.src}
                alt={`Mobile Gallery ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/25 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/60 w-10 h-10 flex items-center justify-center text-white/80 text-xl">
                  +
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="hidden md:grid md:grid-cols-3 gap-3"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              variants={itemVariants}
              className="relative aspect-square overflow-hidden cursor-pointer group"
              onClick={() => setLightboxIndex(index)}
            >
              <img
                src={photo.image_url}
                alt={photo.caption || `Foto ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/25 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/60 w-10 h-10 flex items-center justify-center text-white/80 text-xl">
                  +
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <PhotoLightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => Math.max(0, i - 1))}
        onNext={() => setLightboxIndex((i) => Math.min(photos.length - 1, i + 1))}
      />
    </section>
  )
}
