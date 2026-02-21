'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import '@/components/ui/CategoryGrid.css'

/* ─── Types ─── */

interface TechnovationEventCardProps {
  title: string
  desc: string
  image: string
  number: string
  href?: string
}

/* ─── Static Data (hoisted — allocated once, not per render) ─── */

const TECHNOVATION_EVENTS: TechnovationEventCardProps[] = [
  { 
    title: 'TIC', 
    number: '01', 
    href: '/competitions/technical/technovation/tic', 
    desc: '“The only place where dreams become impossible is in your dreams.” Join the Techkriti Innovation Challenge and transform your bold ideas into reality.', 
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    title: 'III', 
    number: '02', 
    href: '/competitions/technical/technovation/iii', 
    desc: 'A stronger collaboration between technical institutions and industry is essential to enhance engineering education. Bridge the gap between academia and the industrial world.', 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop' 
  },
]

const GridEventCard = ({ title, desc, image, number, href = '#' }: TechnovationEventCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

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
          <div className="btn-glass-grid">Enter Arena <i>→</i></div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Main Export ─── */

export default function TechnovationPage() {
  return (
    <div className="category-grid-page">
      <StarBackgroundViewport mode="rise" count={200} canvasId="star-canvas-technovation" />
      <div className="noise-grid" />
      <div className="ambient-glow-grid" />

      <Navbar />

      <header className="hero-grid">
        <div className="breadcrumb-grid" style={{ marginBottom: '2rem' }}>
          <Link href="/competitions">Competitions</Link> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span>Technical</span> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span style={{ color: '#fff' }}>Technovation</span>
        </div>
        <h1 className="hero-title-grid">Technovation</h1>
        <p className="hero-desc-grid">The ultimate innovation challenge where bold ideas transform into reality through engineering and design excellence. Tackle real-world problems with futuristic solutions.</p>
      </header>

      <main className="arena-container-grid">
        {TECHNOVATION_EVENTS.map(event => (
          <GridEventCard key={event.title} {...event} />
        ))}
      </main>
    </div>
  )
}
