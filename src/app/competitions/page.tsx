'use client'

import React from 'react'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import CompetitionsSection from '@/components/sections/CompetitionsSection'

export default function CompetitionsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <StarBackgroundViewport count={400} mode="drift" />
      <Navbar />
      <div className="pt-20 relative z-10"> {/* Add padding for fixed navbar */}
        <CompetitionsSection />
      </div>
    </main>
  )
}
