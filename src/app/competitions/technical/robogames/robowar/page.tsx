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

export default function RobowarPage() {
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
      <StarBackgroundViewport mode="rise" count={200} canvasId="star-canvas-robowar" />
      <div className="noise-iarc" />
      <div className="ambient-core-iarc" />

      <Navbar />

      <div className="iarc-main-container">
        <div className="header-section-iarc">
          <span className="breadcrumb-iarc">Technical / Robogames / RW-01</span>
          <h1 className="page-title-iarc"><span>ROBOWARS</span></h1>
        </div>

        <div className="terminal-panel">
          <div className="panel-image-iarc">
            <div 
              className="image-bg-iarc" 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1593376893114-1aed528d80cf?q=80&w=2000&auto=format&fit=crop")' }}
            />
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
                    Techkriti&apos;s flagship event, Robowars, is a thrilling battleground of engineering brilliance, strategy, and innovation. Robots in 8 kg, 15 kg, and 30 kg categories engage in intense one-on-one combat, showcasing powerful weapons and robust designs.
                  </p>
                  <p className="pane-text-iarc">
                    Compete to claim glory, pride, and the ultimate title in this electrifying robotic showdown!
                  </p>
                  <div className="meta-data-iarc">
                    <div className="meta-label-iarc">Event Timeline</div>
                    <div className="meta-value-iarc">19.03.2026 — 22.03.2026</div>
                    <div className="meta-label-iarc" style={{ marginTop: '1rem' }}>Total Prize Pool</div>
                    <div className="meta-value-iarc">INR 4,25,000</div>
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
                    The official weight categories, weapon restrictions, and arena safety guidelines for the combat challenge are documented below.
                  </p>
                  <div className="download-card-iarc" role="button" tabIndex={0} aria-label="Download Robowar specifications PDF">
                    <div className="down-text-iarc">
                      <h4>Robowar_Specs_2026.pdf</h4>
                      <p>Full Specification • 3.1 MB</p>
                    </div>
                    <div className="down-icon-iarc">↓</div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane-iarc ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">For technical queries regarding robot safety, weight checks, or arena rules, reach out to the Robo War team.</p>
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
