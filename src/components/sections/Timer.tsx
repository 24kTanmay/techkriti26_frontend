'use client'

import React, { useState, useEffect, useRef } from 'react'
import './Timer.css'

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

const Shard = ({ id, value, label }: { id: string, value: number, label: string }) => {
    const shardRef = useRef<HTMLDivElement>(null)
    const [displayValue, setDisplayValue] = useState(value)

    useEffect(() => {
        if (displayValue !== value) {
            setDisplayValue(value)
            
            // Trigger tick animation
            const el = shardRef.current
            if (el) {
                el.classList.remove('tick')
                void el.offsetWidth // force reflow
                el.classList.add('tick')
            }
        }
    }, [value, displayValue])

    const strVal = value < 10 ? "0" + value : value.toString()

    return (
        <div className="time-block">
            <div className="shard" id={id} ref={shardRef}>
                <div className="corner tl"></div>
                <div className="corner br"></div>
                <div className="glow"></div>
                <div className="number-display">{strVal}</div>
            </div>
            <div className="timer-label">{label}</div>
        </div>
    )
}

export default function Timer() {
    const target = new Date("March 19, 2026 10:00:00").getTime()
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const update = () => {
            const now = new Date().getTime()
            const diff = target - now

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24))
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const s = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeLeft({ days: d, hours: h, minutes: m, seconds: s })
        }

        const timerId = setInterval(update, 1000)
        update()

        return () => clearInterval(timerId)
    }, [])

    return (
        <div className="timer-container">
            <Shard id="s-days" value={timeLeft.days} label="Days" />
            <Shard id="s-hours" value={timeLeft.hours} label="Hours" />
            <Shard id="s-minutes" value={timeLeft.minutes} label="Minutes" />
            <Shard id="s-seconds" value={timeLeft.seconds} label="Seconds" />
        </div>
    )
}
