import { useState, useRef } from 'react'
import { useSupabaseConfig } from '../hooks/useSupabaseConfig'
import HeroSection from '../components/sections/HeroSection'
import GreetingSection from '../components/sections/GreetingSection'
import CoupleSection from '../components/sections/CoupleSection'
import EventSection from '../components/sections/EventSection'
import GallerySection from '../components/sections/GallerySection'
import RSVPSection from '../components/sections/RSVPSection'
import CommentSection from '../components/sections/CommentSection'
import GiftSection from '../components/sections/GiftSection'
import ShareSection from '../components/sections/ShareSection'
import ClosingSection from '../components/sections/ClosingSection'
import MusicToggle from '../components/ui/MusicToggle'

export default function InvitePage() {
  const { config } = useSupabaseConfig()
  const [opened, setOpened] = useState(false)
  const contentRef = useRef(null)

  // Always use local music file as fallback — Supabase config can override with a different URL
  const musicUrl = (config?.music?.enabled && config?.music?.url) || '/Music.mp3'

  // Custom ease-in-out scroll animation
  function smoothScrollTo(element, duration) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    let startTime = null

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      // Ease in out quartic
      let t = timeElapsed / (duration / 2)
      let run = 0
      if (t < 1) {
        run = (distance / 2) * t * t * t * t + startPosition
      } else {
        t -= 2
        run = (-distance / 2) * (t * t * t * t - 2) + startPosition
      }
      
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    requestAnimationFrame(animation)
  }

  function handleOpen() {
    setOpened(true)
    setTimeout(() => {
      if (contentRef.current) {
        smoothScrollTo(contentRef.current, 1500) // 1.5 detik
      }
    }, 50)
  }

  return (
    <div className="min-h-screen">
      <HeroSection config={config} onOpen={handleOpen} />

      {opened && (
        <div ref={contentRef}>
          <GreetingSection />
          <CoupleSection config={config} />
          <EventSection config={config} />
          <GallerySection />
          <RSVPSection config={config} />
          <CommentSection />
          <GiftSection />
          <ShareSection />
          <ClosingSection config={config} />
        </div>
      )}

      <MusicToggle musicUrl={musicUrl} autoPlay={opened} />
    </div>
  )
}
