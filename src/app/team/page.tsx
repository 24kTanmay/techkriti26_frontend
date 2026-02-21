import TeamSection from '@/components/sections/TeamSection'
import Navbar from '@/components/common/Navbar'

export const metadata = {
  title: "Team | TechKriti '26",
  description: "Meet the architects behind the Singularity.",
}

export default function TeamPage() {
  return (
    <main>
      <Navbar />
      <TeamSection />
    </main>
  )
}
