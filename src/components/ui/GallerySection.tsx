'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import StarBackground from './StarBackground'
import './GallerySection.css'

/* ─── Types ─── */

interface FrameData {
  id: string
  label: string
  status: string
  sizeClass: string
  speed: number
}

/* ─── Static Data (hoisted — allocated once) ─── */

const FRAMES: FrameData[] = [
  { id: 'Node_001', label: 'Hero Fragment', status: 'Awaiting Data...', sizeClass: 'gallery-size-large', speed: 0.05 },
  { id: 'Node_002', label: 'Tall Offset', status: 'Processing', sizeClass: 'gallery-size-tall', speed: 0.12 },
  { id: 'Node_003', label: 'Square', status: 'Standby', sizeClass: 'gallery-size-square', speed: 0.08 },
  { id: 'Node_004', label: 'Wide', status: 'Calibrating...', sizeClass: 'gallery-size-wide', speed: 0.03 },
  { id: 'Node_005', label: 'Square', status: 'Synced', sizeClass: 'gallery-size-square', speed: 0.1 },
  { id: 'Node_006', label: 'Square', status: 'Standby', sizeClass: 'gallery-size-square', speed: 0.06 },
  { id: 'Node_007', label: 'Tall', status: 'Awaiting Data...', sizeClass: 'gallery-size-tall', speed: 0.15 },
  { id: 'Node_008', label: 'Large', status: 'System Nominal', sizeClass: 'gallery-size-large', speed: 0.04 },
]

/* ─── Gallery Frame Component ─── */

const GalleryFrame = ({ id, status, sizeClass, speed }: FrameData) => {
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return

    // IntersectionObserver for scroll reveal
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          observer.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -100px 0px', threshold: 0.1 }
    )
    observer.observe(el)

    // Scroll parallax
    const handleScroll = () => {
      if (!el.classList.contains('in-view')) return
      const yPos = -(window.scrollY * speed)
      el.style.transform = `translateY(${yPos}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [speed])

  return (
    <div
      ref={frameRef}
      className={`gallery-frame ${sizeClass}`}
    >
      <div className="gallery-frame-meta">
        <span>{id}</span>
        <span>{status}</span>
      </div>
    </div>
  )
}

/* ─── Main Gallery Section ─── */

export default function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Mouse spotlight tracking on the gallery container
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return
    const rect = galleryRef.current.getBoundingClientRect()
    galleryRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    galleryRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  // Scroll reveal for the header text
  useEffect(() => {
    const headerEl = headerRef.current
    if (!headerEl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add in-view to all animated children
          headerEl.querySelectorAll('.gallery-tagline, .gallery-title, .gallery-subtitle')
            .forEach(child => child.classList.add('in-view'))
          observer.unobserve(headerEl)
        }
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    )
    observer.observe(headerEl)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="gallery" className="relative w-full bg-[#020202] overflow-hidden">
      <StarBackground mode="drift" count={250} sizing="container" />
      <div className="gallery-noise" />

      {/* Hero Header */}
      <header className="gallery-header-section" ref={headerRef}>
        <span className="gallery-tagline">Phase_03 // Fragments</span>
        <h1 className="gallery-title">Visualizing the <br /><i>Singularity.</i></h1>
        <p className="gallery-subtitle">
          A neural archive of past transcensions. Records of intelligence, innovation, and order captured across time.
        </p>
      </header>

      {/* Spatial Archive Grid */}
      <div
        className="gallery-container"
        ref={galleryRef}
        onMouseMove={handleMouseMove}
      >
        <div className="gallery-grid-wrap">
          {FRAMES.map(frame => (
            <GalleryFrame key={frame.id} {...frame} />
          ))}
        </div>
      </div>
    </section>
  )
}
