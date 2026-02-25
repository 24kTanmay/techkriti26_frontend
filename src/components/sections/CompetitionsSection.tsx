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

import eventsDataRaw from '@/data/events.json'

const eventsData = eventsDataRaw as Record<string, any>;

const categoryImages: Record<string, string> = {
  'robogames': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=150&q=80',
  'takeoff': 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=150&q=80',
  'software': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=150&q=80',
  'ecdc': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80',
  'technovation': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&q=80',
  'fintech': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80',
  'business': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80',
  'design-events': 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=150&q=80',
  'mandakini': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=150&q=80',
  'mun': 'https://images.unsplash.com/photo-1521791136064-7986c29535a7?auto=format&fit=crop&w=150&q=80',
  'cubing-events': 'https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?auto=format&fit=crop&w=150&q=80',
};

const defaultImage = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=150&q=80';

const getCategoryEvents = (domain: string) => {
  return Object.keys(eventsData)
    .filter((key) => eventsData[key]?.category === domain)
    .map((key) => {
      const cat = eventsData[key];
      const overviewItem = (cat.data || []).find((item: any) => item.flag?.content === 'overview');
      const descText = overviewItem?.desc?.content || '';
      const shortDesc = descText.length > 120 ? descText.substring(0, 117) + '...' : descText;
      
      return {
        title: cat.title || key,
        href: `/competitions/${domain.toLowerCase()}/${key}`,
        desc: shortDesc,
        image: categoryImages[key.toLowerCase()] || defaultImage,
      };
    });
};

const TECHNICAL_EVENTS = getCategoryEvents('Technical');
const ENTREPRENEURIAL_EVENTS = getCategoryEvents('Entrepreneurial');
const MISCELLANEOUS_EVENTS = getCategoryEvents('Miscellaneous');

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