'use client'

import React from 'react'
import Navbar from '@/components/common/Navbar'
import CompetitionsSection from '@/components/sections/CompetitionsSection'

export default function CompetitionsPage() {
  return (
    <main className="min-h-screen bg-[#020202]">
      <Navbar />
      <div className="pt-20"> {/* Add padding for fixed navbar */}
        <CompetitionsSection />
      </div>
    </main>
  )
}
