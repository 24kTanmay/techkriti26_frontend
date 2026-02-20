import { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <div className="logo">TECHKRITI<span className="highlight">26</span></div>
                <div className="nav-links">
                    <a href="#about">About</a>
                    <a href="#theme">Theme</a>
                    <a href="#legacy">Legacy</a>
                    <a href="#events">Events</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#community" className="btn btn-primary sm">Register</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
