import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'

export default function MusicToggle({ musicUrl }) {
  const audioRef = useRef(null)
  const { isMusicPlaying, setMusicPlaying } = useStore()

  useEffect(() => {
    if (!musicUrl) return
    const audio = new Audio(musicUrl)
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [musicUrl])

  function toggle() {
    if (!audioRef.current) return
    if (isMusicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setMusicPlaying(true)
    }
  }

  if (!musicUrl) return null

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-ivory border border-gold/40 shadow-lg
                 flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-300 text-gold"
      title={isMusicPlaying ? 'Matikan Musik' : 'Putar Musik'}
    >
      {isMusicPlaying ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  )
}
