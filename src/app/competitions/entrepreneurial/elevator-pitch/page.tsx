'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import '@/components/ui/TerminalEvent.css'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'format', label: 'Pitch Format' },
  { id: 'contacts', label: 'Contacts' },
] as const

interface Contact {
  name: string
  number: string
}

const CONTACTS: Contact[] = [
  { name: 'Rohan', number: '+91 88776 55432' },
  { name: 'Ananya', number: '+91 91223 44556' },
]

export default function ElevatorPitchPage() {
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
      <StarBackgroundViewport mode="rise" count={200} canvasId="terminal-star-canvas-elevator" />
      <div className="noise-terminal" />
      <div className="ambient-core-terminal" style={{ background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 60%)' }} />

      <Navbar />

      <div className="terminal-main-container">
        <div className="header-section-terminal">
          <span className="breadcrumb-terminal">Entrepreneurial / Elevator Pitch / EN-05</span>
          <h1 className="page-title-terminal"><span>ELEVATOR PITCH</span></h1>
        </div>

        <div className="terminal-panel">
          <div className="panel-image-terminal">
            <div className="image-bg-terminal" style={{ background: 'linear-gradient(45deg, #78350f 0%, #d97706 100%)' }} />
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
                    60 seconds to change everything. Elevator Pitch is a high-pressure arena where participants must present their business vision in the time it takes to ride an elevator.
                  </p>
                  <p className="pane-text-terminal">
                    Master the art of brevity and persuasion as you pitch to a panel of experts who have seen it all. Only the most compelling and concise ideas will advance in the <span className="pane-highlight-terminal">Pressure Zone</span>.
                  </p>
                  <div className="meta-data-terminal">
                    <div className="meta-label-terminal">Total Prize Pool</div>
                    <div className="meta-value-terminal">INR 75,000</div>
                  </div>
                </div>

                <div className="action-group-terminal">
                  <button className="btn-action-terminal primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-terminal" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-terminal" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              <div className={`tab-pane-terminal ${activeTab === 'format' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    Strict 60-second limit. No slides, no props—just your voice and your vision. Judging criteria focus on clarity, market potential, and conviction.
                  </p>
                  <div className="download-card-terminal" role="button" tabIndex={0} aria-label="Download Elevator Pitch guidelines PDF">
                    <div className="down-text-terminal">
                      <h4>Elevator_Pitch_Manual.pdf</h4>
                      <p>Pitching Protocols • 1.2 MB</p>
                    </div>
                    <div className="down-icon-terminal">↓</div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane-terminal ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">For queries regarding the pitching format or time-limit strictly, please contact the event coordinators.</p>
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
