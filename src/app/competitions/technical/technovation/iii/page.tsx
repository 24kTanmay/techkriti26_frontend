import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'III',
  breadcrumb: 'Technical / Technovation / III-02',
  canvasId: 'star-canvas-iii',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'focus', label: 'Industry Focus' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Rajiv', number: '+91 77665 11223' },
    { name: 'Ishani', number: '+91 88990 33445' },
  ],
  overview: {
    paragraphs: [
      'A stronger collaboration between technical institutions and industry is essential to enhance engineering education.',
      'The Industry Institute Interaction (III) section focuses on creating a synergy between academic learning and industrial requirements. It features panel discussions, industrial problems, and networking sessions with corporate leaders.',
    ],
    meta: [
      { label: 'Session Type', value: 'Industrial Synergy // Networking' },
      { label: 'Total Prize Pool', value: 'NA' },
    ],
  },
  secondTab: {
    description:
      'Key focus areas include automation, sustainable manufacturing, and digital transformation. Participants learn how to apply theoretical knowledge to solve complex industrial bottlenecks.',
    download: {
      title: 'III_Industrial_Connect_26.pdf',
      subtitle: 'Corporate Roadmap \u2022 1.5 MB',
    },
  },
  abstract: {
    description: 'Please upload your technical abstract in PDF format. This should include your team structure, high-level design, and proposed sensor suite.',
  },
}

export default function IIIPage() {
  return <EventDetailPage data={DATA} />
}
