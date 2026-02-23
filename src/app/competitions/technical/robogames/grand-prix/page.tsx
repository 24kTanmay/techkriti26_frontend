import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'GRAND PRIX',
  breadcrumb: 'Technical / Robogames / GP-01',
  canvasId: 'star-canvas-grand-prix',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem Statement' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Karan', number: '+91 97984 76475' },
    { name: 'Lavish', number: '+91 91667 27679' },
    { name: 'Waqar', number: '+91 94331 75993' },
    { name: 'Rahul', number: '+91 62024 30255' },
  ],
  overview: {
    paragraphs: [
      'Gear up for Techkriti Grand Prix, the ultimate RC car showdown! Design and race custom-built IC engine-powered RC cars on dynamic tracks. Showcase innovation, engineering, and precision to outshine competitors.',
      'Compete in thrilling rounds, tackle challenging terrains, and aim for glory in this high-octane racing challenge.',
    ],
    meta: [
      { label: 'Event Timeline', value: '19.03.2026 — 22.03.2026' },
      { label: 'Total Prize Pool', value: 'INR 75,000' },
    ],
  },
  secondTab: {
    description:
      'The official track layout, vehicle dimensions, and power restrictions for the Grand Prix are documented below.',
    download: {
      title: 'GrandPrix_Rules_2026.pdf',
      subtitle: 'Circuit & Specs • 2.1 MB',
    },
  },
  abstract: {
    description: 'Please upload your technical abstract in PDF format. This should include your team structure, high-level design, and proposed sensor suite.',
  },
}

export default function GrandPrixPage() {
  return <EventDetailPage data={DATA} />
}
