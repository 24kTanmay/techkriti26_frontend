import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'ROBOWARS',
  breadcrumb: 'Technical / Robogames / RW-01',
  canvasId: 'star-canvas-robowar',
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
      "Techkriti's flagship event, Robowars, is a thrilling battleground of engineering brilliance, strategy, and innovation. Robots in 8 kg, 15 kg, and 30 kg categories engage in intense one-on-one combat, showcasing powerful weapons and robust designs.",
      'Compete to claim glory, pride, and the ultimate title in this electrifying robotic showdown!',
    ],
    meta: [
      { label: 'Event Timeline', value: '19.03.2026 — 22.03.2026' },
      { label: 'Total Prize Pool', value: 'INR 4,25,000' },
    ],
  },
  secondTab: {
    description:
      'The official weight categories, weapon restrictions, and arena safety guidelines for the combat challenge are documented below.',
    download: {
      title: 'Robowar_Specs_2026.pdf',
      subtitle: 'Full Specification • 3.1 MB',
    },
  },
  abstract: {
    description: 'Please upload your technical abstract in PDF format. This should include your team structure, high-level design, and proposed sensor suite.',
  },
}

export default function RobowarPage() {
  return <EventDetailPage data={DATA} />
}
