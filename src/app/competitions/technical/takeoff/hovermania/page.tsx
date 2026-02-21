'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import '@/components/ui/IARC.css'

/* ─── Static Data ─── */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem Statement' },
  { id: 'contacts', label: 'Contacts' },
] as const

interface Contact {
  name: string
  number: string
}

const CONTACTS: Contact[] = [
  { name: 'Lavish', number: '+91 91667 27679' },
  { name: 'Waqar', number: '+91 94331 75993' },
]

/* ─── Main Page ─── */

export default function HovermaniaPage() {
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
    <div className="iarc-terminal-page">
      <StarBackgroundViewport mode="rise" count={200} canvasId="star-canvas-hovermania" />
      <div className="noise-iarc" />
      <div className="ambient-core-iarc" />

      <Navbar />

      <div className="iarc-main-container">
        <div className="header-section-iarc">
          <span className="breadcrumb-iarc">Technical / Takeoff / TK-04</span>
          <h1 className="page-title-iarc"><span>HOVERMANIA</span></h1>
        </div>

        <div className="terminal-panel">
          <div className="panel-image-iarc">
            <div className="image-bg-iarc" />
            <div className="image-overlay-iarc" />
          </div>

          <div className="panel-content-iarc">
            <div className="tabs-wrapper-iarc">
              <div className="tab-indicator-iarc" ref={indicatorRef} />
              <div className="tabs-list-iarc" ref={tabsContainerRef}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn-iarc ${activeTab === tab.id ? 'active' : ''}`}
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

            <div className="panes-container-iarc" role="tabpanel">
              <div className={`tab-pane-iarc ${activeTab === 'overview' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">
                    Hovermania 2026 challenges teams to design and build lightweight, agile hovercrafts for knockout racing on complex varied terrains.
                  </p>
                  <p className="pane-text-iarc">
                    Master the mechanics of air-cushion flight. Compete in arenas that transition between smooth surfaces and rugged obstacles, testing the limits of your vehicle&apos;s lift and thrust.
                  </p>
                  <div className="meta-data-iarc">
                    <div className="meta-label-iarc">Event Timeline</div>
                    <div className="meta-value-iarc">19.03.2026 — 22.03.2026</div>
                    <div className="meta-label-iarc" style={{ marginTop: '1rem' }}>Total Prize Pool</div>
                    <div className="meta-value-iarc">INR 50,000</div>
                  </div>
                </div>

                <div className="action-group-iarc">
                  <button className="btn-action-iarc primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-iarc" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-iarc" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              <div className={`tab-pane-iarc ${activeTab === 'problem' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">
                    The official track dimensions, surface friction coefficients, and engine power limits for Hovermania 2026 are listed below.
                  </p>
                  <div className="download-card-iarc" role="button" tabIndex={0} aria-label="Download Hovermania specs PDF">
                    <div className="down-text-iarc">
                      <h4>Hovermania_Track_2026.pdf</h4>
                      <p>Full Regulations • 1.7 MB</p>
                    </div>
                    <div className="down-icon-iarc">↓</div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane-iarc ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">For technical queries regarding air-cushion stability or thrust-vectoring mechanisms, contact the Hovermania team.</p>
                  <div className="contacts-grid-iarc">
                    {CONTACTS.map(contact => (
                      <div key={contact.name} className="contact-card-iarc">
                        <div className="c-name-iarc">{contact.name}</div>
                        <div className="c-number-iarc">{contact.number}</div>
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
