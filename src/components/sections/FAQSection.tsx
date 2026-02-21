'use client'

import React, { useState, useRef } from 'react'
import './FAQSection.css'

interface FAQItem {
    question: string
    answer: string
}

const faqData: FAQItem[] = [
    {
        question: "What defines the Neo-Nous Singularita theme?",
        answer: "It is the conceptual journey from artificial intelligence to human inner awareness, ultimately reaching cosmic transcendence. It posits that the micro-structures of our neurons and the macro-structures of the universe reflect the same divine order."
    },
    {
        question: "Who is eligible to interface with Techkriti '26?",
        answer: "Participation is open to all university students (Undergraduate and Postgraduate) across the globe who are passionate about engineering, business strategy, and technological innovation."
    },
    {
        question: "How are neural team-links formed?",
        answer: "Teams can be formed through our registration portal. Most flagship competitions allow teams of 2-4 members, though individual tracks are available for specific coding and design challenges."
    },
    {
        question: "Is temporal housing available at IIT Kanpur?",
        answer: "Yes, Techkriti provides on-campus accommodation within the IIT Kanpur hostels for outstation participants. Registration for accommodation will open parallel to the main event registrations."
    }
]

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    return (
        <section className="faq-section" id="faq">
            <span className="faq-tag">System Protocols // FAQ</span>
            <h2 className="faq-title">Resolving the <br /><i>Singularity.</i></h2>

            <div className="faq-list">
                {faqData.map((item, index) => (
                    <FAQItemComponent 
                        key={index}
                        index={index + 1}
                        item={item}
                        isActive={activeIndex === index}
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    />
                ))}
            </div>
        </section>
    )
}

function FAQItemComponent({ 
    index, 
    item, 
    isActive, 
    onClick 
}: { 
    index: number, 
    item: FAQItem, 
    isActive: boolean, 
    onClick: () => void 
}) {
    const itemRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!itemRef.current) return
        const rect = itemRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        itemRef.current.style.setProperty('--mouse-x', `${x}px`)
        itemRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    return (
        <div 
            ref={itemRef}
            className={`faq-item ${isActive ? 'is-active' : ''}`}
            onClick={onClick}
            onMouseMove={handleMouseMove}
        >
            <div className="item-spotlight" />
            
            <div className="faq-trigger">
                <span className="faq-index">{index.toString().padStart(2, '0')}</span>
                <h3 className="faq-question">{item.question}</h3>
                <div className="faq-icon"></div>
            </div>

            <div className="faq-content">
                <p className="faq-answer">{item.answer}</p>
            </div>
        </div>
    )
}
