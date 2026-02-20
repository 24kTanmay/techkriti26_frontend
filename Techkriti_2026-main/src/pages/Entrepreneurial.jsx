import { useNavigate } from 'react-router-dom';
import EventCard from '../components/UI/EventCard';
import '../components/entrepreneurial/entrepreneurial.css';
const Entrepreneurial = () => {
  const navigate = useNavigate();


  return (
    <div className="entre-page">



      {/* HERO SECTION */}
      <section className="entre-hero">
        <h1 className="entre-main-title">
          ENTREPRENEURIAL
        </h1>
        {/* <p className="entre-tagline">
          *description of the category*
        </p> */}
      </section>

      {/* CARDS SECTION */}
      <section className="entre-events">
        <EventCard
          title="Entrepreneurial"
          description="For early-stage founders and disruptive ideas"
          to="/events/event-details/entrepreneurial"
          image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2532"
        />

      </section>


    </div>
  );

};

export default Entrepreneurial;
