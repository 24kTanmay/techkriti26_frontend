'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/common/Navbar'
import { useAuth } from '../../context/AuthContext'
import {
    getUserRegistrations,
    getPendingRequestsForLeader,
    getSentRequests,
    handleTeamRequest,
    withdrawFromEvent
} from '../../services/eventService'
import './Dashboard.css'

interface TeamMember {
  uid: string;
  fullName: string;
}

interface Registration {
  id: string;
  eventId?: string;
  eventName?: string;
  event?: { id?: string; name?: string } | null;
  teamId?: string;
  role?: string;
  team?: {
    name?: string;
    memberDetails?: TeamMember[];
  } | null;
}

interface SentRequest {
  id: string;
  teamId?: string;
  eventId?: string;
  eventName?: string;
  status?: string;
}

interface JoinRequest {
  id: string;
  eventId?: string;
  eventName?: string;
  teamId?: string;
  user?: {
    fullName?: string;
    college?: string;
    phone?: string;
  } | null;
}

export default function NeuralDashboard() {
  const router = useRouter()
  const { currentUser, userData, logout } = useAuth()
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([])
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([])
  const [loadingConfig, setLoadingConfig] = useState(true)

  const fetchDashboardData = async () => {
    if (!currentUser) return;
    setLoadingConfig(true);
    try {
        const [regs, leaderRequests, myRequests] = await Promise.all([
            getUserRegistrations(currentUser.uid),
            getPendingRequestsForLeader(currentUser.uid),
            getSentRequests(currentUser.uid)
        ]);

        setRegistrations(regs);
        setPendingRequests(leaderRequests);
        setSentRequests(myRequests);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    } finally {
        setLoadingConfig(false);
    }
  };

  useEffect(() => {
      fetchDashboardData();
  }, [currentUser]);

  const onAcceptRequest = async (requestId: string) => {
      try {
          await handleTeamRequest(requestId, 'accepted');
          fetchDashboardData();
      } catch (error: unknown) {
          console.error("Accept Error:", error);
          if (error instanceof Error) {
            alert("Failed to accept request: " + error.message);
          }
      }
  };

  const onRejectRequest = async (requestId: string) => {
      try {
          await handleTeamRequest(requestId, 'rejected');
          fetchDashboardData();
      } catch (error) {
          alert("Failed to reject request");
      }
  };

  const onWithdraw = async (eventId: string) => {
      if (window.confirm("Are you sure you want to withdraw from this event?")) {
          try {
              if (currentUser) {
                  await withdrawFromEvent(currentUser.uid, eventId);
                  fetchDashboardData();
              }
          } catch (error) {
              alert("Failed to withdraw");
          }
      }
  };

  // --- 1. STARFIELD ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width: number, height: number, stars: {
      x: number;
      y: number;
      z: number;
      alpha: number;
      vx: number;
      vy: number;
    }[] = []
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
          <button 
            className="dash-logout-btn" 
            onClick={async () => {
              try {
                await logout();
                router.push('/');
              } catch (error) {
                console.error("Failed to log out", error);
              }
            }}
          >
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
              <div className="detail-value">{userData?.fullName || currentUser?.displayName || 'Unknown'}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Neural Address // Email</span>
              <div className="detail-value">{userData?.email || currentUser?.email || 'Unknown'}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Institution // College</span>
              <div className="detail-value">{userData?.college || 'N/A'}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Comm_Link // Phone</span>
              <div className="detail-value">{userData?.phone || 'N/A'}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Origin // City</span>
              <div className="detail-value">{userData?.city || 'N/A'}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Specialization // Branch</span>
              <div className="detail-value">{userData?.branch || 'N/A'}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Temporal Rank // Year</span>
              <div className="detail-value">{userData?.year || 'N/A'}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Phenotype // Gender</span>
              <div className="detail-value">{userData?.gender || 'N/A'}</div>
            </div>
          </div>
        </section>

        <section className="registrations-section">
          <h2 className="dash-section-title">
            <span className="title-num">02 //</span> My <i>Registrations.</i>
          </h2>
          {registrations.length > 0 ? (
            <div className="registrations-grid">
              {registrations.map(reg => (
                <div key={reg.id} className="reg-card">
                  <div className="reg-card-header">
                    <div>
                      <h3 className="reg-event-name">{reg.event?.name || reg.eventName || reg.eventId}</h3>
                      {reg.teamId && (
                        <>
                          <p className="reg-team-info">Team: <span>{reg.team?.name} ({reg.role})</span></p>
                          {reg.role === 'leader' && (
                            <p className="reg-team-id">Team ID: {reg.teamId} <span className="share-hint">(Share this with members)</span></p>
                          )}
                        </>
                      )}
                    </div>
                    <button className="withdraw-btn" onClick={() => reg.eventId && onWithdraw(reg.eventId)}>Withdraw</button>
                  </div>
                  
                  {reg.team?.memberDetails && (
                    <div className="team-members-box">
                      <span className="members-label">TEAM MEMBERS</span>
                      <div className="members-list">
                        {reg.team.memberDetails.map((m) => (
                          <div key={m.uid} className="member-tag" style={{ border: m.uid === currentUser?.uid ? '1px solid var(--primary)' : '1px solid transparent' }}>
                            {m.fullName} {m.uid === currentUser?.uid && '(You)'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

        {/* Sent Team Requests */}
        {sentRequests.length > 0 && (
          <section className="dashboard-sub-section">
            <h2 className="dash-section-title">
              <span className="title-num">03 //</span> Sent Team <i>Requests.</i>
            </h2>
            <div className="requests-container">
              {sentRequests.map(req => (
                <div key={req.id} className="request-strip">
                  <div className="request-info">
                    <p className="request-title">Request to join Team: <span>{req.teamId}</span></p>
                    <p className="request-event">Event: {req.eventName || req.eventId}</p>
                  </div>
                  <div className="status-pill pending">{req.status || 'Pending'}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Join Requests for Your Teams */}
        {pendingRequests.length > 0 && (
          <section className="dashboard-sub-section">
            <h2 className="dash-section-title">
              <span className="title-num">04 //</span> Join <i>Requests.</i>
            </h2>
            <div className="requests-container">
              {pendingRequests.map(req => (
                <div key={req.id} className="join-request-card">
                  <div className="jr-header">
                    <h4 className="jr-name">{req.user?.fullName || 'Unknown User'}</h4>
                    <div className="jr-actions">
                      <button className="jr-btn accept" onClick={() => onAcceptRequest(req.id)}>Accept</button>
                      <button className="jr-btn reject" onClick={() => onRejectRequest(req.id)}>Reject</button>
                    </div>
                  </div>
                  <div className="jr-details">
                    <div className="jr-detail">
                      <span>College:</span> {req.user?.college || 'N/A'}
                    </div>
                    <div className="jr-detail">
                      <span>Phone:</span> {req.user?.phone || 'N/A'}
                    </div>
                    <div className="jr-detail">
                      <span>Event:</span> {req.eventName || req.eventId}
                    </div>
                    <div className="jr-detail">
                      <span>Team ID:</span> {req.teamId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
