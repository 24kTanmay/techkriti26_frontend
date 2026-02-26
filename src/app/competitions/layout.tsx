import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Competitions | Techkriti '26",
  description: "Explore technical and entrepreneurial competitions at Techkriti '26 — IIT Kanpur.",
}

export default function CompetitionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
