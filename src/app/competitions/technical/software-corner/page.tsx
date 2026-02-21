'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
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

const SOFTWARE_EVENTS: GridEventCardProps[] = [
  { title: 'IUPC', number: '01', desc: "The Inter-University Programming Contest. A battle of algorithms and data structures where only the most efficient survive.", image: '' },
  { title: 'Cyber Security', number: '02', desc: 'Secure the perimeter and exploit the vulnerabilities. A Capture The Flag (CTF) arena for the elite hackers.', image: '' },
  { title: 'AI Challenge', number: '03', desc: 'Develop intelligent agents to solve complex problems. Machine learning, neural networks, and tactical optimization.', image: '' },
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
          <div className="btn-glass-grid">Compile <i>→</i></div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Main Export ─── */

export default function SoftwareCornerPage() {
  return (
    <div className="category-grid-page">
      <StarBackgroundViewport mode="rise" count={250} canvasId="grid-star-canvas-software" />
      <div className="noise-grid" />
      <div className="ambient-glow-grid" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)' }} />

      <Navbar />

      <header className="hero-grid">
        <div className="breadcrumb-grid" style={{ marginBottom: '2rem' }}>
          <Link href="/competitions">Competitions</Link> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span>Technical</span> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span style={{ color: '#fff' }}>Software Corner</span>
        </div>
        <h1 className="hero-title-grid">Software</h1>
        <p className="hero-desc-grid">Dive into the matrix of high-performance coding. From algorithmic battles and cyber security to advanced artificial intelligence, this is where the new digital age is written.</p>
      </header>

      <main className="arena-container-grid">
        {SOFTWARE_EVENTS.map(event => (
          <GridEventCard key={event.title} {...event} />
        ))}
      </main>
    </div>
  )
}
