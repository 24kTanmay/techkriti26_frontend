import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StaggeredFadeIn } from "../components/UI/StaggeredFadeIn";
import { ProblemStatement } from "../components/EventDetails/ProblemStatement";
import { Contacts } from "../components/EventDetails/Contacts";
import RegistrationPanel from "../components/EventDetails/RegistrationPanel";
import ReactMarkdown from 'react-markdown';
import "../components/EventDetails/EventDetails.css"; // Reusing existing styles

import EVENTS_DATA from "../data/events.json";

const TABS = ["Overview", "Problem Statement", "Contacts"];

const CompetitionDetails = () => {
    const { categoryId, competitionId } = useParams();
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [competition, setCompetition] = useState(null);
    const [categoryInfo, setCategoryInfo] = useState(null);

    useEffect(() => {
        // 1. Get Category Data
        const catData = EVENTS_DATA[categoryId];
        if (!catData) return;

        setCategoryInfo(catData);

        // 2. Find Specific Competition
        // We need to match 'beat-the-market' to 'Beat the Market'
        // Strategy: Normalize the JSON titles and compare with URL param
        const comp = catData.data.find(item => {
            if (item.flag.content !== 'comp') return false;
            // slugify title: 'Beat the Market' -> 'beat-the-market'
            const slug = item.title.content.toLowerCase().replace(/\s+/g, '-');
            return slug === competitionId;
        });

        if (comp) {
            setCompetition(comp);
        }

    }, [categoryId, competitionId]);

    if (!competition || !categoryInfo) {
        return <div className="text-center p-10 text-white">Loading or Competition Not Found...</div>;
    }

    // Extract shared data from Category
    const contacts = categoryInfo.data
        .filter(detail => detail.flag.content === "contacts")
        .map(detail => detail.desc.content)
        .join("\n");

    const problemStatementData = categoryInfo.data
        .find(detail => detail.flag.content === "problem_statement");
    
    const problemStatementContent = problemStatementData ? problemStatementData.desc.content : "";
    const problemStatementLink = problemStatementData ? problemStatementData.link : null;


    return (
        <section className="event-details-section">
            <div className="container mx-auto px-6">
                
                {/* Header for the specific competition */}
                 <div className="comp-header">
                    <h1 className="comp-title">
                        {competition.title.content}
                    </h1>
                    {competition.prizeMoney && (
                        <div className="comp-prize-pill">
                            <span className="prize-label">PRIZE POOL:</span> 
                            <span className="prize-amount">{competition.prizeMoney}</span>
                        </div>
                    )}
                 </div>

                <div className="event-details-container">
                    <div className="tabs-container">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="details-body">
                        {activeTab === "Overview" && (
                            <StaggeredFadeIn>
                                <div className="details-content-box">
                                     <div className={`comp-content-layout ${competition.image ? 'has-image' : ''}`}>
                                         {competition.image && (
                                            <div className="comp-image-wrapper">
                                                <div className="comp-image-container">
                                                    <img src={competition.image} alt={competition.title.content} className="comp-image" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="comp-description">
                                            <div className="details-prose">
                                                <ReactMarkdown>{competition.desc.content}</ReactMarkdown>
                                            </div>
                                            
                                            <div className="comp-dates">
                                                <strong>Dates:</strong> 19th-22nd March, 2026
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* REGISTRATION PANEL */}
                                    <RegistrationPanel competitionName={competition.title.content} />
                                </div>
                            </StaggeredFadeIn>
                        )}

                        {activeTab === "Problem Statement" && (
                            <StaggeredFadeIn>
                                <ProblemStatement content={problemStatementContent} link={problemStatementLink} />
                            </StaggeredFadeIn>
                        )}

                        {activeTab === "Contacts" && (
                            <StaggeredFadeIn>
                                <Contacts contacts={contacts} />
                            </StaggeredFadeIn>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompetitionDetails;
