import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ReactMarkdown from 'react-markdown';
import RegistrationPanel from './RegistrationPanel';

gsap.registerPlugin(useGSAP);

function AccordionItem({
  item,
  isOpen,
  onClick,
}) {
  const containerRef = useRef(null);
  const answerRef = useRef(null);
  const iconRef = useRef(null);

  useGSAP(() => {
    const answerElement = answerRef.current;
    if (!answerElement) return;

    gsap.to(answerElement, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      marginTop: isOpen ? "16px" : 0,
      duration: 0.4,
      ease: "power3.inOut",
    });

    gsap.to(iconRef.current, {
      rotate: isOpen ? 180 : 0,
      duration: 0.3,
      ease: "power2.out"
    });

  }, { dependencies: [isOpen], scope: containerRef });

  return (
    <div ref={containerRef} className="accordion-item">
      <button
        onClick={onClick}
        className="accordion-trigger"
      >
        <div className="accordion-header-content">
          <h3 className="accordion-title">
            {item.question}
          </h3>
          {item.prizeMoney && (
            <span className="prize-tag">
              <span className="prize-label">Prize Pool:</span> {item.prizeMoney}
            </span>
          )}
        </div>
        <div ref={iconRef} className="accordion-icon-box">
          <FontAwesomeIcon icon={faChevronDown} className="accordion-icon" />
        </div>
      </button>
      <div ref={answerRef} className="accordion-content">
        <div className="accordion-inner details-prose">
          <div className={`comp-content-layout ${item.image ? 'has-image' : ''}`}>
             {item.image && (
              <div className="comp-image-wrapper">
                <div className="comp-image-container">
                  <img src={item.image} alt={item.question} className="comp-image" />
                </div>
              </div>
            )}
            <div className="comp-description">
              <ReactMarkdown>{item.answer}</ReactMarkdown>
            </div>
          </div>
          
          <RegistrationPanel competitionName={item.question} />

        </div>
      </div>
    </div>
  );
}

export const Competitions = ({ competitions, openCompetition, setOpenCompetition }) => {
  const handleToggle = (name) => {
    setOpenCompetition(openCompetition === name ? null : name);
  };

  return (
    <div className="details-content-box">
      <div className="flex flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
        {competitions.map((comp) => (
          <AccordionItem
            key={comp.name}
            item={{ question: comp.name, answer: `${comp.desc}\n\n**Dates:** 19th-22nd March, 2026`, image: comp.image, prizeMoney: comp.prizeMoney }}
            isOpen={openCompetition === comp.name}
            onClick={() => handleToggle(comp.name)}
          />
        ))}
      </div>
    </div>
  );
};
