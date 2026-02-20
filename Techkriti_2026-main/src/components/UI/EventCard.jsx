import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ title, description, image, to, onClick }) => {
  const cardStyle = image ? { backgroundImage: `url(${image})` } : {};

  const content = (
    <div className="event-card-overlay">
      <div className="event-card-content">
        <h3 className="event-card-title">{title}</h3>
        {description && <p className="event-card-desc">{description}</p>}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="event-card" style={cardStyle}>
        {content}
      </Link>
    );
  }

  return (
    <div className="event-card" style={cardStyle} onClick={onClick}>
      {content}
    </div>
  );
};

export default EventCard;
