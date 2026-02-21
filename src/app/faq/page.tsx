'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from '@/components/common/Navbar'
import FAQSection from '@/components/sections/FAQSection'
import AmbientAurora from '@/components/common/AmbientAurora'

export default function FAQPage() {
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <main className="relative min-h-screen w-full bg-[#020204] overflow-hidden">
      <AmbientAurora />
      <Navbar />
      
      <div className="pt-32 pb-20 relative z-10">
        <FAQSection />
      </div>

      <div className="noise" style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        opacity: 0.04,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }}></div>
    </main>
  )
}
