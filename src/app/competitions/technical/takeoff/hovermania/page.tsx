import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'HOVERMANIA',
  breadcrumb: 'Technical / Takeoff / TK-04',
  canvasId: 'star-canvas-hovermania',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem Statement' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Lavish', number: '+91 91667 27679' },
    { name: 'Waqar', number: '+91 94331 75993' },
  ],
  overview: {
    paragraphs: [
      'Hovermania 2026 challenges teams to design and build lightweight, agile hovercrafts for knockout racing on complex varied terrains.',
      "Master the mechanics of air-cushion flight. Compete in arenas that transition between smooth surfaces and rugged obstacles, testing the limits of your vehicle's lift and thrust.",
    ],
    meta: [
      { label: 'Event Timeline', value: '19.03.2026 — 22.03.2026' },
      { label: 'Total Prize Pool', value: 'INR 50,000' },
    ],
  },
  secondTab: {
    description:
      'The official track dimensions, surface friction coefficients, and engine power limits for Hovermania 2026 are listed below.',
    download: {
      title: 'Hovermania_Track_2026.pdf',
      subtitle: 'Full Regulations • 1.7 MB',
    },
  },
  abstract: {
    description: 'Please upload your technical abstract in PDF format. This should include your team structure, high-level design, and proposed sensor suite.',
  },
}

export default function HovermaniaPage() {
  return <EventDetailPage data={DATA} />
}
