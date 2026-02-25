'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import './ArchivesSection.css'

/* ─── Types ─── */

interface ArchiveEvent {
  year: string
  title: string
  desc: string
}

interface Particle {
  x: number
  y: number
  z: number
  size: number
}

/* ─── Static Data ─── */

const ARCHIVE_EVENTS: ArchiveEvent[] = [
  { year: "2019", title: "Genesis Code", desc: "The initiation of new intelligence. Algorithmic foundations laid." },
  { year: "2020", title: "Virtual Horizon", desc: "Digital transcendence. The entire festival mapped to a virtual matrix." },
  { year: "2021", title: "Neural Link", desc: "Connecting minds globally. Unprecedented synchronous problem solving." },
  { year: "2022", title: "Quantum Shift", desc: "Breaking computational barriers. Introduction of quantum ideation." },
  { year: "2023", title: "Cosmic Resonance", desc: "Aligning technology with universal frequencies." },
  { year: "2024", title: "The Awakening", desc: "Inner awareness realized. Machines adapting to human intuition." },
  { year: "2025", title: "Singularity", desc: "The convergence. Human and underlying order become one." }
]

const Z_SPACING = 1500

/* ─── Memory Slab Sub-component ─── */

interface MemorySlabProps {
  event: ArchiveEvent
  index: number
  currentScroll: number
  mouseX: number
  mouseY: number
}

const MemorySlab = ({ event, index, currentScroll, mouseX, mouseY }: MemorySlabProps) => {
  const slabRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slab = slabRef.current
    if (!slab) return

    const offset = index - currentScroll
    const zPos = -(offset * Z_SPACING)

    let opacity = 1
    let blur = 0

    if (offset > 0) {
      opacity = Math.max(0, 1 - offset * 0.3)
      blur = offset * 4
    } else if (offset < 0) {
      opacity = Math.max(0, 1 + offset * 2)
      blur = Math.abs(offset) * 10
    }

    const isActive = Math.abs(offset) < 0.3
    const rotateX = -mouseY * 10 * Math.max(0, 1 - Math.abs(offset))
    const rotateY = mouseX * 10 * Math.max(0, 1 - Math.abs(offset))

    slab.style.transform = `translateZ(${zPos}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    slab.style.opacity = opacity.toString()
    slab.style.filter = `blur(${blur}px)`
    slab.style.display = opacity < 0.01 ? 'none' : 'flex'
    
    if (isActive) slab.classList.add('is-active')
    else slab.classList.remove('is-active')

  }, [index, currentScroll, mouseX, mouseY])

  return (
    <div ref={slabRef} className="memory-slab">
      <div className="slab-grid" />
      <div className="slab-year">{event.year}</div>
      <div className="slab-meta">System Log<br />Seq_{index + 1}</div>
      <div className="slab-title">{event.title}</div>
      <div className="slab-subtitle">{event.desc}</div>
    </div>
  )
}

/* ─── Main Component ─── */

export default function ArchivesSection() {
  const [targetScroll, setTargetScroll] = useState(0)
  const [currentScroll, setCurrentScroll] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const requestRef = useRef<number>(null)
  const lastScrollRef = useRef(0)

  // ── 1. Warp Particles Logic ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width: number, height: number
    let particles: Particle[] = []

    const createParticle = (): Particle => ({
      x: (Math.random() - 0.5) * 3000,
      y: (Math.random() - 0.5) * 3000,
      z: Math.random() * 2000,
      size: Math.random() * 2
    })

    const init = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      particles = Array.from({ length: 300 }, createParticle)
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      const velocity = (lastScrollRef.current - currentScroll) * 50 // Inverted velocity for warp direction
      lastScrollRef.current = currentScroll
      
      const baseSpeed = 2

      particles.forEach(p => {
        p.z -= (baseSpeed - velocity) // Minus velocity because scrolling forward decreases Z-index of slabs

        if (p.z <= 0) {
          Object.assign(p, createParticle())
          p.z = 2000
        }
        if (p.z > 2000) p.z = 0

        const fov = 300
        const scale = fov / (fov + p.z)
        const x2d = (p.x * scale) + (width / 2)
        const y2d = (p.y * scale) + (height / 2)
        const alpha = Math.max(0, 1 - (p.z / 2000))

        ctx.beginPath()
        ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(var(--color-violet-rgb), ${alpha * 0.5})`
        ctx.fill()
      })

      requestRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', init)
    init()
    animate()

    return () => {
      window.removeEventListener('resize', init)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [currentScroll])

  // ── 2. Scroll & Lerp Logic ──
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor
    
    let frameId: number
    const update = () => {
      setCurrentScroll(prev => {
        const next = lerp(prev, targetScroll, 0.07)
        return Math.abs(next - targetScroll) < 0.001 ? targetScroll : next
      })
      frameId = requestAnimationFrame(update)
    }
    frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [targetScroll])

  // ── 3. Event Listeners ──
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If the mouse is NOT over this section, or section is not visible, we could ignore?
      // Since it's a dedicated page part, we'll let it handle wheel.
      // But we should only block default if we want to "lock" the page.
      // For now, let's keep it section-based.
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      
      // Only process wheel if section is in viewport center-ish
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Option: preventDefault here would lock the whole page.
        // If we want it as a section, maybe we don't preventDefault.
        // But the original design is a dedicated "dive".
        // Let's just track target scroll.
        const speed = 0.002
        setTargetScroll(prev => Math.max(0, Math.min(ARCHIVE_EVENTS.length - 1, prev + e.deltaY * speed)))
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section ref={sectionRef} className="archives-section">
      <div className="warp-canvas-container">
        <canvas ref={canvasRef} />
      </div>
      <div className="archive-noise" />
      <div className="singularity-core" />
      <div className="archive-reticle" />

      <div className="archive-header">
        <span className="archive-tagline">Phase_04 // Archives</span>
        <h1 className="archive-title">Temporal <i>Reflections.</i></h1>
      </div>

      <div className="archive-timeline">
        {ARCHIVE_EVENTS.map((event, i) => (
          <button
            key={event.year}
            className={`time-node ${Math.abs(i - currentScroll) < 0.3 ? 'active' : ''}`}
            onClick={() => setTargetScroll(i)}
          >
            {event.year}
          </button>
        ))}
      </div>

      <div className="archive-viewport">
        <div className="archive-camera">
          {ARCHIVE_EVENTS.map((event, i) => (
            <MemorySlab
              key={event.year}
              event={event}
              index={i}
              currentScroll={currentScroll}
              mouseX={mousePos.x}
              mouseY={mousePos.y}
            />
          ))}
        </div>
      </div>

      <div className="archive-scroll-hint">
        <div className="archive-mouse-icon">
          <div className="archive-mouse-wheel" />
        </div>
        <span className="archive-tagline" style={{ margin: 0, letterSpacing: '0.2em' }}>Scroll to Dive</span>
      </div>
    </section>
  )
}
