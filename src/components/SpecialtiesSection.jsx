import useScrollReveal from '../hooks/useScrollReveal'

const dishes = [
  {
    name: 'Margherita',
    badge: 'Clásica',
    price: '€9.50',
    desc: 'Tomate, mozzarella, aceite de oliva y albahaca fresca',
    img: '/assets/margherita-close.jpg',
    alt: 'Pizza Margherita napolitana con mozzarella fresca y albahaca',
  },
  {
    name: 'Mortazza',
    badge: 'Favorita',
    price: '€15.50',
    desc: 'Base blanca, mozzarella, mortadella, ricotta y pesto de pistacho',
    img: '/assets/mortazza.jpg',
    alt: 'Pizza Mortazza con mortadella, ricotta y pesto de pistacho',
  },
  {
    name: 'Stracciatella',
    badge: 'Fresca',
    price: '€14.50',
    desc: 'Base blanca, tomate cherry, pesto de albahaca y corazones de burrata',
    img: '/assets/stracciatella.jpg',
    alt: 'Pizza Stracciatella con burrata, tomate cherry y pesto de albahaca',
  },
  {
    name: 'Del Horno',
    badge: 'Espectáculo',
    price: '€13.50',
    desc: 'Directa del horno de leña a tu mesa. Masa napolitana de 48 horas',
    img: '/assets/pizza-oven.jpg',
    alt: 'Pizza napolitana recién salida del horno de leña de Picnic',
  },
  {
    name: 'Carbonara',
    badge: 'Pasta',
    price: '€14.50',
    desc: 'Yema de huevo, pecorino, parmesano y guanciale crujiente',
    img: '/assets/carbonara.jpg',
    alt: 'Espaguetis carbonara con guanciale crujiente y parmesano',
  },
  {
    name: 'Torta Pistacho',
    badge: 'Postre',
    price: '€6.00',
    desc: 'Bizcocho de cacao con crema de ricotta y pistacho',
    img: '/assets/torta-pistacho.jpg',
    alt: 'Torta de pistacho con crema de ricotta, postre de la casa',
  },
]

export default function SpecialtiesSection() {
  const headRef = useScrollReveal()

  return (
    <section id="especialidades" className="bg-black py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} className="reveal text-center mb-16">
          <p className="font-body text-rust text-xs tracking-[0.3em] uppercase mb-4">Especialidades</p>
          <h2 className="font-display font-bold text-cream text-4xl md:text-5xl leading-tight mb-4">
            Cada plato,<br />
            <span className="italic font-normal text-cream/70">un pedazo de Nápoles</span>
          </h2>
          <p className="font-body font-light text-cream/50 text-sm tracking-wide">
            Elaborados con ingredientes frescos y mucho cariño
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {dishes.map((d, i) => (
            <DishCard key={d.name} dish={d} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DishCard({ dish, delay }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className="reveal bg-[#0f0f0f] border border-white/[0.06] group relative overflow-hidden cursor-default"
      style={{ transitionDelay: `${delay}ms` }}>

      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={dish.img}
          alt={dish.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, rgba(201,74,26,0.08) 100%)' }} />

      <div className="p-6 relative z-10 group-hover:-translate-y-0.5 transition-transform duration-500">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display font-bold text-cream text-xl group-hover:text-rust transition-colors duration-300">
            {dish.name}
          </h3>
          <span className="font-body text-xs text-rust/70 border border-rust/30 px-2.5 py-1 rounded-full tracking-wide shrink-0 ml-2">
            {dish.badge}
          </span>
        </div>
        <p className="font-body font-light text-cream/50 text-sm leading-relaxed mb-4">{dish.desc}</p>
        <p className="font-body font-semibold text-rust text-2xl">{dish.price}</p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-px bg-rust group-hover:w-full transition-all duration-500" />
    </div>
  )
}
