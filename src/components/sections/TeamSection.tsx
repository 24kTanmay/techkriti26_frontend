'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import './TeamSection.css'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const team = [
    { name: "Aarav Sharma", role: "Head of Infrastructure", bio: "Mapping the hardware limits of the current reality." },
    { name: "Isha Gupta", role: "Creative Director", bio: "Translating neural awareness into visual transcendence." },
    { name: "Rohan Das", role: "Public Relations", bio: "Synchronizing external perception with the core vision." },
    { name: "Meera Reddy", role: "Events Lead", bio: "Designing the physical nodes of the Singularity journey." },
    { name: "Vikram Singh", role: "Technical Head", bio: "Compiling the code that reveals underlying universal order." },
    { name: "Sanya Malhotra", role: "Logistics Manager", bio: "Optimizing the flow of energy and resources." }
]

export default function TeamSection() {
    const mainRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    
    const [activeIndex, setActiveIndex] = useState(0)

    const targetX = useRef(0)
    const displayX = useRef(0)
    const isDragging = useRef(false)
    const startX = useRef(0)

    // --- DESKTOP HORIZONTAL SCROLL & SHARED LOGIC ---
    useEffect(() => {
        const viewport = viewportRef.current
        const track = trackRef.current
        const progressEl = progressRef.current
        if (!viewport || !track) return

        const handleMouseDown = (e: MouseEvent) => {
            if (window.innerWidth <= 1024) return
            isDragging.current = true
            startX.current = e.pageX - targetX.current
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || window.innerWidth <= 1024) return
            targetX.current = e.pageX - startX.current
        }

        const handleMouseUp = () => {
            isDragging.current = false
        }

        const handleWheel = (e: WheelEvent) => {
            if (window.innerWidth <= 1024) return
            targetX.current -= e.deltaY * 0.5
        }

        viewport.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('wheel', handleWheel, { passive: true })
        
        let animationId: number
        const isVisible = { current: false }
        const observer = new IntersectionObserver(([entry]) => {
            isVisible.current = entry.isIntersecting
        }, { threshold: 0.01 })
        observer.observe(viewport)

        const update = () => {
            if (isVisible.current && window.innerWidth > 1024) {
                displayX.current += (targetX.current - displayX.current) * 0.08
                const maxScroll = track.offsetWidth - window.innerWidth + (window.innerWidth * 0.2)
                if (targetX.current > 0) targetX.current = 0
                if (targetX.current < -maxScroll) targetX.current = -maxScroll

                track.style.transform = `translateX(${displayX.current}px)`
                
                if (progressEl) {
                    const p = Math.abs(displayX.current) / (maxScroll || 1)
                    progressEl.style.width = `${p * 100}%`
                }
            }
            animationId = requestAnimationFrame(update)
        }

        animationId = requestAnimationFrame(update)

        return () => {
            viewport.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('wheel', handleWheel)
            cancelAnimationFrame(animationId)
            observer.disconnect()
        }
    }, [])

    // --- MOBILE STACKED DECK ANIMATION (PRO LOGIC) ---
    useGSAP(() => {
        if (window.innerWidth > 1024) return
        
        const cards = gsap.utils.toArray<HTMLElement>('.team-node')
        const N = team.length
        
        // Use a proxy object for smooth progress control via ScrollTrigger
        const proxy = { value: 0 }
        
        ScrollTrigger.create({
            trigger: mainRef.current,
            start: 'top top',
            end: `+=${N * 100}%`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                // Map scroll progress to our deck index scale
                proxy.value = self.progress * (N - 0.001)
            }
        })

        const render = () => {
            const currentProgress = proxy.value
            
            // Update active dot for UI
            const frontIndex = (Math.round(currentProgress) % N + N) % N
            setActiveIndex(frontIndex)

            cards.forEach((card, index) => {
                // Modulo logic for infinite stacking
                let p = (index - currentProgress) % N
                p = ((p % N) + N) % N 
                if (p >= N - 1) p -= N

                let y = 0
                let scale = 1
                let opacity = 1
                let zIndex = 1000 - Math.round(p * 100)
                let blur = 0

                if (p < 0) {
                    // Moving UP and OFF the screen
                    y = p * 600 
                    scale = 0.85
                    opacity = 1 + p * 2
                    blur = Math.abs(p) * 20
                } else {
                    // Stacked behind
                    y = p * -25
                    scale = 1 - (p * 0.06)
                    opacity = 1 - (p * 0.3)
                    if (p > 2) opacity = 0 // Optimization
                }

                gsap.set(card, {
                    y: y,
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex,
                    filter: `brightness(${1 - Math.max(0, p) * 0.1}) blur(${blur}px)`
                })
            })
            
            requestAnimationFrame(render)
        }

        const animId = requestAnimationFrame(render)
        return () => cancelAnimationFrame(animId)

    }, { scope: mainRef, dependencies: [] })

    // --- BG CANVAS ---
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let w: number, h: number, dots: any[] = []
        let animationId: number
        const isVisible = { current: false }
        const observer = new IntersectionObserver(([entry]) => {
            isVisible.current = entry.isIntersecting
        }, { threshold: 0.01 })

        const init = () => {
            w = canvas.width = window.innerWidth
            h = canvas.height = window.innerHeight
            dots = []
            for (let i = 0; i < 100; i++) {
                dots.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 })
            }
        }

        const draw = () => {
            if (!ctx) return
            
            if (isVisible.current) {
                ctx.clearRect(0, 0, w, h)
                ctx.fillStyle = "rgba(203, 163, 129, 0.2)"
                dots.forEach(d => {
                    ctx.beginPath()
                    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
                    ctx.fill()
                    d.y -= 0.2
                    if (d.y < 0) d.y = h
                })
            }
            animationId = requestAnimationFrame(draw)
        }

        window.addEventListener('resize', init)
        observer.observe(canvas)
        init()
        draw()

        return () => {
            window.removeEventListener('resize', init)
            cancelAnimationFrame(animationId)
            observer.disconnect()
        }
    }, [])

    return (
        <div className="team-container" ref={mainRef}>
            <canvas id="bg-canvas-team" ref={canvasRef}></canvas>
            <div className="noise-team"></div>

            <div className="team-sticky-wrapper">
                <header className="section-header-team">
                    <span className="tagline-team">Phase_05 // Neural Architects</span>
                    <h1 className="title-team">Architects of the <br /><i>Singularity.</i></h1>
                </header>

                <div className="gallery-viewport-team" id="viewport" ref={viewportRef}>
                    <div className="gallery-track-team" id="track" ref={trackRef}>
                        {team.map((member, i) => (
                            <div className="team-node" key={i}>
                                <div className="scan-line-team"></div>
                                <div className="image-container-team relative w-full h-full">
                                    <Image 
                                        src={`https://images.unsplash.com/photo-${1500648767791 - (i * 1000)}?auto=format&fit=crop&w=800&q=80`} 
                                        className="team-image object-cover" 
                                        alt={member.name} 
                                        fill
                                        sizes="(max-width: 1024px) 70vw, 30vw"
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

                <div className="deck-indicator">
                    {team.map((_, i) => (
                        <div 
                            key={i} 
                            className={`indicator-dot ${i === activeIndex ? 'active' : ''}`}
                        />
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
