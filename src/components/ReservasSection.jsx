import { useState, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n'

const VAPI_PUBLIC_KEY = '9a9c7215-0f7c-4d07-b089-6d4b9f6020f6'

// Asistentes Vapi por tenant. Para probar otro agente: ?tenant=oraz en la URL,
// o usa el selector que aparece sólo en modo prueba.
//
// `picnic` es la PLANTILLA dorada (de la que se clonan los demás), no un cliente:
// se deja para demo. `oraz` y `bali` son los clientes reales con su propio clon
// Vapi. Cada tenant lleva su idioma y zona horaria para que las fechas que el
// agente pronuncia salgan localizadas y completas. Para añadir un tenant nuevo:
// una línea aquí con su assistantId (Vapi), lang y tz.
const TENANTS = {
  picnic: { label: 'Picnic (demo)', assistantId: '6c92f776-abb2-4175-8a55-45d76ec01d1a', lang: 'es', tz: 'Atlantic/Canary' },
  oraz: { label: 'Oraz', assistantId: '9a1174e4-770e-41f8-b539-7af2e98075ca', lang: 'it', tz: 'Europe/Rome' },
  bali: { label: 'BALI Rest', assistantId: '3deb5b44-b5e8-497d-84c2-da3743c67441', lang: 'es', tz: 'Atlantic/Canary' },
}
const DEFAULT_TENANT = 'picnic'

function readTenantFromUrl() {
  if (typeof window === 'undefined') return { tenant: DEFAULT_TENANT, showPicker: false }
  const p = new URLSearchParams(window.location.search)
  const t = (p.get('tenant') || '').toLowerCase()
  const showPicker = p.has('tenant') || p.get('test') === '1'
  return { tenant: TENANTS[t] ? t : DEFAULT_TENANT, showPicker }
}

// Date variables the Vapi assistant fills into its prompt header. We hand the
// agent the date ALREADY spelled out in full and localized — e.g. "lunes 1 de
// junio de 2026" — so it reads it verbatim and never says an ISO string. Mirrors
// the CRM's formatDateFull (src/lib/format-date.ts): same weekday + month names,
// same 4 languages, so the spoken date matches what WhatsApp writes.
const LOCALE = { es: 'es-ES', it: 'it-IT', en: 'en-GB', de: 'de-DE' }

function formatDateFull(d, lang, tz) {
  const loc = LOCALE[lang] || LOCALE.es
  // Intl already localizes weekday + month; the long format reads naturally in
  // every target language (es "lunes, 1 de junio de 2026", it "lunedì 1 giugno
  // 2026", en "Monday, 1 June 2026", de "Montag, 1. Juni 2026").
  return d.toLocaleDateString(loc, {
    timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getVariables(lang = 'es', tz = 'Atlantic/Canary') {
  const time = new Date().toLocaleTimeString(LOCALE[lang] || LOCALE.es, {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  })
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 86400000)
  return {
    current_date: formatDateFull(today, lang, tz),
    current_time: time,
    tomorrow_date: formatDateFull(tomorrow, lang, tz),
  }
}

export default function ReservasSection() {
  const { t } = useLang()
  const r = t.reservas
  const leftRef = useScrollReveal()
  const rightRef = useScrollReveal()
  const [callActive, setCallActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const vapiRef = useRef(null)
  const [{ tenant, showPicker }, setTenantState] = useState(readTenantFromUrl)

  const getVapi = async () => {
    if (vapiRef.current) return vapiRef.current
    const mod = await import('@vapi-ai/web')
    const Vapi = mod.default?.default ?? mod.default ?? mod.Vapi ?? mod
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
      const cfg = TENANTS[tenant] ?? TENANTS[DEFAULT_TENANT]
      await v.start(cfg.assistantId, { variableValues: getVariables(cfg.lang, cfg.tz) })
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
      <div ref={leftRef} className="reveal from-left relative px-8 md:px-16 py-20 flex flex-col justify-center overflow-hidden">
        <img src="/assets/terrace-night.jpg" alt="Terraza nocturna de Picnic Trattoria con velas y luces cálidas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="relative z-10 flex flex-col">
          <p className="font-body text-rust text-xs tracking-[0.3em] uppercase mb-4">{r.label}</p>
          <h2 className="font-display font-bold text-cream text-4xl md:text-5xl leading-tight mb-4">
            {r.title}<br />
            <span className="italic font-normal">{r.titleItalic}</span>
          </h2>
          <p className="font-body font-light text-cream text-base leading-relaxed mb-10 max-w-sm">{r.body}</p>

          <div className="flex flex-col gap-3">
            <a href="https://wa.me/14155238886?text=Hola%2C%20quiero%20reservar"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white font-body font-medium text-sm px-6 py-3.5 rounded-full hover:bg-[#20bc5a] active:scale-95 transition-all duration-300 w-fit">
              <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse flex-shrink-0" />
              <ion-icon name="logo-whatsapp" style={{ fontSize: '1.1rem' }}></ion-icon>
              {r.whatsapp}
            </a>

            {showPicker && (
              <label className="flex items-center gap-2 text-cream font-body text-xs">
                <span className="uppercase tracking-[0.2em]">Prueba — agente:</span>
                <select
                  value={tenant}
                  disabled={callActive || loading}
                  onChange={(e) => setTenantState((s) => ({ ...s, tenant: e.target.value }))}
                  className="bg-dark/60 border border-cream/30 text-cream rounded-full px-3 py-1.5 font-body text-xs focus:outline-none focus:border-cream/60 disabled:opacity-50"
                >
                  {Object.entries(TENANTS).map(([key, t]) => (
                    <option key={key} value={key} className="text-dark">{t.label}</option>
                  ))}
                </select>
              </label>
            )}

            <button
              onClick={handleCall}
              disabled={loading}
              className={`flex items-center gap-3 font-body font-medium text-sm px-6 py-3.5 rounded-full active:scale-95 transition-all duration-300 w-fit ${
                callActive ? 'bg-rust text-cream hover:bg-rust/80' : 'bg-cream text-dark hover:bg-cream/90'
              } ${loading ? 'opacity-60 cursor-wait' : ''}`}
            >
              <ion-icon
                name={callActive ? 'stop-circle-outline' : 'call-outline'}
                style={{ fontSize: '1.1rem', animation: callActive ? 'pulse 1s infinite' : 'none' }}
              ></ion-icon>
              {loading ? r.calling : callActive ? r.hangup : showPicker ? `Llamar — ${TENANTS[tenant]?.label ?? ''}` : r.call}
            </button>

            <a href="https://maps.google.com"
              className="flex items-center gap-3 border border-cream/30 text-cream font-body font-light text-sm px-6 py-3.5 rounded-full hover:border-cream/60 hover:bg-white/5 active:scale-95 transition-all duration-300 w-fit">
              <ion-icon name="location-outline" style={{ fontSize: '1.1rem' }}></ion-icon>
              {r.directions}
            </a>
          </div>
        </div>
      </div>

      <div ref={rightRef} className="reveal from-right bg-rust px-8 md:px-16 py-20 flex flex-col justify-center">
        <p className="font-body text-cream text-xs tracking-[0.3em] uppercase mb-8">{r.hoursLabel}</p>

        <div className="space-y-4 mb-10">
          {r.hours.map(h => (
            <div key={h.day} className="flex justify-between items-baseline border-b border-cream/20 pb-3">
              <span className="font-body font-medium text-cream text-sm">{h.day}</span>
              <span className={`font-body font-light text-sm ${h.time === 'Cerrado' || h.time === 'Chiuso' ? 'text-cream/40' : 'text-cream'}`}>
                {h.time}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-cream/10 rounded-sm p-5">
          <p className="font-body font-medium text-cream text-sm mb-1 flex items-center gap-2">
            <ion-icon name="location-outline"></ion-icon> {r.findUs}
          </p>
          <p className="font-body font-light text-cream text-sm whitespace-pre-line">{r.address}</p>
          <p className="font-body text-cream text-xs mt-2 italic">{r.nearTriana}</p>
        </div>
      </div>
    </section>
  )
}
