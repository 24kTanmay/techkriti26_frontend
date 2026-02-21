'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from '@/components/common/Navbar'
import GallerySection from '@/components/sections/GallerySection'
import ArchivesSection from '@/components/sections/ArchivesSection'
import PastPerformers from '@/components/sections/PastPerformers'

export default function ArchivesPage() {
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
    <main className="relative w-full bg-[#020202]">
      <Navbar />
      <div className="pt-20"> {/* Offset for Fixed Navbar */}
        <GallerySection />
        <ArchivesSection />
        <PastPerformers />
      </div>
    </main>
  )
}
