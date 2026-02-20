'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/ui/StarBackground'
import Navbar from '@/components/ui/Navbar'
import '@/components/ui/TerminalEvent.css'

/* ─── Static Data ─── */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'rules', label: 'Simulation Rules' },
  { id: 'contacts', label: 'Contacts' },
] as const

interface Contact {
  name: string
  number: string
}

const CONTACTS: Contact[] = [
  { name: 'Rajesh', number: '+91 77665 44332' },
  { name: 'Priya', number: '+91 88990 11223' },
]

export default function BizSimPage() {
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
      <StarBackgroundViewport mode="rise" count={150} canvasId="terminal-star-canvas-bizsim" />
      <div className="noise-terminal" />
      <div className="ambient-core-terminal" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 60%)' }} />

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Main Content ── */}
      <div className="terminal-main-container">
        <div className="header-section-terminal">
          <span className="breadcrumb-terminal">Entrepreneurial / BizSim / EN-02</span>
          <h1 className="page-title-terminal"><span>BIZSIM</span></h1>
        </div>

        <div className="terminal-panel">
          {/* Left: Cinematic Image - Green/Cyan gradient for BizSim */}
          <div className="panel-image-terminal">
            <div className="image-bg-terminal" style={{ background: 'linear-gradient(45deg, #064e3b 0%, #065f46 100%)' }} />
            <div className="image-overlay-terminal" />
          </div>

          {/* Right: Data Interface */}
          <div className="panel-content-terminal">
            {/* Tab Bar */}
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

            {/* Tab Panes */}
            <div className="panes-container-terminal" role="tabpanel">
              {/* Overview */}
              <div className={`tab-pane-terminal ${activeTab === 'overview' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    BizSim is an immersive corporate strategy simulation where participants take on the role of C-suite executives managing a multi-million dollar corporation in a volatile market.
                  </p>
                  <p className="pane-text-terminal">
                    Master financial forecasting, production planning, and competitive marketing strategies to outperform your rivals in this <span className="pane-highlight-terminal">Economic Singularity</span>.
                  </p>
                  <div className="meta-data-terminal">
                    <div className="meta-label-terminal">Difficulty Level</div>
                    <div className="meta-value-terminal">Expert // High-Fidelity Sim</div>
                    <div className="meta-label-terminal" style={{ marginTop: '1rem' }}>Total Prize Pool</div>
                    <div className="meta-value-terminal">INR 50,000</div>
                  </div>
                </div>

                <div className="action-group-terminal">
                  <button className="btn-action-terminal primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-terminal" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-terminal" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              {/* Rules */}
              <div className={`tab-pane-terminal ${activeTab === 'rules' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    The simulation runs for 12 virtual quarters across 48 real-world hours. Ensure your team has a stable connection and strong analytical skills.
                  </p>
                  <div className="download-card-terminal" role="button" tabIndex={0} aria-label="Download BizSim rulebook PDF">
                    <div className="down-text-terminal">
                      <h4>BizSim_Rulebook_26.pdf</h4>
                      <p>Standard Operating Proc • 1.2 MB</p>
                    </div>
                    <div className="down-icon-terminal">↓</div>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className={`tab-pane-terminal ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">For help with simulation software or platform access, contact the business desk.</p>
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
