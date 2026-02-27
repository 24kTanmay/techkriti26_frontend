'use client'

import React, { useState, useEffect, useRef } from 'react'
import './CreateTeam.css'

type CreateTeamState = 'input' | 'processing' | 'success'

interface CreateTeamProps {
    onClose: () => void;
}

export default function CreateTeam({ onClose }: CreateTeamProps) {
    const [state, setState] = useState<CreateTeamState>('input')
    const [teamName, setTeamName] = useState('')
    const [progress, setProgress] = useState(0)
    const [teamId, setTeamId] = useState('')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // --- BACKGROUND STAR ENGINE (Reused from Confirmation) ---
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let w: number, h: number, stars: any[] = []
        let animationFrameId: number

        const init = () => {
            w = canvas.width = window.innerWidth
            h = canvas.height = window.innerHeight
            stars = []
            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 1.5,
                    alpha: Math.random() * 0.5 + 0.1
                })
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h)
            stars.forEach(s => {
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(var(--color-white-rgb), ${s.alpha})`
                ctx.fill()
            })
            animationFrameId = requestAnimationFrame(draw)
        }

        window.addEventListener('resize', init)
        init()
        draw()

        return () => {
            window.removeEventListener('resize', init)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    const handleConfirm = () => {
        if (!teamName.trim()) return
        
        setState('processing')
        setProgress(0)

        // Mock Team ID generation
        const randomId = `tk26-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        setTeamId(randomId)

        let currentProgress = 0
        const interval = setInterval(() => {
            const increment = Math.random() * 10
            currentProgress += increment

            if (currentProgress >= 100) {
                currentProgress = 100
                setProgress(100)
                clearInterval(interval)
                setTimeout(() => setState('success'), 600)
            } else {
                setProgress(currentProgress)
            }
        }, 150)
    }

    return (
        <div className="create-team-overlay">
            <canvas id="star-canvas-createteam" ref={canvasRef}></canvas>
            <div className="noise-createteam"></div>

            <div className="createteam-container">
                {/* STATE: INPUT */}
                <div className={`state-createteam ${state === 'input' ? 'active' : ''}`}>
                    <span className="status-tag-createteam">Team Registration</span>
                    <h2 className="modal-title-createteam">Create a <i>Team</i></h2>
                    <p className="modal-desc-createteam">Enter a name for your team to participate together.</p>
                    
                    <div className="input-field-createteam">
                        <label htmlFor="team-name" className="label-createteam">Team Name</label>
                        <input 
                            type="text" 
                            id="team-name"
                            placeholder="e.g. Cyber Guardians"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="text-input-createteam"
                            autoComplete="off"
                        />
                        <div className="input-glow"></div>
                    </div>

                    <div className="btn-group-createteam">
                        <button 
                            className="btn btn-primary" 
                            onClick={handleConfirm}
                            disabled={!teamName.trim()}
                        >
                            Confirm
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </div>

                {/* STATE: PROCESSING */}
                <div className={`state-createteam ${state === 'processing' ? 'active' : ''}`}>
                    <div className="hologram-spinner-createteam">
                        <div className="ring-createteam ring-1"></div>
                        <div className="ring-createteam ring-2"></div>
                        <div className="ring-createteam ring-3"></div>
                    </div>
                    <h2 className="modal-title-createteam">Creating <i>Team</i></h2>
                    <p className="modal-desc-createteam">Setting up your team <b>{teamName}</b>.</p>
                    
                    <div className="progress-conduit-createteam">
                        <div className="conduit-fill-createteam" style={{ width: `${progress}%` }}>
                            <div className="lead-laser-createteam"></div>
                        </div>
                    </div>
                    <div className="progress-label-createteam">{Math.floor(progress)}% Complete</div>
                </div>

                {/* STATE: SUCCESS */}
                <div className={`state-createteam ${state === 'success' ? 'active' : ''}`}>
                    <div className="success-icon-createteam">✓</div>
                    <span className="status-tag-createteam" style={{ color: 'var(--color-success)' }}>Success</span>
                    <h2 className="modal-title-createteam">Team <i>Created</i></h2>
                    <p className="modal-desc-createteam">
                        Your team <b>{teamName}</b> has been registered successfully.
                    </p>
                    
                    <div className="team-id-card-createteam">
                        <span className="id-label-createteam">Invite Link</span>
                        <div className="id-value-createteam" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                            {typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?team=${teamId}` : `https://techkriti.org/competitions?team=${teamId}`}
                        </div>
                        <button 
                            className="btn btn-primary btn-shine" 
                            style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem', width: '100%' }}
                            onClick={() => {
                                const link = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?team=${teamId}` : `https://techkriti.org/competitions?team=${teamId}`;
                                navigator.clipboard.writeText(link);
                                const btn = document.getElementById('copy-invite-btn');
                                if (btn) {
                                    const originalText = btn.innerHTML;
                                    btn.innerHTML = 'Copied! ✓';
                                    setTimeout(() => btn.innerHTML = originalText, 2000);
                                }
                            }}
                            id="copy-invite-btn"
                        >
                            Copy Invite Link
                        </button>
                    </div>

                    <p className="id-hint-createteam" style={{ marginTop: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        Send this link to anyone so they can join your team instantly.
                    </p>

                    <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onClose}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}
