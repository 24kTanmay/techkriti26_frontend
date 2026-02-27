'use client'

import React, { useEffect, useRef, useState } from 'react'
import './PastPerformers.css'

const performers = [
    { 
        year: "2023", 
        name: "Amit Trivedi", 
        role: "Soul Fusion", 
        img: "https://images.unsplash.com/photo-1514525253344-f814d074e015?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        year: "2021", 
        name: "Nucleya", 
        role: "Bass Theory", 
        img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        year: "2022", 
        name: "Zakir Khan", 
        role: "Narrative Sync", 
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        year: "2020", 
        name: "Ritviz", 
        role: "Indie Harmonic", 
        img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        year: "2019", 
        name: "Kailash Kher", 
        role: "Sufi Resonance", 
        img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&w=800&q=80" 
    },
]

export default function PastPerformers() {
    const previewRef = useRef<HTMLDivElement>(null)
    const previewImgRef = useRef<HTMLImageElement>(null)
    const [activeImg, setActiveImg] = useState<string | null>(null)
    const [isActive, setIsActive] = useState(false)

    const mousePos = useRef({ x: 0, y: 0 })
    const previewPos = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
        }

        window.addEventListener('mousemove', handleMouseMove)

        let animationId: number

        const animate = () => {
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

        animationId = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <div id="performers" className="performer-archive-container">

            {/* The Floating Preview Slab */}
            <div 
                ref={previewRef} 
                className={`hover-preview-performer ${isActive ? 'active' : ''}`}
            >
                <div className="preview-scan-performer"></div>
                {activeImg && (
                    <img 
                        src={activeImg} 
                        alt="Preview" 
                        className="preview-img-performer" 
                        ref={previewImgRef} 
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
