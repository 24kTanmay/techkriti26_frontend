import { notFound } from 'next/navigation';
import EventDetailPage from '../../../components/ui/EventDetailPage';
import CategoryGridPage from '../../../components/ui/CategoryGridPage';
import type { EventDetailData, CategoryGridData } from '../../../types/event';
import eventsDataRaw from '../../../data/events.json';

// Type assertion for the imported JSON
const eventsData = eventsDataRaw as Record<string, any>;

export default function DynamicEventPage({ params }: { params: { slug: string[] } }) {
  if (!params.slug || params.slug.length < 2) {
    notFound();
  }

  const domainSlug = params.slug[0];
  const categorySlug = params.slug[1];

  const categoryKey = Object.keys(eventsData).find(
    (key) => key.toLowerCase() === categorySlug.toLowerCase()
  );

  if (!categoryKey || !eventsData[categoryKey]) {
    notFound();
  }

  const categoryData = eventsData[categoryKey];
  const itemsArray = categoryData.data || [];

  // Formatting strings
  const domainFormatted = domainSlug.charAt(0).toUpperCase() + domainSlug.slice(1);
  const categoryFormatted = categoryData.title || categoryKey;
  
  // Base configuration string fallback for missing UI gradients
  const canvasIds: Record<string, string> = {
    'technical': 'star-canvas-robowar',
    'entrepreneurial': 'star-canvas-entrepreneurial',
    'miscellaneous': 'star-canvas-miscellaneous'
  };

  const finalCanvasId = canvasIds[domainSlug.toLowerCase()] || 'star-canvas-robowar';

  // --- CATEGORY GRID PAGE (e.g. /competitions/technical/robogames) ---
  if (params.slug.length === 2) {
    const overviewItem = itemsArray.find((item: any) => item.flag?.content === 'overview');
    const overviewText = overviewItem?.desc?.content || '';

    const comps = itemsArray
      .filter((item: any) => item.flag?.content === 'comp')
      .map((item: any, index: number) => {
        const title = item.title?.content || 'Event';
        const eventSlug = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return {
          title: title,
          number: String(index + 1).padStart(2, '0'),
          href: `/competitions/${domainSlug}/${categorySlug}/${eventSlug}`,
          desc: item.desc?.content || '',
          image: item.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
        };
      });

    const categoryGridData: CategoryGridData = {
      title: categoryFormatted,
      description: overviewText,
      breadcrumbs: [
        { label: 'Competitions', href: '/competitions' },
        { label: domainFormatted },
        { label: categoryFormatted },
      ],
      canvasId: finalCanvasId,
      ctaText: 'Enter Arena',
      events: comps,
    };

    return <CategoryGridPage data={categoryGridData} />;
  }

  // --- EVENT DETAIL PAGE (e.g. /competitions/technical/robogames/robowar) ---
  if (params.slug.length === 3) {
    const eventSlug = params.slug[2];
    
    // Find the specific competition block within this category's data array
    const compItem = itemsArray.find((item: any) => {
      if (item.flag?.content !== 'comp') return false;
      const normalizedTitle = (item.title?.content || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedSlug = eventSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedTitle.includes(normalizedSlug) || normalizedSlug.includes(normalizedTitle);
    });

    if (!compItem) {
      notFound();
    }

    // Find overview text
    const overviewItem = itemsArray.find((item: any) => item.flag?.content === 'overview');
    const overviewText = overviewItem?.desc?.content || compItem.desc?.content || '';

    // Find problem statement link
    const problemStatementItem = itemsArray.find((item: any) => item.flag?.content === 'problem_statement');

    // Find contacts
    const contactsItem = itemsArray.find((item: any) => item.flag?.content === 'contacts');
    let extractedContacts: { name: string, number: string }[] = [];
    if (contactsItem?.desc?.content) {
      const lines = contactsItem.desc.content.split('\n');
      for (const line of lines) {
        if (line.trim().length === 0) continue;
        const match = line.match(/\*\*([^*]+)\*\*:\s*(.+)/);
        if (match) {
          extractedContacts.push({ name: match[1].trim(), number: match[2].trim() });
        }
      }
    }

    // Constructing the final EventDetailData object expected by the UI template
    const finalData: EventDetailData = {
      title: compItem.title?.content || 'Event Title',
      breadcrumb: `${domainFormatted} / ${categoryFormatted} / ${compItem.title?.content || eventSlug}`,
      canvasId: finalCanvasId,
      tabs: [
        { id: 'overview', label: 'Overview' },
        { id: 'problem', label: 'Problem Statement' },
        { id: 'contacts', label: 'Contacts' },
      ],
      contacts: extractedContacts.length > 0 ? extractedContacts : [{ name: "Support", number: "Coming Soon" }],
      overview: {
        paragraphs: overviewText.split('\n').filter((p: string) => p.trim().length > 0),
        meta: compItem.prizeMoney ? [
          { label: 'Total Prize Pool', value: compItem.prizeMoney }
        ] : [],
      },
      secondTab: {
        description: problemStatementItem?.desc?.content || "Here are the problem statements for the competitions. Please refer to the document linked below for complete details.",
        download: {
          title: `${compItem.title?.content || 'Event'}_Rulebook.pdf`,
          subtitle: 'Problem Statement Link',
        },
      },
    };

    return <EventDetailPage data={finalData} />;
  }

  notFound();
}
