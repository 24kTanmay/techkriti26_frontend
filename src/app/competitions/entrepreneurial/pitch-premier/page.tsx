'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/ui/StarBackground'
import Navbar from '@/components/ui/Navbar'
import '@/components/ui/TerminalEvent.css'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'rules', label: 'Guidelines' },
  { id: 'contacts', label: 'Contacts' },
] as const

interface Contact {
  name: string
  number: string
}

const CONTACTS: Contact[] = [
  { name: 'Arnav', number: '+91 91223 33445' },
  { name: 'Mehak', number: '+91 88776 66554' },
]

export default function PitchPremierPage() {
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
      <StarBackgroundViewport mode="rise" count={200} canvasId="terminal-star-canvas-pitch" />
      <div className="noise-terminal" />
      <div className="ambient-core-terminal" style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 60%)' }} />

      <Navbar />

      <div className="terminal-main-container">
        <div className="header-section-terminal">
          <span className="breadcrumb-terminal">Entrepreneurial / Pitch Premier / EN-03</span>
          <h1 className="page-title-terminal"><span>PITCH PREMIER</span></h1>
        </div>

        <div className="terminal-panel">
          <div className="panel-image-terminal">
            <div className="image-bg-terminal" style={{ background: 'linear-gradient(45deg, #312e81 0%, #4338ca 100%)' }} />
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
                    Pitch Premier is the ultimate stage for the brightest minds to pitch their vision. Stand face-to-face with seasoned investors and venture capitalists to turn your startup idea into a reality.
                  </p>
                  <p className="pane-text-terminal">
                    Whether you are in the ideation phase or already have a prototype, this is your chance to gain national visibility and secure the funding you need to scale in the <span className="pane-highlight-terminal">Venture Core</span>.
                  </p>
                  <div className="meta-data-terminal">
                    <div className="meta-label-terminal">Total Prize Pool</div>
                    <div className="meta-value-terminal">INR 2,00,000</div>
                  </div>
                </div>

                <div className="action-group-terminal">
                  <button className="btn-action-terminal primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-terminal" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-terminal" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              <div className={`tab-pane-terminal ${activeTab === 'rules' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    Registration requires a pitch deck submission in PDF format. Shortlisted teams will move to the live pitching rounds during Techkriti '26.
                  </p>
                  <div className="download-card-terminal" role="button" tabIndex={0} aria-label="Download Pitch Premier guidelines PDF">
                    <div className="down-text-terminal">
                      <h4>Pitch_Premier_Rules.pdf</h4>
                      <p>Submission Guide • 1.4 MB</p>
                    </div>
                    <div className="down-icon-terminal">↓</div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane-terminal ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">For submission queries or presentation format details, please reach out to the pitching coordinators.</p>
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
