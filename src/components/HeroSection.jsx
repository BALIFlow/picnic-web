import { useEffect, useRef, useState, useCallback } from 'react'
import { useLang } from '../i18n'

export const HERO_HEIGHT_VH = 800

// 463 frames at 12fps, 960×540
const FIRST_FRAME = 1
const LAST_FRAME = 463
const TOTAL_FRAMES = 463
const FRAME_W = 960
const FRAME_H = 540

const CLIP_BOUNDARIES = [1, 49, 110, 171, 232, 317, 378, 463].map(n => (n - 1) / 462)

function buildPhrases(phrases) {
  return phrases.map((text, i) => {
    const start = CLIP_BOUNDARIES[i]
    const end = CLIP_BOUNDARIES[i + 1]
    const span = end - start
    return { ...text, from: start + span * 0.2, to: end - span * 0.2 }
  })
}

export default function HeroSection({ onProgressChange }) {
  const { t, lang, toggle } = useLang()
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const rafRef = useRef(null)
  const lastFrameRef = useRef(-1)
  const [loadedCount, setLoadedCount] = useState(0)
  const [totalToLoad] = useState(TOTAL_FRAMES)
  const [readyToShow, setReadyToShow] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [inHero, setInHero] = useState(true)

  useEffect(() => {
    let cancelled = false
    let loaded = 0
    const count = LAST_FRAME - FIRST_FRAME + 1
    const images = new Array(count)
    framesRef.current = images

    const loadBatch = (start, batchSize) => {
      if (cancelled) return
      for (let i = start; i < Math.min(start + batchSize, count); i++) {
        const idx = i
        const img = new Image()
        img.onload = () => {
          if (cancelled) return
          images[idx] = img
          loaded++
          setLoadedCount(loaded)
          if (loaded === 30) setReadyToShow(true)
        }
        img.onerror = () => {
          if (cancelled) return
          loaded++
          setLoadedCount(loaded)
        }
        const n = String(idx + 1).padStart(4, '0')
        img.src = `/assets/frames/frame_${n}.webp`
      }
    }

    loadBatch(0, 30)
    const timer = setTimeout(() => loadBatch(30, count - 30), 50)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [])

  const drawFrame = useCallback((frameIdx, canvas) => {
    const img = framesRef.current[frameIdx]
    if (!img || !canvas) return
    const ctx = canvas.getContext('2d')

    const scale = Math.max(canvas.width / FRAME_W, canvas.height / FRAME_H)
    const dw = FRAME_W * scale
    const dh = FRAME_H * scale
    const dx = (canvas.width - dw) / 2
    const dy = (canvas.height - dh) / 2

    ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H, dx, dy, dw, dh)

    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, Math.min(dw, dh) * 0.3,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.65
    )
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(1, 'rgba(0,0,0,0.85)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    if (!readyToShow) return
    const canvas = canvasRef.current
    if (!canvas) return

    const setSize = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1)
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      const fi = Math.floor(scrollProgress * (TOTAL_FRAMES - 1))
      drawFrame(fi, canvas)
    }
    setSize()
    window.addEventListener('resize', setSize)

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
        setInHero(rect.bottom > window.innerHeight)
        setScrollProgress(p)
        onProgressChange?.(p)
        const fi = Math.floor(p * (TOTAL_FRAMES - 1))
        if (fi !== lastFrameRef.current) {
          lastFrameRef.current = fi
          drawFrame(fi, canvas)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    drawFrame(0, canvas)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', setSize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [readyToShow, drawFrame, onProgressChange])

  const showHero = scrollProgress >= 0.93
  const loadPercent = Math.round((loadedCount / totalToLoad) * 100)
  const phrases = buildPhrases(t.hero.phrases)

  return (
    <>
      {!readyToShow && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: '#000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '24px',
        }}>
          <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, color: '#f7f3ed', fontSize: '2.5rem', letterSpacing: '0.25em' }}>PICNIC</p>
          <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#c94a1a', width: `${loadPercent}%`, transition: 'width 0.3s ease' }} />
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(247,243,237,0.3)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {loadPercent < 100 ? `${loadPercent}%` : 'Listo…'}
          </p>
        </div>
      )}

      <div ref={containerRef} id="inicio" style={{ height: `${HERO_HEIGHT_VH}vh` }} />

      {readyToShow && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: inHero ? 10 : -1,
          opacity: inHero ? 1 : 0,
          transition: 'opacity 0.4s ease',
          background: '#000',
          pointerEvents: 'none',
        }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: 'block' }} />

          <div style={{
            position: 'absolute', left: 0, top: 0, width: '2px',
            background: 'rgba(201,74,26,0.7)', zIndex: 20,
            height: `${scrollProgress * 100}%`,
            transition: 'height 0.05s linear',
          }} />

          {/* PICNIC title + intro — fades on first scroll */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
            opacity: scrollProgress < 0.08 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}>
            <p style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 900,
              fontSize: 'clamp(5rem, 18vw, 16rem)',
              color: '#f7f3ed', letterSpacing: '0.08em', lineHeight: 1,
              textShadow: '0 4px 60px rgba(0,0,0,0.4)',
            }}>PICNIC</p>
            <p style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontWeight: 400, fontSize: 'clamp(1.2rem, 2.2vw, 1.9rem)',
              color: '#c94a1a', letterSpacing: '0.08em', marginTop: '0.75rem',
            }}>{t.hero.intro}</p>
          </div>

          {/* Scroll phrases */}
          {phrases.map((phrase, i) => {
            const isActive = scrollProgress >= phrase.from && scrollProgress <= phrase.to
            const side = i % 2 === 0 ? 'left' : 'right'
            return (
              <div key={i} style={{
                position: 'absolute', bottom: '10%', [side]: '5%',
                textAlign: side, pointerEvents: 'none',
                overflow: 'hidden', maxWidth: '38%',
              }}>
                <div style={{
                  transform: isActive ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
                }}>
                  <p style={{
                    fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                    fontWeight: 400, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                    color: 'rgba(247,243,237,0.92)', lineHeight: 1.25,
                    textShadow: '0 2px 24px rgba(0,0,0,0.9)',
                  }}>
                    {phrase.line1}
                    {phrase.line2 && <><br />{phrase.line2}</>}
                  </p>
                </div>
              </div>
            )
          })}

          {/* End CTA */}
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
              {t.hero.tagline}
            </p>
            <h1 className="font-display font-black text-cream text-5xl md:text-7xl lg:text-8xl leading-tight mb-2">
              {t.hero.title}
            </h1>
            <h2 className="font-display font-black italic text-cream/90 text-4xl md:text-6xl lg:text-7xl leading-tight mb-8">
              {t.hero.subtitle}
            </h2>
            <div className="w-16 h-px bg-rust mx-auto mb-6" />
            <p className="font-body font-light text-cream/70 text-base md:text-lg tracking-widest mb-10">
              {t.hero.divider}
            </p>
            <div className="flex flex-col sm:flex-row gap-4" style={{ pointerEvents: 'auto' }}>
              <a href="#reservas" className="bg-rust text-cream font-body font-medium text-sm px-8 py-3.5 rounded-full hover:bg-rust/80 active:scale-95 transition-all duration-300">
                {t.hero.cta1}
              </a>
              <a href="#carta" className="border border-cream/40 text-cream font-body font-light text-sm px-8 py-3.5 rounded-full hover:border-cream/80 hover:bg-white/5 active:scale-95 transition-all duration-300">
                {t.hero.cta2}
              </a>
            </div>
          </div>

          {/* Top-right: lang toggle (always) + reservation pill (after first scroll) */}
          <div style={{
            position: 'absolute', top: '24px', right: '24px',
            display: 'flex', alignItems: 'center', gap: '8px',
            zIndex: 30,
            opacity: !showHero ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: !showHero ? 'auto' : 'none',
          }}>
            <button
              onClick={toggle}
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(247,243,237,0.25)',
                color: '#f7f3ed',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '10px 16px',
                borderRadius: '999px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {lang === 'es' ? 'IT' : 'ES'}
            </button>
            <a href="#reservas" style={{
              opacity: scrollProgress > 0.05 ? 1 : 0,
              transition: 'opacity 0.5s ease',
              pointerEvents: scrollProgress > 0.05 ? 'auto' : 'none',
              background: 'rgba(201,74,26,0.85)', backdropFilter: 'blur(8px)',
              color: '#f7f3ed', fontFamily: 'Inter, sans-serif',
              fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em',
              padding: '10px 20px', borderRadius: '999px',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              {t.hero.pill}
            </a>
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
        </div>
      )}
    </>
  )
}
