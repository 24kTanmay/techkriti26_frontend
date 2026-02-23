import { notFound } from 'next/navigation';
import EventDetailPage from '../../../components/ui/EventDetailPage';
import type { EventDetailData } from '../../../types/event';
import eventsDataRaw from '../../../data/events.json';

// Type assertion for the imported JSON
const eventsData = eventsDataRaw as Record<string, any>;

export default function DynamicEventPage({ params }: { params: { slug: string[] } }) {
  // A competition URL will usually be something like:
  // /competitions/technical/robogames/robowar
  // the 'slug' array will be: ['technical', 'robogames', 'robowar']

  // We need at least the category (robogames) and the event slug (robowar)
  if (!params.slug || params.slug.length < 2) {
    notFound();
  }

  // The last part is the specific event slug (e.g. 'robowar', 'bizsim')
  const eventSlug = params.slug[params.slug.length - 1];
  
  // The second to last part is the category slug (e.g. 'robogames', 'fintech', 'business')
  const categorySlugRaw = params.slug[params.slug.length - 2];
  
  // Try to find the matching category in events.json.
  // Sometimes the URL slug might not exactly match the JSON key, but for Techkriti, they closely align.
  // Example: URL is 'takeoff', JSON key is 'takeoff'. 
  // URL is 'ecdc', JSON key is 'ECDC'.
  const categoryKey = Object.keys(eventsData).find(
    (key) => key.toLowerCase() === categorySlugRaw.toLowerCase()
  );

  if (!categoryKey || !eventsData[categoryKey]) {
    notFound();
  }

  const categoryData = eventsData[categoryKey];
  const itemsArray = categoryData.data || [];

  // Find the specific competition block within this category's data array
  const compItem = itemsArray.find((item: any) => {
    if (item.flag?.content !== 'comp') return false;
    // We normalize the title from JSON (e.g. "Robowars") to match the slug ("robowar")
    // Simple normalization: lowercase, remove spaces, remove special characters
    const normalizedTitle = (item.title?.content || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedSlug = eventSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Also check if the slug is a direct substring or vice versa (e.g. robowars vs robowar, idrl vs idrl)
    return normalizedTitle.includes(normalizedSlug) || normalizedSlug.includes(normalizedTitle);
  });

  if (!compItem) {
    notFound();
  }

  // Find overview text
  const overviewItem = itemsArray.find((item: any) => item.flag?.content === 'overview');
  const overviewText = overviewItem?.desc?.content || compItem.desc?.content || '';

  // Find contacts
  const contactsItem = itemsArray.find((item: any) => item.flag?.content === 'contacts');
  let extractedContacts: { name: string, number: string }[] = [];
  if (contactsItem?.desc?.content) {
    // Parse contacts from the string "**Name:** +91 1234\n\n**Name2:** +91 5678"
    const lines = contactsItem.desc.content.split('\n');
    for (const line of lines) {
      if (line.trim().length === 0) continue;
      // Match something like "**Karan:** +91 97984 76475"
      const match = line.match(/\*\*([^*]+)\*\*:\s*(.+)/);
      if (match) {
        extractedContacts.push({ name: match[1].trim(), number: match[2].trim() });
      }
    }
  }

  // Formatting strings for Breadcrumb
  const domainNode = params.slug[0] || 'Domain'; // e.g. Technical
  const domainFormatted = domainNode.charAt(0).toUpperCase() + domainNode.slice(1);
  const categoryFormatted = categoryData.title || categoryKey;
  
  // Base configuration string fallback for missing UI gradients
  const canvasIds: Record<string, string> = {
    'technical': 'star-canvas-robowar',
    'entrepreneurial': 'star-canvas-entrepreneurial',
    'miscellaneous': 'star-canvas-miscellaneous'
  };

  const finalCanvasId = canvasIds[domainNode.toLowerCase()] || 'star-canvas-robowar';

  // Constructing the final EventDetailData object expected by the UI template!
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
      description: "Here are the problem statements for the competitions. Please refer to the document linked below for complete details.",
      download: {
        title: `${compItem.title?.content || 'Event'}_Rulebook.pdf`,
        subtitle: 'Problem Statement Link',
      },
    },
  };

  return <EventDetailPage data={finalData} />;
}
