import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'SKYSPARKS',
  breadcrumb: 'Technical / Takeoff / TK-03',
  canvasId: 'star-canvas-skysparks',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem Statement' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Lavish', number: '+91 91667 27679' },
    { name: 'Waqar', number: '+91 94331 75993' },
  ],
  overview: {
    paragraphs: [
      "Skysparks Techkriti's new version of the competition offers aerospace enthusiasts the chance to design and fly high-performance electric aircraft.",
      'From fixed-wing endurance tests to vertical take-off concepts, demonstrate your mastery of aerodynamics and electric propulsion in the next-gen Skysparks arena.',
    ],
    meta: [
      { label: 'Event Timeline', value: '19.03.2026 — 22.03.2026' },
      { label: 'Total Prize Pool', value: 'NA' },
    ],
  },
  secondTab: {
    description:
      'The technical requirements for fuselage construction, battery limits, and scoring formulas for Skysparks are detailed below.',
    download: {
      title: 'Skysparks_Guide_2026.pdf',
      subtitle: 'Full Constraints • 2.3 MB',
    },
  },
}

export default function SkysparksPage() {
  return <EventDetailPage data={DATA} />
}
