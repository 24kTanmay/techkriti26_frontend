'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/common/Navbar'
import AboutSection from '@/components/sections/AboutSection'
import HeroConclusion from '@/components/sections/HeroConclusion'
import AmbientAurora from '@/components/common/AmbientAurora'
import Preloader from '@/components/common/Preloader'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const HeroHead = dynamic(() => import('@/components/3d/Scene'), { ssr: false })
// const Space = dynamic(() => import('@/components/canvas/Space'), { ssr: false })
// const Dna = dynamic(() => import('@/components/canvas/Dna'), { ssr: false })

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  // ─── Optimization: useRef for phase to avoid re-renders on scroll
  const phaseRef = useRef(0)

  useEffect(() => {
    setMounted(true)
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Phases: 0 = Head Zoom, 1 = Explosion/DNA, 2 = Space
    ScrollTrigger.create({
      trigger: '#scroll-trigger',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        // ─── Optimization: only write to ref, no setState = no re-renders
        if (p < 0.45) {
          phaseRef.current = 0
        } else if (p < 0.55) {
          phaseRef.current = 1
        } else {
          phaseRef.current = 2
        }
      }
    });

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="relative w-full bg-[#050505]">
      <Preloader />
      <Navbar />
      <AmbientAurora />
      
      {/* 3D Background Layer */}
      <div className="fixed top-0 left-0 w-full h-[100vh] z-0 pointer-events-none">
        
        {/* 
           ✅ HERO HEAD (Head + Particles) 
           Logic: Visible in Phase 0 (Head) AND Phase 1 (DNA). 
           This allows particles to "Scatter and Concentrate" while DNA is fading in.
        */}
        <div className="absolute inset-0">
          <HeroHead />
        </div>

        {/* 
           Old DNA component disabled — DNA is now handled 
           by HumanDna particles inside the Scene component.
        */}

        {/* 
           ✅ SPACE 
           Logic: Phase 2 only
           Disabled for now
        */}
        {/* <div className={`transition-opacity duration-1000 absolute inset-0 ${phase === 2 ? 'opacity-100' : 'opacity-0'}`}>
          <Space />
        </div> */}
      </div>

      {/* Scroll Triggers */}
      <div id="scroll-trigger" className="relative w-full z-10 pointer-events-none">
        <section className="h-[200vh]" data-label="Zoom Phase" />
        <section className="h-[200vh]" data-label="Scatter/DNA Phase" />
        <section className="h-[200vh]" data-label="Space Phase" />
        <section className="h-[200vh]" data-label="Space Phase" />
      </div>

      <AboutSection />
      <HeroConclusion />
    </main>
  )
}