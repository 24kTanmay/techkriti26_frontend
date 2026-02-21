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
  { name: 'Karan', number: '+91 97984 76475' },
  { name: 'Lavish', number: '+91 91667 27679' },
  { name: 'Waqar', number: '+91 94331 75993' },
  { name: 'Rahul', number: '+91 62024 30255' },
]

/* ─── Main Page ─── */

export default function GrandPrixPage() {
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
      <StarBackgroundViewport mode="rise" count={200} canvasId="star-canvas-grand-prix" />
      <div className="noise-iarc" />
      <div className="ambient-core-iarc" />

      <Navbar />

      <div className="iarc-main-container">
        <div className="header-section-iarc">
          <span className="breadcrumb-iarc">Technical / Robogames / GP-01</span>
          <h1 className="page-title-iarc"><span>GRAND PRIX</span></h1>
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
                    Gear up for Techkriti Grand Prix, the ultimate RC car showdown! Design and race custom-built IC engine-powered RC cars on dynamic tracks. Showcase innovation, engineering, and precision to outshine competitors.
                  </p>
                  <p className="pane-text-iarc">
                    Compete in thrilling rounds, tackle challenging terrains, and aim for glory in this high-octane racing challenge.
                  </p>
                  <div className="meta-data-iarc">
                    <div className="meta-label-iarc">Event Timeline</div>
                    <div className="meta-value-iarc">19.03.2026 — 22.03.2026</div>
                    <div className="meta-label-iarc" style={{ marginTop: '1rem' }}>Total Prize Pool</div>
                    <div className="meta-value-iarc">INR 75,000</div>
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
                    The official track layout, vehicle dimensions, and power restrictions for the Grand Prix are documented below.
                  </p>
                  <div className="download-card-iarc" role="button" tabIndex={0} aria-label="Download Grand Prix specifications PDF">
                    <div className="down-text-iarc">
                      <h4>GrandPrix_Rules_2026.pdf</h4>
                      <p>Circuit & Specs • 2.1 MB</p>
                    </div>
                    <div className="down-icon-iarc">↓</div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane-iarc ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">For technical queries regarding motor specifications or track surfaces, reach out to the Grand Prix coordinators.</p>
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
