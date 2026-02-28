'use client'

import React, { useState, useEffect, useRef } from 'react'
import './WorkshopConfirmation.css'

type GatewayState = 'payment' | 'submitted'

interface WorkshopConfirmationProps {
    onClose: () => void;
}

export default function WorkshopConfirmation({ onClose }: WorkshopConfirmationProps) {
    const [state, setState] = useState<GatewayState>('payment')
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

    const handleSubmission = () => {
        setState('submitted')
    }

    return (
        <div className="wsc-overlay">
            <canvas id="wsc-star-canvas" ref={canvasRef}></canvas>
            <div className="wsc-noise"></div>

            <div className="wsc-container">
                <button className="wsc-close-btn" onClick={onClose} aria-label="Close dialog">×</button>

                {state === 'payment' && (
                    <div className="wsc-state active">
                        <span className="wsc-status-tag">Payment & Verification</span>
                        <h2 className="wsc-modal-title">Complete <i>Registration</i></h2>
                        <p className="wsc-modal-desc">
                            To secure your seat, please proceed with the payment and upload your receipt below for verification.
                        </p>
                        
                        <div className="wsc-action-hub">
                            <a href="https://onlinesbi.sbi.bank.in/sbicollect" target="_blank" rel="noopener noreferrer" className="wsc-payment-cta">Proceed to Payment</a>
                            
                            <div className={`wsc-upload-shard ${uploadStatus}`}>
                                <div className="wsc-hologram-scan"></div>
                                {uploadStatus === 'idle' && (
                                    <label htmlFor="wsc-file-upload" style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
                                        <span className="wsc-upload-label">Upload Payment Receipt</span>
                                        <input type="file" id="wsc-file-upload" style={{ display: 'none' }} onChange={handleFileUpload} accept=".pdf,image/*" />
                                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>PDF / Image Format</p>
                                    </label>
                                )}

                                {uploadStatus === 'scanning' && (
                                    <div className="wsc-sync-container">
                                        <div className="wsc-sync-header">
                                            <div className="wsc-status-group">
                                                <span className="wsc-label-sync">Syncing Receipt</span>
                                                <span className="wsc-filename-sync">{fileName.toUpperCase()}</span>
                                            </div>
                                            <div className="wsc-percentage-sync">{Math.floor(progress)}%</div>
                                        </div>
                                        <div className="wsc-conduit-track">
                                            <div className="wsc-conduit-fill" style={{ width: `${progress}%` }}>
                                                <div className="wsc-lead-laser"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {uploadStatus === 'complete' && (
                                    <div className="wsc-upload-success">
                                        <div className="wsc-mini-check">✓</div>
                                        <div style={{ flex: 1, textAlign: 'left' }}>
                                            <span className="wsc-upload-label" style={{ color: '#4ade80' }}>Upload Complete</span>
                                            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{fileName}</p>
                                        </div>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={resetUpload}>Change</button>
                                    </div>
                                )}
                            </div>

                            <button 
                                className="btn btn-primary btn-shine" 
                                style={{ width: '100%', marginTop: '0.5rem' }} 
                                onClick={handleSubmission}
                                disabled={uploadStatus !== 'complete'}
                            >
                                Submit Receipt
                            </button>
                        </div>
                    </div>
                )}

                {state === 'submitted' && (
                    <div className="wsc-state active">
                        <div className="wsc-success-icon">✓</div>
                        <span className="wsc-status-tag" style={{ color: '#4ade80' }}>Synchronized</span>
                        <h2 className="wsc-modal-title">Registration <i>Captured</i></h2>
                        <p className="wsc-modal-desc">
                            Your details and payment receipt have been received. Our agents will verify your registration shortly. You can track your <b>payment verification status</b> in your personal dashboard.
                        </p>
                        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onClose}>
                            Close Portal
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
