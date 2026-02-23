import CategoryGridPage from '@/components/ui/CategoryGridPage'
import type { CategoryGridData } from '@/types/event'

const DATA: CategoryGridData = {
  title: 'Robogames',
  description:
    "Enter the battleground of engineering brilliance. Design, build, and deploy autonomous and remote-controlled machines in Techkriti's ultimate robotics showcase.",
  breadcrumbs: [
    { label: 'Competitions', href: '/competitions' },
    { label: 'Technical' },
    { label: 'Robogames' },
  ],
  canvasId: 'star-canvas-robo',
  ctaText: 'Enter Arena',
  events: [
    {
      title: 'IARC',
      number: '01',
      href: '/competitions/technical/robogames/iarc',
      desc: 'Join IARC, the ultimate autonomous robotics challenge. Design and build bots to solve complex real-world logic mazes and terrain obstacles.',
      image:
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
    },
    {
      title: 'Robowars',
      number: '02',
      href: '/competitions/technical/robogames/robowar',
      desc: "Techkriti's flagship event, Robowars, is a thrilling battleground of engineering brilliance. Robots in 8 kg, 15 kg, and 30 kg categories engage in intense one-on-one combat.",
      image:
        'https://images.unsplash.com/photo-1593376893114-1aed528d80cf?q=80&w=2000&auto=format&fit=crop',
    },
    {
      title: 'Manoeuvre',
      number: '03',
      href: '/competitions/technical/robogames/manoeuvre',
      desc: 'Build a four-wheeled gripper robot to navigate diverse terrains. Work in pairs to transport and stack objects in complex patterns through precision coordination.',
      image:
        'https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=1000&auto=format&fit=crop',
    },
    {
      title: 'Grand Prix',
      number: '04',
      href: '/competitions/technical/robogames/grand-prix',
      desc: 'The ultimate IC engine RC car showdown! Design and race custom-built machines on dynamic terrains. Showcase your engineering precision to tackle the track.',
      image:
        'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1000&auto=format&fit=crop',
    },
  ],
}

export default function RobogamesPage() {
  return <CategoryGridPage data={DATA} />
}
