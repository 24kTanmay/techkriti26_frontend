'use client'

import React, { useEffect, useRef } from 'react'
import './AmbientAurora.css'

export default function AmbientAurora() {
    const nodeMainRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!nodeMainRef.current) return
            const x = (e.clientX / window.innerWidth) - 0.5
            const y = (e.clientY / window.innerHeight) - 0.5
            
            // Subtle shift of the side aurora node based on mouse
            nodeMainRef.current.style.transform = `translate(${x * 50}px, ${y * 50}px)`
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="aurora-canvas">
            {/* These nodes are specifically placed to "peek" from the sides */}
            <div ref={nodeMainRef} className="light-node node-right"></div>
            <div className="light-node node-bottom-left"></div>
            <div className="light-node node-top-left"></div>
        </div>
    )
}
