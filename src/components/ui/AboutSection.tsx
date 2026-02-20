"use client"

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const step1Ref = useRef<HTMLDivElement>(null)
  const step2Ref = useRef<HTMLDivElement>(null)
  const step3Ref = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Refresh ScrollTrigger after a short delay to ensure everything is in place
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-trigger",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      // Mapping cards to Robot (0-33%), DNA (33-66%), Space (66-100%)
      // Using a 30-unit virtual duration for precise 1/3 splits
      
      // PHASE 01: ROBOT (0 - 10)
      tl.fromTo(step1Ref.current, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 4 }, 1)
        .to(step1Ref.current, { autoAlpha: 0, y: -50, duration: 3 }, 7)

      // PHASE 02: DNA (10 - 20)
      tl.fromTo(step2Ref.current, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 4 }, 11)
        .to(step2Ref.current, { autoAlpha: 0, y: -50, duration: 3 }, 17)

      // PHASE 03: SPACE (20 - 30 units)
      tl.fromTo(step3Ref.current, 
        { autoAlpha: 0, y: 30 }, 
        { autoAlpha: 1, y: 0, duration: 4 }, 21) // In at 21
        .to(step3Ref.current, 
        { autoAlpha: 0, y: -30, duration: 3 }, 27) // Out at 27

      // Background glow sync
      tl.to(glowRef.current, { left: "0%", duration: 5, top: '40%' }, 0)
        .to(glowRef.current, { left: "60%", duration: 10, top: '50%' }, 5)
        .to(glowRef.current, { left: "0%", duration: 10, top: '60%' }, 15)
        .to(glowRef.current, { autoAlpha: 0, duration: 5 }, 25);
    });

    return () => {
      ctx.revert()
      clearTimeout(timer)
    };
  }, []);

  const cardBaseStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32%', 
    padding: '3.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '40px',
    isolation: 'isolate',
    pointerEvents: 'auto',
    zIndex: 50,
  };

  const headingStyle: React.CSSProperties = {
    background: 'linear-gradient(to bottom, #fff 40%, #555 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '3.5rem',
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: '1.5rem',
  };

  return (
    <div id="about" ref={containerRef} className="fixed inset-0 z-[60] pointer-events-none overflow-hidden lg:block hidden">
      <div className="relative w-full h-full flex items-center">
        
        {/* Subtle glow for background depth */}
        <div 
          ref={glowRef}
          style={{
            position: 'absolute',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            zIndex: -1,
            transform: 'translateY(-50%)',
          }}
        ></div>

        {/* STEP 1: LEFT ALIGNED (Robot) */}
        <div ref={step1Ref} className="invisible" style={{ ...cardBaseStyle, left: '5%', textAlign: 'left' }}>
          <span className="font-mono text-[#555] tracking-[4px] mb-4 block text-[0.75rem]">/ PHASE_01</span>
          <h2 style={headingStyle}>Born at <br />IIT Kanpur</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            Founded in 1995, Techkriti was established to spark interest and encourage innovation in technology among students across India.
          </p>
        </div>

        {/* STEP 2: RIGHT ALIGNED (DNA) */}
        <div ref={step2Ref} className="invisible" style={{ ...cardBaseStyle, right: '5%', textAlign: 'left' }}>
          <span className="font-mono text-[#555] tracking-[4px] mb-4 block text-[0.75rem]">/ PHASE_02</span>
          <h2 style={headingStyle}>Asia&apos;s <br />Largest Stage</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            Now in its 32nd edition, Techkriti has become one of Asia’s largest technical festivals, providing an elite platform for young minds.
          </p>
        </div>

        {/* STEP 3: LEFT ALIGNED (Space) */}
        <div ref={step3Ref} className="invisible" style={{ ...cardBaseStyle, left: '5%', textAlign: 'left' }}>
          <span className="font-mono text-[#555] tracking-[4px] mb-4 block text-[0.75rem]">/ PHASE_03</span>
          <h2 style={headingStyle}>Social <br />Welfare</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            Innovation and perseverance are at our heart. We develop organizational skills and drive social change through technical excellence.
          </p>
        </div>

      </div>
    </div>
  )
}
