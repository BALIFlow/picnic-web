import { useState, useEffect } from 'react'

const links = ['Inicio', 'Especialidades', 'Carta', 'Galería', 'Reservas']

export default function Navbar({ heroProgress = 0 }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Only show navbar once hero scroll sequence is complete
  const heroComplete = heroProgress >= 0.99

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClass = scrolled ? 'bg-dark/95 backdrop-blur-sm shadow-lg' : 'bg-black/30 backdrop-blur-md'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClass}`}
        style={{ opacity: heroComplete ? 1 : 0, transform: heroComplete ? 'translateY(0)' : 'translateY(-100%)', transition: 'opacity 0.8s ease, transform 0.8s ease, background-color 0.5s ease' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
          <a href="#" className="flex flex-col leading-none">
            <span className="font-display font-black text-cream text-xl tracking-tight">PICNIC</span>
            <span className="font-body text-cream/60 text-[9px] tracking-[0.25em] uppercase">Trattoria Napoletana</span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`}
                  className="font-body text-cream/80 text-sm tracking-wide hover:text-cream transition-colors duration-300 relative group">
                  {l}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-rust transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a href="#reservas"
              className="hidden md:block bg-rust text-cream text-sm font-body font-medium px-5 py-2 rounded-full hover:bg-rust/80 active:scale-95 transition-all duration-300">
              Reservar mesa
            </a>
            <button onClick={() => setOpen(!open)} className="md:hidden text-cream p-2" aria-label="Menu">
              <div className="space-y-1.5">
                <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {open && heroComplete && (
        <div className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              className="font-display text-3xl text-cream hover:text-rust transition-colors duration-300">
              {l}
            </a>
          ))}
          <a href="#reservas" onClick={() => setOpen(false)}
            className="mt-4 bg-rust text-cream text-base font-body font-medium px-8 py-3 rounded-full">
            Reservar mesa
          </a>
        </div>
      )}
    </>
  )
}
