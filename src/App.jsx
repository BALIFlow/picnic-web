import { useState } from 'react'
import { LangProvider } from './i18n'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MarqueeStrip from './components/MarqueeStrip'
import AboutSection from './components/AboutSection'
import SpecialtiesSection from './components/SpecialtiesSection'
import ParallaxQuote from './components/ParallaxQuote'
import MenuSection from './components/MenuSection'
import GallerySection from './components/GallerySection'
import ReservasSection from './components/ReservasSection'
import Footer from './components/Footer'
import { useLang } from './i18n'

function AppInner() {
  const [heroProgress, setHeroProgress] = useState(0)
  const heroComplete = heroProgress >= 0.99
  const { t } = useLang()

  return (
    <div className="bg-black text-cream font-body">
      <Navbar heroProgress={heroProgress} />
      <HeroSection onProgressChange={setHeroProgress} />
      <MarqueeStrip />
      <AboutSection />
      <SpecialtiesSection />
      <ParallaxQuote />
      <MenuSection />
      <GallerySection />
      <ReservasSection />
      <Footer />

      {heroComplete && (
        <a
          href="#reservas"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5
                     bg-rust text-cream text-sm font-body font-medium px-6 py-3.5 rounded-full
                     shadow-2xl shadow-rust/30 md:hidden active:scale-95 transition-all duration-300"
          style={{ whiteSpace: 'nowrap' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse flex-shrink-0" />
          {t.mobileCta}
        </a>
      )}
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  )
}
