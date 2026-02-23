import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'IDRL',
  breadcrumb: 'Technical / Takeoff / TK-01',
  canvasId: 'star-canvas-idrl',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem Statement' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Ayaan', number: '+91 98765 43210' },
    { name: 'Rohan', number: '+91 87654 32109' },
  ],
  overview: {
    paragraphs: [
      'Get ready for the ultimate high-octane spectacle with **IDRL Drone Racing**, the next frontier of high-speed aerial competition.',
      'Experience first-person view (FPV) racing where pilots navigate custom-built drones through complex neon-lit obstacle courses at breakneck speeds.',
    ],
    meta: [
      { label: 'Event Timeline', value: '19.03.2026 — 22.03.2026' },
      { label: 'Total Prize Pool', value: 'INR 1,50,000' },
    ],
  },
  secondTab: {
    description:
      'The official track specs, drone weight limits, and frequency requirements for IDRL 2026 are listed below.',
    download: {
      title: 'IDRL_Racing_Rules_2026.pdf',
      subtitle: 'FPV Protocols • 2.6 MB',
    },
  },
  abstract: {
    description: 'Please upload your technical abstract in PDF format. This should include your team structure, high-level design, and proposed sensor suite.',
  },
}

export default function IDRLPage() {
  return <EventDetailPage data={DATA} />
}
