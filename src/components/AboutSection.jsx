import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n'

const ICONS = ['flame-outline', 'leaf-outline', 'heart-outline']

export default function AboutSection() {
  const { t } = useLang()
  const { label, title, titleItalic, body, pillars } = t.about
  const imgRef = useScrollReveal()
  const img2Ref = useScrollReveal()
  const textRef = useScrollReveal()

  return (
    <section id="nosotros" className="bg-cream py-24 md:py-32 px-5 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div ref={imgRef} className="reveal from-left">
          <div className="relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl -rotate-1">
              <img
                src="/assets/interior-warm.jpg"
                alt="Salón principal de Picnic Trattoria, ambiente cálido napolitano"
                className="w-full h-full object-cover"
              />
            </div>
            <div ref={img2Ref} className="reveal from-left absolute -bottom-8 -right-6 w-2/3 aspect-[4/3] rounded-sm overflow-hidden shadow-xl rotate-2 border-4 border-cream">
              <img
                src="/assets/ingredientes.jpg"
                alt="Ingredientes italianos frescos: tomate, mozzarella, albahaca y aceite de oliva"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-1/3 h-1/3 bg-rust/10 rounded-sm -z-10" />
          </div>
        </div>

        <div ref={textRef} className="reveal from-right">
          <p className="font-body text-rust text-xs tracking-[0.3em] uppercase mb-4">{label}</p>
          <h2 className="font-display font-bold text-dark text-4xl md:text-5xl leading-tight mb-6">
            {title}<br />
            <span className="italic font-normal">{titleItalic}</span>
          </h2>
          <p className="font-body font-light text-dark/70 text-base leading-relaxed mb-10">{body}</p>

          <div className="grid grid-cols-1 gap-6">
            {pillars.map((p, i) => (
              <div key={p.title} className="flex items-start gap-4">
                <ion-icon name={ICONS[i]} style={{ fontSize: '1.5rem', color: '#c94a1a', flexShrink: 0, marginTop: '2px' }}></ion-icon>
                <div>
                  <p className="font-body font-semibold text-dark text-sm mb-1">{p.title}</p>
                  <p className="font-body font-light text-dark/60 text-sm">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="aspect-[3/2] rounded-sm overflow-hidden shadow-lg">
            <img src="/assets/interior-arch.jpg" alt="Interior de Picnic Trattoria con arco de piedra y mesas con velas" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="aspect-[3/2] rounded-sm overflow-hidden shadow-lg">
            <img src="/assets/interior-wine.jpg" alt="Bodega y bodeguero de Picnic con selección de vinos italianos" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>
  )
}
