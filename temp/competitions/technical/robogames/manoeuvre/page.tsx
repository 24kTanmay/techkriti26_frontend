import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'MANOEUVRE',
  breadcrumb: 'Technical / Robogames / MN-01',
  canvasId: 'star-canvas-manoeuvre',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem Statement' },
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
      'Participants must build a four-wheeled gripper robot within specified dimensions, capable of navigating diverse terrains and performing tasks like grabbing and moving objects.',
      'Gameplay involves two robots working together to transport, arrange, and stack blocks or special objects in patterns, earning points through coordination and precision in task execution.',
    ],
    meta: [
      { label: 'Event Timeline', value: '19.03.2026 — 22.03.2026' },
      { label: 'Total Prize Pool', value: 'INR 65,000' },
    ],
  },
  secondTab: {
    description:
      'The detailed rules, track dimensions, and obstacle types for the navigation challenge are provided below.',
    download: {
      title: 'Manoeuvre_Guide_2026.pdf',
      subtitle: 'Rules & Tracks • 1.5 MB',
    },
  },
}

export default function ManoeuvrePage() {
  return <EventDetailPage data={DATA} />
}
