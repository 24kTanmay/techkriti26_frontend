'use client'

import React, { useState, useEffect, useRef } from 'react'
import './Confirmation.css'
import PaymentInstructions from './PaymentInstructions'

type GatewayState = 'confirm' | 'hub' | 'submitted' | 'pay_later'

interface ConfirmationProps {
    onClose: () => void;
}

export default function Confirmation({ onClose }: ConfirmationProps) {
    const [state, setState] = useState<GatewayState>('confirm')
    const [showInstructions, setShowInstructions] = useState(false)
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

    const transition = (to: GatewayState) => {
        setState(to)
    }

    return (
        <div className="confirmation-overlay">
            <canvas id="star-canvas-gateway" ref={canvasRef}></canvas>
            <div className="noise-gateway"></div>

            <div className="gateway-container">
                <div className={`state-gateway ${state === 'confirm' ? 'active' : ''}`}>
                    <span className="status-tag-gateway">Registration</span>
                    <h2 className="modal-title-gateway">Register for <i>Participation?</i></h2>
                    <p className="modal-desc-gateway">You are about to register for individual participation in this event.</p>
                    <div className="btn-group-gateway">
                        <button className="btn btn-primary" onClick={() => transition('hub')}>Confirm</button>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </div>

                {/* STATE: HUB (PAYMENT & UPLOAD) */}
                <div className={`state-gateway ${state === 'hub' ? 'active' : ''}`}>
                    <h2 className="modal-title-gateway" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Payment <i>Portal</i></h2>
                    <p className="modal-desc-gateway" style={{ fontSize: '0.85rem', marginBottom: '2rem' }}>
                        To complete your registration, a fee of <span style={{ color: 'var(--gateway-accent)', fontWeight: 600 }}>₹3,100</span> is required. 
                        This includes your Participation Pass and On-Campus Accommodation.
                    </p>
                    
                    <div className="action-hub-gateway">
                        <a href="https://onlinesbi.sbi.bank.in/sbicollect" target="_blank" rel="noopener noreferrer" className="payment-cta-gateway">Proceed to Payment</a>
                        
                        <a 
                            href="#" 
                            className="sub-link-gateway" 
                            onClick={(e) => { e.preventDefault(); setShowInstructions(true); }}
                        >
                            Read Payment Instructions
                        </a>

                        <div className={`upload-shard-gateway ${uploadStatus}`}>
                            <div className="hologram-scan-gateway"></div>
                            {uploadStatus === 'idle' && (
                                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                                    <span className="upload-label-gateway">Upload Payment Receipt</span>
                                    <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                                    <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '8px' }}>PDF / Image Format</p>
                                </label>
                            )}

                            {uploadStatus === 'scanning' && (
                                <div className="neural-sync-container">
                                    <div className="sync-header">
                                        <div className="status-group-sync">
                                            <span className="label-sync">Uploading Receipt</span>
                                            <span className="filename-sync">{fileName.toUpperCase()}</span>
                                        </div>
                                        <div className="percentage-sync">{Math.floor(progress).toString().padStart(2, '0')}%</div>
                                    </div>

                                    <div className="conduit-track-gateway">
                                        <div className="conduit-fill-gateway" style={{ width: `${progress}%` }}>
                                            <div className="lead-laser-gateway"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {uploadStatus === 'complete' && (
                                <div className="upload-success">
                                    <div className="mini-check">✓</div>
                                    <div style={{ flex: 1 }}>
                                        <span className="upload-label-gateway" style={{ color: 'var(--color-success)' }}>Upload Complete</span>
                                        <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '2px' }}>{fileName} Attached</p>
                                    </div>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={resetUpload}
                                        aria-label="Change uploaded file"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="pay-later-divider-gateway">
                            <span>OR</span>
                        </div>

                        <button 
                            className="btn btn-secondary" 
                            style={{ 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer', 
                                textAlign: 'center', 
                                width: '100%', 
                                opacity: 0.7,
                                whiteSpace: 'normal',
                                height: 'auto',
                                padding: '0.8rem 1rem',
                                lineHeight: '1.4'
                            }}
                            onClick={() => transition('pay_later')}
                        >
                            Complete Registration & Pay Later
                        </button>

                        {uploadStatus === 'complete' && (
                            <button 
                                className="btn btn-primary btn-shine" 
                                style={{ marginTop: '1rem', width: '100%', flex: 'none' }}
                                onClick={() => transition('submitted')}
                            >
                                Submit Registration
                            </button>
                        )}
                    </div>
                </div>

                {/* STATE: PAY LATER CONFIRMATION */}
                <div className={`state-gateway ${state === 'pay_later' ? 'active' : ''}`}>
                    <div className="loader-ring-gateway" style={{ borderTopColor: 'var(--gateway-accent)', width: '40px', height: '40px' }}></div>
                    <span className="status-tag-gateway">Attention</span>
                    <h2 className="modal-title-gateway">Finalize <i>Now?</i></h2>
                    <p className="modal-desc-gateway">
                        Your registration will be saved. You can upload the payment receipt later from your <b>Neural Dashboard</b> to complete verification.
                    </p>
                    <div className="btn-group-gateway">
                        <button className="btn btn-primary" onClick={() => transition('submitted')}>Confirm</button>
                        <button className="btn btn-secondary" onClick={() => transition('hub')}>Go Back</button>
                    </div>
                </div>

                {/* STATE: THANK YOU (SUBMITTED) */}
                <div className={`state-gateway ${state === 'submitted' ? 'active' : ''}`}>
                    <div className="success-icon-gateway">✓</div>
                    <span className="status-tag-gateway" style={{ color: 'var(--color-success)' }}>Submitted</span>
                    <h2 className="modal-title-gateway">Registration <i>Received</i></h2>
                    <p className="modal-desc-gateway">
                        Your payment details have been submitted. Our team will verify the payment and confirm your registration soon.
                    </p>
                    <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onClose}>
                        Return to Dashboard
                    </button>
                </div>
            </div>

            {showInstructions && (
                <PaymentInstructions onClose={() => setShowInstructions(false)} />
            )}
        </div>
    )
}
