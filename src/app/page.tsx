'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/common/Navbar'
import AboutSection from '@/components/sections/AboutSection'
import HeroConclusion from '@/components/sections/HeroConclusion'
import AmbientAurora from '@/components/common/AmbientAurora'
import Preloader from '@/components/common/Preloader'
import Wheel from '@/components/ui/Wheel'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const HeroHead = dynamic(() => import('@/components/3d/Scene'), { ssr: false })

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [wheelProgress, setWheelProgress] = useState(0)
  const [currentSummit, setCurrentSummit] = useState(0)
  const wheelSectionRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const phaseRef = useRef(0)

  // Random Unsplash IDs for summits
  const summitImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000", // Tech
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000", // AI
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000", // Rakshakriti
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000", // MedTech
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000", // Space
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000", // E-Conclave
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000", // Sustainability
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000", // Industry 4.0
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000", // Women Panel
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000"  // Vision 360
  ]

  const summitNames = [
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

  const summitBriefs = [
    "Engineering the future through disruptive innovations.",
    "Exploring the frontiers of artificial intelligence and machine learning.",
    "Strengthening national security through indigenous defense technology.",
    "Revolutionizing healthcare with advanced medical engineering.",
    "Scaling new heights in aerospace and interplanetary exploration.",
    "Igniting the entrepreneurial spirit of tomorrow's leaders.",
    "Crafting eco-friendly solutions for a greener planet.",
    "Mastering the smart manufacturing and automation revolution.",
    "Celebrating and empowering women leaders in the tech ecosystem.",
    "Shaping global policies through multifaceted dialogue."
  ];

  const handleSummitSelect = useCallback((index: number) => {
    setCurrentSummit(index)
  }, [])

  useEffect(() => {
    setMounted(true)
    const lenis = new Lenis()
    lenisRef.current = lenis

    if (isLoading) {
      lenis.stop()
    }

    // Bridge Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Phases: 0 = Head Zoom, 1 = Explosion/DNA, 2 = Space
    ScrollTrigger.create({
      trigger: '#scroll-trigger',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
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

  // Start lenis when loading finishes
  useEffect(() => {
    if (!isLoading && lenisRef.current) {
      lenisRef.current.start()
      document.documentElement.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
    } else if (isLoading) {
      document.documentElement.classList.add('no-scroll')
      document.body.classList.add('no-scroll')
    }
  }, [isLoading])

  // Separate effect for wheel pin — runs after mount so ref is valid
  useEffect(() => {
    if (!wheelSectionRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: wheelSectionRef.current,
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        setWheelProgress(self.progress)
      }
    })

    return () => {
      trigger.kill()
    }
  }, [])

  return (
    <main className="relative w-full bg-[var(--bg-primary)]">
      <Preloader onComplete={() => setIsLoading(false)} />
      <Navbar />
      <AmbientAurora />
      
      {/* 3D Background Layer */}
      <div className="fixed top-0 left-0 w-full h-[100vh] z-0 pointer-events-none">
        <div className="absolute inset-0">
          <HeroHead />
        </div>
      </div>

      {/* Scroll Triggers (Main Hero Logic) */}
      <div id="scroll-trigger" className="relative w-full z-10 pointer-events-none">
        <section className="h-[200vh]" data-label="Zoom Phase" />
        <section className="h-[200vh]" data-label="Scatter/DNA Phase" />
        <section className="h-[200vh]" data-label="Space Phase" />
        <section className="h-[200vh]" data-label="Space Phase" />
      </div>

      <AboutSection />
      
      {/* Interactive Wheel Section - Locked until completion */}
      <div ref={wheelSectionRef} className="w-full relative h-[100vh] flex flex-col lg:flex-row items-center overflow-hidden">
        
        {/* Summit Visual Preview */}
        <div 
          className={`absolute right-1/2 translate-x-1/2 lg:right-[6%] lg:translate-x-0 top-[15%] lg:top-1/2 lg:-translate-y-1/2 w-[85vw] lg:w-[28vw] lg:max-w-[520px] lg:min-w-[420px] h-[35vh] lg:h-auto lg:aspect-[4/5] rounded-[30px] lg:rounded-[48px] overflow-hidden border border-white/10 z-20 shadow-[0_40px_100px_rgba(var(--color-black-rgb),0.7)] transition-all duration-1000 ease-out ${
            wheelProgress > 0.01 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
          }`}
        >
           <Image 
             key={`img-${currentSummit}`}
             src={summitImages[currentSummit] || summitImages[0]}
             alt={summitNames[currentSummit]}
             fill
             className="object-cover animate-fade-in transition-opacity duration-500"
             sizes="(max-width: 1024px) 85vw, 30vw"
             priority={currentSummit === 0}
             style={{ 
               filter: 'contrast(1.1) brightness(0.8)',
             }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
           
           {/* Details Layer */}
           <div 
             key={`text-${currentSummit}`}
             className="absolute bottom-6 lg:bottom-12 left-6 lg:left-10 right-6 lg:right-10 transform animate-text-reveal"
             style={{ animationDelay: '0.1s' }}
           >
              <h3 className="text-xl lg:text-3xl font-bold tracking-tight text-white uppercase mb-1 lg:mb-3 leading-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                {summitNames[currentSummit]}
              </h3>
              <p className="text-white/60 text-[10px] lg:text-sm leading-relaxed max-w-[95%] font-light tracking-wide">
                {summitBriefs[currentSummit]}
              </p>
           </div>
        </div>

        <div className="w-full h-full mt-[30vh] lg:mt-0 flex items-center justify-center">
          <Wheel 
            scrollDrive={wheelProgress} 
            onSelect={handleSummitSelect}
          />
        </div>
      </div>

      <HeroConclusion />
    </main>
  )
}