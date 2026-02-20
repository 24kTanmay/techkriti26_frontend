'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/ui/StarBackground'
import Navbar from '@/components/ui/Navbar'
import '@/components/ui/IARC.css'

/* ─── Static Data ─── */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'guidelines', label: 'Guidelines' },
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

export default function TICPage() {
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
      <StarBackgroundViewport mode="rise" count={200} canvasId="star-canvas-tic" />
      <div className="noise-iarc" />
      <div className="ambient-core-iarc" />

      <Navbar />

      <div className="iarc-main-container">
        <div className="header-section-iarc">
          <span className="breadcrumb-iarc">Technical / Technovation / TIC-01</span>
          <h1 className="page-title-iarc"><span>TIC</span></h1>
        </div>

        <div className="terminal-panel">
          <div className="panel-image-iarc">
            <div className="image-bg-iarc" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop")' }} />
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
                  “The only place where dreams become impossible is in your dreams.”
                  </p>
                  <p className="pane-text-iarc">
                    Techkriti Innovation Challenge (TIC) is a premier platform for young innovators to showcase their creative thinking and engineering prowess. It encourages participants to identify real-world problems and develop scalable, tech-driven solutions.
                  </p>
                  <div className="meta-data-iarc">
                    <div className="meta-label-iarc">Prize Pool</div>
                    <div className="meta-value-iarc">INR 1,50,000</div>
                  </div>
                </div>

                <div className="action-group-iarc">
                  <button className="btn-action-iarc primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-iarc" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-iarc" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              <div className={`tab-pane-iarc ${activeTab === 'guidelines' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">
                    Participants must submit an abstract of their project followed by a detailed prototype presentation. All engineering branches are welcome to participate.
                  </p>
                  <div className="download-card-iarc" role="button" tabIndex={0} aria-label="Download TIC guidelines PDF">
                    <div className="down-text-iarc">
                      <h4>TIC_Innovation_Guide_26.pdf</h4>
                      <p>Submission Manual • 2.1 MB</p>
                    </div>
                    <div className="down-icon-iarc">↓</div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane-iarc ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-iarc">For mentoring queries or submission deadlines, reach out to the TIC innovation desk.</p>
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
