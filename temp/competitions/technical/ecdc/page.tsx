import CategoryGridPage from '@/components/ui/CategoryGridPage'
import type { CategoryGridData } from '@/types/event'

const DATA: CategoryGridData = {
  title: 'ECDC',
  description:
    'The domain of silicon and signals. From embedded systems design and analog circuits to high-speed digital logic, master the hardware that powers the future.',
  breadcrumbs: [
    { label: 'Competitions', href: '/competitions' },
    { label: 'Technical' },
    { label: 'ECDC' },
  ],
  canvasId: 'grid-star-canvas-ecdc',
  ctaText: 'Power Up',
  ambientGradient: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)',
  events: [
    {
      title: 'Embedded Systems',
      number: '01',
      href: '#',
      desc: 'Design micro-controller based solutions for real-world automation. Real-time OS, firmware, and low-level optimization.',
      image: '',
    },
    {
      title: 'Analog Design',
      number: '02',
      href: '#',
      desc: 'Craft precision circuits from the ground up. Master the nuances of signal processing, filters, and amplifiers.',
      image: '',
    },
    {
      title: 'FPGA Challenge',
      number: '03',
      href: '#',
      desc: 'Implement high-speed digital logic on hardware. VHDL/Verilog expertise in a race against time and clock cycles.',
      image: '',
    },
  ],
}

export default function ECDCPage() {
  return <CategoryGridPage data={DATA} />
}
