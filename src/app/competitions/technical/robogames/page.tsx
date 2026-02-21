'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import '@/components/ui/CategoryGrid.css'

/* ─── Types ─── */

interface RobogamesEventCardProps {
  title: string
  desc: string
  image: string
  number: string
  href?: string
}

/* ─── Static Data (hoisted — allocated once, not per render) ─── */

const ROBOGAMES_EVENTS: RobogamesEventCardProps[] = [
  { title: 'IARC', number: '01', href: '/competitions/technical/robogames/iarc', desc: 'Join IARC, the ultimate autonomous robotics challenge. Design and build bots to solve complex real-world logic mazes and terrain obstacles.', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop' },
  { title: 'Robowars', number: '02', href: '/competitions/technical/robogames/robowar', desc: "Techkriti's flagship event, Robowars, is a thrilling battleground of engineering brilliance. Robots in 8 kg, 15 kg, and 30 kg categories engage in intense one-on-one combat.", image: 'https://images.unsplash.com/photo-1593376893114-1aed528d80cf?q=80&w=2000&auto=format&fit=crop' },
  { title: 'Manoeuvre', number: '03', href: '/competitions/technical/robogames/manoeuvre', desc: 'Build a four-wheeled gripper robot to navigate diverse terrains. Work in pairs to transport and stack objects in complex patterns through precision coordination.', image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=1000&auto=format&fit=crop' },
  { title: 'Grand Prix', number: '04', href: '/competitions/technical/robogames/grand-prix', desc: 'The ultimate IC engine RC car showdown! Design and race custom-built machines on dynamic terrains. Showcase your engineering precision to tackle the track.', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1000&auto=format&fit=crop' },
]

const GridEventCard = ({ title, desc, image, number, href = '#' }: RobogamesEventCardProps) => {
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

export default function RobogamesPage() {
  return (
    <div className="category-grid-page">
      <StarBackgroundViewport mode="rise" count={200} canvasId="star-canvas-robo" />
      <div className="noise-grid" />
      <div className="ambient-glow-grid" />

      <Navbar />

      <header className="hero-grid">
        <div className="breadcrumb-grid" style={{ marginBottom: '2rem' }}>
          <Link href="/competitions">Competitions</Link> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span>Technical</span> <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>
          <span style={{ color: '#fff' }}>Robogames</span>
        </div>
        <h1 className="hero-title-grid">Robogames</h1>
        <p className="hero-desc-grid">Enter the battleground of engineering brilliance. Design, build, and deploy autonomous and remote-controlled machines in Techkriti&apos;s ultimate robotics showcase.</p>
      </header>

      <main className="arena-container-grid">
        {ROBOGAMES_EVENTS.map(event => (
          <GridEventCard key={event.title} {...event} />
        ))}
      </main>
    </div>
  )
}
