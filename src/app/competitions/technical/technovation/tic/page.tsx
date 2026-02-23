import EventDetailPage from '@/components/ui/EventDetailPage'
import type { EventDetailData } from '@/types/event'

const DATA: EventDetailData = {
  title: 'TIC',
  breadcrumb: 'Technical / Technovation / TIC-01',
  canvasId: 'star-canvas-tic',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'guidelines', label: 'Guidelines' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'contacts', label: 'Contacts' },
  ],
  contacts: [
    { name: 'Aditya', number: '+91 88776 55443' },
    { name: 'Sanya', number: '+91 99887 77665' },
  ],
  overview: {
    paragraphs: [
      '\u201CThe only place where dreams become impossible is in your dreams.\u201D',
      'Techkriti Innovation Challenge (TIC) is a premier platform for young innovators to showcase their creative thinking and engineering prowess. It encourages participants to identify real-world problems and develop scalable, tech-driven solutions.',
    ],
    meta: [{ label: 'Prize Pool', value: 'INR 1,50,000' }],
  },
  secondTab: {
    description:
      'Participants must submit an abstract of their project followed by a detailed prototype presentation. All engineering branches are welcome to participate.',
    download: {
      title: 'TIC_Innovation_Guide_26.pdf',
      subtitle: 'Submission Manual \u2022 2.1 MB',
    },
  },
  abstract: {
    description: 'Please upload your technical abstract in PDF format. This should include your team structure, high-level design, and proposed sensor suite.',
  },
}

export default function TICPage() {
  return <EventDetailPage data={DATA} />
}
