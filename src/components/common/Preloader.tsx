'use client'

import React, { useEffect, useRef, useState } from 'react'
import './Preloader.css'

export default function Preloader() {
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Progress Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => setIsComplete(true), 500)
                    return 100
                }
                const increment = Math.random() * 5
                return Math.min(100, prev + increment)
            })
        }, 100)
        return () => clearInterval(interval)
    }, [])

    // Neural Web Animation
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let w: number, h: number, points: any[] = []
        let animationId: number

        const init = () => {
            w = canvas.width = window.innerWidth
            h = canvas.height = window.innerHeight
            points = []
            for(let i=0; i<60; i++) {
                points.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                })
            }
        }

        const draw = () => {
            ctx.clearRect(0,0,w,h)
            ctx.fillStyle = "rgba(255,255,255,0.2)"
            
            points.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy
                if(p.x < 0 || p.x > w) p.vx *= -1
                if(p.y < 0 || p.y > h) p.vy *= -1
                
                ctx.beginPath()
                ctx.arc(p.x, p.y, 1, 0, Math.PI*2)
                ctx.fill()

                for(let j=i+1; j<points.length; j++) {
                    const p2 = points[j]
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
                    if(dist < 150) {
                        ctx.strokeStyle = `rgba(255,255,255,${(1 - dist/150) * 0.15})`
                        ctx.lineWidth = 0.5
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.stroke()
                    }
                }
            })
            animationId = requestAnimationFrame(draw)
        }

        window.addEventListener('resize', init)
        init()
        draw()

        return () => {
            window.removeEventListener('resize', init)
            cancelAnimationFrame(animationId)
        }
    }, [])

    if (isComplete && progress === 100) return null

    return (
        <div className={`preloader-overlay ${progress === 100 ? 'fading' : ''}`} 
             style={{ 
                 opacity: progress === 100 ? 0 : 1,
                 transform: progress === 100 ? 'scale(1.1)' : 'scale(1)',
                 pointerEvents: progress === 100 ? 'none' : 'all'
             }}>
            <canvas ref={canvasRef} className="preloader-canvas" />
            
            <div className="preloader-content">
                <div className="preloader-meta">Recalibrating Neural Architecture...</div>
                
                <div className="preloader-progress-bar">
                    <div className="preloader-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                
                <div style={{ 
                    marginTop: '20px', 
                    fontFamily: 'monospace', 
                    fontSize: '9px', 
                    color: '#333',
                    letterSpacing: '2px'
                }}>
                    SYNCING_CORE_NODES_{Math.round(progress)}%
                </div>
            </div>
        </div>
    )
}
