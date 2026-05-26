import { useState, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const VAPI_PUBLIC_KEY = '9a9c7215-0f7c-4d07-b089-6d4b9f6020f6'
const VAPI_ASSISTANT_ID = '6c92f776-abb2-4175-8a55-45d76ec01d1a'

function getVariables() {
  const fmt = (d) =>
    d.toLocaleDateString('es-ES', {
      timeZone: 'Atlantic/Canary',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).split('/').reverse().join('-')
  const dayName = (d) =>
    d.toLocaleDateString('es-ES', { timeZone: 'Atlantic/Canary', weekday: 'long' })
  const time = new Date().toLocaleTimeString('es-ES', {
    timeZone: 'Atlantic/Canary', hour: '2-digit', minute: '2-digit', hour12: false,
  })
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 86400000)
  return {
    current_date: `${fmt(today)} (${dayName(today)})`,
    current_time: time,
    tomorrow_date: `${fmt(tomorrow)} (${dayName(tomorrow)})`,
  }
}

const hours = [
  { day: 'Lunes', time: 'Cerrado' },
  { day: 'Mar – Mié', time: '19:30 – 22:30' },
  { day: 'Jueves', time: '12:30–15:30 · 20:00–22:30' },
  { day: 'Vie – Sáb', time: '12:30–15:30 · 19:30–22:30' },
  { day: 'Domingo', time: '12:30 – 15:30' },
]

export default function ReservasSection() {
  const leftRef = useScrollReveal()
  const rightRef = useScrollReveal()
  const [callActive, setCallActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const vapiRef = useRef(null)

  const getVapi = async () => {
    if (vapiRef.current) return vapiRef.current
    const { default: Vapi } = await import('@vapi-ai/web')
    const instance = new Vapi(VAPI_PUBLIC_KEY)
    instance.on('call-start', () => console.log('Llamada iniciada'))
    instance.on('call-end', () => { console.log('Llamada terminada'); setCallActive(false) })
    instance.on('error', (e) => console.error('Vapi error:', e))
    vapiRef.current = instance
    return instance
  }

  const handleCall = async () => {
    if (callActive) {
      vapiRef.current?.stop()
      setCallActive(false)
      return
    }
    setLoading(true)
    try {
      const v = await getVapi()
      await v.start(VAPI_ASSISTANT_ID, { variableValues: getVariables() })
      setCallActive(true)
    } catch (e) {
      console.error('Vapi start error:', e)
      alert('No se pudo iniciar la llamada. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="reservas" className="grid md:grid-cols-2 min-h-[500px]">
      {/* Left — photo background */}
      <div ref={leftRef} className="reveal from-left relative px-8 md:px-16 py-20 flex flex-col justify-center overflow-hidden">
        <img
          src="/assets/terrace-night.jpg"
          alt="Terraza nocturna de Picnic Trattoria con velas y luces cálidas"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="relative z-10 flex flex-col">
          <p className="font-body text-rust text-xs tracking-[0.3em] uppercase mb-4">Reservas</p>
          <h2 className="font-display font-bold text-cream text-4xl md:text-5xl leading-tight mb-4">
            ¿Tienes<br />
            <span className="italic font-normal">hambre?</span>
          </h2>
          <p className="font-body font-light text-cream/60 text-base leading-relaxed mb-10 max-w-sm">
            Llámanos, escríbenos por WhatsApp o pásate a vernos. Te esperamos con la masa ya estirada.
          </p>

          <div className="flex flex-col gap-3">
            <a href="https://wa.me/14155238886?text=Hola%2C%20quiero%20reservar"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white font-body font-medium text-sm px-6 py-3.5 rounded-full hover:bg-[#20bc5a] active:scale-95 transition-all duration-300 w-fit">
              <ion-icon name="logo-whatsapp" style={{ fontSize: '1.1rem' }}></ion-icon> Escribir por WhatsApp
            </a>

            <button
              onClick={handleCall}
              disabled={loading}
              className={`flex items-center gap-3 font-body font-medium text-sm px-6 py-3.5 rounded-full active:scale-95 transition-all duration-300 w-fit ${
                callActive
                  ? 'bg-rust text-cream hover:bg-rust/80'
                  : 'bg-cream text-dark hover:bg-cream/90'
              } ${loading ? 'opacity-60 cursor-wait' : ''}`}
            >
              <ion-icon
                name={callActive ? 'stop-circle-outline' : 'call-outline'}
                style={{ fontSize: '1.1rem', animation: callActive ? 'pulse 1s infinite' : 'none' }}
              ></ion-icon>
              {loading ? 'Conectando…' : callActive ? 'Colgar llamada' : 'Llamar ahora'}
            </button>

            <a href="https://maps.google.com"
              className="flex items-center gap-3 border border-cream/30 text-cream font-body font-light text-sm px-6 py-3.5 rounded-full hover:border-cream/60 hover:bg-white/5 active:scale-95 transition-all duration-300 w-fit">
              <ion-icon name="location-outline" style={{ fontSize: '1.1rem' }}></ion-icon> Cómo llegar
            </a>
          </div>
        </div>
      </div>

      {/* Right — rust */}
      <div ref={rightRef} className="reveal from-right bg-rust px-8 md:px-16 py-20 flex flex-col justify-center">
        <p className="font-body text-cream/60 text-xs tracking-[0.3em] uppercase mb-8">Horarios</p>

        <div className="space-y-4 mb-10">
          {hours.map(h => (
            <div key={h.day} className="flex justify-between items-baseline border-b border-cream/20 pb-3">
              <span className="font-body font-medium text-cream text-sm">{h.day}</span>
              <span className={`font-body font-light text-sm ${h.time === 'Cerrado' ? 'text-cream/40' : 'text-cream'}`}>
                {h.time}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-cream/10 rounded-sm p-5">
          <p className="font-body font-medium text-cream text-sm mb-1 flex items-center gap-2"><ion-icon name="location-outline"></ion-icon> Encuéntranos</p>
          <p className="font-body font-light text-cream/70 text-sm">
            Avenida Rafael Cabrera, 7<br />
            35002 Las Palmas de Gran Canaria
          </p>
          <p className="font-body text-cream/50 text-xs mt-2 italic">A dos pasos de Triana</p>
        </div>
      </div>
    </section>
  )
}
