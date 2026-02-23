import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'MULTIROTOR',
  breadcrumb: 'Technical / Takeoff / TK-02',
  canvasId: 'star-canvas-multirotor',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem Statement' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Karan', number: '+91 97984 76475' },
    { name: 'Lavish', number: '+91 91667 27679' },
  ],
  overview: {
    paragraphs: [
      'The Multirotor aircraft hobby is rapidly growing, offering a unique opportunity to compete with the most advanced aerial platforms.',
      "Showcase your drone's stability, payload capacity, and autonomy in a series of tasks designed to push your flight controller to its limits.",
    ],
    meta: [
      { label: 'Event Timeline', value: '19.03.2026 — 22.03.2026' },
      { label: 'Total Prize Pool', value: 'INR 65,000' },
    ],
  },
  secondTab: {
    description:
      'Detailed task descriptions, arena layouts, and scoring criteria for Multirotor 2026 are provided below.',
    download: {
      title: 'Multirotor_Challenge_v1.pdf',
      subtitle: 'Task Specs • 1.9 MB',
    },
  },
  abstract: {
    description: 'Please upload your technical abstract in PDF format. This should include your team structure, high-level design, and proposed sensor suite.',
  },
}

export default function MultirotorPage() {
  return <EventDetailPage data={DATA} />
}
