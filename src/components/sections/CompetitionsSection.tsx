'use client'

import React, { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import StarBackground from '@/components/common/StarBackground'
import './CompetitionsSection.css'

/* ─── Types ─── */

interface EventCardProps {
  title: string
  desc: string
  image: string
  delay: string
  href?: string
}

interface CompetitionGroupProps {
  title: string
  subtitle: string
  isActive: boolean
  onToggle: () => void
  events: EventCardProps[]
}

/* ─── Static Data (hoisted — allocated once, not per render) ─── */

const TECHNICAL_EVENTS = [
  { title: 'Robogames', href: '/competitions/technical/robogames', desc: "Techkriti's flagship robotics basket, bringing together innovation, engineering, and adrenaline-fueled combat.", image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=150&q=80' },
  { title: 'Takeoff', href: '/competitions/technical/takeoff', desc: 'Celebrate flight and futuristic mobility, uniting aeromodelling aircraft, multirotors, and hovercrafts.', image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=150&q=80' },
  { title: 'Software Corner', href: '/competitions/technical/software-corner', desc: 'Rapid quantitative problem-solving and team-based programming battles focusing on reasoning and strategy.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=150&q=80' },
  { title: 'ECDC', href: '/competitions/technical/ecdc', desc: 'Blends electronics, creativity, and gaming into one exciting challenge. Design and build real-world circuits.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80' },
  { title: 'Technovation', href: '/competitions/technical/technovation', desc: 'The ultimate innovation challenge where bold ideas transform into reality through engineering and design excellence.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&q=80' },
] as const

const ENTREPRENEURIAL_EVENTS = [
  { title: 'Upstart', href: '/competitions/entrepreneurial/upstart', desc: 'The ultimate search for the next big unicorn. Pitch your startup to elite VCs and secure seed funding and expert mentorship.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=150&q=80' },
  { title: 'BizSim', href: '/competitions/entrepreneurial/bizsim', desc: 'Step into the shoes of a CEO. Navigate the complexities of a multi-million dollar corporation in this high-fidelity business simulation.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80' },
  { title: 'Pitch Premier', href: '/competitions/entrepreneurial/pitch-premier', desc: 'An elite stage for bright minds to pitch their vision. Stand face-to-face with investors and turn your startup into a reality.', image: 'https://images.unsplash.com/photo-1475721027187-402ad2989a3b?auto=format&fit=crop&w=150&q=80' },
  { title: 'Social Track', href: '/competitions/entrepreneurial/social-track', desc: 'Transforming lives through innovation. A dedicated track for startups creating high-impact solutions for social challenges.', image: 'https://images.unsplash.com/photo-1542601906-973ad1ee5f5e?auto=format&fit=crop&w=150&q=80' },
  { title: 'Elevator Pitch', href: '/competitions/entrepreneurial/elevator-pitch', desc: '60 seconds to change everything. A high-pressure pitching arena where you present your vision in the time it takes to ride an elevator.', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=150&q=80' },
  { title: 'Finsearch', href: '/competitions/entrepreneurial/finsearch', desc: 'Dive deep into the world of quantitative finance, portfolio management, and algorithmic trading strategies.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80' },
] as const

const MISCELLANEOUS_EVENTS = [
  { title: 'Design Events', href: '/competitions/miscellaneous/design', desc: 'Design comes alive when creativity is guided by structure. Participants explore the balance between strength and elegance by transforming simple materials into masterpieces.', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=150&q=80' },
  { title: 'Mandakini', href: '/competitions/miscellaneous/mandakini', desc: 'Step into a domain where curiosity drives competition and the universe becomes the playing field. Mandakini challenges participants to think beyond textbooks.', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=150&q=80' },
  { title: 'Model United Nations', href: '/competitions/miscellaneous/mun', desc: 'Experience how major international institutions function. Delegates discuss governance, security, and human rights in an interactive and engaging setting.', image: 'https://images.unsplash.com/photo-1521791136064-7986c29535a7?auto=format&fit=crop&w=150&q=80' },
  { title: 'Cubing Events', href: '/competitions/miscellaneous/cubing', desc: 'Get ready to twist, turn, and solve! Techkriti brings you the ultimate cubing challenge where speed, precision, and strategy come together.', image: 'https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?auto=format&fit=crop&w=150&q=80' },
] as const

/* ─── Sub-Components ─── */

const EventCard = ({ title, desc, image, delay, href = '#' }: EventCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    cardRef.current.style.setProperty('--mouseX', `${x}px`)
    cardRef.current.style.setProperty('--mouseY', `${y}px`)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5

    cardRef.current.style.transform = `perspective(1000px) scale3d(1.02, 1.02, 1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`
  }, [])

  return (
    <div
      className="tilt-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: delay }}
    >
      <div className="sub-header">
        <img src={image} className="sub-icon" alt={title} loading="lazy" />
        <h3 className="sub-title">{title}</h3>
      </div>
      <p className="sub-desc">{desc}</p>
      <Link href={href} className="sub-btn">Explore <span>→</span></Link>
    </div>
  )
}

const CompetitionGroup = ({ title, subtitle, isActive, onToggle, events }: CompetitionGroupProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }, [onToggle])

  return (
    <div className={`comp-group ${isActive ? 'is-active' : ''}`}>
      <div
        className="main-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
      >
        <div className="card-info">
          <h2 className="card-title">{title}</h2>
          <p className="card-subtitle">{subtitle}</p>
        </div>
        <div className="expand-icon" aria-hidden="true">↓</div>
      </div>

      <div className="sub-wrapper" aria-hidden={!isActive}>
        <div className="sub-inner">
          <div className="grid">
            {events.map((event, index) => (
              <EventCard key={event.title} {...event} delay={`${(index + 1) * 0.1}s`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Export ─── */

export default function CompetitionsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="competitions" className="relative w-full bg-[#020202] overflow-hidden min-h-screen">
      <StarBackground mode="drift" count={400} sizing="container" />
      <div className="noise-overlay" />

      <div className="competitions-container">
        <div className="hero-text">
          <span className="tagline">Phase_02 // Competitions</span>
          <h1 className="section-title">Explore the <br /><i>Singularity.</i></h1>
          <p className="subtitle">New intelligence meets cosmic transcendence. Select an arena to view events and challenges.</p>
        </div>

        <div className={`comp-list ${activeIndex !== null ? 'comp-list-has-active' : ''}`}>
          <CompetitionGroup
            title="Technical"
            subtitle="Robotics, Aeromodelling, Coding & Electronics"
            isActive={activeIndex === 0}
            onToggle={() => setActiveIndex(activeIndex === 0 ? null : 0)}
            events={TECHNICAL_EVENTS as unknown as EventCardProps[]}
          />
          <CompetitionGroup
            title="Entrepreneurial"
            subtitle="Pitching, Business Simulation & Strategy"
            isActive={activeIndex === 1}
            onToggle={() => setActiveIndex(activeIndex === 1 ? null : 1)}
            events={ENTREPRENEURIAL_EVENTS as unknown as EventCardProps[]}
          />
          <CompetitionGroup
            title="Miscellaneous"
            subtitle="Finance, Gaming, and Strategy"
            isActive={activeIndex === 2}
            onToggle={() => setActiveIndex(activeIndex === 2 ? null : 2)}
            events={MISCELLANEOUS_EVENTS as unknown as EventCardProps[]}
          />
        </div>
      </div>
    </section>
  )
}