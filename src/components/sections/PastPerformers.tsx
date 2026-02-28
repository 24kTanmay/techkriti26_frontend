'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import './PastPerformers.css'

const performers = [
    { 
        year: "2023", 
        name: "Amit Trivedi", 
        role: "Soul Fusion", 
        img: "https://images.unsplash.com/photo-1514525253344-f814d074e015?auto=format&fit=crop&w=400&q=80&fm=webp" 
    },
    { 
        year: "2021", 
        name: "Nucleya", 
        role: "Bass Theory", 
        img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=400&q=80&fm=webp" 
    },
    { 
        year: "2022", 
        name: "Zakir Khan", 
        role: "Narrative Sync", 
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80&fm=webp" 
    },
    { 
        year: "2020", 
        name: "Ritviz", 
        role: "Indie Harmonic", 
        img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80&fm=webp" 
    },
    { 
        year: "2019", 
        name: "Kailash Kher", 
        role: "Sufi Resonance", 
        img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=400&q=80&fm=webp" 
    },
]

export default function PastPerformers() {
    const containerRef = useRef<HTMLDivElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    const previewImgRef = useRef<HTMLImageElement>(null)
    const [activeImg, setActiveImg] = useState<string | null>(null)
    const [isActive, setIsActive] = useState(false)

    const mousePos = useRef({ x: 0, y: 0 })
    const previewPos = useRef({ x: 0, y: 0 })

    useEffect(() => {
        let animationId: number | null = null
        let isVisible = false

        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisible) return
            mousePos.current = { x: e.clientX, y: e.clientY }
        }

        const animate = () => {
            if (!isVisible) {
                animationId = null
                return
            }

            // Adjust offsets so the photo appears next to the cursor
            const targetX = mousePos.current.x + 50
            const targetY = mousePos.current.y - 250

            // LERP for smooth floating
            previewPos.current.x += (targetX - previewPos.current.x) * 0.1
            previewPos.current.y += (targetY - previewPos.current.y) * 0.1

            if (previewRef.current) {
                previewRef.current.style.left = `${previewPos.current.x}px`
                previewRef.current.style.top = `${previewPos.current.y}px`
            }

            animationId = requestAnimationFrame(animate)
        }

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting
            if (isVisible) {
                // Restart animation loop if not currently running
                if (animationId === null) {
                    animationId = requestAnimationFrame(animate)
                }
            } else {
                // Stop the loop completely
                if (animationId !== null) {
                    cancelAnimationFrame(animationId)
                    animationId = null
                }
            }
        }, { threshold: 0.0 })

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current)
            window.removeEventListener('mousemove', handleMouseMove)
            if (animationId !== null) cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <div id="performers" ref={containerRef} className="performer-archive-container">

            {/* The Floating Preview Slab */}
            <div 
                ref={previewRef} 
                className={`hover-preview-performer ${isActive ? 'active' : ''}`}
            >
                <div className="preview-scan-performer"></div>
                {activeImg && (
                    <Image 
                        src={activeImg} 
                        alt="Preview" 
                        className="preview-img-performer" 
                        ref={previewImgRef} 
                        fill
                        sizes="350px"
                    />
                )}
            </div>

            <main className="performer-content-container">
                <span className="section-tag-performer">Phase_06 // Harmonic Frequency Archives</span>
                
                <div className="archive-list-performer">
                    {performers.map((item, index) => (
                        <div 
                            key={index}
                            className="archive-item-performer"
                            onMouseEnter={() => {
                                setActiveImg(item.img)
                                setIsActive(true)
                            }}
                            onMouseLeave={() => {
                                setIsActive(false)
                            }}
                        >
                            <div>
                                <span className="item-year-performer">{item.year}</span>
                                <h2 className="item-name-performer">{item.name}</h2>
                            </div>
                            <span className="item-role-performer">{item.role}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
