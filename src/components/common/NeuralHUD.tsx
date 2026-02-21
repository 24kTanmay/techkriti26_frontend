'use client'

import React, { useEffect, useState, useRef } from 'react'
import './NeuralHUD.css'
import { useScrollProgress } from '@/context/ScrollProgressContext'

export default function NeuralHUD() {
    const [isReady, setIsReady] = useState(false)
    const [hexList, setHexList] = useState<string[]>([])
    const progressRef = useScrollProgress()
    
    const cursorRef = useRef<HTMLDivElement>(null)
    const followerRef = useRef<HTMLDivElement>(null)
    const needleRef = useRef<HTMLDivElement>(null)

    // Cinematic Entrance
    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 1500)
        return () => clearTimeout(timer)
    }, [])

    // Hex Stream Logic
    useEffect(() => {
        const hex = "0123456789ABCDEF"
        const interval = setInterval(() => {
            let code = ""
            for(let i=0; i<8; i++) code += hex[Math.floor(Math.random()*16)]
            setHexList(prev => {
                const newList = [`0x${code}`, ...prev]
                return newList.slice(0, 12) // Keep last 12
            })
        }, 150)
        return () => clearInterval(interval)
    }, [])

    // Cursor & Progress Tracking
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`
                cursorRef.current.style.top = `${e.clientY}px`
            }
            if (followerRef.current) {
                // Smooth lag for the follower
                followerRef.current.animate({
                    left: `${e.clientX}px`,
                    top: `${e.clientY}px`
                }, { duration: 500, fill: "forwards" })
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Update needle based on 3D Scroll Progress Ref
    useEffect(() => {
        let frameId: number
        const updateNeedle = () => {
            if (needleRef.current && progressRef.current !== undefined) {
                const scrollP = progressRef.current
                needleRef.current.style.top = `${scrollP * 100}%`
            }
            frameId = requestAnimationFrame(updateNeedle)
        }
        frameId = requestAnimationFrame(updateNeedle)
        return () => cancelAnimationFrame(frameId)
    }, [progressRef])

    return (
        <>
            {/* Custom Cursor */}
            <div ref={cursorRef} className="custom-cursor" />
            <div ref={followerRef} className="cursor-follower" />

            {/* HUD Overlay */}
            <div className={`hud-container ${isReady ? 'ready' : ''}`}>
                {/* 1px Brackets */}
                <div className="bracket tl" />
                <div className="bracket tr" />
                <div className="bracket bl" />
                <div className="bracket br" />

                {/* Left Side: Transcendence Meter */}
                <div className="side-left">
                    <span className="side-label-v">GENESIS_PHASE_01 // SCROLL_SYSTEM</span>
                    <div ref={needleRef} className="progress-needle" />
                </div>

                {/* Right Side: Neural Stream */}
                <div className="side-right">
                    <div className="data-stream">
                        {hexList.map((hex, i) => (
                            <span key={i} style={{ opacity: 1 - (i * 0.08) }}>{hex}</span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
