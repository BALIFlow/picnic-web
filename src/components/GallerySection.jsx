import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const photos = [
  { src: '/assets/margherita-flatlay.jpg', alt: 'Pizza Margherita vista cenital con tomate, mozzarella y albahaca', tall: true },
  { src: '/assets/burrata.jpg',            alt: 'Burrata fresca con tomate cherry y aceite de oliva virgen extra', tall: false },
  { src: '/assets/carbonara.jpg',          alt: 'Espaguetis carbonara con guanciale crujiente y pecorino', tall: false },
  { src: '/assets/pizza-oven.jpg',         alt: 'Pizza napolitana saliendo del horno de leña', tall: true },
  { src: '/assets/mortazza.jpg',           alt: 'Pizza Mortazza con mortadella, ricotta y pesto de pistacho', tall: false },
  { src: '/assets/tiramisu.jpg',           alt: 'Tiramisú della casa con mascarpone y café espresso', tall: false },
  { src: '/assets/margherita-2.jpg',       alt: 'Detalle de pizza Margherita napolitana con bordes carbonizados', tall: false },
  { src: '/assets/bodega.jpg',             alt: 'Bodega de Picnic con selección de vinos italianos', tall: true },
  { src: '/assets/torta-pistacho.jpg',     alt: 'Torta de pistacho con crema de ricotta, postre estrella', tall: false },
]

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null)
  const headRef = useScrollReveal()

  return (
    <section id="galería" className="bg-black py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} className="reveal text-center mb-16">
          <p className="font-body text-rust text-xs tracking-[0.3em] uppercase mb-4">Galería</p>
          <h2 className="font-display font-bold text-cream text-4xl md:text-5xl">Nuestra galería</h2>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {photos.map((photo, i) => (
            <GalleryItem key={i} photo={photo} index={i} onClick={() => setLightbox(photo)} />
          ))}
          {/* Instagram CTA card */}
          <a
            href="https://www.instagram.com/picnic.laspalmas"
            target="_blank"
            rel="noopener noreferrer"
            className="break-inside-avoid bg-rust rounded-sm p-8 flex flex-col items-center justify-center text-center min-h-[160px] cursor-pointer hover:bg-rust/80 transition-colors duration-300 block"
          >
            <span className="text-3xl mb-3">📸</span>
            <p className="font-display font-bold text-cream text-lg mb-1">Síguenos</p>
            <p className="font-body text-cream/80 text-sm">@picnic.laspalmas</p>
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute top-0 right-0 -translate-y-full mb-2 text-cream/50 hover:text-cream text-2xl transition-colors p-2"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function GalleryItem({ photo, index, onClick }) {
  const ref = useScrollReveal()
  return (
    <div
      ref={ref}
      className="reveal break-inside-avoid cursor-pointer group relative overflow-hidden rounded-sm"
      style={{ transitionDelay: `${index * 60}ms` }}
      onClick={onClick}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${photo.tall ? 'aspect-[2/3]' : 'aspect-[4/3]'}`}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
        <span className="text-cream text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">+</span>
      </div>
    </div>
  )
}
