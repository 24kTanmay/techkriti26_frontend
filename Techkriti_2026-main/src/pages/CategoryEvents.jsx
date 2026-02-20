import { useParams } from 'react-router-dom';
import EventCard from '../components/UI/EventCard';
import eventsData from '../data/events.json';
import '../components/technical/technical.css'; // Reusing existing styles for now

const CategoryEvents = () => {
  const { category, categoryId } = useParams();
  
  // Handle potential default export issue with JSON
  const actualEventsData = eventsData.default || eventsData;
  const categoryData = actualEventsData[categoryId];

  if (!categoryData) {
    return (
      <div className="text-center p-10 text-white">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <p>Requested ID: {categoryId}</p>
        <p>Available Categories: {Object.keys(actualEventsData).join(", ")}</p>
      </div>
    );
  }

  const { title, data } = categoryData;

  // Filter for actual competitions
  const competitions = data.filter(item => item.flag.content === 'comp');

  return (
    <div className="tech-page">
      <section className="tech-hero">
        <h1 className="tech-title">{title.toUpperCase()}</h1>
      </section>

      <section className="tech-events">
        {competitions.map((comp, index) => (
            <EventCard
            key={index}
            title={comp.title.content}
            description={comp.desc.content.substring(0, 100) + "..."} // Truncate description
            to={`/competitions/${category}/${categoryId}/${comp.title.content.toLowerCase().replace(/\s+/g, '-')}`}
            image={comp.image || "/placeholder.jpg"} // Fallback image
            />
        ))}
      </section>
    </div>
  );
};

export default CategoryEvents;
