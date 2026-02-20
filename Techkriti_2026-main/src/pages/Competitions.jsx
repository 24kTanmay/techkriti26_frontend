
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getNavigationStructure } from '../utils/navigationHelper';
import './Competitions.css';

// Import local assets
import technicalImg from '../assets/technical.jpg';
import entrepreneurialImg from '../assets/entrepreneurial.jpg';
import miscellaneousImg from '../assets/miscellaneous.jpg';

const Competitions = () => {
    const navigate = useNavigate();
    const competitionStructure = getNavigationStructure();
    
    // Explicitly define domains to ensure order
    const domains = [
        { name: "Technical", img: technicalImg },
        { name: "Entrepreneurial", img: entrepreneurialImg },
        { name: "Miscellaneous", img: miscellaneousImg }
    ];
    
    // Default expanded category (None)
    const [expandedCategory, setExpandedCategory] = useState(null);

    const handleCategoryClick = (categoryName) => {
        setExpandedCategory(prev => prev === categoryName ? null : categoryName);
    };

    return (
        <div className="competitions-page">
            <div className="hero-bg"></div>
            <Navbar />
            <div className="competitions-container">
                <h1 className="competitions-title">COMPETITIONS</h1>

                <div className="competitions-accordion">
                    {domains.map((domain) => (
                        <div 
                            key={domain.name} 
                            className={`competition-card ${expandedCategory === domain.name ? 'expanded' : ''}`}
                        >
                            {/* Header / Card Title Area - Styled like the cards */}
                            <div 
                                className="card-header"
                                onClick={() => handleCategoryClick(domain.name)}
                            >
                                <div className="card-header-content">
                                    <div className="card-icon">
                                        <img src={domain.img} alt={domain.name} />
                                    </div>
                                    <div className="card-text">
                                        <h2 className="card-title">{domain.name}</h2>
                                        <p className="card-subtitle">Click to explore {domain.name} events</p>
                                    </div>
                                </div>
                                <div className={`card-arrow ${expandedCategory === domain.name ? 'rotated' : ''}`}>
                                    ▼
                                </div>
                            </div>

                            {/* Expanded Content Body */}
                            <div className={`card-body ${expandedCategory === domain.name ? 'open' : ''}`}>
                                <div className="card-grid">
                                    {competitionStructure[domain.name] && competitionStructure[domain.name].map((subCat) => (
                                        <div 
                                            key={subCat.id} 
                                            className="subcategory-card"
                                            onClick={() => navigate(subCat.link)}
                                        >
                                            <div className="subcategory-header">
                                                {subCat.image && (
                                                    <div className="subcategory-icon-wrapper">
                                                        <img 
                                                            src={subCat.image} 
                                                            alt={subCat.title} 
                                                            className="subcategory-icon"
                                                        />
                                                    </div>
                                                )}
                                                <h3 className="subcategory-title">
                                                    {subCat.title}
                                                </h3>
                                            </div>
                                            <p className="subcategory-desc">
                                                {subCat.description || `Explore ${subCat.title} events and competitions.`}
                                            </p>
                                            <button className="subcategory-btn">
                                                Explore &rarr;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Competitions;
