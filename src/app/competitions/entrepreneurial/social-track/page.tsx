'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/ui/StarBackground'
import Navbar from '@/components/ui/Navbar'
import '@/components/ui/TerminalEvent.css'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'impact', label: 'Impact Areas' },
  { id: 'contacts', label: 'Contacts' },
] as const

interface Contact {
  name: string
  number: string
}

const CONTACTS: Contact[] = [
  { name: 'Sameer', number: '+91 77665 55443' },
  { name: 'Kritika', number: '+91 99887 77665' },
]

export default function SocialTrackPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const indicatorRef = useRef<HTMLDivElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  const updateIndicator = useCallback((targetId: string) => {
    if (!indicatorRef.current || !tabsContainerRef.current) return
    const activeBtn = tabsContainerRef.current.querySelector(
      `[data-target="${targetId}"]`
    ) as HTMLElement | null
    if (!activeBtn) return

    requestAnimationFrame(() => {
      if (indicatorRef.current) {
        indicatorRef.current.style.width = `${activeBtn.offsetWidth}px`
        indicatorRef.current.style.left = `${activeBtn.offsetLeft}px`
      }
    })
  }, [])

  useEffect(() => {
    updateIndicator(activeTab)
  }, [activeTab, updateIndicator])

  useEffect(() => {
    const container = tabsContainerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => updateIndicator(activeTab))
    observer.observe(container)
    return () => observer.disconnect()
  }, [activeTab, updateIndicator])

  return (
    <div className="terminal-page-container">
      <StarBackgroundViewport mode="rise" count={200} canvasId="terminal-star-canvas-social" />
      <div className="noise-terminal" />
      <div className="ambient-core-terminal" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)' }} />

      <Navbar />

      <div className="terminal-main-container">
        <div className="header-section-terminal">
          <span className="breadcrumb-terminal">Entrepreneurial / Social Track / EN-04</span>
          <h1 className="page-title-terminal"><span>SOCIAL TRACK</span></h1>
        </div>

        <div className="terminal-panel">
          <div className="panel-image-terminal">
            <div className="image-bg-terminal" style={{ background: 'linear-gradient(45deg, #064e3b 0%, #059669 100%)' }} />
            <div className="image-overlay-terminal" />
          </div>

          <div className="panel-content-terminal">
            <div className="tabs-wrapper-terminal">
              <div className="tab-indicator-terminal" ref={indicatorRef} />
              <div className="tabs-list-terminal" ref={tabsContainerRef}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn-terminal ${activeTab === tab.id ? 'active' : ''}`}
                    data-target={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-selected={activeTab === tab.id}
                    role="tab"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="panes-container-terminal" role="tabpanel">
              <div className={`tab-pane-terminal ${activeTab === 'overview' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    Transforming lives through innovation. Social Track is a dedicated platform for startups creating high-impact solutions for pressing social and environmental challenges.
                  </p>
                  <p className="pane-text-terminal">
                    We invite entrepreneurs working in healthcare, education, sustainability, and rural development to showcase their scalable models for a <span className="pane-highlight-terminal">Better Future</span>.
                  </p>
                  <div className="meta-data-terminal">
                    <div className="meta-label-terminal">Total Prize Pool</div>
                    <div className="meta-value-terminal">INR 1,50,000</div>
                  </div>
                </div>

                <div className="action-group-terminal">
                  <button className="btn-action-terminal primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-terminal" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-terminal" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              <div className={`tab-pane-terminal ${activeTab === 'impact' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    Focus categories include: Agrotech, Edutech, Clean Energy, and Waste Management. Participants must demonstrate measurable impact and a viable business model.
                  </p>
                  <div className="download-card-terminal" role="button" tabIndex={0} aria-label="Download Social Track guidelines PDF">
                    <div className="down-text-terminal">
                      <h4>Social_Impact_Guide.pdf</h4>
                      <p>Impact Metrics • 1.9 MB</p>
                    </div>
                    <div className="down-icon-terminal">↓</div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane-terminal ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">For queries regarding impact assessment or track-specific criteria, contact the Social Track desk.</p>
                  <div className="contacts-grid-terminal">
                    {CONTACTS.map(contact => (
                      <div key={contact.name} className="contact-card-terminal">
                        <div className="c-name-terminal">{contact.name}</div>
                        <div className="c-number-terminal">{contact.number}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
