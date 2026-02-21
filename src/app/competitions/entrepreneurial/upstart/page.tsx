'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import '@/components/ui/TerminalEvent.css'

/* ─── Static Data ─── */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'impact', label: 'Competition Structure' },
  { id: 'contacts', label: 'Contacts' },
] as const

interface Contact {
  name: string
  number: string
}

const CONTACTS: Contact[] = [
  { name: 'Aditya', number: '+91 88776 55443' },
  { name: 'Sanya', number: '+91 99887 77665' },
]

export default function UpstartPage() {
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
      <StarBackgroundViewport mode="rise" count={200} canvasId="terminal-star-canvas-upstart" />
      <div className="noise-terminal" />
      <div className="ambient-core-terminal" />

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Main Content ── */}
      <div className="terminal-main-container">
        <div className="header-section-terminal">
          <span className="breadcrumb-terminal">Entrepreneurial / Upstart / EN-01</span>
          <h1 className="page-title-terminal"><span>UPSTART</span></h1>
        </div>

        <div className="terminal-panel">
          {/* Left: Cinematic Image - Placeholder set to dark blue for now */}
          <div className="panel-image-terminal">
            <div className="image-bg-terminal" style={{ background: 'linear-gradient(45deg, #1e1b4b 0%, #312e81 100%)' }} />
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
                    Upstart is Techkriti&apos;s premier startup launchpad. It provides a unique opportunity for early-stage startups to refine their business models through intensive mentoring by industry experts.
                  </p>
                  <p className="pane-text-terminal">
                    Finalists get to pitch their ideas to a panel of elite venture capitalists and angel investors, competing for seed funding and recognition in the global <span className="pane-highlight-terminal">Innovation Core</span>.
                  </p>
                  <div className="meta-data-terminal">
                    <div className="meta-label-terminal">Total Prize Pool</div>
                    <div className="meta-value-terminal">₹ 15,00,000 + Funding Ops</div>
                  </div>
                </div>

                <div className="action-group-terminal">
                  <button className="btn-action-terminal primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-terminal" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-terminal" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              {/* Competition Structure */}
              <div className={`tab-pane-terminal ${activeTab === 'impact' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    Upstart follows a rigorous three-stage evaluation process designed to test the scalability and viability of your startup venture.
                  </p>
                  <div className="download-card-terminal" role="button" tabIndex={0} aria-label="Download Upstart structure PDF">
                    <div className="down-text-terminal">
                      <h4>Upstart_Structure_2026.pdf</h4>
                      <p>Draft Document • 1.8 MB</p>
                    </div>
                    <div className="down-icon-terminal">↓</div>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className={`tab-pane-terminal ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">For mentoring queries or corporate sponsorship details, please reach out to the Upstart core team.</p>
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
