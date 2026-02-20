

import EventCard from '../components/UI/EventCard';

import '../components/technical/technical.css';

const Technical = () => {




  return (
    <div className="tech-page">



      {/* HERO SECTION */}
      <section className="tech-hero">
        <h1 className="tech-title">
          TECHNICAL
        </h1>
        {/* <p className="tech-tagline">
          *description of the category*
        </p> */}
      </section>

      {/* CARDS SECTION */}
      <section className="tech-events">
        <EventCard
          title="Business Events"
          description="Strategic competitions testing your business acumen"
          to="/events/event-details/business"
          image="/StrategySprint.png"
        />

        <EventCard
          title="Model United Nations"
          description="Debate, collaborate, and solve global issues"
          to="/events/event-details/mun"
          image="/UNSC.png"
        />

        <EventCard
          title="Robogames"
          description="Battle of the bots and autonomous systems"
          to="/events/event-details/robogames"
          image="/robowar.jpeg"
        />

        <EventCard
          title="Takeoff"
          description="Aerial robotics and drone challenges"
          to="/events/event-details/takeoff"
          image="/skysparks.jpeg"
        />

        <EventCard
          title="Software Corner"
          description="Coding challenges and software development"
          to="/events/event-details/software"
          image="/CodeNCompete.jpeg"
        />

        <EventCard
          title="Mandakini"
          description="Unravel the mysteries of the cosmos"
          to="/events/event-details/mandakini"
          image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2372"
        />

        <EventCard
          title="Technovation"
          description="Showcase your innovative projects"
          to="/events/event-details/technovation"
          image="/TIC.png"
        />

        <EventCard
          title="Fintech"
          description="High-stakes pitching and business strategy"
          to="/events/event-details/fintech"
          image="/BeatTheMarket.jpeg"
        />
      </section>

    </div>
  );
};

export default Technical;
