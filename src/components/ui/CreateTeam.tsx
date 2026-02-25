'use client'

import React, { useState, useEffect, useRef } from 'react'
import './CreateTeam.css'

import { useAuth } from '../../context/AuthContext'
import { createTeam } from '../../services/eventService'

type CreateTeamState = 'input' | 'processing' | 'success' | 'error'

interface CreateTeamProps {
    onClose: () => void;
    eventId: string;
    competitionName: string;
}

export default function CreateTeam({ onClose, eventId, competitionName }: CreateTeamProps) {
    const [state, setState] = useState<CreateTeamState>('input')
    const [errorMsg, setErrorMsg] = useState<string>('')
    const { currentUser } = useAuth()
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
                ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`
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

    const handleConfirm = async () => {
        if (!teamName.trim() || !currentUser) return
        
        setState('processing')
        setProgress(0)

        // Give UI time to show processing text
        let currentProgress = 0
        const interval = setInterval(() => {
            currentProgress += Math.random() * 20
            if (currentProgress < 90) setProgress(currentProgress)
        }, 150)

        try {
            const newTeamId = await createTeam(currentUser.uid, eventId, competitionName, teamName);
            setTeamId(newTeamId);
            
            clearInterval(interval);
            setProgress(100);
            setTimeout(() => setState('success'), 600)
        } catch (error: any) {
            clearInterval(interval);
            console.error(error);
            setErrorMsg(error.message || "Failed to create team.");
            setState('error');
        }
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
                            className="btn-createteam btn-primary-createteam" 
                            onClick={handleConfirm}
                            disabled={!teamName.trim()}
                        >
                            Confirm
                        </button>
                        <button className="btn-createteam btn-secondary-createteam" onClick={onClose}>Cancel</button>
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
                    <span className="status-tag-createteam" style={{ color: '#4ade80' }}>Success</span>
                    <h2 className="modal-title-createteam">Team <i>Created</i></h2>
                    <p className="modal-desc-createteam">
                        Your team <b>{teamName}</b> has been registered successfully.
                    </p>
                    
                    <div className="team-id-card-createteam">
                        <span className="id-label-createteam">Team Access ID</span>
                        <div className="id-value-createteam">{teamId}</div>
                        <p className="id-hint-createteam">Share this ID with your members so they can join your team.</p>
                    </div>

                    <button className="btn-createteam btn-secondary-createteam" style={{ width: '100%' }} onClick={onClose}>
                        Return to Event
                    </button>
                </div>

                {/* STATE: ERROR */}
                <div className={`state-createteam ${state === 'error' ? 'active' : ''}`}>
                    <div className="success-icon-createteam" style={{ color: '#ef4444', borderColor: '#ef4444' }}>!</div>
                    <span className="status-tag-createteam" style={{ color: '#ef4444' }}>Error</span>
                    <h2 className="modal-title-createteam">Creation <i>Failed</i></h2>
                    <p className="modal-desc-createteam" style={{ color: '#ef4444' }}>
                        {errorMsg}
                    </p>
                    <button className="btn-createteam btn-secondary-createteam" style={{ width: '100%', marginTop: '1rem' }} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
