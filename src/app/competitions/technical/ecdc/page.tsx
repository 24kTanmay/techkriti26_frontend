'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/ui/StarBackground'
import Navbar from '@/components/ui/Navbar'
import '@/components/ui/CategoryGrid.css'

/* ─── Types ─── */

interface GridEventCardProps {
  title: string
  desc: string
  image: string
  number: string
  href?: string
}

/* ─── Static Data ─── */

const ECDC_EVENTS: GridEventCardProps[] = [
  { title: 'Embedded Systems', number: '01', desc: 'Design micro-controller based solutions for real-world automation. Real-time OS, firmware, and low-level optimization.', image: '' },
  { title: 'Analog Design', number: '02', desc: 'Craft precision circuits from the ground up. Master the nuances of signal processing, filters, and amplifiers.', image: '' },
  { title: 'FPGA Challenge', number: '03', desc: 'Implement high-speed digital logic on hardware. VHDL/Verilog expertise in a race against time and clock cycles.', image: '' },
]

/* ─── Sub-Components ─── */

const GridEventCard = ({ title, desc, image, number, href = '#' }: GridEventCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const tiltX = (y / rect.height) * -8
    const tiltY = (x / rect.width) * 8
    cardRef.current.style.transform = `perspective(1000px) scale3d(1.02, 1.02, 1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`
  }, [])

  return (
    <Link
      href={href}
      className={`event-card-grid ${isVisible ? 'visible' : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-img-grid" style={{ backgroundImage: image ? `url(${image})` : 'none' }} />
      <div className="card-vignette-grid" />
      <div className="card-number-grid">{number}</div>

      <div className="card-content-grid">
        <h2 className="card-title-grid">{title}</h2>
        <div className="card-reveal-grid">
          <p className="card-desc-grid">{desc}</p>
          <div className="btn-glass-grid">Power Up <i>→</i></div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Main Export ─── */

export default function ECDCPage() {
  return (
    <div className="category-grid-page">
      <StarBackgroundViewport mode="rise" count={220} canvasId="grid-star-canvas-ecdc" />
      <div className="noise-grid" />
      <div className="ambient-glow-grid" style={{ background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)' }} />

      <Navbar />

      <header className="hero-grid">
        <div className="breadcrumb-grid" style={{ marginBottom: '2rem' }}>
          <Link href="/competitions">Competitions</Link> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span>Technical</span> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span style={{ color: '#fff' }}>ECDC</span>
        </div>
        <h1 className="hero-title-grid">ECDC</h1>
        <p className="hero-desc-grid">The domain of silicon and signals. From embedded systems design and analog circuits to high-speed digital logic, master the hardware that powers the future.</p>
      </header>

      <main className="arena-container-grid">
        {ECDC_EVENTS.map(event => (
          <GridEventCard key={event.title} {...event} />
        ))}
      </main>
    </div>
  )
}
