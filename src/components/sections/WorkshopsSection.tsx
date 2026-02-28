'use client'

import React, { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WorkshopConfirmation from '@/components/ui/WorkshopConfirmation'
import './WorkshopsSection.css'

/* ─── Types ─── */

interface WorkshopCardProps {
  title: string
  desc: string
  image: string
  delay: string
  href?: string
  onRegister: () => void
}

interface WorkshopGroupProps {
  title: string
  subtitle: string
  isActive: boolean
  onToggle: () => void
  events: WorkshopCardProps[]
}

/* ─── Static Data ─── */

const ADVANCED_WORKSHOPS = [
  { title: 'AI & ML Workshop', href: '#', desc: 'Dive into artificial intelligence and machine learning basics and advanced implementations on 20th March 2026.', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'Generative AI Workshop', href: '#', desc: 'Learn how generative models create text, images, and tools of the future on 21st March 2026.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'Agentic AI Workshop', href: '#', desc: 'Step into the future with autonomous agentic AI models capable of complex decision-making on 22nd March 2026.', image: 'https://images.unsplash.com/photo-1684369176140-57173e351fce?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'AI for Business Professionals', href: '#', desc: 'Discover how artificial intelligence can revolutionize your business strategy on 22nd March 2026.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'AI & ML BootCamp', href: '#', desc: 'A rigorous two-day AI & ML intensive experience on 21st and 22nd March 2026.', image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'CRISPR and Gene Editing', href: '#', desc: 'Explore the revolution in bioengineering with CRISPR technology on 21st and 22nd March 2026.', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=100&q=80&fm=webp' },
] as const

const SATURDAY_WORKSHOPS = [
  { title: 'Prompt Engineering with AI', href: '#', desc: 'Master the art of prompt design to harness the full potential of large language models.', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'AI Powered Digital Marketing', href: '#', desc: 'Leverage AI with Instagram & Facebook Ads to drive unprecedented growth.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'Cyber Security & Ethical Hacking', href: '#', desc: 'Learn cutting edge penetration testing and robust security infrastructure development.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=100&q=80&fm=webp' },
] as const

const SUNDAY_WORKSHOPS = [
  { title: 'AI Tools for Health Care', href: '#', desc: 'Revolutionizing diagnosis and treatment through AI specifically tailored for healthcare professionals.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'Agentic AI Masterclass', href: '#', desc: 'An elite masterclass into Machine Learning and Agentic AI workflows.', image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=100&q=80&fm=webp' },
  { title: 'Data Analytics with Python', href: '#', desc: 'Turn data into decisions with comprehensive Python data analytics training.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=100&q=80&fm=webp' },
] as const

/* ─── Sub-Components ─── */

const WorkshopCard = ({ title, desc, image, delay, onRegister }: WorkshopCardProps) => {
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
      className="ws-tilt-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: delay }}
    >
      <div className="ws-sub-header">
        <Image 
          src={image} 
          className="ws-sub-icon" 
          alt={title} 
          width={56}
          height={56}
        />
        <h3 className="ws-sub-title">{title}</h3>
      </div>
      <p className="ws-sub-desc">{desc}</p>
      <button 
        onClick={onRegister} 
        className="btn btn-primary"
        style={{ width: '100%', marginTop: 'auto' }}
      >
        Register Now <span>→</span>
      </button>
    </div>
  )
}

interface WorkshopGroupProps {
  title: string
  subtitle: string
  isActive: boolean
  onToggle: () => void
  events: WorkshopCardProps[]
  onRegisterWorkshop: () => void
}

const WorkshopGroup = ({ title, subtitle, isActive, onToggle, events, onRegisterWorkshop }: WorkshopGroupProps) => {
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
    <div className={`ws-group ${isActive ? 'is-active' : ''}`}>
      <div
        className="ws-main-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
      >
        <div className="ws-card-info">
          <h2 className="ws-card-title">{title}</h2>
          <p className="ws-card-subtitle">{subtitle}</p>
        </div>
        <div className="ws-expand-icon" aria-hidden="true">↓</div>
      </div>

      <div className="ws-sub-wrapper" aria-hidden={!isActive}>
        <div className="ws-sub-inner">
          <div className="ws-grid">
            {events.map((event, index) => (
              <WorkshopCard 
                key={event.title} 
                {...event} 
                delay={`${(index + 1) * 0.1}s`} 
                onRegister={onRegisterWorkshop}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Export ─── */

export default function WorkshopsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleRegisterClick = () => {
    setShowConfirmation(true)
  }

  return (
    <section id="workshops" className="relative w-full bg-transparent overflow-hidden min-h-screen">
      <div className="workshops-container">
        <div className="ws-hero-text">
          <span className="ws-tagline">Phase_03 // Skill Building</span>
          <h1 className="ws-section-title">Upgrade your <br /><i>Knowledge.</i></h1>
          <p className="ws-subtitle">Learn from industry leading experts and master state-of-the-art tools across diverse domains.</p>
        </div>

        <div className={`ws-list ${activeIndex !== null ? 'ws-list-has-active' : ''}`}>
          <WorkshopGroup
            title="Advanced Technologies"
            subtitle="AI/ML, Generative AI, Agentic AI, and CRISPR"
            isActive={activeIndex === 0}
            onToggle={() => setActiveIndex(activeIndex === 0 ? null : 0)}
            events={ADVANCED_WORKSHOPS as unknown as WorkshopCardProps[]}
            onRegisterWorkshop={handleRegisterClick}
          />
          <WorkshopGroup
            title="Saturday Specials"
            subtitle="Prompt Engineering, Digital Marketing & Cyber Security"
            isActive={activeIndex === 1}
            onToggle={() => setActiveIndex(activeIndex === 1 ? null : 1)}
            events={SATURDAY_WORKSHOPS as unknown as WorkshopCardProps[]}
            onRegisterWorkshop={handleRegisterClick}
          />
          <WorkshopGroup
            title="Sunday Masterclasses"
            subtitle="Health Care AI, Data Analytics & Agentic AI Masterclass"
            isActive={activeIndex === 2}
            onToggle={() => setActiveIndex(activeIndex === 2 ? null : 2)}
            events={SUNDAY_WORKSHOPS as unknown as WorkshopCardProps[]}
            onRegisterWorkshop={handleRegisterClick}
          />
        </div>
      </div>

      {showConfirmation && (
        <WorkshopConfirmation onClose={() => setShowConfirmation(false)} />
      )}
    </section>
  )
}
