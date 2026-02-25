import CategoryGridPage from '@/components/ui/CategoryGridPage'
import type { CategoryGridData } from '@/types/event'

const DATA: CategoryGridData = {
  title: 'Takeoff',
  description:
    "Ascend to the skies in Techkriti's flagship aeromodelling arena. From custom multirotors to high-speed hovercraft, engineering the future of flight begins here.",
  breadcrumbs: [
    { label: 'Competitions', href: '/competitions' },
    { label: 'Technical' },
    { label: 'Takeoff' },
  ],
  canvasId: 'grid-star-canvas-takeoff',
  ctaText: 'Enter Hangar',
  ambientGradient: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
  events: [
    {
      title: 'IDRL',
      number: '01',
      href: '/competitions/technical/takeoff/idrl',
      desc: 'Get ready for the ultimate high-octane spectacle with IDRL Drone Racing, the next frontier of high-speed aerial competition.',
      image:
        'https://images.unsplash.com/photo-1508614589041-895b9ec99607?q=80&w=1000&auto=format&fit=crop',
    },
    {
      title: 'Multirotor',
      number: '02',
      href: '/competitions/technical/takeoff/multirotor',
      desc: 'The Multirotor aircraft hobby is rapidly growing, offering a unique opportunity to compete with the most advanced aerial platforms.',
      image:
        'https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?q=80&w=1000&auto=format&fit=crop',
    },
    {
      title: 'Skysparks',
      number: '03',
      href: '/competitions/technical/takeoff/skysparks',
      desc: "Skysparks Techkriti's new version of the competition offers aerospace enthusiasts the chance to design high-performance electric aircraft.",
      image:
        'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop',
    },
    {
      title: 'Hovermania',
      number: '04',
      href: '/competitions/technical/takeoff/hovermania',
      desc: 'Hovermania 2026 challenges teams to design and build lightweight, agile hovercrafts for knockout racing on complex varied terrains.',
      image:
        'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000&auto=format&fit=crop',
    },
  ],
}

export default function TakeoffPage() {
  return <CategoryGridPage data={DATA} />
}
