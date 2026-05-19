import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const menu = {
  Pizzas: [
    { name: 'Margherita', price: '€9.50', desc: 'Tomate, mozzarella, aceite de oliva y albahaca' },
    { name: 'Mortazza', price: '€15.50', desc: 'Base blanca, mozzarella, mortadella, ricotta, pesto de pistacho' },
    { name: 'Stracciatella', price: '€14.50', desc: 'Base blanca, tomate cherry, pesto de albahaca, burrata' },
    { name: 'Pizza Picnic', price: '€13.50', desc: 'Salsa boloñesa, ricotta, jamón cocido, mozzarella' },
    { name: 'Diavola', price: '€12.50', desc: 'Tomate, mozzarella, salame piccante y aceitunas negras' },
    { name: 'Quattro Formaggi', price: '€14.00', desc: 'Mozzarella, gorgonzola, parmesano y provolone' },
  ],
  Primeros: [
    { name: 'Burrata y bresaola', price: '€12.50', desc: 'Burrata fresca, bresaola, rúcula y reducción de balsámico' },
    { name: 'Caprese', price: '€10.00', desc: 'Tomate, mozzarella di bufala, albahaca y aceite de oliva virgen extra' },
    { name: 'Bruschetta al pomodoro', price: '€7.50', desc: 'Pan tostado, tomate fresco, ajo y albahaca' },
    { name: 'Tabla de embutidos', price: '€14.00', desc: 'Mortadella, bresaola, prosciutto y grisines artesanos' },
  ],
  Ensaladas: [
    { name: 'Ensalada César', price: '€10.00', desc: 'Lechuga romana, parmesano, picatostes y aderezo César casero' },
    { name: 'Rúcula y parmesano', price: '€9.00', desc: 'Rúcula fresca, lascas de parmesano y vinagreta de limón' },
    { name: 'Caprese de burrata', price: '€11.00', desc: 'Burrata entera, tomate cherry, albahaca y AOVE' },
  ],
  Postres: [
    { name: 'Torta pistacho', price: '€6.00', desc: 'Bizcocho de cacao con crema de ricotta y pistacho' },
    { name: 'Tiramisú della casa', price: '€6.50', desc: 'Tiramisú clásico con mascarpone y café espresso' },
    { name: 'Panna cotta', price: '€5.50', desc: 'Panna cotta con coulis de frutos rojos' },
  ],
  Bebidas: [
    { name: 'Agua mineral', price: '€2.00', desc: 'Con o sin gas, 500ml' },
    { name: 'Refrescos', price: '€2.50', desc: 'Coca-Cola, Fanta, agua tónica' },
    { name: 'Vino de la casa', price: '€3.50/copa', desc: 'Tinto o blanco, selección del chef' },
    { name: 'Cerveza artesana', price: '€4.00', desc: 'Selección rotativa de cervezas locales' },
    { name: 'Aperol Spritz', price: '€7.00', desc: 'Aperol, prosecco, naranja y soda' },
  ],
}

const tabs = Object.keys(menu)

export default function MenuSection() {
  const [active, setActive] = useState('Pizzas')
  const headRef = useScrollReveal()

  return (
    <section id="carta" className="bg-cream py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div ref={headRef} className="reveal text-center mb-12">
          <p className="font-body text-rust text-xs tracking-[0.3em] uppercase mb-4">La carta</p>
          <h2 className="font-display font-bold text-dark text-4xl md:text-5xl">Nuestro menú</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-1 mb-12 border-b border-dark/10 pb-0">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActive(tab)}
              className={`font-body text-sm px-5 py-3 border-b-2 transition-all duration-300 -mb-px ${
                active === tab
                  ? 'text-rust border-rust font-medium'
                  : 'text-dark/40 border-transparent hover:text-dark/70'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="grid md:grid-cols-2 gap-0">
          {menu[active].map((item, i) => (
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
