'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/ui/Navbar'
import AboutSection from '@/components/ui/AboutSection'
import HeroConclusion from '@/components/ui/HeroConclusion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const HeroHead = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })
const Space = dynamic(() => import('@/components/canvas/Space'), { ssr: false })
const Dna = dynamic(() => import('@/components/canvas/Dna'), { ssr: false })

export default function Home() {
  const [phase, setPhase] = useState(0)
  
  // Track precise progress to control fade-out timing better if needed
  const scrollRef = useRef(0) 

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Phases: 0 = Head Zoom, 1 = Explosion/DNA, 2 = Space
    const phases = ["HEAD", "DNA", "SPACE"]
    const indicator = document.getElementById('phase-indicator')
    
    ScrollTrigger.create({
      trigger: '#scroll-trigger',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true, // Important for smooth tracking
      onUpdate: (self) => {
      const p = self.progress;
      
      // ✅ MANUAL PHASE THRESHOLDS
      if (p < 0.20) {
        setPhase(0); // 0% to 20% is Head
      } else if (p < 0.35) {
        setPhase(1); // 20% to 35% is DNA / Singularity
      } else {
        setPhase(2); // 35% to 100% is SPACE
      }
    }
    });

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <main className="relative w-full bg-[#050505]">
      <Navbar />
      
      {/* 3D Background Layer */}
      <div className="fixed top-0 left-0 w-full h-[100vh] z-0 pointer-events-none">
        
        {/* 
           ✅ HERO HEAD (Head + Particles) 
           Logic: Visible in Phase 0 (Head) AND Phase 1 (DNA). 
           This allows particles to "Scatter and Concentrate" while DNA is fading in.
        */}
        <div className={`transition-opacity duration-1000 absolute inset-0 ${phase <= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <HeroHead />
        </div>

        {/* 
           ✅ DNA 
           Logic: Fades in during Phase 1. 
           (The Head particles will be imploding *inside* this scene)
        */}
        <div className={`transition-opacity duration-1000 absolute inset-0 ${phase === 1 ? 'opacity-100' : 'opacity-0'}`} style={{ filter: 'brightness(1.2)' }}>
          <Dna />
        </div>

        {/* 
           ✅ SPACE 
           Logic: Phase 2 only
        */}
        <div className={`transition-opacity duration-1000 absolute inset-0 ${phase === 2 ? 'opacity-100' : 'opacity-0'}`}>
          <Space />
        </div>
      </div>

      {/* Scroll Triggers */}
      <div id="scroll-trigger" className="relative w-full z-10 pointer-events-none">
        <section className="h-[200vh]" data-label="Zoom Phase" />
        <section className="h-[200vh]" data-label="Scatter/DNA Phase" />
        <section className="h-[200vh]" data-label="Space Phase" />
      </div>

      <AboutSection />
      <HeroConclusion />
    </main>
  )
}