import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import useStore from '../../store/useStore'

export default function MusicToggle({ musicUrl, autoPlay = false }) {
  const audioRef = useRef(null)
  const { isMusicPlaying, setMusicPlaying } = useStore()
  const [volume, setVolume] = useState(0.4)
  const [showSlider, setShowSlider] = useState(false)
  const sliderRef = useRef(null)
  const hasAutoPlayed = useRef(false)

  useEffect(() => {
    if (!musicUrl) return
    const audio = new Audio(musicUrl)
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [musicUrl])

  // Auto-play when triggered (e.g. after "Buka Undangan" click)
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed.current && audioRef.current) {
      hasAutoPlayed.current = true
      audioRef.current.play().then(() => {
        setMusicPlaying(true)
      }).catch(() => {
        // Browser blocked autoplay — user will need to click Play manually
      })
    }
  }, [autoPlay])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Pause saat tab tidak aktif, lanjut saat kembali
  useEffect(() => {
    function handleVisibilityChange() {
      if (!audioRef.current) return
      if (document.hidden) {
        audioRef.current.pause()
      } else if (isMusicPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isMusicPlaying])

  // Close slider when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        setShowSlider(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function togglePlay() {
    if (!audioRef.current) return
    if (isMusicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setMusicPlaying(true)
    }
  }

  function toggleSlider() {
    setShowSlider(!showSlider)
  }

  if (!musicUrl) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3" ref={sliderRef}>
      {/* Volume Control */}
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {showSlider && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-14 sm:bottom-auto sm:right-14 sm:top-1/2 sm:-translate-y-1/2 
                         bg-ivory border border-gold/40 shadow-lg rounded-full 
                         flex items-center justify-center
                         w-10 h-32 sm:w-32 sm:h-10"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-gold/30 rounded-lg appearance-none cursor-pointer 
                           accent-gold absolute origin-center -rotate-90 sm:rotate-0"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={toggleSlider}
          className="w-12 h-12 bg-ivory border border-gold/40 shadow-lg rounded-full
                     flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-300 text-gold"
          title="Atur Volume"
        >
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Play/Pause Control */}
      <button
        onClick={togglePlay}
        className="w-12 h-12 bg-ivory border border-gold/40 shadow-lg rounded-full
                   flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-300 text-gold"
        title={isMusicPlaying ? 'Matikan Musik' : 'Putar Musik'}
      >
        {isMusicPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  )
}
