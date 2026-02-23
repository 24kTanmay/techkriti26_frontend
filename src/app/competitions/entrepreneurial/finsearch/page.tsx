import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'FINSEARCH',
  breadcrumb: 'Entrepreneurial / Finsearch / EN-06',
  canvasId: 'terminal-star-canvas-finsearch',
  ambientGradient: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 60%)',
  imageFallbackGradient: 'linear-gradient(45deg, #78350f 0%, #92400e 100%)',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'track', label: 'Competition Track' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Vikram', number: '+91 66554 33221' },
    { name: 'Niti', number: '+91 55443 22110' },
  ],
  overview: {
    paragraphs: [
      'Finsearch is a challenge for the numerically gifted and the financially savvy. Dive into the world of algorithmic trading, derivatives, and systemic risk analysis.',
      'Whether you are a math enthusiast or an aspiring quant, this competition tests your ability to find patterns and value in the Financial Entropy.',
    ],
    highlight: 'Financial Entropy',
    meta: [
      { label: 'Focus Areas', value: 'Quant Finance // Data Alpha' },
      { label: 'Total Prize Pool', value: 'INR 50,000' },
    ],
  },
  secondTab: {
    description:
      'The competition consists of a preliminary quantitative test followed by a 24-hour backtesting hackathon.',
    download: {
      title: 'Finsearch_Alpha_v1.pdf',
      subtitle: 'Encrypted Quant Set \u2022 0.9 MB',
    },
  },
}

export default function FinsearchPage() {
  return <EventDetailPage data={DATA} />
}
