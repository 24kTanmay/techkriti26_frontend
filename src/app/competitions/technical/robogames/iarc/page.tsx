'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import '@/components/ui/IARC.css'

/* ─── Static Data (hoisted — allocated once, not per render) ─── */

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

export default function IARCPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const indicatorRef = useRef<HTMLDivElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  /** Moves the sliding pill indicator to the active tab button. */
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

  /* Effect 1: Reposition indicator whenever the active tab changes */
  useEffect(() => {
    updateIndicator(activeTab)
  }, [activeTab, updateIndicator])

  /* Effect 2: Keep indicator aligned on window / container resize (independent) */
  useEffect(() => {
    const container = tabsContainerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => updateIndicator(activeTab))
    observer.observe(container)

    return () => observer.disconnect()
  }, [activeTab, updateIndicator])

  return (
    <div className="iarc-terminal-page">
      <StarBackgroundViewport mode="rise" count={200} canvasId="star-canvas-iarc" />
      <div className="noise-iarc" />
      <div className="ambient-core-iarc" />

      <Navbar />

      {/* ── Main Content ── */}
      <div className="iarc-main-container">
        <div className="header-section-iarc">
          <span className="breadcrumb-iarc">Technical / Robogames / ID-01</span>
          <h1 className="page-title-iarc"><span>IARC</span></h1>
        </div>

        <div className="terminal-panel">
          {/* Left: Cinematic Image */}
          <div className="panel-image-iarc">
            <div className="image-bg-iarc" />
            <div className="image-overlay-iarc" />
          </div>

          {/* Right: Data Interface */}
          <div className="panel-content-iarc">
            {/* Tab Bar */}
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

            {/* Tab Panes */}
            <div className="panes-container-iarc" role="tabpanel">
              {/* Overview */}
              <div className={`tab-pane-iarc ${activeTab === 'overview' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">
                    Join IARC, the ultimate autonomous robotics challenge at Techkriti&apos; 26! Design and build bots to solve intricate mazes, decode nodes, and tackle speed and angle tasks with precision.
                  </p>
                  <p className="pane-text-iarc">
                    Showcase your innovation, engineering, and coding skills. Compete with top teams globally and achieve robotic glory in the <span className="pane-highlight-iarc">Neo-Nous Singularita</span> arena.
                  </p>
                  <div className="meta-data-iarc">
                    <div className="meta-label-iarc">Event Timeline</div>
                    <div className="meta-value-iarc">19.03.2026 — 22.03.2026</div>
                    <div className="meta-label-iarc" style={{ marginTop: '1rem' }}>Total Prize Pool</div>
                    <div className="meta-value-iarc">NA</div>
                  </div>
                </div>

                <div className="action-group-iarc">
                  <button className="btn-action-iarc primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-iarc" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-iarc" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              {/* Problem Statement */}
              <div className={`tab-pane-iarc ${activeTab === 'problem' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">
                    The official parameters, constraints, and arena dimensions for the autonomous challenge are documented below. Ensure your build complies with all weight and sensor restrictions.
                  </p>
                  <div className="download-card-iarc" role="button" tabIndex={0} aria-label="Download IARC specifications PDF">
                    <div className="down-text-iarc">
                      <h4>IARC_Specs_v2.pdf</h4>
                      <p>Encrypted PDF Document • 2.4 MB</p>
                    </div>
                    <div className="down-icon-iarc">↓</div>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className={`tab-pane-iarc ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">For technical queries regarding the problem statement or arena setup, reach out to the event coordinators.</p>
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
