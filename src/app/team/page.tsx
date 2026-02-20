import TeamSection from '@/components/ui/TeamSection'
import Navbar from '@/components/ui/Navbar'

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
