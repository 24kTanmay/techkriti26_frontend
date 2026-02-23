import CategoryGridPage from '@/components/ui/CategoryGridPage'
import type { CategoryGridData } from '@/types/event'

const DATA: CategoryGridData = {
  title: 'Technovation',
  description:
    'The ultimate innovation challenge where bold ideas transform into reality through engineering and design excellence. Tackle real-world problems with futuristic solutions.',
  breadcrumbs: [
    { label: 'Competitions', href: '/competitions' },
    { label: 'Technical' },
    { label: 'Technovation' },
  ],
  canvasId: 'star-canvas-technovation',
  ctaText: 'Enter Arena',
  events: [
    {
      title: 'TIC',
      number: '01',
      href: '/competitions/technical/technovation/tic',
      desc: '\u201CThe only place where dreams become impossible is in your dreams.\u201D Join the Techkriti Innovation Challenge and transform your bold ideas into reality.',
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    },
    {
      title: 'III',
      number: '02',
      href: '/competitions/technical/technovation/iii',
      desc: 'A stronger collaboration between technical institutions and industry is essential to enhance engineering education. Bridge the gap between academia and the industrial world.',
      image:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
    },
  ],
}

export default function TechnovationPage() {
  return <CategoryGridPage data={DATA} />
}
