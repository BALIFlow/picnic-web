import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n'

export default function MenuSection() {
  const { t } = useLang()
  const { label, title, tabs, items } = t.menu
  const [activeIdx, setActiveIdx] = useState(0)
  const headRef = useScrollReveal()
  const activeTab = tabs[activeIdx]

  return (
    <section id="carta" className="bg-cream py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div ref={headRef} className="reveal text-center mb-12">
          <p className="font-body text-rust text-xs tracking-[0.3em] uppercase mb-4">{label}</p>
          <h2 className="font-display font-bold text-dark text-4xl md:text-5xl">{title}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-1 mb-12 border-b border-dark/10 pb-0">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveIdx(i)}
              className={`font-body text-sm px-5 py-3 border-b-2 transition-all duration-300 -mb-px ${
                activeIdx === i
                  ? 'text-rust border-rust font-medium'
                  : 'text-dark/40 border-transparent hover:text-dark/70'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {(items[activeTab] || []).map(item => (
            <div key={item.name}
              className="flex items-start justify-between gap-4 py-5 px-2 border-b border-dark/8 group hover:bg-rust/3 transition-colors duration-200 rounded-sm">
              <div>
                <p className="font-display font-medium text-dark text-base mb-1 group-hover:text-rust transition-colors duration-200">{item.name}</p>
                <p className="font-body font-light text-dark/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
              <p className="font-body font-semibold text-rust text-sm shrink-0 mt-0.5">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
