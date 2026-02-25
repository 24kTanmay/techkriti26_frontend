import CategoryGridPage from '@/components/ui/CategoryGridPage'
import type { CategoryGridData } from '@/types/event'

const DATA: CategoryGridData = {
  title: 'Software',
  description:
    'Dive into the matrix of high-performance coding. From algorithmic battles and cyber security to advanced artificial intelligence, this is where the new digital age is written.',
  breadcrumbs: [
    { label: 'Competitions', href: '/competitions' },
    { label: 'Technical' },
    { label: 'Software Corner' },
  ],
  canvasId: 'grid-star-canvas-software',
  ctaText: 'Compile',
  ambientGradient: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
  events: [
    {
      title: 'IUPC',
      number: '01',
      href: '#',
      desc: 'The Inter-University Programming Contest. A battle of algorithms and data structures where only the most efficient survive.',
      image: '',
    },
    {
      title: 'Cyber Security',
      number: '02',
      href: '#',
      desc: 'Secure the perimeter and exploit the vulnerabilities. A Capture The Flag (CTF) arena for the elite hackers.',
      image: '',
    },
    {
      title: 'AI Challenge',
      number: '03',
      href: '#',
      desc: 'Develop intelligent agents to solve complex problems. Machine learning, neural networks, and tactical optimization.',
      image: '',
    },
  ],
}

export default function SoftwareCornerPage() {
  return <CategoryGridPage data={DATA} />
}
