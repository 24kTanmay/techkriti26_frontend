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

const TAKEOFF_EVENTS: GridEventCardProps[] = [
  { title: 'IDRL', number: '01', href: '/competitions/technical/takeoff/idrl', desc: 'Get ready for the ultimate high-octane spectacle with IDRL Drone Racing, the next frontier of high-speed aerial competition.', image: 'https://images.unsplash.com/photo-1508614589041-895b9ec99607?q=80&w=1000&auto=format&fit=crop' },
  { title: 'Multirotor', number: '02', href: '/competitions/technical/takeoff/multirotor', desc: 'The Multirotor aircraft hobby is rapidly growing, offering a unique opportunity to compete with the most advanced aerial platforms.', image: 'https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?q=80&w=1000&auto=format&fit=crop' },
  { title: 'Skysparks', number: '03', href: '/competitions/technical/takeoff/skysparks', desc: "Skysparks Techkriti's new version of the competition offers aerospace enthusiasts the chance to design high-performance electric aircraft.", image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop' },
  { title: 'Hovermania', number: '04', href: '/competitions/technical/takeoff/hovermania', desc: 'Hovermania 2026 challenges teams to design and build lightweight, agile hovercrafts for knockout racing on complex varied terrains.', image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000&auto=format&fit=crop' },
]

/* ─── Sub-Components ─── */

const GridEventCard = ({ title, desc, image, number, href = '#' }: GridEventCardProps) => {
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
          <div className="btn-glass-grid">Enter Hangar <i>→</i></div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Main Export ─── */

export default function TakeoffPage() {
  return (
    <div className="category-grid-page">
      <StarBackgroundViewport mode="rise" count={200} canvasId="grid-star-canvas-takeoff" />
      <div className="noise-grid" />
      <div className="ambient-glow-grid" style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)' }} />

      <Navbar />

      <header className="hero-grid">
        <div className="breadcrumb-grid" style={{ marginBottom: '2rem' }}>
          <Link href="/competitions">Competitions</Link> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span>Technical</span> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span style={{ color: '#fff' }}>Takeoff</span>
        </div>
        <h1 className="hero-title-grid">Takeoff</h1>
        <p className="hero-desc-grid">Ascend to the skies in Techkriti&apos;s flagship aeromodelling arena. From custom multirotors to high-speed hovercraft, engineering the future of flight begins here.</p>
      </header>

      <main className="arena-container-grid">
        {TAKEOFF_EVENTS.map(event => (
          <GridEventCard key={event.title} {...event} />
        ))}
      </main>
    </div>
  )
}
