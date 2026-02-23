import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'ELEVATOR PITCH',
  breadcrumb: 'Entrepreneurial / Elevator Pitch / EN-05',
  canvasId: 'terminal-star-canvas-elevator',
  ambientGradient: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 60%)',
  imageFallbackGradient: 'linear-gradient(45deg, #78350f 0%, #d97706 100%)',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'format', label: 'Pitch Format' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Rohan', number: '+91 88776 55432' },
    { name: 'Ananya', number: '+91 91223 44556' },
  ],
  overview: {
    paragraphs: [
      '60 seconds to change everything. Elevator Pitch is a high-pressure arena where participants must present their business vision in the time it takes to ride an elevator.',
      'Master the art of brevity and persuasion as you pitch to a panel of experts who have seen it all. Only the most compelling and concise ideas will advance in the Pressure Zone.',
    ],
    highlight: 'Pressure Zone',
    meta: [{ label: 'Total Prize Pool', value: 'INR 75,000' }],
  },
  secondTab: {
    description:
      'Strict 60-second limit. No slides, no props\u2014just your voice and your vision. Judging criteria focus on clarity, market potential, and conviction.',
    download: {
      title: 'Elevator_Pitch_Manual.pdf',
      subtitle: 'Pitching Protocols \u2022 1.2 MB',
    },
  },
}

export default function ElevatorPitchPage() {
  return <EventDetailPage data={DATA} />
}
