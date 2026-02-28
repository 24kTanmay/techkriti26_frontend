'use client'

import React, { useEffect, useRef } from 'react'
import './Timer.css'

interface ShardProps {
    label: string
    displayRef: React.RefObject<HTMLDivElement | null>
}

const Shard = React.memo(({ label, displayRef }: ShardProps) => {
    return (
        <div className="time-block">
            <div className="shard">
                <div className="corner tl"></div>
                <div className="corner br"></div>
                <div className="glow"></div>
                <div className="number-display" ref={displayRef}>00</div>
            </div>
            <div className="timer-label">{label}</div>
        </div>
    )
})

Shard.displayName = 'Shard'

export default function Timer() {
    const target = new Date("March 19, 2026 10:00:00").getTime()
    
    const dRef = useRef<HTMLDivElement>(null)
    const hRef = useRef<HTMLDivElement>(null)
    const mRef = useRef<HTMLDivElement>(null)
    const sRef = useRef<HTMLDivElement>(null)
    
    // Store previous values to avoid unnecessary DOM writes
    const prevValues = useRef({ d: -1, h: -1, m: -1, s: -1 })

    useEffect(() => {
        const update = () => {
            const now = new Date().getTime()
            const diff = target - now

            const vals = {
                d: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
                h: Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
                m: Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))),
                s: Math.max(0, Math.floor((diff % (1000 * 60)) / 1000))
            }

            const updateEl = (el: HTMLDivElement | null, val: number, prevVal: number) => {
                if (!el || val === prevVal) return
                
                const str = val < 10 ? "0" + val : val.toString()
                el.textContent = str
                
                // Trigger tick animation on parent (.shard)
                const shard = el.closest('.shard')
                if (shard) {
                    shard.classList.remove('tick')
                    // Force a reflow to restart the animation
                    void (shard as HTMLElement).offsetWidth 
                    shard.classList.add('tick')
                }
            }

            updateEl(dRef.current, vals.d, prevValues.current.d)
            updateEl(hRef.current, vals.h, prevValues.current.h)
            updateEl(mRef.current, vals.m, prevValues.current.m)
            updateEl(sRef.current, vals.s, prevValues.current.s)

            prevValues.current = vals
        }

        const timerId = setInterval(update, 1000)
        update()

        return () => clearInterval(timerId)
    }, [])

    return (
        <div className="timer-container">
            <Shard label="Days" displayRef={dRef} />
            <Shard label="Hours" displayRef={hRef} />
            <Shard label="Minutes" displayRef={mRef} />
            <Shard label="Seconds" displayRef={sRef} />
        </div>
    )
}
