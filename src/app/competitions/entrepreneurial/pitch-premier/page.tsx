import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'PITCH PREMIER',
  breadcrumb: 'Entrepreneurial / Pitch Premier / EN-03',
  canvasId: 'terminal-star-canvas-pitch',
  ambientGradient: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
  imageFallbackGradient: 'linear-gradient(45deg, #312e81 0%, #4338ca 100%)',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'rules', label: 'Guidelines' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Arnav', number: '+91 91223 33445' },
    { name: 'Mehak', number: '+91 88776 66554' },
  ],
  overview: {
    paragraphs: [
      'Pitch Premier is the ultimate stage for the brightest minds to pitch their vision. Stand face-to-face with seasoned investors and venture capitalists to turn your startup idea into a reality.',
      'Whether you are in the ideation phase or already have a prototype, this is your chance to gain national visibility and secure the funding you need to scale in the Venture Core.',
    ],
    highlight: 'Venture Core',
    meta: [{ label: 'Total Prize Pool', value: 'INR 2,00,000' }],
  },
  secondTab: {
    description:
      "Registration requires a pitch deck submission in PDF format. Shortlisted teams will move to the live pitching rounds during Techkriti '26.",
    download: {
      title: 'Pitch_Premier_Rules.pdf',
      subtitle: 'Submission Guide \u2022 1.4 MB',
    },
  },
  abstract: {
    description: 'Please upload your startup abstract or executive summary in PDF format. This should include your business model, value proposition, and target market.',
  },
}

export default function PitchPremierPage() {
  return <EventDetailPage data={DATA} />
}
