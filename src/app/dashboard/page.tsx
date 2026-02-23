'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/common/Navbar'
import './Dashboard.css'

const MY_REGISTRATIONS = [
  {
    id: 'cubic-1',
    event: 'Cubic Extravaganza',
    teamName: 'team_test (leader)',
    teamId: 'cubic4426',
    members: ['Tanmay Roy (You)', 'Shreyansh Rastogi'],
    status: 'Verified'
  },
  {
    id: 'unsc-1',
    event: 'UNSC',
    teamName: 'test_team (leader)',
    teamId: 'unsc4061',
    members: ['Tanmay Roy (You)'],
    status: 'Unpaid'
  }
];

const SENT_REQUESTS = [
  {
    id: 'req-1',
    teamId: 'unsc4061',
    event: 'UNSC',
    status: 'Pending'
  }
];

const JOIN_REQUESTS = [
  {
    id: 'jr-1',
    name: 'Shreyansh Rastogi',
    college: 'IIT Kanpur',
    phone: '1234567890',
    event: 'UNSC',
    teamId: 'unsc4061'
  }
];

const ABSTRACT_SUBMISSIONS = [
  {
    id: 'abs-1',
    event: 'IARC',
    teamId: 'iarc9920',
    status: 'Verified',
    fileName: 'IARC_Abstract_v1.pdf'
  },
  {
    id: 'abs-2',
    event: 'Cubic Extravaganza',
    teamId: 'cubic4426',
    status: 'Pending',
    fileName: 'Cubic_Design_Final.pdf'
  }
];

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
            <h1 className="dash-title">Neural <i>Dashboard</i></h1>
          </div>
          <button className="dash-logout-btn">
            Logout
          </button>
        </header>

        <section className="dashboard-section">
          <h2 className="dash-section-title">
            <span className="title-num">01 //</span> Personal <i>Details.</i>
          </h2>
          
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
          <h2 className="dash-section-title">
            <span className="title-num">02 //</span> My <i>Registrations.</i>
          </h2>
          {MY_REGISTRATIONS.length > 0 ? (
            <div className="registrations-grid">
              {MY_REGISTRATIONS.map(reg => (
                <div key={reg.id} className="reg-card">
                  <div className="reg-card-header">
                    <div>
                      <h3 className="reg-event-name">{reg.event}</h3>
                      <p className="reg-team-info">Team: <span>{reg.teamName}</span></p>
                      <p className="reg-team-id">Team ID: {reg.teamId} <span className="share-hint">(Share this with members)</span></p>
                      <div className="reg-status-container" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className={`status-pill ${reg.status.toLowerCase()}`}>{reg.status}</div>
                        {reg.status === 'Unpaid' ? (
                          <button className="reg-action-btn upload">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                            Upload Receipt
                          </button>
                        ) : (
                          <button className="reg-action-btn view">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View Document
                          </button>
                        )}
                      </div>
                    </div>
                    <button className="withdraw-btn">Withdraw</button>
                  </div>
                  
                  <div className="team-members-box">
                    <span className="members-label">TEAM MEMBERS</span>
                    <div className="members-list">
                      {reg.members.map((m, i) => (
                        <div key={i} className="member-tag">{m}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-text">No active event registrations detected in the current sector.</p>
              <Link href="/competitions" className="explore-btn">Initiate Discovery →</Link>
            </div>
          )}
        </section>

        {/* Abstract Submissions */}
        <section className="dashboard-sub-section">
          <h2 className="dash-section-title">
            <span className="title-num">03 //</span> My <i>Abstracts.</i>
          </h2>
          <div className="requests-container">
            {ABSTRACT_SUBMISSIONS.map(abs => (
              <div key={abs.id} className="request-strip">
                <div className="request-info">
                  <p className="request-title">{abs.event} <span>({abs.teamId})</span></p>
                  <p className="request-event">File: {abs.fileName}</p>
                </div>
                <div className="status-group-sync" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className={`status-pill ${abs.status.toLowerCase()}`}>{abs.status}</div>
                    <button className="reg-action-btn view" style={{ padding: '4px 8px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sent Team Requests */}
        <section className="dashboard-sub-section">
          <h2 className="dash-section-title">
            <span className="title-num">04 //</span> Sent Team <i>Requests.</i>
          </h2>
          <div className="requests-container">
            {SENT_REQUESTS.map(req => (
              <div key={req.id} className="request-strip">
                <div className="request-info">
                  <p className="request-title">Request to join Team: <span>{req.teamId}</span></p>
                  <p className="request-event">Event: {req.event}</p>
                </div>
                <div className={`status-pill ${req.status.toLowerCase()}`}>{req.status}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Requests for Your Teams */}
        <section className="dashboard-sub-section">
          <h2 className="dash-section-title">
            <span className="title-num">05 //</span> Join <i>Requests.</i>
          </h2>
          <div className="requests-container">
            {JOIN_REQUESTS.map(req => (
              <div key={req.id} className="join-request-card">
                <div className="jr-header">
                  <h4 className="jr-name">{req.name}</h4>
                  <div className="jr-actions">
                    <button className="jr-btn accept">Accept</button>
                    <button className="jr-btn reject">Reject</button>
                  </div>
                </div>
                <div className="jr-details">
                  <div className="jr-detail">
                    <span>College:</span> {req.college}
                  </div>
                  <div className="jr-detail">
                    <span>Phone:</span> {req.phone}
                  </div>
                  <div className="jr-detail">
                    <span>Event:</span> {req.event}
                  </div>
                  <div className="jr-detail">
                    <span>Team ID:</span> {req.teamId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
