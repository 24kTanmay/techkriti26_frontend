"use client"

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutSection.css'

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

  return (
    <div id="about" ref={containerRef} className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">


      <div className="relative w-full h-full flex items-center">
        
        {/* Subtle glow for background depth */}
        <div 
          ref={glowRef}
          style={{
            position: 'absolute',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, var(--white-subtle) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            zIndex: -1,
            transform: 'translateY(-50%)',
          }}
        ></div>

        {/* STEP 1: LEFT ALIGNED (Robot) */}
        <div ref={step1Ref} className="about-card invisible" style={{ left: '5%' }}>
          <span className="text-[var(--text-muted)] tracking-[4px] mb-4 block text-[0.75rem]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>/ PHASE_01</span>
          <h2 className="about-heading">Born at <br />IIT Kanpur</h2>
          <p className="text-lg text-[var(--text-muted)] font-light leading-relaxed">
            Since 1995, Techkriti has sparked innovation and technical interest among students across India.
          </p>
        </div>

        {/* STEP 2: RIGHT ALIGNED (DNA) */}
        <div ref={step2Ref} className="about-card invisible" style={{ right: '5%' }}>
          <span className="text-[var(--text-muted)] tracking-[4px] mb-4 block text-[0.75rem]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>/ PHASE_02</span>
          <h2 className="about-heading">Asia&apos;s <br />Largest Stage</h2>
          <p className="text-lg text-[var(--text-muted)] font-light leading-relaxed">
            In its 32nd edition, Techkriti is one of Asia’s largest technical festivals for young minds.
          </p>
        </div>

        {/* STEP 3: LEFT ALIGNED (Space) */}
        <div ref={step3Ref} className="about-card invisible" style={{ left: '5%' }}>
          <span className="text-[var(--text-muted)] tracking-[4px] mb-4 block text-[0.75rem]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>/ PHASE_03</span>
          <h2 className="about-heading">Social <br />Welfare</h2>
          <p className="text-lg text-[var(--text-muted)] font-light leading-relaxed">
            We drive social change and technical excellence through innovation and perseverance.
          </p>
        </div>

      </div>
    </div>
  )
}
