
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StaggeredFadeIn } from "../components/UI/StaggeredFadeIn";
import { ProblemStatement } from "../components/EventDetails/ProblemStatement";
import { Overview } from "../components/EventDetails/Overview";
import { Competitions } from "../components/EventDetails/Competitions";
import { Contacts } from "../components/EventDetails/Contacts";
import "../components/EventDetails/EventDetails.css";

import EVENTS_DATA from "../data/events.json";

const TABS = ["Overview", "Problem Statement", "Competitions", "Contacts"];

export default function EventDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [openCompetition, setOpenCompetition] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);

  useEffect(() => {
    // Simulate fetching data
    console.log("Fetching data for ID:", id);
    const data = EVENTS_DATA[id];
    setEventInfo(data);
  }, [id]);

  // If data is loading or not found
  if (!eventInfo) {
      console.log("Event info not found for ID:", id);
      return <div className="text-center p-10" style={{color: 'white'}}>Loading or Event Not Found...</div>;
  }

  const { title: pageTitle, category, data: eventData } = eventInfo;
  const slug = id;

  const visibleTabs = slug === "MnM" ? TABS.filter(tab => tab !== "Competitions") : TABS;

  // Process data for components
  const overview = eventData
    .filter(detail => detail.flag.content === "overview")
    .map(detail => detail.desc.content)
    .join("\n");

  const overviewTitle = eventData
    .filter(detail => detail.flag.content === "heading")
    .map(detail => detail.title.content)
    .join("\n");

  const competitions = [];
  eventData.forEach((detail) => {
    if (detail.flag.content === "comp") {
      competitions.push({
        name: detail.title.content,
        desc: detail.desc.content,
        image: detail.image,
        prizeMoney: detail.prizeMoney
      });
    }
  });

  const contacts = eventData
    .filter(detail => detail.flag.content === "contacts")
    .map(detail => detail.desc.content)
    .join("\n");

  const problemStatementData = eventData
    .find(detail => detail.flag.content === "problem_statement");
  
  const problemStatementContent = problemStatementData ? problemStatementData.desc.content : "";
  const problemStatementLink = problemStatementData ? problemStatementData.link : null;

  const handleCompetitionClick = (competitionName) => {
    setActiveTab("Competitions");
    setOpenCompetition(competitionName);
  };

  return (
    <section className="event-details-section">
      <div className="container mx-auto px-6">


        <div className="event-details-container">
          <div className="tabs-container">
            {visibleTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${
                  activeTab === tab ? "active" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="details-body">
            {activeTab === "Overview" && (
              <StaggeredFadeIn>
                <Overview content={overview} title={overviewTitle} handleCompetitionClick={handleCompetitionClick} competitions={competitions} slug={slug} />
              </StaggeredFadeIn>
            )}

            {activeTab === "Problem Statement" && (
              <StaggeredFadeIn>
                <ProblemStatement content={problemStatementContent} link={problemStatementLink} />
              </StaggeredFadeIn>
            )}

            {activeTab === "Competitions" && (
              <StaggeredFadeIn>
                <Competitions competitions={competitions} openCompetition={openCompetition} setOpenCompetition={setOpenCompetition} />
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
}
