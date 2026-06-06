import { useState, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n'

const VAPI_PUBLIC_KEY = '9a9c7215-0f7c-4d07-b089-6d4b9f6020f6'

// Voice "motore unico": there is ONE shared Vapi engine assistant for every
// restaurant. We don't pick an assistant per tenant anymore — we ask the CRM
// for this tenant's call config (the system prompt composed fresh from the
// single source of truth: the code template + the live DB menu/hours/KB, plus
// the localized date header and metadata.tenant_id) and start the engine with
// those overrides. Change the template or any DB value → the next call reflects
// it for ALL tenants, with no per-tenant clone and no re-sync.
//
// To add a new restaurant: one line here mapping its slug to its CRM tenant id.
// Picnic is NOT listed: it's the legacy template the shared engine was built
// from (like the chat's motore unico), not a restaurant with its own voice.
const CRM_BASE = 'https://crm.baliflowagency.com'
const TENANTS = {
  oraz: { label: 'Oraz', tenantId: '93eebe9c-8af5-4ca5-a315-3376ef4976e5' },
  bali: { label: 'BALI Rest', tenantId: 'a085e5bb-11f3-47f9-96da-c6cfdbff2ea0' },
}
const DEFAULT_TENANT = 'oraz'

function readTenantFromUrl() {
  if (typeof window === 'undefined') return DEFAULT_TENANT
  const p = new URLSearchParams(window.location.search)
  const t = (p.get('tenant') || '').toLowerCase()
  return TENANTS[t] ? t : DEFAULT_TENANT
}

// Fetch the shared engine assistant id + per-tenant assistantOverrides (system
// prompt, first message, localized date vars, metadata.tenant_id) from the CRM.
async function fetchCallConfig(tenantId) {
  const res = await fetch(`${CRM_BASE}/api/voice/overrides?tenant_id=${encodeURIComponent(tenantId)}`)
  if (!res.ok) throw new Error(`overrides ${res.status}`)
  return res.json() // { assistantId, assistantOverrides }
}

export default function ReservasSection() {
  const { t } = useLang()
  const r = t.reservas
  const leftRef = useScrollReveal()
  const rightRef = useScrollReveal()
  const [callActive, setCallActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const vapiRef = useRef(null)
  const [tenant, setTenant] = useState(readTenantFromUrl)

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
      const t = TENANTS[tenant] ?? TENANTS[DEFAULT_TENANT]
      const { assistantId, assistantOverrides } = await fetchCallConfig(t.tenantId)
      await v.start(assistantId, assistantOverrides)
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

            <label className="flex items-center gap-2 text-cream font-body text-xs">
              <span className="uppercase tracking-[0.2em]">Prueba — agente:</span>
              <select
                value={tenant}
                disabled={callActive || loading}
                onChange={(e) => setTenant(e.target.value)}
                className="bg-dark/60 border border-cream/30 text-cream rounded-full px-3 py-1.5 font-body text-xs focus:outline-none focus:border-cream/60 disabled:opacity-50"
              >
                {Object.entries(TENANTS).map(([key, tn]) => (
                  <option key={key} value={key} className="text-dark">{tn.label}</option>
                ))}
              </select>
            </label>

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
              {loading ? r.calling : callActive ? r.hangup : `Llamar — ${TENANTS[tenant]?.label ?? ''}`}
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
