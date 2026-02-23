import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'BIZSIM',
  breadcrumb: 'Entrepreneurial / BizSim / EN-02',
  canvasId: 'terminal-star-canvas-bizsim',
  ambientGradient: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
  imageFallbackGradient: 'linear-gradient(45deg, #064e3b 0%, #065f46 100%)',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'rules', label: 'Simulation Rules' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Rajesh', number: '+91 77665 44332' },
    { name: 'Priya', number: '+91 88990 11223' },
  ],
  overview: {
    paragraphs: [
      'BizSim is an immersive corporate strategy simulation where participants take on the role of C-suite executives managing a multi-million dollar corporation in a volatile market.',
      'Master financial forecasting, production planning, and competitive marketing strategies to outperform your rivals in this Economic Singularity.',
    ],
    highlight: 'Economic Singularity',
    meta: [
      { label: 'Difficulty Level', value: 'Expert // High-Fidelity Sim' },
      { label: 'Total Prize Pool', value: 'INR 50,000' },
    ],
  },
  secondTab: {
    description:
      'The simulation runs for 12 virtual quarters across 48 real-world hours. Ensure your team has a stable connection and strong analytical skills.',
    download: {
      title: 'BizSim_Rulebook_26.pdf',
      subtitle: 'Standard Operating Proc \u2022 1.2 MB',
    },
  },
  abstract: {
    description: 'Please upload your startup abstract or executive summary in PDF format. This should include your business model, value proposition, and target market.',
  },
}

export default function BizSimPage() {
  return <EventDetailPage data={DATA} />
}
