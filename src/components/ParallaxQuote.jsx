import { useEffect, useRef, useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

export default function ParallaxQuote() {
  const ref = useScrollReveal()
  const sectionRef = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      setOffset(el.getBoundingClientRect().top * 0.3)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src="/assets/italian-street.jpg"
          alt="Calle italiana de noche con farolillos y adoquines, ambiente napolitano"
          className="w-full h-full object-cover"
          style={{ transform: `translateY(${offset}px) scale(1.15)`, willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      </div>

      <div ref={ref} className="reveal relative z-10 text-center px-5 max-w-4xl mx-auto">
        <div className="w-px h-16 bg-rust/60 mx-auto mb-8" />
        <blockquote
          className="font-display font-black italic text-cream leading-tight mb-8"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
        >
          "Siempre hay una pizza<br />esperándote."
        </blockquote>
        <cite className="font-body font-light text-cream/50 text-sm tracking-[0.3em] uppercase not-italic">
          — Picnic Trattoria Napoletana
        </cite>
        <div className="w-px h-16 bg-rust/60 mx-auto mt-8" />
      </div>
    </section>
  )
}
