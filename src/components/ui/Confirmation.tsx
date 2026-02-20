'use client'

import React, { useState, useEffect, useRef } from 'react'
import './Confirmation.css'

type GatewayState = 'confirm' | 'hub' | 'submitted'

export default function Confirmation() {
    const [state, setState] = useState<GatewayState>('confirm')
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'scanning' | 'complete'>('idle')
    const [fileName, setFileName] = useState<string>('')
    const [progress, setProgress] = useState<number>(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setUploadStatus('scanning')
        setProgress(0)

        let currentProgress = 0
        const interval = setInterval(() => {
            const increment = Math.random() * 7
            currentProgress += increment

            if (currentProgress >= 100) {
                currentProgress = 100
                setProgress(100)
                clearInterval(interval)
                setUploadStatus('complete')
            } else {
                setProgress(currentProgress)
            }
        }, 180)
    }

    const resetUpload = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setUploadStatus('idle')
        setFileName('')
    }

    // --- BACKGROUND STAR ENGINE ---
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

    const transition = (to: GatewayState) => {
        setState(to)
    }

    return (
        <div className="confirmation-overlay">
            <canvas id="star-canvas-gateway" ref={canvasRef}></canvas>
            <div className="noise-gateway"></div>

            <div className="gateway-container">
                {/* STATE: CONFIRMATION */}
                <div className={`state-gateway ${state === 'confirm' ? 'active' : ''}`}>
                    <span className="status-tag-gateway">Protocol_Initialize</span>
                    <h2 className="modal-title-gateway">Proceed to <i>Singularity?</i></h2>
                    <p className="modal-desc-gateway">You are about to synchronize your identity with the Individual Participation node.</p>
                    <div className="btn-group-gateway">
                        <button className="btn-gateway btn-primary-gateway" onClick={() => transition('hub')}>Confirm</button>
                        <button className="btn-gateway btn-secondary-gateway" onClick={() => window.location.reload()}>Cancel</button>
                    </div>
                </div>

                {/* STATE: HUB (PAYMENT & UPLOAD) */}
                <div className={`state-gateway ${state === 'hub' ? 'active' : ''}`}>
                    <h2 className="modal-title-gateway" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Transaction <i>Portal</i></h2>
                    <p className="modal-desc-gateway" style={{ fontSize: '0.85rem', marginBottom: '2rem' }}>
                        To finalize your integration, a consolidated fee of <span style={{ color: 'var(--gateway-accent)', fontWeight: 600 }}>₹3,100</span> is required. 
                        This includes your official Participation Pass and On-Campus Accommodation for Techkriti &apos;26.
                    </p>
                    
                    <div className="action-hub-gateway">
                        <a href="https://onlinesbi.sbi.bank.in/sbicollect" target="_blank" rel="noopener noreferrer" className="payment-cta-gateway">Proceed for Payment</a>
                        
                        <a href="#" className="sub-link-gateway">Read Payment Instructions</a>

                        <div className={`upload-shard-gateway ${uploadStatus}`}>
                            <div className="hologram-scan-gateway"></div>
                            {uploadStatus === 'idle' && (
                                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                                    <span className="upload-label-gateway">Upload Transaction Receipt</span>
                                    <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                                    <p style={{ fontSize: '0.6rem', color: '#888890', marginTop: '8px' }}>PDF / Image Secure Portal</p>
                                </label>
                            )}

                            {uploadStatus === 'scanning' && (
                                <div className="neural-sync-container">
                                    <div className="sync-header">
                                        <div className="status-group-sync">
                                            <span className="label-sync">Integrating Shard</span>
                                            <span className="filename-sync">{fileName.toUpperCase()}</span>
                                        </div>
                                        <div className="percentage-sync">{Math.floor(progress).toString().padStart(2, '0')}%</div>
                                    </div>

                                    <div className="conduit-track-gateway">
                                        <div className="conduit-fill-gateway" style={{ width: `${progress}%` }}>
                                            <div className="lead-laser-gateway"></div>
                                        </div>
                                    </div>

                                    <div className="sync-footer">
                                        <span>{( (progress/100) * 4.2 ).toFixed(1)} / 4.2 MB</span>
                                        <span>Bitrate: Optimized</span>
                                    </div>
                                </div>
                            )}

                            {uploadStatus === 'complete' && (
                                <div className="upload-success">
                                    <div className="mini-check">✓</div>
                                    <div style={{ flex: 1 }}>
                                        <span className="upload-label-gateway" style={{ color: '#4ade80' }}>Transcendence Established</span>
                                        <p style={{ fontSize: '0.55rem', color: '#888890', marginTop: '2px' }}>{fileName} Linked</p>
                                    </div>
                                    <button 
                                        className="change-btn-gateway"
                                        onClick={resetUpload}
                                        aria-label="Change uploaded file"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>

                        {uploadStatus === 'complete' && (
                            <button 
                                className="btn-gateway btn-primary-gateway" 
                                style={{ marginTop: '1rem', width: '100%', flex: 'none' }}
                                onClick={() => transition('submitted')}
                            >
                                Final Proceed
                            </button>
                        )}
                    </div>
                </div>

                {/* STATE: THANK YOU (SUBMITTED) */}
                <div className={`state-gateway ${state === 'submitted' ? 'active' : ''}`}>
                    <div className="success-icon-gateway">✓</div>
                    <span className="status-tag-gateway" style={{ color: '#4ade80' }}>Data Logged</span>
                    <h2 className="modal-title-gateway">Thank You for <i>Registering</i></h2>
                    <p className="modal-desc-gateway">
                        Your transaction details have been received. Our team will manually verify the payment parameters. 
                        You will receive a confirmation link once the link is established.
                    </p>
                    <button className="btn-gateway btn-secondary-gateway" style={{ width: '100%' }} onClick={() => window.location.href = '/'}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}
