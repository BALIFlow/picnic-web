import { createContext, useContext, useState, useEffect } from 'react'

export const translations = {
  es: {
    nav: {
      links: ['Inicio', 'Especialidades', 'Carta', 'Galería', 'Reservas'],
      cta: 'Reservar mesa',
    },
    hero: {
      tagline: 'Trattoria Napoletana · Las Palmas de Gran Canaria',
      title: 'Benvenuto',
      subtitle: 'a Napoli',
      divider: 'en el corazón de Las Palmas',
      cta1: 'Reservar mesa',
      cta2: 'Ver carta',
      pill: 'Reservar mesa →',
      intro: 'Una pizza napolitana empieza aquí',
      phrases: [
        { line1: 'Todo empieza',          line2: 'con la masa.' },
        { line1: 'Amasada a mano,',       line2: 'con cariño.' },
        { line1: 'Nuestra salsa',         line2: 'de Nápoles.' },
        { line1: 'El toque secreto:',     line2: 'mozzarella fresca.' },
        { line1: 'Ingredientes frescos',  line2: 'y de primera calidad.' },
        { line1: 'El fuego',              line2: 'hace la magia.' },
        { line1: 'Lista.',                line2: 'Te está esperando.' },
      ],
    },
    marquee: [
      '4.6 · 200+ reseñas',
      '· @picnic.laspalmas ·',
      '· Pizza Napoletana ·',
      '· Las Palmas de Gran Canaria ·',
    ],
    about: {
      label: 'Nuestra historia',
      title: 'Una trattoria napolitana',
      titleItalic: 'con alma',
      body: 'Picnic nació del amor por Nápoles y por la buena mesa. Cada pizza que sale de nuestro horno de leña es un pedazo de Italia en el corazón de Las Palmas. A dos pasos de Triana, te esperamos como si fueras de casa.',
      pillars: [
        { title: 'Horno de leña',       desc: 'Masa napolitana de 48h de fermentación lenta' },
        { title: 'Ingredientes frescos', desc: 'Importados directamente de Italia con cariño' },
        { title: 'Con alma',            desc: 'Cada plato hecho con amor y mucho orégano' },
      ],
    },
    specialties: {
      label: 'Especialidades',
      title: 'Cada plato,',
      titleItalic: 'un pedazo de Nápoles',
      subtitle: 'Elaborados con ingredientes frescos y mucho cariño',
      dishes: [
        { name: 'Margherita',    badge: 'Clásica',     price: '€9.50',  desc: 'Tomate, mozzarella, aceite de oliva y albahaca fresca' },
        { name: 'Mortazza',      badge: 'Favorita',    price: '€15.50', desc: 'Base blanca, mozzarella, mortadella, ricotta y pesto de pistacho' },
        { name: 'Stracciatella', badge: 'Fresca',      price: '€14.50', desc: 'Base blanca, tomate cherry, pesto de albahaca y corazones de burrata' },
        { name: 'Del Horno',     badge: 'Espectáculo', price: '€13.50', desc: 'Directa del horno de leña a tu mesa. Masa napolitana de 48 horas' },
        { name: 'Carbonara',     badge: 'Pasta',       price: '€14.50', desc: 'Yema de huevo, pecorino, parmesano y guanciale crujiente' },
        { name: 'Torta Pistacho',badge: 'Postre',      price: '€6.00',  desc: 'Bizcocho de cacao con crema de ricotta y pistacho' },
      ],
    },
    quote: '"Siempre hay una pizza\nesperándote."',
    menu: {
      label: 'La carta',
      title: 'Nuestro menú',
      tabs: ['Pizzas', 'Primeros', 'Ensaladas', 'Postres', 'Bebidas'],
      items: {
        Pizzas: [
          { name: 'Margherita',       price: '€9.50',      desc: 'Tomate, mozzarella, aceite de oliva y albahaca' },
          { name: 'Mortazza',         price: '€15.50',     desc: 'Base blanca, mozzarella, mortadella, ricotta, pesto de pistacho' },
          { name: 'Stracciatella',    price: '€14.50',     desc: 'Base blanca, tomate cherry, pesto de albahaca, burrata' },
          { name: 'Pizza Picnic',     price: '€13.50',     desc: 'Salsa boloñesa, ricotta, jamón cocido, mozzarella' },
          { name: 'Diavola',          price: '€12.50',     desc: 'Tomate, mozzarella, salame piccante y aceitunas negras' },
          { name: 'Quattro Formaggi', price: '€14.00',     desc: 'Mozzarella, gorgonzola, parmesano y provolone' },
        ],
        Primeros: [
          { name: 'Burrata y bresaola',       price: '€12.50', desc: 'Burrata fresca, bresaola, rúcula y reducción de balsámico' },
          { name: 'Caprese',                  price: '€10.00', desc: 'Tomate, mozzarella di bufala, albahaca y aceite de oliva virgen extra' },
          { name: 'Bruschetta al pomodoro',   price: '€7.50',  desc: 'Pan tostado, tomate fresco, ajo y albahaca' },
          { name: 'Tabla de embutidos',       price: '€14.00', desc: 'Mortadella, bresaola, prosciutto y grisines artesanos' },
        ],
        Ensaladas: [
          { name: 'Ensalada César',     price: '€10.00', desc: 'Lechuga romana, parmesano, picatostes y aderezo César casero' },
          { name: 'Rúcula y parmesano', price: '€9.00',  desc: 'Rúcula fresca, lascas de parmesano y vinagreta de limón' },
          { name: 'Caprese de burrata', price: '€11.00', desc: 'Burrata entera, tomate cherry, albahaca y AOVE' },
        ],
        Postres: [
          { name: 'Torta pistacho',    price: '€6.00',  desc: 'Bizcocho de cacao con crema de ricotta y pistacho' },
          { name: 'Tiramisú della casa', price: '€6.50', desc: 'Tiramisú clásico con mascarpone y café espresso' },
          { name: 'Panna cotta',       price: '€5.50',  desc: 'Panna cotta con coulis de frutos rojos' },
        ],
        Bebidas: [
          { name: 'Agua mineral',    price: '€2.00',     desc: 'Con o sin gas, 500ml' },
          { name: 'Refrescos',       price: '€2.50',     desc: 'Coca-Cola, Fanta, agua tónica' },
          { name: 'Vino de la casa', price: '€3.50/copa', desc: 'Tinto o blanco, selección del chef' },
          { name: 'Cerveza artesana',price: '€4.00',     desc: 'Selección rotativa de cervezas locales' },
          { name: 'Aperol Spritz',   price: '€7.00',     desc: 'Aperol, prosecco, naranja y soda' },
        ],
      },
    },
    reservas: {
      label: 'Reservas',
      title: '¿Tienes',
      titleItalic: 'hambre?',
      body: 'Llámanos, escríbenos por WhatsApp o pásate a vernos. Te esperamos con la masa ya estirada.',
      whatsapp: 'Escribir por WhatsApp',
      call: 'Llamar ahora',
      calling: 'Conectando…',
      hangup: 'Colgar llamada',
      directions: 'Cómo llegar',
      hoursLabel: 'Horarios',
      hours: [
        { day: 'Lunes',    time: 'Cerrado' },
        { day: 'Mar – Mié', time: '19:30 – 22:30' },
        { day: 'Jueves',   time: '12:30–15:30 · 20:00–22:30' },
        { day: 'Vie – Sáb', time: '12:30–15:30 · 19:30–22:30' },
        { day: 'Domingo',  time: '12:30 – 15:30' },
      ],
      findUs: 'Encuéntranos',
      address: 'Avenida Rafael Cabrera, 7\n35002 Las Palmas de Gran Canaria',
      nearTriana: 'A dos pasos de Triana',
    },
    footer: {
      tagline: 'Hecho con amor\ny mucho orégano.',
      navLabel: 'Navegación',
      contactLabel: 'Encuéntranos',
      copyright: '© 2026 Picnic Trattoria Napoletana · Todos los derechos reservados',
      madeWith: 'Hecho con amor y mucho orégano',
      cta: 'Reservar mesa',
    },
    mobileCta: 'Reservar mesa',
  },

  it: {
    nav: {
      links: ['Inizio', 'Specialità', 'Menù', 'Galleria', 'Prenotazioni'],
      cta: 'Prenota un tavolo',
    },
    hero: {
      tagline: 'Trattoria Napoletana · Las Palmas de Gran Canaria',
      title: 'Benvenuto',
      subtitle: 'a Napoli',
      divider: 'nel cuore di Las Palmas',
      cta1: 'Prenota un tavolo',
      cta2: 'Vedi il menù',
      pill: 'Prenota →',
      intro: 'Una pizza napoletana comincia qui',
      phrases: [
        { line1: 'Tutto inizia',           line2: "con l'impasto." },
        { line1: 'Lavorato a mano,',       line2: 'con amore.' },
        { line1: 'Il nostro sugo',         line2: 'di Napoli.' },
        { line1: 'Il tocco segreto:',      line2: 'mozzarella fresca.' },
        { line1: 'Ingredienti freschi',    line2: 'e di prima qualità.' },
        { line1: 'Il fuoco',               line2: 'fa la magia.' },
        { line1: 'Pronta.',                line2: 'Ti sta aspettando.' },
      ],
    },
    marquee: [
      '4.6 · 200+ recensioni',
      '· @picnic.laspalmas ·',
      '· Pizza Napoletana ·',
      '· Las Palmas de Gran Canaria ·',
    ],
    about: {
      label: 'La nostra storia',
      title: 'Una trattoria napoletana',
      titleItalic: 'con anima',
      body: "Picnic è nata dall'amore per Napoli e per la buona tavola. Ogni pizza che esce dal nostro forno a legna è un pezzo d'Italia nel cuore di Las Palmas. A due passi da Triana, ti aspettiamo come se fossi a casa.",
      pillars: [
        { title: 'Forno a legna',          desc: 'Impasto napoletano con 48h di lievitazione lenta' },
        { title: 'Ingredienti freschi',    desc: "Importati direttamente dall'Italia con cura" },
        { title: 'Con anima',              desc: 'Ogni piatto fatto con amore e tanto origano' },
      ],
    },
    specialties: {
      label: 'Specialità',
      title: 'Ogni piatto,',
      titleItalic: 'un pezzo di Napoli',
      subtitle: 'Realizzati con ingredienti freschi e tanto amore',
      dishes: [
        { name: 'Margherita',    badge: 'Classica',    price: '€9.50',  desc: 'Pomodoro, mozzarella, olio d\'oliva e basilico fresco' },
        { name: 'Mortazza',      badge: 'Preferita',   price: '€15.50', desc: 'Base bianca, mozzarella, mortadella, ricotta e pesto di pistacchio' },
        { name: 'Stracciatella', badge: 'Fresca',      price: '€14.50', desc: 'Base bianca, pomodorini, pesto di basilico e cuori di burrata' },
        { name: 'Del Forno',     badge: 'Spettacolo',  price: '€13.50', desc: 'Direttamente dal forno a legna al tuo tavolo. Impasto napoletano 48h' },
        { name: 'Carbonara',     badge: 'Pasta',       price: '€14.50', desc: 'Tuorlo d\'uovo, pecorino, parmigiano e guanciale croccante' },
        { name: 'Torta Pistacchio', badge: 'Dolce',    price: '€6.00',  desc: 'Pan di cacao con crema di ricotta e pistacchio' },
      ],
    },
    quote: '"C\'è sempre una pizza\nche ti aspetta."',
    menu: {
      label: 'Il menù',
      title: 'La nostra carta',
      tabs: ['Pizze', 'Antipasti', 'Insalate', 'Dolci', 'Bevande'],
      items: {
        Pizze: [
          { name: 'Margherita',       price: '€9.50',      desc: 'Pomodoro, mozzarella, olio d\'oliva e basilico' },
          { name: 'Mortazza',         price: '€15.50',     desc: 'Base bianca, mozzarella, mortadella, ricotta, pesto di pistacchio' },
          { name: 'Stracciatella',    price: '€14.50',     desc: 'Base bianca, pomodorini, pesto di basilico, burrata' },
          { name: 'Pizza Picnic',     price: '€13.50',     desc: 'Ragù bolognese, ricotta, prosciutto cotto, mozzarella' },
          { name: 'Diavola',          price: '€12.50',     desc: 'Pomodoro, mozzarella, salame piccante e olive nere' },
          { name: 'Quattro Formaggi', price: '€14.00',     desc: 'Mozzarella, gorgonzola, parmigiano e provolone' },
        ],
        Antipasti: [
          { name: 'Burrata e bresaola',       price: '€12.50', desc: 'Burrata fresca, bresaola, rucola e riduzione di balsamico' },
          { name: 'Caprese',                  price: '€10.00', desc: 'Pomodoro, mozzarella di bufala, basilico e olio extravergine' },
          { name: 'Bruschetta al pomodoro',   price: '€7.50',  desc: 'Pane tostato, pomodoro fresco, aglio e basilico' },
          { name: 'Tagliere di salumi',       price: '€14.00', desc: 'Mortadella, bresaola, prosciutto e grissini artigianali' },
        ],
        Insalate: [
          { name: 'Insalata Caesar',    price: '€10.00', desc: 'Lattuga romana, parmigiano, crostini e salsa Caesar fatta in casa' },
          { name: 'Rucola e parmigiano', price: '€9.00', desc: 'Rucola fresca, scaglie di parmigiano e vinaigrette al limone' },
          { name: 'Caprese di burrata', price: '€11.00', desc: 'Burrata intera, pomodorini, basilico e olio EVO' },
        ],
        Dolci: [
          { name: 'Torta pistacchio',    price: '€6.00',  desc: 'Pan di cacao con crema di ricotta e pistacchio' },
          { name: 'Tiramisù della casa', price: '€6.50',  desc: 'Tiramisù classico con mascarpone e caffè espresso' },
          { name: 'Panna cotta',         price: '€5.50',  desc: 'Panna cotta con coulis di frutti rossi' },
        ],
        Bevande: [
          { name: 'Acqua minerale',  price: '€2.00',      desc: 'Naturale o frizzante, 500ml' },
          { name: 'Bibite',          price: '€2.50',      desc: 'Coca-Cola, Fanta, acqua tonica' },
          { name: 'Vino della casa', price: '€3.50/calice', desc: 'Rosso o bianco, selezione dello chef' },
          { name: 'Birra artigianale', price: '€4.00',    desc: 'Selezione rotativa di birre locali' },
          { name: 'Aperol Spritz',   price: '€7.00',      desc: 'Aperol, prosecco, arancia e soda' },
        ],
      },
    },
    reservas: {
      label: 'Prenotazioni',
      title: 'Hai',
      titleItalic: 'fame?',
      body: "Chiamaci, scrivici su WhatsApp o vieni a trovarci. Ti aspettiamo con l'impasto già steso.",
      whatsapp: 'Scrivici su WhatsApp',
      call: 'Chiama ora',
      calling: 'Connessione…',
      hangup: 'Riaggancia',
      directions: 'Come arrivare',
      hoursLabel: 'Orari',
      hours: [
        { day: 'Lunedì',    time: 'Chiuso' },
        { day: 'Mar – Mer', time: '19:30 – 22:30' },
        { day: 'Giovedì',   time: '12:30–15:30 · 20:00–22:30' },
        { day: 'Ven – Sab', time: '12:30–15:30 · 19:30–22:30' },
        { day: 'Domenica',  time: '12:30 – 15:30' },
      ],
      findUs: 'Dove siamo',
      address: 'Avenida Rafael Cabrera, 7\n35002 Las Palmas de Gran Canaria',
      nearTriana: 'A due passi da Triana',
    },
    footer: {
      tagline: 'Fatto con amore\ne tanto origano.',
      navLabel: 'Navigazione',
      contactLabel: 'Dove siamo',
      copyright: '© 2026 Picnic Trattoria Napoletana · Tutti i diritti riservati',
      madeWith: 'Fatto con amore e tanto origano',
      cta: 'Prenota un tavolo',
    },
    mobileCta: 'Prenota un tavolo',
  },
}

const LangContext = createContext(null)

// Italian-speaking countries (ISO 3166-1 alpha-2)
const IT_COUNTRIES = new Set(['IT', 'SM', 'VA', 'CH'])

async function detectLang() {
  // 1. Honour an explicit previous choice stored in sessionStorage
  const stored = sessionStorage.getItem('picnic_lang')
  if (stored === 'es' || stored === 'it') return stored

  // 2. Try browser language hint first (fast, no network)
  const browserLang = (navigator.language || '').toLowerCase()
  if (browserLang.startsWith('it')) return 'it'

  // 3. Geo-IP via a free, no-auth API
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
    const data = await res.json()
    if (IT_COUNTRIES.has(data.country_code)) return 'it'
  } catch {
    // network unavailable — fall through to default
  }

  return 'es'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState('es')

  useEffect(() => {
    detectLang().then(detected => setLang(detected))
  }, [])

  const toggle = () => {
    const next = lang === 'es' ? 'it' : 'es'
    sessionStorage.setItem('picnic_lang', next)
    setLang(next)
  }

  const t = translations[lang]
  return <LangContext.Provider value={{ lang, t, toggle }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
