const items = ['⭐ 4.6 · 200+ reseñas', '· @picnic.laspalmas ·', '· Pizza Napoletana ·', '· Las Palmas de GC ·', '⭐ 4.6 · 200+ reseñas', '· @picnic.laspalmas ·', '· Pizza Napoletana ·', '· Las Palmas de GC ·']

export default function MarqueeStrip() {
  return (
    <div className="bg-dark border-y border-white/5 py-3 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.concat(items).map((item, i) => (
          <span key={i} className="font-body text-xs text-cream/50 tracking-widest uppercase mx-8 shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
