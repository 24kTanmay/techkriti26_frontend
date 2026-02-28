import React from 'react';
import { StarBackgroundViewport } from '@/components/common/StarBackground';
import Navbar from '@/components/common/Navbar';
import WorkshopsSection from '@/components/sections/WorkshopsSection';

export const metadata = {
  title: "Techkriti '26 | Workshops",
  description: "Workshops - Phase_03 // Skill Building",
};

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-white">
      <StarBackgroundViewport count={400} mode="drift" />
      <Navbar />
      <div className="pt-20 relative z-10">
        <WorkshopsSection />
      </div>
    </main>
  );
}
