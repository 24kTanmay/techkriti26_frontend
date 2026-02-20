import React, { useEffect, useRef, useState } from 'react';
import './About.css';

const TEXT_CONTENT = "Techkriti is the annual inter-collegiate technical and entrepreneurship festival organized by IIT Kanpur. Founded in 1995, it aims to spark interest and encourage innovation in technology among students across India. Now in its 32nd edition, Techkriti has become one of Asia’s largest technical festivals, igniting passion in young minds and providing a platform to showcase their skills. Innovation and perseverance are at the heart of the event, with social welfare also playing a key role. Every year, we select ambassadors from colleges across the country to promote Techkriti, helping them develop their organizational and management skills.";

const About = () => {
    const containerRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate progress based on how much of the section has been scrolled
            // Start revealing when the section enters the viewport
            // Finish revealing when the section is mostly scrolled through
            
            // Determine start and end points relative to viewport
            const start = windowHeight * 0.6; // Start when top is 80% down the screen
            const end = windowHeight * 0.2;   // End when the element is near the top (20% from top)

            // Currently 'top' decreases as we scroll down.
            // When rect.top == start, progress is 0.
            // When rect.top == end, progress is 1.
            
            const current = rect.top;
            let p = (start - current) / (start - end);
            
            // Clamp between 0 and 1
            p = Math.min(1, Math.max(0, p));
            
            setProgress(p);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Split text into words
    const words = TEXT_CONTENT.split(' ');

    return (
        <section className="about-section" ref={containerRef} id="about">
            <div className="about-content-wrapper">
                <h2 className="about-title">About Techkriti</h2>

                <div className="about-text">
                     {/* Paragraph 1 */}
                     <p>
                        {words.map((word, index) => {
                            // Simultaneous reveal: Both paragraphs use the same ratio logic
                            const percent = index / words.length; 
                            const isVisible = progress > percent;
                            
                            return (
                                <span key={`p1-${index}`} className={`word ${isVisible ? 'visible' : 'blurred'}`}>
                                    {word}
                                </span>
                            );
                        })}
                     </p>
                 </div>
            </div>
        </section>
    );
};

export default About;
