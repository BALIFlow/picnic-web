const navLinks = ['Inicio', 'Especialidades', 'Carta', 'Galería', 'Reservas']

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 px-5 md:px-8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <p className="font-display font-black text-cream text-2xl tracking-tight mb-1">PICNIC</p>
            <p className="font-body text-cream/40 text-[10px] tracking-[0.25em] uppercase mb-4">Trattoria Napoletana</p>
            <p className="font-body font-light text-cream/40 text-sm leading-relaxed">
              Hecho con amor<br />y mucho orégano.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-body text-cream/30 text-xs tracking-[0.2em] uppercase mb-5">Navegación</p>
            <ul className="space-y-3">
              {navLinks.map(l => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`}
                    className="font-body font-light text-cream/50 text-sm hover:text-cream transition-colors duration-300">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & contact */}
          <div>
            <p className="font-body text-cream/30 text-xs tracking-[0.2em] uppercase mb-5">Encuéntranos</p>
            <div className="space-y-2 mb-6">
              <p className="font-body font-light text-cream/50 text-sm flex items-center gap-2"><ion-icon name="location-outline"></ion-icon> Av. Rafael Cabrera, 7 · Las Palmas</p>
              <p className="font-body font-light text-cream/50 text-sm flex items-center gap-2"><ion-icon name="call-outline"></ion-icon> +34 828 712 623</p>
              <p className="font-body font-light text-cream/50 text-sm flex items-center gap-2"><ion-icon name="logo-instagram"></ion-icon> @picnic.laspalmas</p>
            </div>
            <a href="#reservas"
              className="inline-block bg-rust text-cream font-body font-medium text-xs px-5 py-2.5 rounded-full hover:bg-rust/80 active:scale-95 transition-all duration-300">
              Reservar mesa
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body font-light text-cream/20 text-xs">
            © 2026 Picnic Trattoria Napoletana · Todos los derechos reservados
          </p>
          <p className="font-body font-light text-cream/20 text-xs italic">
            Hecho con amor y mucho orégano
          </p>
        </div>
      </div>
    </footer>
  )
}
