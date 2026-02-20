import Hero from '../components/Hero';
import About from '../components/About';
import Theme from '../components/Theme';
import Legacy from '../components/Legacy';
import PastEvents from '../components/PastEvents';
import Community from '../components/Community';
import Gallery from '../components/Gallery';

const Home = () => {
    return (
        <>
            <Hero />
            <About />
            <Theme />
            <Legacy />
            <PastEvents />
            <Community />
            <Gallery />
        </>
    );
};

export default Home;
