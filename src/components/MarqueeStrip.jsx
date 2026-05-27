import { useLang } from '../i18n'

export default function MarqueeStrip() {
  const { t } = useLang()
  const base = t.marquee
  const items = [...base, ...base, ...base, ...base, ...base, ...base]

  return (
    <div className="bg-dark border-y border-white/5 py-3 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((item, i) => (
          <span key={i} className="font-body text-xs text-cream tracking-widest uppercase mx-8 shrink-0 flex items-center gap-1">
            {i % base.length === 0
              ? <><span className="text-rust">✦</span> {item}</>
              : item}
          </span>
        ))}
      </div>
    </div>
  )
}
