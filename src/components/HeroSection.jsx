import { useEffect, useRef, useState } from 'react'

export const HERO_HEIGHT_VH = 800

const VIDEO_SRC = '/assets/hero_scrub.mp4'
const DURATION = 33.36
const TOTAL_FRAMES = 180

// Clip durations: 4.06, 5.06, 5.06, 7.06, 5.06, 7.06 = 33.36s
// Each phrase shows in the middle 60% of its clip's scroll zone
const CLIP_BOUNDARIES = [0, 4.06, 9.12, 14.18, 21.24, 26.30, 33.36].map(t => t / 33.36)
const PHRASES = [
  { line1: 'Todo empieza',             line2: 'con la masa.' },
  { line1: 'Harina, agua y',           line2: 'un poco de cariño.' },
  { line1: 'El toque secreto:',        line2: 'Nuestra salsa de Nápoles.' },
  { line1: 'Ingredientes frescos y',   line2: 'de primera calidad.' },
  { line1: 'El fuego',                 line2: 'hace la magia.' },
  { line1: 'Lista.',                   line2: 'Te está esperando.' },
].map((text, i) => {
  const start = CLIP_BOUNDARIES[i]
  const end = CLIP_BOUNDARIES[i + 1]
  const span = end - start
  return {
    ...text,
    from: start + span * 0.15,
    to: end - span * 0.15,
  }
})

export default function HeroSection({ onProgressChange }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const rafRef = useRef(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [inHero, setInHero] = useState(true)

  // --- Extract all frames from video ---
  useEffect(() => {
    const video = document.createElement('video')
    video.src = VIDEO_SRC
    video.muted = true
    video.playsInline = true

    const offscreen = document.createElement('canvas')
    offscreen.width = 1280
    offscreen.height = 720
    const offCtx = offscreen.getContext('2d')

    const frames = []
    let frameIndex = 0
    const step = DURATION / TOTAL_FRAMES

    const seekNext = () => {
      if (frameIndex >= TOTAL_FRAMES) {
        framesRef.current = frames
        setLoaded(true)
        return
      }
      video.currentTime = frameIndex * step
    }

    video.addEventListener('loadedmetadata', seekNext)
    video.addEventListener('seeked', async () => {
      offCtx.drawImage(video, 0, 0, 1280, 720)
      const bitmap = await createImageBitmap(offscreen)
      frames.push(bitmap)
      frameIndex++
      setLoadProgress(Math.round((frameIndex / TOTAL_FRAMES) * 100))
      seekNext()
    })

    video.load()
  }, [])

  // --- Fixed canvas: draw frame on scroll ---
  useEffect(() => {
    if (!loaded) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()
    window.addEventListener('resize', setSize)

    const drawFrame = (frameIdx) => {
      const frame = framesRef.current[Math.min(frameIdx, framesRef.current.length - 1)]
      if (!frame) return
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const maxW = canvas.width * 0.78
      const maxH = canvas.height * 0.78
      const scale = Math.min(maxW / 1280, maxH / 720)
      const w = 1280 * scale
      const h = 720 * scale
      const x = (canvas.width - w) / 2
      const y = (canvas.height - h) / 2
      ctx.save()
      roundRect(ctx, x, y, w, h, 12)
      ctx.clip()
      ctx.drawImage(frame, x, y, w, h)
      ctx.restore()
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, Math.min(w, h) * 0.3,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.65
      )
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(1, 'rgba(0,0,0,0.85)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        const containerTop = rect.top + window.scrollY
        const scrolled = window.scrollY - containerTop
        const totalScroll = container.offsetHeight - window.innerHeight
        const p = Math.max(0, Math.min(1, scrolled / totalScroll))
        const pastHero = rect.bottom <= 0
        setInHero(!pastHero)
        setScrollProgress(p)
        onProgressChange?.(p)
        drawFrame(Math.floor(p * (TOTAL_FRAMES - 1)))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    drawFrame(0)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', setSize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loaded, onProgressChange])

  const showHero = scrollProgress >= 0.93

  return (
    <>
      {/* Loading screen */}
      {!loaded && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: '#000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '24px'
        }}>
          <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, color: '#f7f3ed', fontSize: '2.5rem', letterSpacing: '0.25em' }}>PICNIC</p>
          <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#c94a1a', width: `${loadProgress}%`, transition: 'width 0.1s linear' }} />
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(247,243,237,0.3)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Preparando tu experiencia… {loadProgress}%
          </p>
        </div>
      )}

      {/* Scroll spacer */}
      <div ref={containerRef} id="inicio" style={{ height: `${HERO_HEIGHT_VH}vh` }} />

      {/* Fixed canvas layer — disappears when hero spacer is fully scrolled past */}
      {loaded && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: inHero ? 10 : -1,
          opacity: inHero ? 1 : 0,
          transition: 'opacity 2s ease, zIndex 0s 2s',
          background: '#000',
          pointerEvents: 'none',
        }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

          {/* Phrase overlays */}
          {PHRASES.map((phrase, i) => {
            const isActive = scrollProgress >= phrase.from && scrollProgress <= phrase.to
            return (
              <div key={i} style={{
                position: 'absolute', bottom: '12%', left: '50%',
                transform: 'translateX(-50%)', textAlign: 'center',
                opacity: isActive ? 1 : 0, transition: 'opacity 0.6s ease',
                pointerEvents: 'none', whiteSpace: 'nowrap',
              }}>
                <p style={{
                  fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                  fontWeight: 400, fontSize: 'clamp(1.4rem, 3.5vw, 2.6rem)',
                  color: 'rgba(247,243,237,0.95)', lineHeight: 1.3,
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                }}>
                  {phrase.line1}<br />{phrase.line2}
                </p>
              </div>
            )
          })}

          {/* Hero CTA — fades in at end */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 20px',
            opacity: showHero ? 1 : 0, transition: 'opacity 1s ease',
            pointerEvents: showHero ? 'auto' : 'none',
            background: showHero ? 'rgba(0,0,0,0.45)' : 'transparent',
          }}>
            <p className="font-body text-cream/60 text-xs tracking-[0.4em] uppercase mb-6">
              Trattoria Napoletana · Las Palmas de Gran Canaria
            </p>
            <h1 className="font-display font-black text-cream text-5xl md:text-7xl lg:text-8xl leading-tight mb-2">
              Benvenuto
            </h1>
            <h2 className="font-display font-black italic text-cream/90 text-4xl md:text-6xl lg:text-7xl leading-tight mb-8">
              a Napoli
            </h2>
            <div className="w-16 h-px bg-rust mx-auto mb-6" />
            <p className="font-body font-light text-cream/70 text-base md:text-lg tracking-widest mb-10">
              en el corazón de Las Palmas
            </p>
            <div className="flex flex-col sm:flex-row gap-4" style={{ pointerEvents: 'auto' }}>
              <a href="#reservas" className="bg-rust text-cream font-body font-medium text-sm px-8 py-3.5 rounded-full hover:bg-rust/80 active:scale-95 transition-all duration-300">
                Reservar mesa
              </a>
              <a href="#carta" className="border border-cream/40 text-cream font-body font-light text-sm px-8 py-3.5 rounded-full hover:border-cream/80 hover:bg-white/5 active:scale-95 transition-all duration-300">
                Ver carta
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            opacity: scrollProgress < 0.03 ? 1 : 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none', zIndex: 20,
          }}>
            <span className="font-body text-cream/50 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-cream/50 to-transparent animate-pulse" />
          </div>

          {/* Progress bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, height: '2px',
            background: 'rgba(201,74,26,0.7)', zIndex: 20,
            width: `${scrollProgress * 100}%`,
          }} />
        </div>
      )}

      {/* MarqueeStrip placeholder spacer — keeps layout correct so marquee
          appears immediately after the scroll spacer with no gap */}
    </>
  )
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
