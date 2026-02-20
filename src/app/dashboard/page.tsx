'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import './Dashboard.css'

export default function NeuralDashboard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // --- 1. STARFIELD ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width: number, height: number, stars: any[] = []
    let animationFrameId: number

    const initStars = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      stars = []
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 2,
          alpha: Math.random() * 0.5 + 0.1,
          vx: (Math.random() - 0.5) * 0.2, // Subtle horizontal drift
          vy: (Math.random() - 0.5) * 0.2  // Subtle vertical drift
        })
      }
    }

    const animateStars = () => {
      ctx.clearRect(0, 0, width, height)
      stars.forEach(s => {
        s.x += s.vx
        s.y += s.vy

        // Wrap around logic
        if (s.x < 0) s.x = width
        if (s.x > width) s.x = 0
        if (s.y < 0) s.y = height
        if (s.y > height) s.y = 0

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.z, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`
        ctx.fill()
      })
      animationFrameId = requestAnimationFrame(animateStars)
    }

    initStars()
    animateStars()

    window.addEventListener('resize', initStars)
    return () => {
      window.removeEventListener('resize', initStars)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // --- 2. 3D CARD TILT & SPOTLIGHT ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update Spotlight Position
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)

    // Calculate 3D Tilt
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4 // Subtle tilt
    const rotateY = ((x - centerX) / centerX) * 4

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`
  }

  return (
    <div className="dashboard-page">
      <canvas ref={canvasRef} className="star-canvas-dash" />
      <div className="noise-dash" />

      <Navbar />

      <main className="dash-container">
        <header className="dashboard-header">
          <div>
            <div className="status-badge">
              <div className="status-dot"></div> Singularity Synchronized
            </div>
            <h1 className="dash-title">Neural <i>Identity</i></h1>
          </div>
        </header>

        <section>
          <span className="section-label">01 // Personal Parameters</span>
          
          <div 
            className="identity-card" 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-glow"></div>

            <button className="edit-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Modify Parameters
            </button>
            
            <div className="detail-item">
              <span className="detail-label">Designation // Full Name</span>
              <div className="detail-value">Tanmay Roy</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Neural Address // Email</span>
              <div className="detail-value">rtanmay588@gmail.com</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Institution // College</span>
              <div className="detail-value">IIT Kanpur</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Comm_Link // Phone</span>
              <div className="detail-value">+91 89000 58536</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Origin // City</span>
              <div className="detail-value">Kanpur</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Specialization // Branch</span>
              <div className="detail-value">Electrical Engineering</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Temporal Rank // Year</span>
              <div className="detail-value">3rd Year Undergraduate</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Phenotype // Gender</span>
              <div className="detail-value">Male</div>
            </div>
          </div>
        </section>

        <section className="registrations-section">
          <span className="section-label">02 // Active Transmissions</span>
          <div className="empty-state">
            <p className="empty-text">No active event registrations detected in the current sector.</p>
            <Link href="/competitions" className="explore-btn">Initiate Discovery →</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
