'use client'

import React, { useEffect, useRef, useState } from 'react'
import './TeamSection.css'

const team = [
    { name: "Aarav Sharma", role: "Head of Infrastructure", bio: "Mapping the hardware limits of the current reality." },
    { name: "Isha Gupta", role: "Creative Director", bio: "Translating neural awareness into visual transcendence." },
    { name: "Rohan Das", role: "Public Relations", bio: "Synchronizing external perception with the core vision." },
    { name: "Meera Reddy", role: "Events Lead", bio: "Designing the physical nodes of the Singularity journey." },
    { name: "Vikram Singh", role: "Technical Head", bio: "Compiling the code that reveals underlying universal order." },
    { name: "Sanya Malhotra", role: "Logistics Manager", bio: "Optimizing the flow of energy and resources." }
]

export default function TeamSection() {
    const viewportRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)

    const [currentX, setCurrentX] = useState(0)
    const targetX = useRef(0)
    const displayX = useRef(0)
    const isDragging = useRef(false)
    const startX = useRef(0)

    // --- SMOOTH SCROLL & DRAG ---
    useEffect(() => {
        const viewport = viewportRef.current
        const track = trackRef.current
        const progress = progressRef.current
        if (!viewport || !track) return

        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true
            startX.current = e.pageX - targetX.current
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return
            targetX.current = e.pageX - startX.current
        }

        const handleMouseUp = () => {
            isDragging.current = false
        }

        const handleWheel = (e: WheelEvent) => {
            targetX.current -= e.deltaY * 0.5
        }

        const handleTouchStart = (e: TouchEvent) => {
            isDragging.current = true
            startX.current = e.touches[0].pageX - targetX.current
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging.current) return
            targetX.current = e.touches[0].pageX - startX.current
        }

        const handleTouchEnd = () => {
            isDragging.current = false
        }

        viewport.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('wheel', handleWheel, { passive: false })
        
        viewport.addEventListener('touchstart', handleTouchStart)
        window.addEventListener('touchmove', handleTouchMove)
        window.addEventListener('touchend', handleTouchEnd)

        let animationId: number

        const update = () => {
            // Smooth lerp
            displayX.current += (targetX.current - displayX.current) * 0.08

            // Boundaries
            const maxScroll = track.offsetWidth - window.innerWidth + (window.innerWidth * 0.2)
            if (targetX.current > 0) targetX.current = 0
            if (targetX.current < -maxScroll) targetX.current = -maxScroll

            if (track) {
                track.style.transform = `translateX(${displayX.current}px)`
            }
            
            if (progress) {
                const p = Math.abs(displayX.current) / maxScroll
                progress.style.width = `${p * 100}%`
            }

            animationId = requestAnimationFrame(update)
        }

        animationId = requestAnimationFrame(update)

        return () => {
            viewport.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('wheel', handleWheel)
            
            viewport.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleTouchEnd)
            
            cancelAnimationFrame(animationId)
        }
    }, [])

    // --- BG CANVAS (Subtle Particles) ---
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let w: number, h: number, dots: any[] = []
        let animationId: number

        const init = () => {
            w = canvas.width = window.innerWidth
            h = canvas.height = window.innerHeight
            dots = []
            for (let i = 0; i < 100; i++) {
                dots.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 })
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h)
            ctx.fillStyle = "rgba(203, 163, 129, 0.2)"
            dots.forEach(d => {
                ctx.beginPath()
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
                ctx.fill()
                d.y -= 0.2
                if (d.y < 0) d.y = h
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

    return (
        <div className="team-container">
            <canvas id="bg-canvas-team" ref={canvasRef}></canvas>
            <div className="noise-team"></div>

            <header className="section-header-team">
                <span className="tagline-team">Phase_05 // Neural Architects</span>
                <h1 className="title-team">Architects of the <br /><i>Singularity.</i></h1>
            </header>

            <div className="gallery-viewport-team" id="viewport" ref={viewportRef}>
                <div className="gallery-track-team" id="track" ref={trackRef}>
                    {team.map((member, i) => (
                        <div className="team-node" key={i}>
                            <div className="scan-line-team"></div>
                            <div className="image-container-team">
                                <img 
                                    src={`https://images.unsplash.com/photo-${1500648767791 - (i * 1000)}?auto=format&fit=crop&w=800&q=80`} 
                                    className="team-image" 
                                    alt={member.name} 
                                />
                            </div>
                            <div className="node-info-team">
                                <span className="role-team">{member.role}</span>
                                <h2 className="name-team">{member.name}</h2>
                                <p className="bio-team">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="scroll-hint-team">
                Explore Team 
                <div className="hint-bar-team">
                    <div className="hint-progress-team" id="progress" ref={progressRef}></div>
                </div>
            </div>
        </div>
    )
}
