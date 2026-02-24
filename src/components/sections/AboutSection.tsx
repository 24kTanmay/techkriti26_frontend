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

  return (
    <div id="about" ref={containerRef} className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .about-card {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32%; 
          padding: 3.5rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          isolation: isolate;
          pointer-events: auto;
          zIndex: 50;
          text-align: left;
          transition: width 0.5s ease, left 0.5s ease, right 0.5s ease, padding 0.5s ease;
        }

        .about-heading {
          font-family: var(--font-space-grotesk), sans-serif;
          background: linear-gradient(to bottom, #fff 60%, rgba(255,255,255,0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 3.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .about-heading i {
          font-family: var(--font-playfair), serif;
          font-style: italic;
          font-weight: 400;
          opacity: 0.8;
          display: inline-block;
          margin-left: 0.2em;
        }

        @media (max-width: 1024px) {
          .about-card {
            width: 85%;
            padding: 2.5rem;
            left: 50% !important;
            right: auto !important;
            transform: translate(-50%, -50%);
            border-radius: 30px;
          }
          .about-heading {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 640px) {
          .about-card {
            width: 90%;
            padding: 2rem;
          }
          .about-heading {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          .about-card p {
            font-size: 1rem;
          }
          .about-card {
            font-family: var(--font-space-grotesk), sans-serif;
          }
        }
      `}} />

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
        <div ref={step1Ref} className="about-card invisible" style={{ left: '5%' }}>
          <span className="text-[#555] tracking-[4px] mb-4 block text-[0.75rem]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>/ PHASE_01</span>
          <h2 className="about-heading">Born at <br />IIT Kanpur</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            Since 1995, Techkriti has sparked innovation and technical interest among students across India.
          </p>
        </div>

        {/* STEP 2: RIGHT ALIGNED (DNA) */}
        <div ref={step2Ref} className="about-card invisible" style={{ right: '5%' }}>
          <span className="text-[#555] tracking-[4px] mb-4 block text-[0.75rem]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>/ PHASE_02</span>
          <h2 className="about-heading">Asia&apos;s <br />Largest Stage</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            In its 32nd edition, Techkriti is one of Asia’s largest technical festivals for young minds.
          </p>
        </div>

        {/* STEP 3: LEFT ALIGNED (Space) */}
        <div ref={step3Ref} className="about-card invisible" style={{ left: '5%' }}>
          <span className="text-[#555] tracking-[4px] mb-4 block text-[0.75rem]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>/ PHASE_03</span>
          <h2 className="about-heading">Social <br />Welfare</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            We drive social change and technical excellence through innovation and perseverance.
          </p>
        </div>

      </div>
    </div>
  )
}
