'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import './Wheel.css'

interface WheelProps {
    data?: string[];
    onSelect?: (index: number) => void;
    scrollDrive?: number;
}

const DEFAULT_DATA = [
    "Tech Summit",
    "AI Summit",
    "Rakshakriti",
    "MedTech",
    "Space",
    "E - Conclave",
    "Sustainability",
    "Industry 4.0",
    "Women Panel",
    "Vision 360 Policy Conclave"
];

const WheelContent = React.memo(({ data, ticks, itemsRef }: { data: string[], ticks: any[], itemsRef: React.MutableRefObject<(HTMLDivElement | null)[]> }) => {
    return (
        <div className="wheel-dial">
            {/* Tick Marks Layer */}
            {ticks.map((tick, i) => (
                <div 
                    key={`tick-${i}`}
                    className={`wheel-tick ${tick.isMajor ? 'major' : 'minor'}`}
                    style={{ transform: `rotate(${tick.rotation}deg) translateX(46vh) translateZ(0px)` }}
                />
            ))}

            {/* Interactive Items Layer */}
            {data.map((name, i) => (
                <div 
                    key={`item-${i}`}
                    className="wheel-dial-item"
                    ref={el => { itemsRef.current[i] = el; }}
                >
                    <div className="wheel-item-text">
                        <span>{(i + 1).toString().padStart(2, '0')}</span>
                        {name}
                    </div>
                </div>
            ))}
        </div>
    );
});

WheelContent.displayName = 'WheelContent';

export default function Wheel({ data = DEFAULT_DATA, onSelect, scrollDrive }: WheelProps) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const dialContainerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const lastSelectedIndex = useRef<number>(-1);
    const [mounted, setMounted] = useState(false);

    // Animation & Interaction State
    const state = useRef({
        current: 0,
        target: 0,
        step: 20,
        max: (data.length - 1) * 20
    });

    // Generate tick data once
    const ticks = useMemo(() => {
        return Array.from({ length: 120 }, (_, i) => ({
            rotation: i * 3,
            isMajor: i % 5 === 0
        }));
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 1. Update target from scroll drive - NO RE-RENDERING LOOP
    useEffect(() => {
        if (scrollDrive !== undefined) {
            state.current.target = scrollDrive * state.current.max;
            
            // Only notify parent if index actually changes to prevent render cascades
            const index = Math.round(state.current.target / state.current.step);
            if (index >= 0 && index < data.length && index !== lastSelectedIndex.current) {
                lastSelectedIndex.current = index;
                if (onSelect) onSelect(index);
            }
        }
    }, [scrollDrive, onSelect, data.length]);

    // 2. Persistent Animation Loop - Runs once on mount
    useEffect(() => {
        if (!mounted) return;

        const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
        let animationId: number;

        const loop = () => {
            state.current.current = lerp(state.current.current, state.current.target, 0.08);
            
            // Apply rotations directly to DOM for 60fps performance
            const dial = dialContainerRef.current?.querySelector('.wheel-dial') as HTMLElement;
            if (dial) {
                dial.style.transform = `rotate(${-state.current.current}deg)`;
            }

            itemsRef.current.forEach((el, i) => {
                if (!el) return;
                const base = i * state.current.step;
                const angle = base - state.current.current;
                const d = Math.abs(angle);
                
                // 3D positioning
                const zPush = -Math.pow(d, 1.2) * 0.5; 
                const rotateX = d * 0.2 * (angle > 0 ? 1 : -1);
                
                // Smoother scale transition
                const scale = d < 100 ? 1 - Math.pow(d / 100, 1.5) * 0.3 : 0.7;

                el.style.transform = `
                    rotate(${base}deg)
                    translateX(44vh)
                    rotate(${-base + state.current.current}deg)
                    translateZ(${zPush}px)
                    rotateX(${rotateX}deg)
                    scale(${scale})
                `;

                // Visual Styling (Opacity/Blur)
                const textWrapper = el.querySelector('.wheel-item-text') as HTMLElement;
                if (textWrapper) {
                    // Wider visibility range (60 instead of 40)
                    const opacityBase = Math.max(0, 1 - d / 65);
                    const opacity = Math.pow(opacityBase, 1.2);
                    
                    const blur = Math.min(6, d * 0.1);
                    textWrapper.style.opacity = opacity.toString();
                    textWrapper.style.filter = `blur(${blur}px)`;

                    // Smoother active state transition
                    if (d < 4) {
                        textWrapper.style.color = "#FFFFFF";
                        textWrapper.style.fontWeight = "400";
                        textWrapper.style.textShadow = "0 0 30px rgba(203, 163, 129, 0.8)";
                    } else {
                        textWrapper.style.color = "var(--wheel-text-muted)";
                        textWrapper.style.fontWeight = "200";
                        textWrapper.style.textShadow = "none";
                    }
                }
            });

            animationId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(animationId);
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div className="wheel-scene" ref={sceneRef} suppressHydrationWarning>
            <div className="dial-container" ref={dialContainerRef}>
                <div className="physical-base"></div>
                <div className="physical-rim"></div>
                <div className="physical-hub"></div>
                
                <WheelContent data={data} ticks={ticks} itemsRef={itemsRef} />
            </div>

            <div className="wheel-pointer-wrapper">
                <div className="wheel-pointer-line"></div>
                <div className="wheel-pointer-bracket"></div>
            </div>
        </div>
    )
}
