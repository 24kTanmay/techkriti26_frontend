import React from 'react';
import './PastEvents.css';


import image1 from '../assets/army2.jpg';
import image2 from '../assets/cds.jpg';
import image3 from '../assets/drill_.jpeg';
import image4 from '../assets/expo3.jpg';
import image5 from '../assets/JNT04240.jpg';
import image6 from '../assets/JNT04307.jpg';
import image7 from '../assets/JNT04314.jpg';
import image8 from '../assets/JNT04559.jpg';
import image9 from '../assets/PAT00571.jpg';
import image10 from '../assets/PAT09183.jpg';
import image11 from '../assets/robo6.jpg';
import image12 from '../assets/sonu.jpg';

// Generate a list of items to populate the cylinder
const RAW_IMAGES = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
];

// Use exactly the defined items
const CAROUSEL_ITEMS = RAW_IMAGES;

const PastEvents = () => {
    const totalItems = CAROUSEL_ITEMS.length;
    const anglePerItem = 360 / totalItems;

    return (
        <div className="past-events-section" id="past-events">
            <h2 className="section-title">PAST EVENTS: RELIVE THE JOURNEY</h2>

            <div className="scene-container">
                <div className="split-view left-split">
                    <div className="carousel-scene">
                        <div className="cylinder grayscale-filter">
                            {CAROUSEL_ITEMS.map((imgSrc, index) => {
                                const rotationAngle = index * anglePerItem;
                                return (
                                    <div 
                                        className="carousel-item" 
                                        key={index}
                                        style={{ '--angle': `${rotationAngle}deg` }}
                                    >
                                        <img src={imgSrc} alt={`Event ${index}`} className="event-img" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="split-view right-split">
                    <div className="carousel-scene">
                        <div className="cylinder">
                            {CAROUSEL_ITEMS.map((imgSrc, index) => {
                                const rotationAngle = index * anglePerItem;
                                return (
                                    <div 
                                        className="carousel-item" 
                                        key={index}
                                        style={{ '--angle': `${rotationAngle}deg` }}
                                    >
                                        <img src={imgSrc} alt={`Event ${index}`} className="event-img" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* The Blur/Fade Effect Overlay */}
                <div className="edge-overlays"></div>
            </div>

            {/* Visual Overlays */}
            <div className="center-line"></div>
        </div>
    );
};

export default PastEvents;