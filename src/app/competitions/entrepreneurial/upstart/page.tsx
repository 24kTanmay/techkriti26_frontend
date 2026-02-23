import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'UPSTART',
  breadcrumb: 'Entrepreneurial / Upstart / EN-01',
  canvasId: 'terminal-star-canvas-upstart',
  imageFallbackGradient: 'linear-gradient(45deg, #1e1b4b 0%, #312e81 100%)',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'impact', label: 'Competition Structure' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Aditya', number: '+91 88776 55443' },
    { name: 'Sanya', number: '+91 99887 77665' },
  ],
  overview: {
    paragraphs: [
      "Upstart is Techkriti's premier startup launchpad. It provides a unique opportunity for early-stage startups to refine their business models through intensive mentoring by industry experts.",
      'Finalists get to pitch their ideas to a panel of elite venture capitalists and angel investors, competing for seed funding and recognition in the global Innovation Core.',
    ],
    highlight: 'Innovation Core',
    meta: [{ label: 'Total Prize Pool', value: '\u20B9 15,00,000 + Funding Ops' }],
  },
  secondTab: {
    description:
      'Upstart follows a rigorous three-stage evaluation process designed to test the scalability and viability of your startup venture.',
    download: {
      title: 'Upstart_Structure_2026.pdf',
      subtitle: 'Draft Document \u2022 1.8 MB',
    },
  },
  abstract: {
    description: 'Please upload your startup abstract or executive summary in PDF format. This should include your business model, value proposition, and target market.',
  },
}

export default function UpstartPage() {
  return <EventDetailPage data={DATA} />
}
