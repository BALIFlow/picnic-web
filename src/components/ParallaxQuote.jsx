import useScrollReveal from '../hooks/useScrollReveal'

export default function ParallaxQuote() {
  const ref = useScrollReveal()
  return (
    <section className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center">
      {/* Full-bleed background image — italian street at night */}
      <div className="absolute inset-0">
        <img
          src="/assets/italian-street.jpg"
          alt="Calle italiana de noche con farolillos y adoquines, ambiente napolitano"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      </div>

      <div ref={ref} className="reveal relative z-10 text-center px-5 max-w-4xl mx-auto">
        <div className="w-px h-16 bg-rust/60 mx-auto mb-8" />
        <blockquote className="font-display font-black italic text-cream text-4xl md:text-6xl lg:text-7xl leading-tight mb-8">
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
