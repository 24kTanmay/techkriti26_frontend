'use client'

import React, { useState, useEffect, useRef } from 'react'
import './JoinTeam.css'

type JoinTeamState = 'input' | 'processing' | 'success'

interface JoinTeamProps {
    onClose: () => void;
}

export default function JoinTeam({ onClose }: JoinTeamProps) {
    const [state, setState] = useState<JoinTeamState>('input')
    const [teamId, setTeamId] = useState('')
    const [progress, setProgress] = useState(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // --- BACKGROUND STAR ENGINE (Reused from Confirmation/CreateTeam) ---
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
        if (!teamId.trim()) return
        
        setState('processing')
        setProgress(0)

        let currentProgress = 0
        const interval = setInterval(() => {
            const increment = Math.random() * 12
            currentProgress += increment

            if (currentProgress >= 100) {
                currentProgress = 100
                setProgress(100)
                clearInterval(interval)
                setTimeout(() => setState('success'), 600)
            } else {
                setProgress(currentProgress)
            }
        }, 120)
    }

    return (
        <div className="join-team-overlay">
            <canvas id="star-canvas-jointeam" ref={canvasRef}></canvas>
            <div className="noise-jointeam"></div>

            <div className="jointeam-container">
                {/* STATE: INPUT */}
                <div className={`state-jointeam ${state === 'input' ? 'active' : ''}`}>
                    <span className="status-tag-jointeam">Join Team</span>
                    <h2 className="modal-title-jointeam">Join a <i>Team</i></h2>
                    <p className="modal-desc-jointeam">Enter the unique ID of the team you wish to join.</p>
                    
                    <div className="input-field-jointeam">
                        <label htmlFor="team-id" className="label-jointeam">Team ID</label>
                        <input 
                            type="text" 
                            id="team-id"
                            placeholder="e.g. TK26-XYZ123"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            className="text-input-jointeam"
                            autoComplete="off"
                        />
                    </div>

                    <div className="btn-group-jointeam">
                        <button 
                            className="btn btn-primary" 
                            onClick={handleConfirm}
                            disabled={!teamId.trim()}
                        >
                            Confirm
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </div>

                {/* STATE: PROCESSING */}
                <div className={`state-jointeam ${state === 'processing' ? 'active' : ''}`}>
                    <div className="beacon-scanner-jointeam">
                        <div className="scanner-line-jointeam"></div>
                        <div className="target-id-jointeam">{teamId.toUpperCase()}</div>
                    </div>
                    <h2 className="modal-title-jointeam">Searching <i>Team</i></h2>
                    <p className="modal-desc-jointeam">Sending your request to the team leader.</p>
                    
                    <div className="progress-conduit-jointeam">
                        <div className="conduit-fill-jointeam" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="progress-label-jointeam">Sending Request... {Math.floor(progress)}%</div>
                </div>

                {/* STATE: SUCCESS */}
                <div className={`state-createteam active ${state === 'success' ? 'active' : ''}`} style={{ display: state === 'success' ? 'flex' : 'none' }}>
                    <div className="success-icon-createteam">✓</div>
                    <span className="status-tag-createteam" style={{ color: 'var(--color-success)' }}>Request Sent</span>
                    <h2 className="modal-title-createteam">Request <i>Logged</i></h2>
                    <p className="modal-desc-createteam" style={{ maxWidth: '300px' }}>
                        Your request to join <b>{teamId.toUpperCase()}</b> has been sent to the team leader.
                    </p>
                    <p className="modal-desc-createteam" style={{ fontSize: '0.75rem', marginTop: '-1rem', opacity: 0.7 }}>
                        You will be notified once they approve your request.
                    </p>
                    <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onClose}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}
