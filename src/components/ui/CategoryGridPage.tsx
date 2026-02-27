'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import type { CategoryGridData, GridEventCardData } from '@/types/event'
import '@/components/ui/CategoryGrid.css'

/* ─── Reusable Card Component ─── */

function GridEventCard({
  title,
  desc,
  image,
  number,
  href,
  ctaText = 'Enter Arena',
}: GridEventCardData & { ctaText?: string }) {
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
          <div className="btn btn-glass">
            {ctaText} <i>→</i>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Template Component ─── */

export default function CategoryGridPage({ data }: { data: CategoryGridData }) {
  const { title, description, breadcrumbs, canvasId, events, ctaText, ambientGradient } = data

  return (
    <div className="category-grid-page">
      <StarBackgroundViewport mode="rise" count={200} canvasId={canvasId} />
      <div className="noise-grid" />
      <div
        className="ambient-glow-grid"
        style={ambientGradient ? { background: ambientGradient } : undefined}
      />

      <Navbar />

      <header className="hero-grid">
        <div className="breadcrumb-grid">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ margin: '0 10px', opacity: 0.3 }}>/</span>}
              {crumb.href ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : i === breadcrumbs.length - 1 ? (
                <span style={{ color: 'var(--text-primary)' }}>{crumb.label}</span>
              ) : (
                <span>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <h1 className="hero-title-grid">{title}</h1>
        <p className="hero-desc-grid">{description}</p>
      </header>

      <main className="arena-container-grid">
        {events.map((event) => (
          <GridEventCard key={event.title} {...event} ctaText={ctaText} />
        ))}
      </main>
    </div>
  )
}
