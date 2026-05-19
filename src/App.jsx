import { useState } from 'react'
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

export default function App() {
  const [heroProgress, setHeroProgress] = useState(0)

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
    </div>
  )
}
