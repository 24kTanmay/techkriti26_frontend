import EventCard from '../components/UI/EventCard';
import '../components/technical/technical.css'; // Reuse tech styles or create mis-styles

const Miscellaneous = () => {
    return (
        <div className="tech-page">
            {/* HERO SECTION */}
            <section className="tech-hero">
                <h1 className="tech-title">
                    MISCELLANEOUS
                </h1>
                {/* <p className="tech-tagline">
                    Beyond the tracks: Workshops, Talks, and Cultural events
                </p> */}
            </section>

            {/* CARDS SECTION */}
            <section className="tech-events">
                <EventCard
                    title="Design Events"
                    description= "Where aesthetics meet functional innovation"
                    to="/events/event-details/design-events"
                    image="/AutodeskDesignChallenge.png"
                />

                <EventCard
                    title="ECDC"
                    description="Building IoT-powered, handheld gaming hardware"
                    to="/events/event-details/ECDC"
                    image="/ECDC.png"
                />

                <EventCard
                    title="Cubing Events"
                    description="Race against the clock to master the cube"
                    to="/events/event-details/cubing-events"
                    image="/cubing.jpeg"
                />
            </section>
        </div>
    );
};

export default Miscellaneous;
