import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'IARC',
  breadcrumb: 'Technical / Robogames / ID-01',
  canvasId: 'star-canvas-iarc',
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
      "Join IARC, the ultimate autonomous robotics challenge at Techkriti' 26! Design and build bots to solve intricate mazes, decode nodes, and tackle speed and angle tasks with precision.",
      'Showcase your innovation, engineering, and coding skills. Compete with top teams globally and achieve robotic glory in the Neo-Nous Singularita arena.',
    ],
    highlight: 'Neo-Nous Singularita',
    meta: [
      { label: 'Event Timeline', value: '19.03.2026 — 22.03.2026' },
      { label: 'Total Prize Pool', value: 'NA' },
    ],
  },
  secondTab: {
    description:
      'The official parameters, constraints, and arena dimensions for the autonomous challenge are documented below. Ensure your build complies with all weight and sensor restrictions.',
    download: {
      title: 'IARC_Specs_v2.pdf',
      subtitle: 'Encrypted PDF Document • 2.4 MB',
    },
  },
}

export default function IARCPage() {
  return <EventDetailPage data={DATA} />
}
