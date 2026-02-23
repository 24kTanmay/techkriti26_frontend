import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'SOCIAL TRACK',
  breadcrumb: 'Entrepreneurial / Social Track / EN-04',
  canvasId: 'terminal-star-canvas-social',
  ambientGradient: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)',
  imageFallbackGradient: 'linear-gradient(45deg, #064e3b 0%, #059669 100%)',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'impact', label: 'Impact Areas' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Sameer', number: '+91 77665 55443' },
    { name: 'Kritika', number: '+91 99887 77665' },
  ],
  overview: {
    paragraphs: [
      'Transforming lives through innovation. Social Track is a dedicated platform for startups creating high-impact solutions for pressing social and environmental challenges.',
      'We invite entrepreneurs working in healthcare, education, sustainability, and rural development to showcase their scalable models for a Better Future.',
    ],
    highlight: 'Better Future',
    meta: [{ label: 'Total Prize Pool', value: 'INR 1,50,000' }],
  },
  secondTab: {
    description:
      'Focus categories include: Agrotech, Edutech, Clean Energy, and Waste Management. Participants must demonstrate measurable impact and a viable business model.',
    download: {
      title: 'Social_Impact_Guide.pdf',
      subtitle: 'Impact Metrics \u2022 1.9 MB',
    },
  },
  abstract: {
    description: 'Please upload your startup abstract or executive summary in PDF format. This should include your business model, value proposition, and target market.',
  },
}

export default function SocialTrackPage() {
  return <EventDetailPage data={DATA} />
}
