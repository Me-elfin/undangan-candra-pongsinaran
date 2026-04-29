import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PhotoLightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (currentIndex === null) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentIndex, onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {currentIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3 }}
            src={photos[currentIndex]?.image_url}
            alt={photos[currentIndex]?.caption || ''}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute top-5 right-5 text-white/50 hover:text-white text-2xl w-10 h-10 flex items-center justify-center"
            onClick={onClose}
          >✕</button>

          {currentIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold text-4xl w-12 h-12 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); onPrev() }}
            >‹</button>
          )}
          {currentIndex < photos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold text-4xl w-12 h-12 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); onNext() }}
            >›</button>
          )}

          {photos[currentIndex]?.caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-display italic text-lg">
              {photos[currentIndex].caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
