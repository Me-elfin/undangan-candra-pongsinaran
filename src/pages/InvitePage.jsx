import { useState } from 'react'
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

  const musicUrl = config?.music?.enabled ? config?.music?.url : ''

  return (
    <div className="min-h-screen">
      <HeroSection config={config} onOpen={() => setOpened(true)} />

      {opened && (
        <>
          <GreetingSection />
          <CoupleSection config={config} />
          <EventSection config={config} />
          <GallerySection />
          <RSVPSection config={config} />
          <CommentSection />
          <GiftSection />
          <ShareSection />
          <ClosingSection config={config} />
        </>
      )}

      <MusicToggle musicUrl={musicUrl} />
    </div>
  )
}
