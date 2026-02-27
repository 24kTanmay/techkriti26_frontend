'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import StarBackground from '../common/StarBackground'
import './ArchivesSection.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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
  // { year: "2019", title: "Genesis Code", desc: "The initiation of new intelligence. Algorithmic foundations laid." },
  // { year: "2020", title: "Virtual Horizon", desc: "Digital transcendence. The entire festival mapped to a virtual matrix." },
  // { year: "2021", title: "Neural Link", desc: "Connecting minds globally. Unprecedented synchronous problem solving." },
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
      opacity = Math.max(0, 1 + offset * 1.5)
      blur = Math.abs(offset) * 15
    }

    const isActive = Math.abs(offset) < 0.3
    const rotateX = -mouseY * 8 * Math.max(0, 1 - Math.abs(offset))
    const rotateY = mouseX * 8 * Math.max(0, 1 - Math.abs(offset))

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
  const [currentScroll, setCurrentScroll] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const requestRef = useRef<number>(null)
  const lastScrollRef = useRef(0)

  // ── 1. Scroll-Locking PROGRESS (GSAP) ──
  useGSAP(() => {
    const N = ARCHIVE_EVENTS.length;
    
    // Create a proxy to lerp between ScrollTrigger and state
    const proxy = { value: 0 };

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=600%', // Increased weight for 4 cards to feel like the original 7
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        // Reaching the last card (N-1) at ~85% of the scroll for "dwell time"
        proxy.value = Math.min(N - 1, self.progress * (N * 1.15));
      }
    });

    const renderLoop = () => {
      // Smoothly approach the proxy value
      setCurrentScroll(prev => {
        const diff = proxy.value - prev;
        if (Math.abs(diff) < 0.0001) return proxy.value;
        return prev + diff * 0.1;
      });
      requestRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, { scope: sectionRef });

  // ── 2. Warp Particles Logic ──
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
      
      const velocity = (lastScrollRef.current - currentScroll) * 50
      lastScrollRef.current = currentScroll
      
      const baseSpeed = 2

      particles.forEach(p => {
        p.z -= (baseSpeed - velocity)

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
        ctx.fillStyle = `rgba(180, 150, 255, ${alpha * 0.4})`
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

  // ── 3. Mouse Interaction ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section ref={sectionRef} className="archives-section">
      <div className="warp-canvas-container">
        <canvas ref={canvasRef} />
      </div>
      <div className="singularity-core" />
      <div className="archive-reticle" />

      <div className="archive-header">
        <span className="archive-tagline">Phase_04 // Archives</span>
        <h1 className="archive-title">Temporal <i>Reflections.</i></h1>
      </div>

      <div className="archive-timeline">
        {ARCHIVE_EVENTS.map((event, i) => (
          <div
            key={event.year}
            className={`time-node ${Math.abs(i - currentScroll) < 0.4 ? 'active' : ''}`}
          >
            {event.year}
          </div>
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
        <span className="archive-tagline" style={{ margin: 0, letterSpacing: '0.2em' }}>Vertical Stretch to Dive</span>
      </div>
    </section>
  )
}
