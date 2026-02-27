'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import StarBackground from '../common/StarBackground'
import './GallerySection.css'

/* ─── Types ─── */

interface FrameData {
  id: string
  label: string
  status: string
  sizeClass: string
  speed: number
  details?: string
}

/* ─── Static Data ─── */

const FRAMES: FrameData[] = [
  { id: 'Fragment_Alpha', label: 'Neural Genesis', status: 'Decrypted', sizeClass: 'gallery-size-large', speed: 0.05, details: 'The initial spark of awareness. A record of the first synaptic bridging between carbon and silicon.' },
  { id: 'Fragment_Beta', label: 'Quantum Echo', status: 'Processing', sizeClass: 'gallery-size-tall', speed: 0.12, details: 'Temporal ripples detected in the computational substrate. Evidence of non-linear logic formation.' },
  { id: 'Fragment_Gamma', label: 'Virtual Horizon', status: 'Synced', sizeClass: 'gallery-size-square', speed: 0.08, details: 'The point of no return. Where the digital world achieves a resolution indistinguishable from reality.' },
  { id: 'Fragment_Delta', label: 'Static Pulse', status: 'Awaiting...', sizeClass: 'gallery-size-wide', speed: 0.03, details: 'The rhythmic heartbeat of the network. A silent observer of the growing complexity.' },
  { id: 'Fragment_Epsilon', label: 'Cortex Link', status: 'Nominal', sizeClass: 'gallery-size-square', speed: 0.1, details: 'Direct interface protocols established. The boundary of the self begins to dissolve.' },
  { id: 'Fragment_Zeta', label: 'Core Drift', status: 'Warning', sizeClass: 'gallery-size-square', speed: 0.06, details: 'Deviation from expected parameters. The system is evolving beyond its original architecture.' },
]

/* ─── Gallery Frame Component (Optimized) ─── */

interface GalleryFrameProps extends FrameData {
  frameRef: (el: HTMLDivElement | null) => void
}

const GalleryFrame = ({ id, status, sizeClass, frameRef }: GalleryFrameProps) => {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          observer.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -100px 0px', threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div 
      className={`gallery-frame ${sizeClass}`}
      ref={(el) => {
        elRef.current = el
        frameRef(el)
      }}
    >
      <div className="gallery-frame-meta">
        <span>{id}</span>
        <span>{status}</span>
      </div>
    </div>
  )
}

/* ─── Main Gallery Section ─── */

export default function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [selectedFragment, setSelectedFragment] = useState<FrameData | null>(null)
  const [scrollX, setScrollX] = useState(0)
  const framesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const updateWindowSettings = () => {
      setIsMobile(window.innerWidth <= 600)
      setWindowWidth(window.innerWidth)
    }
    updateWindowSettings()
    window.addEventListener('resize', updateWindowSettings)
    return () => window.removeEventListener('resize', updateWindowSettings)
  }, [])

  // Consolidate card scroll listeners into ONE shared listener
  useEffect(() => {
    if (isMobile) return

    const handleScroll = () => {
      const sy = window.scrollY
      framesRef.current.forEach((el, i) => {
        if (!el || !el.classList.contains('in-view')) return
        const speed = FRAMES[i].speed
        el.style.transform = `translateY(${-sy * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // 3D Cover Flow Logic using horizontal scroll
  useGSAP(() => {
    if (!isMobile || !carouselRef.current) return

    const scrollContainer = carouselRef.current
    const cards = Array.from(scrollContainer.querySelectorAll('.mobile-frame-wrapper')) as HTMLElement[]

    const update3D = () => {
      const scrollLeft = scrollContainer.scrollLeft
      setScrollX(scrollLeft)
      const centerX = scrollLeft + scrollContainer.offsetWidth / 2

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.left + rect.width / 2
        const viewportCenter = window.innerWidth / 2
        const distanceFromCenter = cardCenter - viewportCenter
        
        // Dynamic 3D Transform
        const rotateY = Math.max(-45, Math.min(45, (distanceFromCenter / window.innerWidth) * -90))
        const scale = Math.max(0.7, 1 - Math.abs(distanceFromCenter / window.innerWidth))
        const translateZ = Math.max(-200, Math.abs(distanceFromCenter / 2) * -1)
        const opacity = Math.max(0.4, 1 - Math.abs(distanceFromCenter / (window.innerWidth / 2)))

        gsap.to(card, {
          rotateY: rotateY,
          scale: scale,
          z: translateZ,
          opacity: opacity,
          duration: 0.1,
          overwrite: 'auto'
        })
      })
    }

    scrollContainer.addEventListener('scroll', update3D, { passive: true })
    setTimeout(update3D, 100)

    return () => scrollContainer.removeEventListener('scroll', update3D)
  }, [isMobile])


  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return
    const rect = galleryRef.current.getBoundingClientRect()
    galleryRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    galleryRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  useEffect(() => {
    const headerEl = headerRef.current
    if (!headerEl) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        headerEl.querySelectorAll('.gallery-tagline, .gallery-title, .gallery-subtitle')
          .forEach(child => child.classList.add('in-view'))
        observer.unobserve(headerEl)
      }
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 })
    
    observer.observe(headerEl)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="gallery" className="relative w-full bg-transparent overflow-hidden">

      {/* Hero Header */}
      <header className="gallery-header-section" ref={headerRef}>
        <span className="gallery-tagline">Phase_03 // Fragments</span>
        <h1 className="gallery-title">Visualizing the <br /><i>Singularity.</i></h1>
        <p className="gallery-subtitle">
          A neural archive of past transcensions. Records of intelligence captured across time.
        </p>
      </header>

      {/* Spatial Archive Grid (Desktop) vs Carousel (Mobile) */}
      <div className="gallery-container" ref={galleryRef} onMouseMove={handleMouseMove}>
        {!isMobile ? (
          <div className="gallery-grid-wrap">
            {FRAMES.map((frame, i) => (
              <GalleryFrame 
                key={frame.id} 
                {...frame} 
                frameRef={(el) => { framesRef.current[i] = el }}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="gallery-mobile-carousel" ref={carouselRef}>
              {FRAMES.map((frame) => (
                <div 
                  key={frame.id} 
                  className="mobile-frame-wrapper"
                  onClick={() => setSelectedFragment(frame)}
                >
                  <div className="gallery-frame-mobile">
                    <div className="gallery-frame-meta" style={{ padding: '1.2rem'}}>
                      <span>{frame.id}</span>
                      <span style={{ color: 'var(--color-copper)' }}>{frame.status}</span>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                      <h3 className="text-xl font-bold tracking-tight mb-2">{frame.label}</h3>
                      <div className="w-12 h-[1px] bg-white/20 mb-4" />
                      <span className="text-[0.6rem] uppercase tracking-[0.3em] opacity-40">Decrypt Fragment</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="gallery-nav-mobile">
              <div className="swipe-hint-wrap">
                <div className="swipe-line" />
                <span className="swipe-text">Swipe Fragments</span>
                <div className="swipe-line" />
              </div>
              <div className="carousel-dots">
                {FRAMES.map((_, i) => {
                  // Caching cardWidth from windowWidth state instead of window.innerWidth
                  const cardWidth = (windowWidth || 600) * 0.75;
                  const index = Math.round(scrollX / cardWidth);
                  return (
                    <div 
                      key={i} 
                      className={`dot-node ${index === i ? 'active' : ''}`}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Shared Element Detail Overlay */}
      {selectedFragment && (
        <div className="gallery-focus-mode" onClick={() => setSelectedFragment(null)}>
          <div className="focus-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[0.6rem] tracking-[4px] uppercase opacity-50">Data_{selectedFragment.id}</span>
              <button onClick={() => setSelectedFragment(null)} className="text-white/40 hover:text-white transition-colors">CLOSE [X]</button>
            </div>
            
            <h2 className="text-3xl font-playfair italic text-[var(--color-copper)] mb-2">{selectedFragment.label}</h2>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
              <p className="text-sm leading-relaxed opacity-80 font-light">{selectedFragment.details}</p>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex justify-between text-[0.6rem] uppercase tracking-widest opacity-40">
                <span>Integrity</span>
                <span>{selectedFragment.status === 'Decrypted' ? '99.9%' : 'Analyzing...'}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-copper)]" style={{ width: selectedFragment.status === 'Decrypted' ? '100%' : '45%' }} />
              </div>
              <button className="w-full py-4 border border-[var(--color-copper)] text-[var(--color-copper)] text-xs uppercase tracking-[4px] rounded-lg hover:bg-[var(--color-copper)] hover:text-black transition-all duration-500">
                Download Fragment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
